import { Coordinate, TrafficLight, distanceMeters } from "@/lib/geo";

interface StatusPanelProps {
  ambulancePos: Coordinate;
  trafficLights: TrafficLight[];
}

export default function StatusPanel({ ambulancePos, trafficLights }: StatusPanelProps) {
  return (
    <div className="space-y-3">
      {/* Ambulance Position */}
      <div className="rounded-lg border border-border bg-secondary/50 p-3">
        <p className="text-xs text-muted-foreground mb-1">Ambulance Position</p>
        <p className="font-mono text-sm">
          {ambulancePos.lat.toFixed(5)}, {ambulancePos.lng.toFixed(5)}
        </p>
      </div>

      {/* Traffic Lights */}
      <div className="space-y-2">
        {trafficLights.map((tl) => {
          const dist = distanceMeters(ambulancePos, tl.position);
          const inRange = dist <= 100;
          return (
            <div
              key={tl.id}
              className={`rounded-lg border p-3 transition-all duration-300 ${
                inRange
                  ? "border-accent/50 bg-accent/5"
                  : "border-border bg-secondary/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`h-3 w-3 rounded-full ${
                      tl.status === "green"
                        ? "bg-signal-green glow-green"
                        : tl.status === "yellow"
                        ? "bg-signal-yellow"
                        : "bg-signal-red"
                    }`}
                  />
                  <span className="text-sm font-medium">{tl.name}</span>
                </div>
                <span
                  className={`font-mono text-xs ${
                    inRange ? "text-accent font-bold" : "text-muted-foreground"
                  }`}
                >
                  {Math.round(dist)}m
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1 font-mono">
                {tl.ipAddress} · {tl.mqttTopic}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
