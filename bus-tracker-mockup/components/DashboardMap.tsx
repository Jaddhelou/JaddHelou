"use client";

import { useEffect, useMemo, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Tooltip,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { Maximize2 } from "lucide-react";
import type { Bus, Route, School } from "@/lib/mockData";
import type { BusPosition } from "@/lib/simulation";
import { busIcon, schoolIcon } from "./mapIcons";

export interface FleetEntry {
  bus: Bus;
  route: Route;
  position: BusPosition;
}

function MapBridge({ refOut }: { refOut: React.MutableRefObject<L.Map | null> }) {
  const map = useMap();
  useEffect(() => {
    refOut.current = map;
  }, [map, refOut]);
  return null;
}

function FitOnMount({ bounds }: { bounds: L.LatLngBoundsExpression }) {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(bounds, { padding: [70, 70], animate: false });
  }, []);
  return null;
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
  const mapRef = useRef<L.Map | null>(null);

  const allPoints = useMemo(() => {
    const pts: L.LatLngTuple[] = [school.position as L.LatLngTuple];
    fleet.forEach((f) => {
      pts.push(f.position.position as L.LatLngTuple);
      f.route.stops.forEach((s) => pts.push(s.position as L.LatLngTuple));
    });
    return pts;
  }, [fleet, school]);

  const bounds = useMemo(() => L.latLngBounds(allPoints), [allPoints]);

  return (
    <MapContainer
      center={school.position}
      zoom={12}
      scrollWheelZoom
      zoomControl={false}
      style={{ width: "100%", height: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://carto.com">CARTO</a> &copy; OpenStreetMap'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        subdomains="abcd"
      />

      {/* All route casings */}
      {fleet.map((f) => (
        <Polyline
          key={`casing-${f.route.id}`}
          positions={f.route.stops.map((s) => s.position)}
          pathOptions={{
            color: "#ffffff",
            weight: f.bus.id === selectedBusId ? 9 : 6,
            opacity: 0.9,
          }}
          className="route-casing"
        />
      ))}

      {/* All route fills */}
      {fleet.map((f) => {
        const isSel = f.bus.id === selectedBusId;
        return (
          <Polyline
            key={`fill-${f.route.id}`}
            positions={f.route.stops.map((s) => s.position)}
            pathOptions={{
              color: f.route.color,
              weight: isSel ? 5 : 3,
              opacity: isSel ? 1 : selectedBusId ? 0.35 : 0.7,
            }}
            className={`route-casing ${isSel ? "route-live" : ""}`}
          />
        );
      })}

      {/* School */}
      <Marker position={school.position} icon={schoolIcon}>
        <Tooltip permanent direction="top" offset={[0, -22]} className="tooltip-navy">
          {school.name}
        </Tooltip>
      </Marker>

      {/* Buses */}
      {fleet.map((f) => {
        const isSel = f.bus.id === selectedBusId;
        return (
          <Marker
            key={f.bus.id}
            position={f.position.position}
            icon={busIcon(f.bus.status, {
              selected: isSel,
              pulse: isSel || f.bus.status === "delayed",
              bearingDeg: f.position.bearingDeg,
            })}
            eventHandlers={{ click: () => onSelect?.(f.bus.id) }}
            zIndexOffset={isSel ? 1000 : 0}
          >
            <Tooltip
              direction="bottom"
              offset={[0, 22]}
              permanent={isSel}
              className={isSel ? "tooltip-amber" : "tooltip-navy"}
            >
              {f.bus.plate}
              {isSel && ` · ${Math.round(f.position.progress * 100)}%`}
            </Tooltip>
          </Marker>
        );
      })}

      <MapBridge refOut={mapRef} />
      <FitOnMount bounds={bounds} />

      <div className="absolute bottom-5 right-5 z-[400] pointer-events-auto">
        <button
          className="map-fab"
          onClick={() =>
            mapRef.current?.fitBounds(bounds, { padding: [70, 70], animate: true })
          }
          aria-label="Fit all buses"
          title="Fit all"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    </MapContainer>
  );
}
