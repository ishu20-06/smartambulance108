import { LogEntry } from "@/hooks/useSimulation";
import { ScrollArea } from "@/components/ui/scroll-area";

interface LogPanelProps {
  logs: LogEntry[];
}

const typeColors: Record<LogEntry["type"], string> = {
  proximity: "text-warning",
  request: "text-accent",
  error: "text-destructive",
  info: "text-muted-foreground",
};

export default function LogPanel({ logs }: LogPanelProps) {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="border-b border-border px-4 py-2 flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-primary ambulance-flash" />
        <h3 className="text-sm font-semibold">Event Log</h3>
        <span className="text-xs text-muted-foreground ml-auto">{logs.length} entries</span>
      </div>
      <ScrollArea className="h-52">
        <div className="p-3 space-y-1">
          {logs.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-6">
              Start the simulation to see events here
            </p>
          )}
          {logs.map((log) => (
            <div key={log.id} className="flex gap-2 text-xs font-mono">
              <span className="text-muted-foreground shrink-0">
                {log.timestamp.toLocaleTimeString()}
              </span>
              <span className={typeColors[log.type]}>{log.message}</span>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
