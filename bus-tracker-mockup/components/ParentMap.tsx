"use client";

import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import type { Bus, Route, School } from "@/lib/mockData";
import type { BusPosition } from "@/lib/simulation";
import { busIcon, schoolIcon, stopIcon } from "./mapIcons";

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
  const polyline = useMemo(() => route.stops.map((s) => s.position), [route.stops]);

  return (
    <MapContainer
      center={busPos.position}
      zoom={14}
      scrollWheelZoom
      zoomControl={false}
      style={{ width: "100%", height: "100%" }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Subtle shadow behind the live route */}
      <Polyline
        positions={polyline}
        pathOptions={{ color: "#0b2545", weight: 10, opacity: 0.08 }}
      />
      <Polyline
        positions={polyline}
        pathOptions={{ color: "#0b2545", weight: 4, opacity: 0.9, dashArray: "1 0" }}
      />

      {route.stops.map((s, idx) => {
        const done = idx < busPos.completedStops;
        const isSchool =
          s.position[0] === school.position[0] && s.position[1] === school.position[1];
        if (isSchool) return <Marker key={s.id} position={s.position} icon={schoolIcon} />;
        return (
          <Marker
            key={s.id}
            position={s.position}
            icon={stopIcon({ done, highlight: s.id === highlightStopId })}
          />
        );
      })}

      <Marker position={busPos.position} icon={busIcon(bus.status, { pulse: true })} />
      <Recenter position={busPos.position} />
    </MapContainer>
  );
}
