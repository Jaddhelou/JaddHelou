"use client";

import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import type { Bus, Route, School } from "@/lib/mockData";
import type { BusPosition } from "@/lib/simulation";

function busIcon(status: Bus["status"]): L.DivIcon {
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
    html: `<div class="bus-icon ${cls}">🚌</div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  });
}

function stopIcon(done: boolean, highlight: boolean): L.DivIcon {
  return L.divIcon({
    className: "",
    html: `<div class="stop-icon ${done ? "done" : ""}" ${
      highlight ? 'style="transform:scale(1.4);border-color:#f59e0b;"' : ""
    }></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
}

const schoolDivIcon = L.divIcon({
  className: "",
  html: `<div class="school-icon">🏫</div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

function Recenter({ position }: { position: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(position, map.getZoom(), { animate: true });
  }, [position, map]);
  return null;
}

export default function ParentMap({
  bus,
  route,
  school,
  busPos,
  highlightStopId,
}: {
  bus: Bus;
  route: Route;
  school: School;
  busPos: BusPosition;
  highlightStopId?: string;
}) {
  const polyline = useMemo(
    () => route.stops.map((s) => s.position),
    [route.stops]
  );

  const center: [number, number] = busPos.position;

  return (
    <MapContainer
      center={center}
      zoom={14}
      scrollWheelZoom
      style={{ width: "100%", height: "100%" }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Polyline
        positions={polyline}
        pathOptions={{ color: route.color, weight: 5, opacity: 0.7 }}
      />
      {route.stops.map((s, idx) => {
        const done = idx < busPos.completedStops;
        const isSchool = s.position[0] === school.position[0] && s.position[1] === school.position[1];
        if (isSchool) {
          return <Marker key={s.id} position={s.position} icon={schoolDivIcon} />;
        }
        return (
          <Marker
            key={s.id}
            position={s.position}
            icon={stopIcon(done, s.id === highlightStopId)}
          />
        );
      })}
      <Marker position={busPos.position} icon={busIcon(bus.status)} />
      <Recenter position={busPos.position} />
    </MapContainer>
  );
}
