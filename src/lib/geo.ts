export interface Coordinate {
  lat: number;
  lng: number;
}

export interface TrafficLight {
  id: string;
  name: string;
  position: Coordinate;
  status: "red" | "green" | "yellow";
  ipAddress: string;
  mqttTopic: string;
}

/** Haversine distance in meters between two GPS coordinates */
export function distanceMeters(a: Coordinate, b: Coordinate): number {
  const R = 6371000;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const h =
    sinLat * sinLat +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      sinLng * sinLng;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

export const PROXIMITY_THRESHOLD = 100; // meters

export const DEFAULT_TRAFFIC_LIGHTS: TrafficLight[] = [
  {
    id: "tl-1",
    name: "Main St & 1st Ave",
    position: { lat: 12.9716, lng: 77.5946 },
    status: "red",
    ipAddress: "192.168.1.100",
    mqttTopic: "traffic/signal/1",
  },
  {
    id: "tl-2",
    name: "Park Rd & 2nd Ave",
    position: { lat: 12.9726, lng: 77.5966 },
    status: "red",
    ipAddress: "192.168.1.101",
    mqttTopic: "traffic/signal/2",
  },
  {
    id: "tl-3",
    name: "Hospital Junction",
    position: { lat: 12.9740, lng: 77.5930 },
    status: "red",
    ipAddress: "192.168.1.102",
    mqttTopic: "traffic/signal/3",
  },
];

export const DEFAULT_AMBULANCE_START: Coordinate = {
  lat: 12.9700,
  lng: 77.5920,
};
