"use client";

import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import L from "leaflet";
import type { Bus, Route, School } from "@/lib/mockData";
import type { BusPosition } from "@/lib/simulation";

function busIcon(status: Bus["status"], selected: boolean): L.DivIcon {
  const cls =
    status === "idle"
      ? "idle"
      : status === "arrived"
      ? "arrived"
      : status === "delayed"
      ? "delayed"
      : "";
  return L.divIcon({
    className: "",
    html: `<div class="bus-icon ${cls}" style="${
      selected ? "outline: 4px solid #f59e0b;" : ""
    }">🚌</div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  });
}

const schoolDivIcon = L.divIcon({
  className: "",
  html: `<div class="school-icon">🏫</div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

export interface FleetEntry {
  bus: Bus;
  route: Route;
  position: BusPosition;
}

export default function DashboardMap({
  fleet,
  school,
  selectedBusId,
  onSelect,
}: {
  fleet: FleetEntry[];
  school: School;
  selectedBusId?: string;
  onSelect?: (busId: string) => void;
}) {
  return (
    <MapContainer
      center={school.position}
      zoom={12}
      scrollWheelZoom
      style={{ width: "100%", height: "100%" }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {fleet.map((f) => (
        <Polyline
          key={`line-${f.route.id}`}
          positions={f.route.stops.map((s) => s.position)}
          pathOptions={{
            color: f.route.color,
            weight: f.bus.id === selectedBusId ? 6 : 3,
            opacity: f.bus.id === selectedBusId ? 0.9 : 0.45,
          }}
        />
      ))}
      <Marker position={school.position} icon={schoolDivIcon}>
        <Popup>
          <strong>{school.name}</strong>
          <br />
          Operating {fleet.length} buses
        </Popup>
      </Marker>
      {fleet.map((f) => (
        <Marker
          key={f.bus.id}
          position={f.position.position}
          icon={busIcon(f.bus.status, f.bus.id === selectedBusId)}
          eventHandlers={{
            click: () => onSelect?.(f.bus.id),
          }}
        >
          <Popup>
            <div style={{ minWidth: 180 }}>
              <strong>{f.bus.plate}</strong>
              <br />
              {f.route.name}
              <br />
              Driver: {f.bus.driver}
              <br />
              Onboard: {f.bus.onboard} / {f.bus.capacity}
              <br />
              Status: {f.bus.status.replace("_", " ")}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
