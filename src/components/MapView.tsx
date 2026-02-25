import { Coordinate, TrafficLight, distanceMeters } from "@/lib/geo";

interface MapViewProps {
  ambulancePos: Coordinate;
  trafficLights: TrafficLight[];
}

/** Converts GPS coordinate to pixel position on our simulated map */
function toPixel(
  coord: Coordinate,
  center: Coordinate,
  width: number,
  height: number
): { x: number; y: number } {
  const scale = 80000; // pixels per degree (roughly)
  const x = width / 2 + (coord.lng - center.lng) * scale;
  const y = height / 2 - (coord.lat - center.lat) * scale;
  return { x, y };
}

export default function MapView({ ambulancePos, trafficLights }: MapViewProps) {
  const W = 600;
  const H = 500;
  const center: Coordinate = { lat: 12.972, lng: 77.594 };

  const ambPixel = toPixel(ambulancePos, center, W, H);

  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-border bg-secondary/30">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ minHeight: 340 }}>
        {/* Grid */}
        {Array.from({ length: 20 }).map((_, i) => (
          <g key={i}>
            <line
              x1={i * (W / 20)} y1={0} x2={i * (W / 20)} y2={H}
              stroke="hsl(220 15% 14%)" strokeWidth={0.5}
            />
            <line
              x1={0} y1={i * (H / 16)} x2={W} y2={i * (H / 16)}
              stroke="hsl(220 15% 14%)" strokeWidth={0.5}
            />
          </g>
        ))}

        {/* Roads */}
        <line x1={W * 0.1} y1={H * 0.5} x2={W * 0.9} y2={H * 0.5} stroke="hsl(220 15% 20%)" strokeWidth={12} strokeLinecap="round" />
        <line x1={W * 0.5} y1={H * 0.1} x2={W * 0.5} y2={H * 0.9} stroke="hsl(220 15% 20%)" strokeWidth={12} strokeLinecap="round" />
        <line x1={W * 0.2} y1={H * 0.2} x2={W * 0.8} y2={H * 0.8} stroke="hsl(220 15% 17%)" strokeWidth={8} strokeLinecap="round" />

        {/* Proximity rings for traffic lights */}
        {trafficLights.map((tl) => {
          const p = toPixel(tl.position, center, W, H);
          const dist = distanceMeters(ambulancePos, tl.position);
          const inRange = dist <= 100;
          return (
            <g key={tl.id + "-ring"}>
              {inRange && (
                <>
                  <circle cx={p.x} cy={p.y} r={40} fill="none" stroke="hsl(145 65% 42%)" strokeWidth={1} opacity={0.3}>
                    <animate attributeName="r" from="20" to="50" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.5" to="0" dur="2s" repeatCount="indefinite" />
                  </circle>
                </>
              )}
              <circle cx={p.x} cy={p.y} r={40} fill="none" stroke="hsl(220 15% 25%)" strokeWidth={0.5} strokeDasharray="3 3" />
            </g>
          );
        })}

        {/* Traffic lights */}
        {trafficLights.map((tl) => {
          const p = toPixel(tl.position, center, W, H);
          const color = tl.status === "green" ? "hsl(145 65% 42%)" : tl.status === "yellow" ? "hsl(45 100% 51%)" : "hsl(0 75% 50%)";
          return (
            <g key={tl.id}>
              {/* Glow */}
              <circle cx={p.x} cy={p.y} r={12} fill={color} opacity={0.2} />
              {/* Signal body */}
              <rect x={p.x - 6} y={p.y - 14} width={12} height={28} rx={3} fill="hsl(220 18% 10%)" stroke="hsl(220 15% 25%)" strokeWidth={1} />
              <circle cx={p.x} cy={p.y - 7} r={3.5} fill={tl.status === "red" ? color : "hsl(220 15% 18%)"} />
              <circle cx={p.x} cy={p.y} r={3.5} fill={tl.status === "yellow" ? color : "hsl(220 15% 18%)"} />
              <circle cx={p.x} cy={p.y + 7} r={3.5} fill={tl.status === "green" ? color : "hsl(220 15% 18%)"} />
              {/* Label */}
              <text x={p.x} y={p.y + 24} textAnchor="middle" fill="hsl(210 20% 65%)" fontSize={8} fontFamily="Space Grotesk">
                {tl.name}
              </text>
            </g>
          );
        })}

        {/* Ambulance */}
        <g>
          {/* Flashing ring */}
          <circle cx={ambPixel.x} cy={ambPixel.y} r={8} fill="hsl(0 85% 55%)" opacity={0.3}>
            <animate attributeName="r" from="8" to="18" dur="1s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.4" to="0" dur="1s" repeatCount="indefinite" />
          </circle>
          {/* Ambulance dot */}
          <circle cx={ambPixel.x} cy={ambPixel.y} r={7} fill="hsl(0 85% 55%)" stroke="hsl(0 0% 100%)" strokeWidth={2} />
          <text x={ambPixel.x} y={ambPixel.y + 4} textAnchor="middle" fill="white" fontSize={8} fontWeight="bold">🚑</text>
        </g>
      </svg>
    </div>
  );
}
