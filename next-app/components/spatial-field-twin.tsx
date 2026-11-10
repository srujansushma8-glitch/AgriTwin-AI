"use client";

import React, { useState } from "react";
import { Droplets, Thermometer, Sparkles, MapPin } from "lucide-react";
import { FieldPlot } from "@/lib/api";

interface SpatialFieldTwinProps {
  plots: FieldPlot[];
  selectedPlot: FieldPlot;
  onSelectPlot: (plot: FieldPlot) => void;
}

type LayerMode = "moisture" | "canopy" | "thermal";

export function SpatialFieldTwin({
  plots,
  selectedPlot,
  onSelectPlot,
}: SpatialFieldTwinProps) {
  const [activeLayer, setActiveLayer] = useState<LayerMode>("moisture");

  const getLayerColor = (plot: FieldPlot) => {
    if (activeLayer === "moisture") {
      const rootMoisture = plot.soil.layers[1]?.moisture_percentage ?? 25;
      if (rootMoisture >= 32) return "from-emerald-500/25 to-blue-500/35 border-blue-500/50";
      if (rootMoisture >= 24) return "from-amber-500/25 to-emerald-500/30 border-emerald-500/40";
      return "from-amber-600/30 to-red-500/35 border-red-500/60";
    }
    if (activeLayer === "canopy") {
      const ndvi = plot.crop.canopy_ndvi;
      if (ndvi >= 0.8) return "from-emerald-600/35 to-green-500/40 border-emerald-500/60";
      if (ndvi >= 0.7) return "from-emerald-500/25 to-yellow-500/30 border-yellow-500/50";
      return "from-yellow-600/30 to-amber-600/35 border-amber-500/60";
    }
    // Thermal stress (CWSI)
    const cwsi = plot.crop.crop_water_stress_index;
    if (cwsi < 0.3) return "from-sky-500/25 to-emerald-500/30 border-sky-500/50";
    if (cwsi < 0.5) return "from-amber-500/30 to-orange-500/35 border-amber-500/60";
    return "from-orange-600/35 to-rose-600/40 border-rose-500/70";
  };

  return (
    <div className="relative rounded-2xl border border-border bg-card p-5 shadow-xs overflow-hidden">
      {/* Background grid lines for digital twin aesthetic */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Header controls for Digital Twin */}
      <div className="relative flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-2 rounded-full bg-emerald-500 animate-ping" />
            <h2 className="text-sm font-bold tracking-tight text-foreground uppercase">
              Field Spatial Digital Twin
            </h2>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time micro-zone simulation & multi-layer sensor telemetry
          </p>
        </div>

        {/* Layer Switches */}
        <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/60 p-1">
          <button
            onClick={() => setActiveLayer("moisture")}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all cursor-pointer ${
              activeLayer === "moisture"
                ? "bg-card text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Droplets className="size-3.5 text-blue-500" />
            <span>Soil Moisture (Depth)</span>
          </button>
          <button
            onClick={() => setActiveLayer("canopy")}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all cursor-pointer ${
              activeLayer === "canopy"
                ? "bg-card text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Sparkles className="size-3.5 text-emerald-500" />
            <span>Canopy NDVI</span>
          </button>
          <button
            onClick={() => setActiveLayer("thermal")}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all cursor-pointer ${
              activeLayer === "thermal"
                ? "bg-card text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Thermometer className="size-3.5 text-amber-500" />
            <span>VPD & Thermal</span>
          </button>
        </div>
      </div>

      {/* Interactive 2.5D Plot Grid Map */}
      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
        {plots.map((plot) => {
          const isSelected = plot.id === selectedPlot.id;
          const rootMoisture = plot.soil.layers[1]?.moisture_percentage ?? 25;
          const topMoisture = plot.soil.layers[0]?.moisture_percentage ?? 20;

          return (
            <div
              key={plot.id}
              onClick={() => onSelectPlot(plot)}
              className={`group relative rounded-xl border p-4 transition-all duration-200 cursor-pointer overflow-hidden ${
                isSelected
                  ? "ring-2 ring-emerald-500 shadow-md bg-gradient-to-br " + getLayerColor(plot)
                  : "bg-card/70 hover:bg-card/90 border-border hover:border-emerald-500/40"
              }`}
            >
              {/* Corner badge for crop and status */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[0.65rem] font-bold uppercase tracking-wider text-muted-foreground">
                    Zone {plot.id.split("-")[1]?.toUpperCase() || "A"}
                  </span>
                  <h3 className="text-sm font-semibold text-foreground group-hover:text-emerald-500 transition-colors">
                    {plot.name}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-xs font-medium text-muted-foreground">
                      {plot.crop.crop_name} • {plot.crop.variety}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[0.65rem] font-bold ${
                      plot.risk_level === "Low"
                        ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                        : plot.risk_level === "Moderate"
                        ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                        : "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                    }`}
                  >
                    {plot.risk_level} Risk
                  </span>
                  <span className="text-[0.7rem] font-mono text-muted-foreground">
                    Score: {plot.resilience_score}/100
                  </span>
                </div>
              </div>

              {/* Dynamic Layer Data Overlay */}
              <div className="mt-4 pt-3 border-t border-border/60 grid grid-cols-3 gap-2 text-xs">
                {activeLayer === "moisture" && (
                  <>
                    <div className="rounded-lg bg-background/50 p-2 border border-border/40">
                      <span className="text-[0.65rem] text-muted-foreground block">Topsoil (10cm)</span>
                      <span className="font-mono font-semibold text-foreground">{topMoisture}%</span>
                    </div>
                    <div className="rounded-lg bg-background/50 p-2 border border-border/40">
                      <span className="text-[0.65rem] text-muted-foreground block">Root Zone (30cm)</span>
                      <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                        {rootMoisture}%
                      </span>
                    </div>
                    <div className="rounded-lg bg-background/50 p-2 border border-border/40">
                      <span className="text-[0.65rem] text-muted-foreground block">Water Potential</span>
                      <span className="font-mono font-semibold text-foreground">
                        {plot.soil.water_potential_kpa} kPa
                      </span>
                    </div>
                  </>
                )}

                {activeLayer === "canopy" && (
                  <>
                    <div className="rounded-lg bg-background/50 p-2 border border-border/40">
                      <span className="text-[0.65rem] text-muted-foreground block">Canopy NDVI</span>
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {plot.crop.canopy_ndvi}
                      </span>
                    </div>
                    <div className="rounded-lg bg-background/50 p-2 border border-border/40">
                      <span className="text-[0.65rem] text-muted-foreground block">Leaf Area Index</span>
                      <span className="font-mono font-semibold text-foreground">
                        {plot.crop.leaf_area_index}
                      </span>
                    </div>
                    <div className="rounded-lg bg-background/50 p-2 border border-border/40">
                      <span className="text-[0.65rem] text-muted-foreground block">GDD Accumulated</span>
                      <span className="font-mono font-semibold text-foreground">
                        {plot.crop.growing_degree_days_accumulated} °C-d
                      </span>
                    </div>
                  </>
                )}

                {activeLayer === "thermal" && (
                  <>
                    <div className="rounded-lg bg-background/50 p-2 border border-border/40">
                      <span className="text-[0.65rem] text-muted-foreground block">Canopy Temp</span>
                      <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                        {plot.crop.canopy_temperature_c}°C
                      </span>
                    </div>
                    <div className="rounded-lg bg-background/50 p-2 border border-border/40">
                      <span className="text-[0.65rem] text-muted-foreground block">VPD Deficit</span>
                      <span className="font-mono font-semibold text-foreground">
                        {plot.microclimate.vapor_pressure_deficit_kpa} kPa
                      </span>
                    </div>
                    <div className="rounded-lg bg-background/50 p-2 border border-border/40">
                      <span className="text-[0.65rem] text-muted-foreground block">Stress Index (CWSI)</span>
                      <span
                        className={`font-mono font-semibold ${
                          plot.crop.crop_water_stress_index > 0.4
                            ? "text-rose-500 font-bold"
                            : "text-emerald-500"
                        }`}
                      >
                        {plot.crop.crop_water_stress_index}
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Status bar */}
              <div className="mt-3 flex items-center justify-between text-[0.7rem] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="size-3 text-muted-foreground" />
                  {plot.area_hectares} ha • {(plot.irrigation_system || plot.irrigation_method || "Drip").split(" ")[0]}
                </span>
                <span className="font-medium text-foreground">{plot.crop.growth_stage}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Layer legend */}
      <div className="relative mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground pt-3 border-t border-border/60">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-foreground">Legend:</span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-emerald-500" /> Optimal Health
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-amber-500" /> Moisture Deficit Warning
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-rose-500" /> High Stress / Thermal Critical
          </span>
        </div>
        <span className="text-[0.7rem]">Click any zone to inspect full digital twin telemetry</span>
      </div>
    </div>
  );
}
