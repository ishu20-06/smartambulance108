import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Play, Square, RotateCcw, Wifi, WifiOff } from "lucide-react";

interface ControlPanelProps {
  isRunning: boolean;
  useRealGPS: boolean;
  setUseRealGPS: (v: boolean) => void;
  espEndpoint: string;
  setEspEndpoint: (v: string) => void;
  sendRequests: boolean;
  setSendRequests: (v: boolean) => void;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
}

export default function ControlPanel({
  isRunning,
  useRealGPS,
  setUseRealGPS,
  espEndpoint,
  setEspEndpoint,
  sendRequests,
  setSendRequests,
  onStart,
  onStop,
  onReset,
}: ControlPanelProps) {
  return (
    <div className="space-y-5">
      {/* Playback Controls */}
      <div className="flex gap-2">
        {!isRunning ? (
          <Button onClick={onStart} className="flex-1 gap-2 bg-primary hover:bg-primary/90">
            <Play className="h-4 w-4" /> Start
          </Button>
        ) : (
          <Button onClick={onStop} variant="secondary" className="flex-1 gap-2">
            <Square className="h-4 w-4" /> Stop
          </Button>
        )}
        <Button onClick={onReset} variant="outline" size="icon">
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      {/* GPS Toggle */}
      <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/50 p-3">
        <Label htmlFor="gps-toggle" className="text-sm font-medium">
          Real GPS
        </Label>
        <Switch id="gps-toggle" checked={useRealGPS} onCheckedChange={setUseRealGPS} disabled={isRunning} />
      </div>

      {/* ESP32 Config */}
      <div className="space-y-3 rounded-lg border border-border bg-secondary/50 p-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium flex items-center gap-2">
            {sendRequests ? <Wifi className="h-4 w-4 text-accent" /> : <WifiOff className="h-4 w-4 text-muted-foreground" />}
            HTTP to ESP32
          </Label>
          <Switch checked={sendRequests} onCheckedChange={setSendRequests} />
        </div>
        <Input
          value={espEndpoint}
          onChange={(e) => setEspEndpoint(e.target.value)}
          placeholder="http://192.168.1.100"
          className="font-mono text-xs bg-background"
          disabled={!sendRequests}
        />
        <p className="text-xs text-muted-foreground">
          POST to <code className="text-primary/80">{espEndpoint}/green</code> on proximity
        </p>
      </div>
    </div>
  );
}
