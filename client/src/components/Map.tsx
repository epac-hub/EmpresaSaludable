/**
 * MapView — Leaflet map (no API key required).
 *
 * Replaces the Google Maps loader that depended on the Manus Forge proxy.
 * Tiles: OpenStreetMap standard basemap (CARTO's free tiles now require an API key).
 */
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

export interface LatLngLiteral {
  lat: number;
  lng: number;
}

interface MapViewProps {
  className?: string;
  initialCenter?: LatLngLiteral;
  initialZoom?: number;
  onMapReady?: (map: L.Map) => void;
}

export function MapView({
  className,
  initialCenter = { lat: 18.2208, lng: -66.5901 },
  initialZoom = 9,
  onMapReady,
}: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const onReady = useRef(onMapReady);
  onReady.current = onMapReady;

  useEffect(() => {
    if (!mapContainer.current || map.current) return;
    const instance = L.map(mapContainer.current, {
      center: [initialCenter.lat, initialCenter.lng],
      zoom: initialZoom,
      scrollWheelZoom: false,
      zoomControl: true,
      attributionControl: true,
    });
    L.tileLayer(TILE_URL, {
      attribution: TILE_ATTRIBUTION,
      maxZoom: 19,
    }).addTo(instance);
    map.current = instance;
    onReady.current?.(instance);

    return () => {
      instance.remove();
      map.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={mapContainer} className={cn("w-full h-full", className)} />;
}

export default MapView;
