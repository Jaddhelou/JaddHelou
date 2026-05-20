"use client";

import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import type { Bus, Route, School } from "@/lib/mockData";
import type { BusPosition } from "@/lib/simulation";
import { busIcon, schoolIcon } from "./mapIcons";

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
      zoomControl={false}
      style={{ width: "100%", height: "100%" }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {fleet.map((f) => (
        <Polyline
          key={`line-${f.route.id}`}
          positions={f.route.stops.map((s) => s.position)}
          pathOptions={{
            color: f.route.color,
            weight: f.bus.id === selectedBusId ? 6 : 3,
            opacity: f.bus.id === selectedBusId ? 0.95 : 0.5,
          }}
        />
      ))}
      <Marker position={school.position} icon={schoolIcon}>
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
          icon={busIcon(f.bus.status, {
            selected: f.bus.id === selectedBusId,
            pulse: f.bus.id === selectedBusId,
          })}
          eventHandlers={{ click: () => onSelect?.(f.bus.id) }}
        >
          <Popup>
            <div style={{ minWidth: 180, fontFamily: "inherit" }}>
              <strong>{f.bus.plate}</strong>
              <br />
              {f.route.name}
              <br />
              Driver: {f.bus.driver}
              <br />
              Onboard: {f.bus.onboard} / {f.bus.capacity}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
