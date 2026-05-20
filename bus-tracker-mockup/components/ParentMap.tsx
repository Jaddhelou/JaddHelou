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
import { Locate, Maximize2 } from "lucide-react";
import type { Bus, Route, School } from "@/lib/mockData";
import type { BusPosition } from "@/lib/simulation";
import { busIcon, schoolIcon, stopIcon } from "./mapIcons";

function FitOnMount({ bounds }: { bounds: L.LatLngBoundsExpression }) {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(bounds, { padding: [60, 60], animate: false });
  }, []); // run once
  return null;
}

function MapControls({
  onRecenter,
  onFit,
}: {
  onRecenter: () => void;
  onFit: () => void;
}) {
  return (
    <div className="absolute bottom-5 right-5 z-[400] flex flex-col gap-2 pointer-events-auto">
      <button
        className="map-fab primary"
        onClick={onRecenter}
        aria-label="Recenter on bus"
        title="Follow bus"
      >
        <Locate className="w-4 h-4" />
      </button>
      <button
        className="map-fab"
        onClick={onFit}
        aria-label="Fit route"
        title="Fit route"
      >
        <Maximize2 className="w-4 h-4" />
      </button>
    </div>
  );
}

function MapBridge({
  refOut,
}: {
  refOut: React.MutableRefObject<L.Map | null>;
}) {
  const map = useMap();
  useEffect(() => {
    refOut.current = map;
  }, [map, refOut]);
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
  const mapRef = useRef<L.Map | null>(null);

  // Done segment = points up to last completed stop + current bus position
  const doneSegment = useMemo(() => {
    const done = polyline.slice(0, busPos.completedStops + 1);
    return [...done, busPos.position];
  }, [polyline, busPos]);

  // Remaining segment = current bus position + remaining stops
  const remainingSegment = useMemo(() => {
    return [busPos.position, ...polyline.slice(busPos.completedStops + 1)];
  }, [polyline, busPos]);

  const bounds = useMemo(() => L.latLngBounds(polyline as L.LatLngTuple[]), [polyline]);

  return (
    <MapContainer
      center={busPos.position}
      zoom={14}
      scrollWheelZoom
      zoomControl={false}
      style={{ width: "100%", height: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://carto.com">CARTO</a> &copy; OpenStreetMap'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        subdomains="abcd"
      />

      {/* White casing under entire route */}
      <Polyline
        positions={polyline}
        pathOptions={{
          color: "#ffffff",
          weight: 10,
          opacity: 0.95,
        }}
        className="route-casing"
      />

      {/* Already-traveled portion: solid navy */}
      <Polyline
        positions={doneSegment}
        pathOptions={{
          color: "#0b2545",
          weight: 5,
          opacity: 1,
        }}
        className="route-casing"
      />

      {/* Remaining portion: animated amber marching ants */}
      <Polyline
        positions={remainingSegment}
        pathOptions={{
          color: "#f59e0b",
          weight: 5,
          opacity: 0.95,
        }}
        className="route-casing route-live"
      />

      {/* Stops */}
      {route.stops.map((s, idx) => {
        const done = idx < busPos.completedStops;
        const isSchool =
          s.position[0] === school.position[0] && s.position[1] === school.position[1];
        const isYours = s.id === highlightStopId;

        if (isSchool) {
          return (
            <Marker key={s.id} position={s.position} icon={schoolIcon}>
              <Tooltip permanent direction="top" offset={[0, -22]} className="tooltip-navy">
                {school.name}
              </Tooltip>
            </Marker>
          );
        }
        return (
          <Marker
            key={s.id}
            position={s.position}
            icon={stopIcon({ done, highlight: isYours })}
          >
            <Tooltip
              direction="top"
              offset={[0, isYours ? -14 : -10]}
              permanent={isYours}
              className={isYours ? "tooltip-amber" : ""}
            >
              {isYours ? `Your stop · ${s.scheduledTime}` : `${s.name} · ${s.scheduledTime}`}
            </Tooltip>
          </Marker>
        );
      })}

      {/* Bus with permanent identity tooltip */}
      <Marker
        position={busPos.position}
        icon={busIcon(bus.status, { pulse: true, bearingDeg: busPos.bearingDeg })}
        zIndexOffset={1000}
      >
        <Tooltip
          permanent
          direction="bottom"
          offset={[0, 22]}
          className="tooltip-navy"
        >
          {bus.plate}
        </Tooltip>
      </Marker>

      <MapBridge refOut={mapRef} />
      <FitOnMount bounds={bounds} />
      <MapControls
        onRecenter={() => mapRef.current?.setView(busPos.position, 15, { animate: true })}
        onFit={() => mapRef.current?.fitBounds(bounds, { padding: [60, 60], animate: true })}
      />
    </MapContainer>
  );
}
