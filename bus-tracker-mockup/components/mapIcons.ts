import L from "leaflet";
import type { Bus } from "@/lib/mockData";

const BUS_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M8 6v6"/>
  <path d="M15 6v6"/>
  <path d="M2 12h19.6"/>
  <path d="M18 18h3s.5-1.7.7-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/>
  <circle cx="7" cy="18" r="2"/>
  <path d="M9 18h5"/>
  <circle cx="16" cy="18" r="2"/>
</svg>`;

const SCHOOL_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M22 10v6"/>
  <path d="M2 10l10-5 10 5-10 5z"/>
  <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/>
</svg>`;

export function busIcon(
  status: Bus["status"],
  opts: { selected?: boolean; pulse?: boolean; bearingDeg?: number } = {}
): L.DivIcon {
  const cls =
    status === "delayed"
      ? "danger"
      : status === "arrived"
      ? "success"
      : status === "idle"
      ? "idle"
      : "";
  const sel = opts.selected ? "selected" : "";
  const pulse = opts.pulse && status === "on_route" ? "pulse" : "";
  const bearing = opts.bearingDeg ?? 0;
  const headingHtml =
    status === "on_route"
      ? `<span class="heading" style="transform: translateX(-50%) rotate(${bearing}deg);"></span>`
      : "";
  return L.divIcon({
    className: "",
    html: `<div class="marker-bus ${cls} ${sel} ${pulse}">${headingHtml}${BUS_SVG}</div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
}

export function stopIcon(opts: { done?: boolean; highlight?: boolean } = {}): L.DivIcon {
  return L.divIcon({
    className: "",
    html: `<div class="marker-stop ${opts.done ? "done" : ""} ${
      opts.highlight ? "highlight" : ""
    }"></div>`,
    iconSize: opts.highlight ? [20, 20] : [14, 14],
    iconAnchor: opts.highlight ? [10, 10] : [7, 7],
  });
}

export const schoolIcon: L.DivIcon = L.divIcon({
  className: "",
  html: `<div class="marker-school">${SCHOOL_SVG}</div>`,
  iconSize: [42, 42],
  iconAnchor: [21, 21],
});
