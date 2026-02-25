import { useSimulation } from "@/hooks/useSimulation";
import MapView from "@/components/MapView";
import ControlPanel from "@/components/ControlPanel";
import StatusPanel from "@/components/StatusPanel";
import LogPanel from "@/components/LogPanel";
import { Siren } from "lucide-react";

const Index = () => {
  const sim = useSimulation();

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      {/* Header */}
      <header className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 glow-red">
          <Siren className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Ambulance Traffic Control</h1>
          <p className="text-xs text-muted-foreground">
            GPS proximity detection · ESP32 IoT integration
          </p>
        </div>
        <div className={`ml-auto flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
          sim.isRunning
            ? "bg-accent/10 text-accent"
            : "bg-secondary text-muted-foreground"
        }`}>
          <div className={`h-2 w-2 rounded-full ${sim.isRunning ? "bg-accent ambulance-flash" : "bg-muted-foreground"}`} />
          {sim.isRunning ? "ACTIVE" : "IDLE"}
        </div>
      </header>

      {/* Main Layout */}
      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        {/* Left Column */}
        <div className="space-y-5">
          <MapView ambulancePos={sim.ambulancePos} trafficLights={sim.trafficLights} />
          <LogPanel logs={sim.logs} />
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          <div className="rounded-xl border border-border bg-card p-4">
            <h2 className="text-sm font-semibold mb-4">Controls</h2>
            <ControlPanel
              isRunning={sim.isRunning}
              useRealGPS={sim.useRealGPS}
              setUseRealGPS={sim.setUseRealGPS}
              espEndpoint={sim.espEndpoint}
              setEspEndpoint={sim.setEspEndpoint}
              sendRequests={sim.sendRequests}
              setSendRequests={sim.setSendRequests}
              onStart={sim.start}
              onStop={sim.stop}
              onReset={sim.reset}
            />
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <h2 className="text-sm font-semibold mb-4">Signal Status</h2>
            <StatusPanel ambulancePos={sim.ambulancePos} trafficLights={sim.trafficLights} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
