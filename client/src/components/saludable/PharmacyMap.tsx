/**
 * PharmacyMap — Interactive Google Maps pharmacy locator for Puerto Rico
 * Design: Botanical Sanctuary — earthy markers, organic info windows
 */
import { useEffect, useRef, useState } from "react";
import { MapView } from "@/components/Map";
import { PHARMACIES } from "./pharmacyData";

export default function PharmacyMap() {
  const [selectedMunicipio, setSelectedMunicipio] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  // Get unique municipalities
  const municipalities = Array.from(new Set(PHARMACIES.map((p) => p.municipality))).sort();

  // Filter pharmacies
  const filtered = PHARMACIES.filter((p) => {
    const matchMuni = selectedMunicipio === "all" || p.municipality === selectedMunicipio;
    const matchSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.municipality.toLowerCase().includes(searchQuery.toLowerCase());
    return matchMuni && matchSearch;
  });

  const handleMapReady = (map: google.maps.Map) => {
    mapInstanceRef.current = map;
    geocoderRef.current = new google.maps.Geocoder();
    infoWindowRef.current = new google.maps.InfoWindow();

    // Center on Puerto Rico
    map.setCenter({ lat: 18.2208, lng: -66.5901 });
    map.setZoom(9);
    map.setOptions({
      styles: [
        { featureType: "water", stylers: [{ color: "#c4d4c0" }] },
        { featureType: "landscape", stylers: [{ color: "#f5f0e8" }] },
        { featureType: "road", stylers: [{ color: "#e8ddd0" }] },
        { featureType: "poi", stylers: [{ visibility: "off" }] },
        { featureType: "transit", stylers: [{ visibility: "off" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#2D3B2D" }] },
      ],
    });

    // Add markers for first 50 pharmacies (geocoding limit)
    addMarkers(map);
  };

  const addMarkers = (map: google.maps.Map) => {
    // Clear existing markers
    markersRef.current.forEach((m) => (m.map = null));
    markersRef.current = [];

    // Puerto Rico municipality approximate coordinates
    const MUNI_COORDS: Record<string, { lat: number; lng: number }> = {
      "Aguada": { lat: 18.3808, lng: -67.1886 },
      "Aguadilla": { lat: 18.4274, lng: -67.1541 },
      "Aguas Buenas": { lat: 18.2569, lng: -66.1030 },
      "Aibonito": { lat: 18.1400, lng: -66.2661 },
      "Añasco": { lat: 18.2828, lng: -67.1394 },
      "Arecibo": { lat: 18.4725, lng: -66.7156 },
      "Arroyo": { lat: 17.9669, lng: -66.0614 },
      "Barceloneta": { lat: 18.4508, lng: -66.5386 },
      "Bayamón": { lat: 18.3989, lng: -66.1553 },
      "Cabo Rojo": { lat: 18.0866, lng: -67.1457 },
      "Caguas": { lat: 18.2341, lng: -66.0485 },
      "Camuy": { lat: 18.4839, lng: -66.8449 },
      "Canóvanas": { lat: 18.3794, lng: -65.9014 },
      "Carolina": { lat: 18.3811, lng: -65.9574 },
      "Cayey": { lat: 18.1119, lng: -66.1660 },
      "Ciales": { lat: 18.3358, lng: -66.4689 },
      "Cidra": { lat: 18.1758, lng: -66.1614 },
      "Coamo": { lat: 18.0800, lng: -66.3578 },
      "Condado": { lat: 18.4564, lng: -66.0697 },
      "Corozal": { lat: 18.3419, lng: -66.3169 },
      "Coto": { lat: 18.4200, lng: -66.2600 },
      "Dorado": { lat: 18.4589, lng: -66.2678 },
      "Fajardo": { lat: 18.3258, lng: -65.6525 },
      "Guánica": { lat: 17.9714, lng: -66.9078 },
      "Guaynabo": { lat: 18.3569, lng: -66.1108 },
      "Guayama": { lat: 17.9842, lng: -66.1117 },
      "Gurabo": { lat: 18.2544, lng: -65.9728 },
      "Hatillo": { lat: 18.4867, lng: -66.8256 },
      "Hormigueros": { lat: 18.1397, lng: -67.1269 },
      "Humacao": { lat: 18.1497, lng: -65.8197 },
      "Isabela": { lat: 18.5000, lng: -67.0200 },
      "Jayuya": { lat: 18.2186, lng: -66.5917 },
      "Juana Díaz": { lat: 18.0533, lng: -66.5067 },
      "Juncos": { lat: 18.2275, lng: -65.9211 },
      "Lajas": { lat: 18.0497, lng: -67.0597 },
      "Las Piedras": { lat: 18.1831, lng: -65.8717 },
      "Lares": { lat: 18.2958, lng: -66.8778 },
      "Luquillo": { lat: 18.3725, lng: -65.7164 },
      "Manatí": { lat: 18.4297, lng: -66.4828 },
      "Mayagüez": { lat: 18.2011, lng: -67.1397 },
      "Moca": { lat: 18.3947, lng: -67.1131 },
      "Morovis": { lat: 18.3258, lng: -66.4064 },
      "Naguabo": { lat: 18.2117, lng: -65.7350 },
      "Naranjito": { lat: 18.3008, lng: -66.2450 },
      "Ponce": { lat: 18.0108, lng: -66.6141 },
      "Quebradillas": { lat: 18.4733, lng: -66.9386 },
      "Rincón": { lat: 18.3400, lng: -67.2500 },
      "Río Grande": { lat: 18.3803, lng: -65.8314 },
      "Sabana Grande": { lat: 18.0778, lng: -66.9606 },
      "San Germán": { lat: 18.0831, lng: -67.0353 },
      "San Juan": { lat: 18.4655, lng: -66.1057 },
      "San Lorenzo": { lat: 18.1897, lng: -65.9617 },
      "San Sebastián": { lat: 18.3369, lng: -66.9900 },
      "Santa Isabel": { lat: 17.9661, lng: -66.4050 },
      "Toa Alta": { lat: 18.3883, lng: -66.2483 },
      "Toa Baja": { lat: 18.4439, lng: -66.2542 },
      "Trujillo Alto": { lat: 18.3547, lng: -66.0075 },
      "Utuado": { lat: 18.2653, lng: -66.7008 },
      "Vega Alta": { lat: 18.4122, lng: -66.3314 },
      "Vega Baja": { lat: 18.4431, lng: -66.3878 },
      "Villalba": { lat: 18.1278, lng: -66.4922 },
      "Yabucoa": { lat: 18.0506, lng: -65.8789 },
      "Yauco": { lat: 18.0350, lng: -66.8497 },
    };

    // Place markers using municipality coordinates with slight offsets
    const pharmaciesToShow = filtered.slice(0, 100);
    const offsetCounters: Record<string, number> = {};

    pharmaciesToShow.forEach((pharmacy) => {
      const muniKey = pharmacy.municipality;
      const coords = MUNI_COORDS[muniKey];
      if (!coords) return;

      // Add small offset for multiple pharmacies in same municipality
      if (!offsetCounters[muniKey]) offsetCounters[muniKey] = 0;
      offsetCounters[muniKey]++;
      const offset = offsetCounters[muniKey] * 0.003;
      const angle = (offsetCounters[muniKey] * 137.5 * Math.PI) / 180; // golden angle

      const position = {
        lat: coords.lat + Math.cos(angle) * offset,
        lng: coords.lng + Math.sin(angle) * offset,
      };

      // Create custom marker element
      const markerEl = document.createElement("div");
      markerEl.innerHTML = `
        <div style="
          width: 32px; height: 32px; 
          background: linear-gradient(135deg, #8B9E7C, #6B7E5C);
          border: 2px solid #FDF8F0;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex; align-items: center; justify-content: center;
        ">
          <span style="transform: rotate(45deg); color: #FDF8F0; font-size: 14px;">+</span>
        </div>
      `;

      const marker = new google.maps.marker.AdvancedMarkerElement({
        map,
        position,
        content: markerEl,
        title: pharmacy.name,
      });

      marker.addListener("click", () => {
        if (infoWindowRef.current) {
          infoWindowRef.current.setContent(`
            <div style="padding: 12px; font-family: 'DM Sans', sans-serif; max-width: 250px;">
              <h3 style="margin: 0 0 6px; color: #2D3B2D; font-size: 14px; font-weight: 600;">${pharmacy.name}</h3>
              <p style="margin: 0 0 4px; color: #5a6b5a; font-size: 12px;">${pharmacy.municipality}</p>
              <p style="margin: 0 0 4px; color: #666; font-size: 11px;">${pharmacy.address}</p>
              <a href="tel:${pharmacy.phone.replace(/[^+\d]/g, '')}" style="color: #C4725F; font-size: 12px; text-decoration: none; font-weight: 500;">${pharmacy.phone}</a>
            </div>
          `);
          infoWindowRef.current.open(map, marker);
        }
      });

      markersRef.current.push(marker);
    });
  };

  // Re-add markers when filter changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      addMarkers(mapInstanceRef.current);
    }
  }, [selectedMunicipio, searchQuery]);

  return (
    <div className="w-full">
      {/* Filter controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Buscar farmacia..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-[#2D3B2D]/50 border border-[#8B9E7C]/30 text-[#FDF8F0] placeholder-[#8B9E7C]/60 focus:outline-none focus:border-[#8B9E7C] transition-colors"
          />
          <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B9E7C]/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <select
          value={selectedMunicipio}
          onChange={(e) => setSelectedMunicipio(e.target.value)}
          className="px-4 py-3 rounded-xl bg-[#2D3B2D]/50 border border-[#8B9E7C]/30 text-[#FDF8F0] focus:outline-none focus:border-[#8B9E7C] transition-colors"
        >
          <option value="all">Todos los Municipios ({PHARMACIES.length})</option>
          {municipalities.map((m) => (
            <option key={m} value={m}>
              {m} ({PHARMACIES.filter((p) => p.municipality === m).length})
            </option>
          ))}
        </select>
      </div>

      {/* Map */}
      <div className="rounded-2xl overflow-hidden border border-[#8B9E7C]/20" style={{ height: "500px" }}>
        <MapView onMapReady={handleMapReady} />
      </div>

      {/* Results count */}
      <p className="mt-4 text-sm text-[#8B9E7C]/70">
        Mostrando {Math.min(filtered.length, 100)} de {filtered.length} farmacias
        {selectedMunicipio !== "all" && ` en ${selectedMunicipio}`}
      </p>

      {/* Pharmacy list */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto pr-2">
        {filtered.slice(0, 30).map((pharmacy, i) => (
          <div
            key={i}
            className="p-4 rounded-xl bg-[#2D3B2D]/30 border border-[#8B9E7C]/10 hover:border-[#8B9E7C]/40 transition-all duration-300"
          >
            <h4 className="text-sm font-semibold text-[#FDF8F0] mb-1">{pharmacy.name}</h4>
            <p className="text-xs text-[#8B9E7C]/80 mb-1">{pharmacy.municipality}</p>
            <p className="text-xs text-[#FDF8F0]/50 mb-2">{pharmacy.address}</p>
            <a
              href={`tel:${pharmacy.phone.replace(/[^+\d]/g, "")}`}
              className="text-xs text-[#C4725F] hover:text-[#D4A574] transition-colors"
            >
              {pharmacy.phone}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
