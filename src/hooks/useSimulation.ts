import { useState, useCallback, useRef, useEffect } from "react";
import {
  Coordinate,
  TrafficLight,
  DEFAULT_TRAFFIC_LIGHTS,
  DEFAULT_AMBULANCE_START,
  distanceMeters,
  PROXIMITY_THRESHOLD,
} from "@/lib/geo";

export interface LogEntry {
  id: string;
  timestamp: Date;
  type: "proximity" | "request" | "error" | "info";
  message: string;
}

export function useSimulation() {
  const [ambulancePos, setAmbulancePos] = useState<Coordinate>(DEFAULT_AMBULANCE_START);
  const [trafficLights, setTrafficLights] = useState<TrafficLight[]>(DEFAULT_TRAFFIC_LIGHTS);
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [useRealGPS, setUseRealGPS] = useState(false);
  const [espEndpoint, setEspEndpoint] = useState("http://192.168.1.100");
  const [sendRequests, setSendRequests] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const stepRef = useRef(0);
  const triggeredRef = useRef<Set<string>>(new Set());

  const addLog = useCallback((type: LogEntry["type"], message: string) => {
    setLogs((prev) => [
      { id: crypto.randomUUID(), timestamp: new Date(), type, message },
      ...prev.slice(0, 99),
    ]);
  }, []);

  const checkProximity = useCallback(
    (pos: Coordinate) => {
      setTrafficLights((prev) =>
        prev.map((tl) => {
          const dist = distanceMeters(pos, tl.position);
          const inRange = dist <= PROXIMITY_THRESHOLD;

          if (inRange && !triggeredRef.current.has(tl.id)) {
            triggeredRef.current.add(tl.id);
            addLog("proximity", `🚨 Within ${Math.round(dist)}m of "${tl.name}" — switching to GREEN`);

            if (sendRequests) {
              fetch(`${espEndpoint}/green`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ signal_id: tl.id, action: "green" }),
              })
                .then(() => addLog("request", `✅ POST sent to ${espEndpoint}/green for "${tl.name}"`))
                .catch((err) => addLog("error", `❌ Failed to reach ${espEndpoint}: ${err.message}`));
            } else {
              addLog("info", `ℹ️ HTTP requests disabled — would POST to ${tl.ipAddress}`);
            }
            return { ...tl, status: "green" as const };
          }

          if (!inRange && triggeredRef.current.has(tl.id)) {
            triggeredRef.current.delete(tl.id);
            addLog("info", `🔴 Left range of "${tl.name}" — reverting to RED`);
            return { ...tl, status: "red" as const };
          }

          return tl;
        })
      );
    },
    [addLog, espEndpoint, sendRequests]
  );

  // Simulated movement path toward traffic lights
  const simulateStep = useCallback(() => {
    stepRef.current += 1;
    const step = stepRef.current;
    const t = step * 0.002;

    // Move ambulance along a path that passes near traffic lights
    const newPos: Coordinate = {
      lat: DEFAULT_AMBULANCE_START.lat + t * 0.6,
      lng: DEFAULT_AMBULANCE_START.lng + t * 0.4 + Math.sin(step * 0.1) * 0.0005,
    };

    setAmbulancePos(newPos);
    checkProximity(newPos);
  }, [checkProximity]);

  // Real GPS tracking
  useEffect(() => {
    if (!useRealGPS || !isRunning) return;
    if (!navigator.geolocation) {
      addLog("error", "Geolocation not supported in this browser");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const newPos: Coordinate = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setAmbulancePos(newPos);
        checkProximity(newPos);
      },
      (err) => addLog("error", `GPS error: ${err.message}`),
      { enableHighAccuracy: true, maximumAge: 1000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [useRealGPS, isRunning, checkProximity, addLog]);

  const start = useCallback(() => {
    setIsRunning(true);
    addLog("info", useRealGPS ? "📡 Started real GPS tracking" : "▶️ Started simulation");

    if (!useRealGPS) {
      intervalRef.current = window.setInterval(simulateStep, 500);
    }
  }, [useRealGPS, simulateStep, addLog]);

  const stop = useCallback(() => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    addLog("info", "⏹ Stopped");
  }, [addLog]);

  const reset = useCallback(() => {
    stop();
    stepRef.current = 0;
    triggeredRef.current.clear();
    setAmbulancePos(DEFAULT_AMBULANCE_START);
    setTrafficLights(DEFAULT_TRAFFIC_LIGHTS);
    setLogs([]);
  }, [stop]);

  return {
    ambulancePos,
    trafficLights,
    isRunning,
    logs,
    useRealGPS,
    setUseRealGPS,
    espEndpoint,
    setEspEndpoint,
    sendRequests,
    setSendRequests,
    start,
    stop,
    reset,
    setTrafficLights,
  };
}
