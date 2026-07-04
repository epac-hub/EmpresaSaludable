/**
 * PharmacyMap — Interactive Google Maps pharmacy locator for Puerto Rico
 * Design: Light Botanical Sanctuary — sage markers, clean info windows
 * Featured: Super Farmacia Isla Verde, Carolina PR
 */
import { useEffect, useRef, useState } from "react";
import { MapView } from "@/components/Map";
import { PHARMACIES } from "./pharmacyData";

// Featured pharmacy
const FEATURED_PHARMACY = {
  name: "Super Farmacia Isla Verde",
  municipality: "Carolina",
  address: "1035 #AO-16 Marginal Villamar, Isla Verde",
  phone: "+1-787-200-0380",
  lat: 18.4498,
  lng: -66.0015,
  featured: true,
};

export default function PharmacyMap() {
  const [selectedMunicipio, setSelectedMunicipio] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get unique municipalities with counts
  const municipalities = Array.from(new Set(PHARMACIES.map((p) => p.municipality))).sort();
  const muniCounts = municipalities.map((m) => ({
    name: m,
    count: PHARMACIES.filter((p) => p.municipality === m).length,
  }));

  // Filter pharmacies
  const filtered = PHARMACIES.filter((p) => {
    const matchMuni = selectedMunicipio === "all" || p.municipality === selectedMunicipio;
    const matchSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.municipality.toLowerCase().includes(searchQuery.toLowerCase());
    return matchMuni && matchSearch;
  });

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleMapReady = (map: google.maps.Map) => {
    mapInstanceRef.current = map;
    infoWindowRef.current = new google.maps.InfoWindow();

    // Center on Puerto Rico
    map.setCenter({ lat: 18.2208, lng: -66.5901 });
    map.setZoom(9);
    map.setOptions({
      styles: [
        { featureType: "water", stylers: [{ color: "#d4e8d0" }] },
        { featureType: "landscape", stylers: [{ color: "#f5f9f3" }] },
        { featureType: "road", stylers: [{ color: "#e8ede6" }] },
        { featureType: "poi", stylers: [{ visibility: "off" }] },
        { featureType: "transit", stylers: [{ visibility: "off" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#2D3B2D" }] },
      ],
    });

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

    // Add FEATURED marker first (Super Farmacia Isla Verde)
    const featuredEl = document.createElement("div");
    featuredEl.innerHTML = `
      <div style="
        width: 44px; height: 44px;
        background: linear-gradient(135deg, #6BAF8D, #4A9070);
        border: 3px solid #FFFFFF;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 4px 16px rgba(107,175,141,0.5);
        display: flex; align-items: center; justify-content: center;
        animation: pulse 2s infinite;
      ">
        <span style="transform: rotate(45deg); color: #FFF; font-size: 18px; font-weight: bold;">★</span>
      </div>
    `;

    const featuredMarker = new google.maps.marker.AdvancedMarkerElement({
      map,
      position: { lat: FEATURED_PHARMACY.lat, lng: FEATURED_PHARMACY.lng },
      content: featuredEl,
      title: FEATURED_PHARMACY.name,
      zIndex: 1000,
    });

    featuredMarker.addListener("click", () => {
      if (infoWindowRef.current) {
        infoWindowRef.current.setContent(`
          <div style="padding: 16px; font-family: 'DM Sans', sans-serif; max-width: 280px;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
              <span style="background: #6BAF8D; color: white; font-size: 10px; padding: 2px 8px; border-radius: 12px; font-weight: 600;">★ DESTACADA</span>
            </div>
            <h3 style="margin: 0 0 6px; color: #2D3B2D; font-size: 16px; font-weight: 700;">${FEATURED_PHARMACY.name}</h3>
            <p style="margin: 0 0 4px; color: #6BAF8D; font-size: 13px; font-weight: 500;">${FEATURED_PHARMACY.municipality}, Puerto Rico</p>
            <p style="margin: 0 0 8px; color: #666; font-size: 12px;">${FEATURED_PHARMACY.address}</p>
            <a href="tel:${FEATURED_PHARMACY.phone.replace(/[^+\d]/g, '')}" style="color: #6BAF8D; font-size: 13px; text-decoration: none; font-weight: 600;">${FEATURED_PHARMACY.phone}</a>
          </div>
        `);
        infoWindowRef.current.open(map, featuredMarker);
      }
    });

    markersRef.current.push(featuredMarker);

    // Place regular markers
    const pharmaciesToShow = filtered.slice(0, 100);
    const offsetCounters: Record<string, number> = {};

    pharmaciesToShow.forEach((pharmacy) => {
      // Skip featured pharmacy from regular markers
      if (pharmacy.name === "Super Farmacia Isla Verde" && pharmacy.municipality === "Carolina") return;

      const muniKey = pharmacy.municipality;
      const coords = MUNI_COORDS[muniKey];
      if (!coords) return;

      if (!offsetCounters[muniKey]) offsetCounters[muniKey] = 0;
      offsetCounters[muniKey]++;
      const offset = offsetCounters[muniKey] * 0.003;
      const angle = (offsetCounters[muniKey] * 137.5 * Math.PI) / 180;

      const position = {
        lat: coords.lat + Math.cos(angle) * offset,
        lng: coords.lng + Math.sin(angle) * offset,
      };

      const markerEl = document.createElement("div");
      markerEl.innerHTML = `
        <div style="
          width: 28px; height: 28px;
          background: linear-gradient(135deg, #A8C5A0, #7EB89A);
          border: 2px solid #FFFFFF;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          display: flex; align-items: center; justify-content: center;
        ">
          <span style="transform: rotate(45deg); color: #FFF; font-size: 12px;">+</span>
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
              <p style="margin: 0 0 4px; color: #6BAF8D; font-size: 12px; font-weight: 500;">${pharmacy.municipality}</p>
              <p style="margin: 0 0 4px; color: #666; font-size: 11px;">${pharmacy.address}</p>
              <a href="tel:${pharmacy.phone.replace(/[^+\d]/g, '')}" style="color: #6BAF8D; font-size: 12px; text-decoration: none; font-weight: 500;">${pharmacy.phone}</a>
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
      {/* ═══ FEATURED PHARMACY BANNER ═══ */}
      <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-[#6BAF8D]/10 to-[#A8C5A0]/10 border border-[#6BAF8D]/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#6BAF8D]/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-[#6BAF8D] text-white text-xs font-semibold">★ Farmacia Destacada</span>
            </div>
            <h3 className="text-xl font-bold text-[#2D3B2D]" style={{ fontFamily: "'Playfair Display', serif" }}>
              {FEATURED_PHARMACY.name}
            </h3>
            <p className="text-sm text-[#2D3B2D]/60 mt-1">{FEATURED_PHARMACY.address}</p>
            <p className="text-sm text-[#2D3B2D]/60">{FEATURED_PHARMACY.municipality}, Puerto Rico</p>
          </div>
          <a
            href={`tel:${FEATURED_PHARMACY.phone.replace(/[^+\d]/g, "")}`}
            className="px-6 py-3 rounded-full bg-[#6BAF8D] text-white font-semibold hover:bg-[#5A9E7D] transition-all duration-300 hover:scale-105 shadow-md shadow-[#6BAF8D]/20 text-sm whitespace-nowrap"
          >
            Llamar: {FEATURED_PHARMACY.phone}
          </a>
        </div>
      </div>

      {/* ═══ FILTER CONTROLS ═══ */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Search input */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Buscar farmacia por nombre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-5 py-3.5 rounded-xl bg-white border border-[#A8C5A0]/30 text-[#2D3B2D] placeholder-[#2D3B2D]/40 focus:outline-none focus:border-[#6BAF8D] focus:ring-2 focus:ring-[#6BAF8D]/20 transition-all"
          />
          <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A8C5A0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Municipality Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full md:w-72 px-5 py-3.5 rounded-xl bg-white border border-[#A8C5A0]/30 text-[#2D3B2D] focus:outline-none focus:border-[#6BAF8D] focus:ring-2 focus:ring-[#6BAF8D]/20 transition-all flex items-center justify-between gap-2 text-left"
          >
            <span className={selectedMunicipio === "all" ? "text-[#2D3B2D]/50" : "text-[#2D3B2D] font-medium"}>
              {selectedMunicipio === "all" ? `Todos los Municipios (${municipalities.length})` : `${selectedMunicipio} (${PHARMACIES.filter((p) => p.municipality === selectedMunicipio).length})`}
            </span>
            <svg
              className={`w-5 h-5 text-[#6BAF8D] transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown menu */}
          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#A8C5A0]/30 rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto">
              <button
                onClick={() => { setSelectedMunicipio("all"); setIsDropdownOpen(false); }}
                className={`w-full px-5 py-3 text-left text-sm hover:bg-[#6BAF8D]/5 transition-colors flex items-center justify-between ${
                  selectedMunicipio === "all" ? "bg-[#6BAF8D]/10 text-[#6BAF8D] font-semibold" : "text-[#2D3B2D]"
                }`}
              >
                <span>Todos los Municipios</span>
                <span className="text-xs text-[#2D3B2D]/40">{PHARMACIES.length}</span>
              </button>
              <div className="border-t border-[#A8C5A0]/10" />
              {muniCounts.map((m) => (
                <button
                  key={m.name}
                  onClick={() => { setSelectedMunicipio(m.name); setIsDropdownOpen(false); }}
                  className={`w-full px-5 py-2.5 text-left text-sm hover:bg-[#6BAF8D]/5 transition-colors flex items-center justify-between ${
                    selectedMunicipio === m.name ? "bg-[#6BAF8D]/10 text-[#6BAF8D] font-semibold" : "text-[#2D3B2D]"
                  }`}
                >
                  <span>{m.name}</span>
                  <span className="text-xs bg-[#F4F9F2] px-2 py-0.5 rounded-full text-[#6BAF8D]">{m.count}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ═══ MAP ═══ */}
      <div className="rounded-2xl overflow-hidden border border-[#A8C5A0]/20 shadow-lg" style={{ height: "500px" }}>
        <MapView onMapReady={handleMapReady} />
      </div>

      {/* Results count */}
      <p className="mt-4 text-sm text-[#2D3B2D]/50">
        Mostrando {Math.min(filtered.length, 100)} de {filtered.length} farmacias
        {selectedMunicipio !== "all" && ` en ${selectedMunicipio}`}
      </p>

      {/* ═══ PHARMACY LIST ═══ */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto pr-2">
        {filtered.slice(0, 30).map((pharmacy, i) => {
          const isFeatured = pharmacy.name === "Super Farmacia Isla Verde" && pharmacy.municipality === "Carolina";
          return (
            <div
              key={i}
              className={`p-4 rounded-xl border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${
                isFeatured
                  ? "bg-[#6BAF8D]/5 border-[#6BAF8D]/40 shadow-sm"
                  : "bg-white border-[#A8C5A0]/20 hover:border-[#6BAF8D]/30"
              }`}
            >
              {isFeatured && (
                <span className="inline-block px-2 py-0.5 rounded-full bg-[#6BAF8D] text-white text-[10px] font-semibold mb-2">★ DESTACADA</span>
              )}
              <h4 className="text-sm font-semibold text-[#2D3B2D] mb-1">{pharmacy.name}</h4>
              <p className="text-xs text-[#6BAF8D] font-medium mb-1">{pharmacy.municipality}</p>
              <p className="text-xs text-[#2D3B2D]/50 mb-2">{pharmacy.address}</p>
              <a
                href={`tel:${pharmacy.phone.replace(/[^+\d]/g, "")}`}
                className="text-xs text-[#6BAF8D] hover:text-[#5A9E7D] font-medium transition-colors"
              >
                {pharmacy.phone}
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
