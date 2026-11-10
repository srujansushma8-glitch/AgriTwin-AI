"use client";

import React, { useState, useEffect } from "react";
import {
  MapPin,
  Compass,
  Layers,
  Save,
  CheckCircle2,
  Navigation,
  Mountain,
  Globe2,
  Maximize2,
  RefreshCw,
} from "lucide-react";
import {
  fetchGeospatialDistricts,
  updateFieldGeospatialLocation,
  StateDistricts,
  DistrictInfo,
} from "@/lib/api";
import { useTranslation } from "@/lib/i18n";

interface LocationTwinPickerProps {
  fieldId: string;
  initialState?: string;
  initialDistrict?: string;
  initialVillage?: string;
  initialLat?: number;
  initialLng?: number;
  initialElevation?: number;
  onLocationUpdated?: (updated: {
    state: string;
    district: string;
    village: string;
    lat: number;
    lng: number;
    elevation_m: number;
  }) => void;
}

export function LocationTwinPicker({
  fieldId,
  initialState = "Karnataka",
  initialDistrict = "Mandya",
  initialVillage = "Kaveri Basin — Plot #142/A",
  initialLat = 12.524,
  initialLng = 76.896,
  initialElevation = 670,
  onLocationUpdated,
}: LocationTwinPickerProps) {
  const { t } = useTranslation();

  const [statesData, setStatesData] = useState<StateDistricts[]>([]);
  const [selectedState, setSelectedState] = useState<string>(initialState);
  const [selectedDistrict, setSelectedDistrict] = useState<string>(initialDistrict);
  const [village, setVillage] = useState<string>(initialVillage);
  const [lat, setLat] = useState<number>(initialLat);
  const [lng, setLng] = useState<number>(initialLng);
  const [elevation, setElevation] = useState<number>(initialElevation);

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [boundaryVertices, setBoundaryVertices] = useState<Array<[number, number]>>([
    [0.15, 0.15],
    [0.85, 0.12],
    [0.9, 0.88],
    [0.12, 0.82],
  ]);

  // Load districts
  useEffect(() => {
    fetchGeospatialDistricts()
      .then((res) => {
        if (res && res.states) {
          setStatesData(res.states);
        }
      })
      .catch(() => {});
  }, []);

  const activeStateObj = statesData.find((s) => s.name === selectedState) || statesData[0];
  const activeDistricts = activeStateObj?.districts || [];
  const currentDistrictObj = activeDistricts.find((d) => d.name === selectedDistrict);

  // When district changes, update coordinates and elevation
  const handleDistrictChange = (distName: string) => {
    setSelectedDistrict(distName);
    const d = activeDistricts.find((item) => item.name === distName);
    if (d) {
      setLat(d.lat);
      setLng(d.lng);
      setElevation(d.elevation_m);
    }
  };

  const handleStateChange = (stateName: string) => {
    setSelectedState(stateName);
    const s = statesData.find((item) => item.name === stateName);
    if (s && s.districts.length > 0) {
      handleDistrictChange(s.districts[0].name);
    }
  };

  const handleSaveLocation = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      await updateFieldGeospatialLocation(fieldId, {
        state: selectedState,
        district: selectedDistrict,
        village,
        lat,
        lng,
        elevation_m: elevation,
        boundary_geojson: {
          type: "Polygon",
          coordinates: [
            boundaryVertices.map(([vx, vy]) => [
              lng + (vx - 0.5) * 0.008,
              lat + (vy - 0.5) * 0.008,
            ]),
          ],
        },
      });

      setSaveSuccess(true);
      if (onLocationUpdated) {
        onLocationUpdated({
          state: selectedState,
          district: selectedDistrict,
          village,
          lat,
          lng,
          elevation_m: elevation,
        });
      }
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to update location:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-border">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
              <Globe2 className="size-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                Geospatial Twin & Cadastral Plot Boundary
              </h3>
              <p className="text-xs text-muted-foreground">
                Configure real-world GPS coordinates, district elevation, and farm boundary geometry.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleSaveLocation}
          disabled={isSaving}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer disabled:opacity-50"
        >
          {isSaving ? (
            <RefreshCw className="size-3.5 animate-spin" />
          ) : saveSuccess ? (
            <CheckCircle2 className="size-3.5 text-white" />
          ) : (
            <Save className="size-3.5" />
          )}
          <span>{saveSuccess ? "Synchronized to 3D Twin!" : "Synchronize 3D Digital Twin"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-5">
        {/* Form Selectors */}
        <div className="lg:col-span-5 space-y-4 text-xs">
          {/* State & District */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-muted-foreground block mb-1.5">State / Province</label>
              <select
                value={selectedState}
                onChange={(e) => handleStateChange(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-foreground font-medium focus:ring-1 focus:ring-emerald-500 outline-none"
              >
                {statesData.map((st) => (
                  <option key={st.name} value={st.name}>
                    {st.name}
                  </option>
                ))}
                {statesData.length === 0 && <option value="Karnataka">Karnataka</option>}
              </select>
            </div>

            <div>
              <label className="font-semibold text-muted-foreground block mb-1.5">District / Region</label>
              <select
                value={selectedDistrict}
                onChange={(e) => handleDistrictChange(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-foreground font-medium focus:ring-1 focus:ring-emerald-500 outline-none"
              >
                {activeDistricts.map((dst) => (
                  <option key={dst.name} value={dst.name}>
                    {dst.name} ({dst.elevation_m}m)
                  </option>
                ))}
                {activeDistricts.length === 0 && <option value="Mandya">Mandya (670m)</option>}
              </select>
            </div>
          </div>

          {/* Village / Cadastral Plot */}
          <div>
            <label className="font-semibold text-muted-foreground block mb-1.5">
              Village / Cadastral Survey Number
            </label>
            <input
              type="text"
              value={village}
              onChange={(e) => setVillage(e.target.value)}
              placeholder="e.g. Kaveri Basin — Survey Plot #142/A"
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-foreground font-medium focus:ring-1 focus:ring-emerald-500 outline-none"
            />
          </div>

          {/* Lat & Lng */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-muted-foreground block mb-1.5 flex items-center gap-1">
                <MapPin className="size-3 text-emerald-500" />
                Latitude (°N)
              </label>
              <input
                type="number"
                step="0.0001"
                value={lat}
                onChange={(e) => setLat(parseFloat(e.target.value) || 0)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-foreground font-mono focus:ring-1 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-muted-foreground block mb-1.5 flex items-center gap-1">
                <Navigation className="size-3 text-sky-500" />
                Longitude (°E)
              </label>
              <input
                type="number"
                step="0.0001"
                value={lng}
                onChange={(e) => setLng(parseFloat(e.target.value) || 0)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-foreground font-mono focus:ring-1 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          {/* Elevation */}
          <div>
            <label className="font-semibold text-muted-foreground block mb-1.5 flex items-center gap-1">
              <Mountain className="size-3 text-amber-500" />
              Elevation (Meters ASL)
            </label>
            <input
              type="number"
              value={elevation}
              onChange={(e) => setElevation(parseInt(e.target.value) || 0)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-foreground font-mono focus:ring-1 focus:ring-emerald-500 outline-none"
            />
          </div>

          {/* Regional Agro-Climatic Intel */}
          {currentDistrictObj && (
            <div className="rounded-xl bg-muted/50 p-3 border border-border/80">
              <span className="text-[0.65rem] font-bold text-muted-foreground uppercase block mb-1">
                Regional Agronomic Match
              </span>
              <div className="flex flex-wrap gap-1 mt-1">
                {currentDistrictObj.primary_crops.map((c) => (
                  <span
                    key={c}
                    className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[0.65rem] font-semibold"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Interactive Cadastral Boundary Map Preview */}
        <div className="lg:col-span-7 flex flex-col justify-between rounded-2xl bg-neutral-900 border border-border p-4 relative overflow-hidden">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-800 text-xs">
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-emerald-400" />
              <span className="font-bold text-neutral-200">
                Cadastral Survey Map & Parcel Boundary
              </span>
            </div>
            <span className="text-[0.65rem] font-mono text-neutral-400">
              Area: ~2.4 Hectares (5.93 Acres)
            </span>
          </div>

          {/* SVG Cadastral Map Representation */}
          <div className="w-full h-56 relative my-2 flex items-center justify-center">
            {/* Topographic Contour Lines */}
            <svg className="w-full h-full absolute inset-0" viewBox="0 0 400 220">
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#262626" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="400" height="220" fill="#171717" />
              <rect width="400" height="220" fill="url(#grid)" />

              {/* Natural elevation contours */}
              <path
                d="M 10 180 Q 150 140 280 190 T 390 160"
                fill="none"
                stroke="#333333"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <path
                d="M 20 110 Q 180 80 290 120 T 380 90"
                fill="none"
                stroke="#333333"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <path
                d="M 10 50 Q 160 30 270 60 T 390 40"
                fill="none"
                stroke="#333333"
                strokeWidth="1"
                strokeDasharray="4 4"
              />

              {/* Rural road */}
              <path
                d="M 0 30 Q 120 45 240 25 T 400 35"
                fill="none"
                stroke="#525252"
                strokeWidth="6"
              />

              {/* Parcel polygon boundary */}
              <polygon
                points={boundaryVertices
                  .map(([vx, vy]) => `${Math.round(60 + vx * 260)},${Math.round(40 + vy * 140)}`)
                  .join(" ")}
                fill="rgba(16, 185, 129, 0.2)"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeDasharray="6 3"
              />

              {/* Corner boundary stone nodes */}
              {boundaryVertices.map(([vx, vy], idx) => {
                const px = Math.round(60 + vx * 260);
                const py = Math.round(40 + vy * 140);
                return (
                  <g key={idx}>
                    <circle cx={px} cy={py} r="5" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
                    <text
                      x={px + 8}
                      y={py - 6}
                      fill="#a3a3a3"
                      fontSize="9"
                      fontFamily="monospace"
                    >
                      P{idx + 1}
                    </text>
                  </g>
                );
              })}

              {/* Digital Twin Sensor Station Icon */}
              <circle cx="190" cy="115" r="7" fill="#38bdf8" />
              <circle cx="190" cy="115" r="14" fill="none" stroke="#38bdf8" strokeWidth="1" opacity="0.4" />
              <text x="205" y="119" fill="#38bdf8" fontSize="10" fontWeight="bold">
                IoT Twin Gateway #GW-01
              </text>
            </svg>
          </div>

          <div className="flex items-center justify-between text-[0.65rem] text-neutral-400 pt-2 border-t border-neutral-800 font-mono">
            <span>Datum: WGS 84 • EPSG:4326</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="size-3" />
              Synchronized with 3D Spatial Pipeline
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

