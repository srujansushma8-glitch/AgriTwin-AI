"use client";

import React from "react";
import {
  Thermometer,
  Droplets,
  Sun,
  Wind,
  Layers,
  Flame,
  Sparkles,
} from "lucide-react";
import { FieldPlot } from "@/lib/api";

interface TelemetryCardsProps {
  plot: FieldPlot;
}

export function TelemetryCards({ plot }: TelemetryCardsProps) {
  const { microclimate, soil, crop } = plot;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* 1. Microclimate Telemetry Grid */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500 ring-1 ring-amber-500/20">
                <Thermometer className="size-4" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                Microclimate Telemetry
              </h3>
            </div>
            <span className="text-[0.65rem] font-mono text-muted-foreground">LIVE STREAM</span>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="rounded-xl border border-border/60 bg-muted/30 p-3">
              <div className="flex items-center justify-between text-muted-foreground text-xs">
                <span>Ambient Temp</span>
                <Thermometer className="size-3.5 text-amber-500" />
              </div>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-xl font-bold font-mono text-foreground">
                  {microclimate.ambient_temp_c}°C
                </span>
                <span className="text-[0.65rem] text-muted-foreground">
                  Heat: {microclimate.heat_index_c}°C
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-border/60 bg-muted/30 p-3">
              <div className="flex items-center justify-between text-muted-foreground text-xs">
                <span>VPD Deficit</span>
                <Flame className="size-3.5 text-rose-500" />
              </div>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-xl font-bold font-mono text-foreground">
                  {microclimate.vapor_pressure_deficit_kpa}
                </span>
                <span className="text-xs text-muted-foreground">kPa</span>
              </div>
            </div>

            <div className="rounded-xl border border-border/60 bg-muted/30 p-3">
              <div className="flex items-center justify-between text-muted-foreground text-xs">
                <span>Humidity (RH)</span>
                <Droplets className="size-3.5 text-blue-500" />
              </div>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-xl font-bold font-mono text-foreground">
                  {microclimate.relative_humidity_percent}%
                </span>
                <span className="text-[0.65rem] text-muted-foreground">RH</span>
              </div>
            </div>

            <div className="rounded-xl border border-border/60 bg-muted/30 p-3">
              <div className="flex items-center justify-between text-muted-foreground text-xs">
                <span>Solar Radiation</span>
                <Sun className="size-3.5 text-amber-500" />
              </div>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-xl font-bold font-mono text-foreground">
                  {microclimate.solar_radiation_wm2}
                </span>
                <span className="text-[0.65rem] text-muted-foreground">W/m²</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Wind className="size-3.5" /> Wind: {microclimate.wind_speed_kmh} km/h
          </span>
          <span className="font-mono text-foreground font-medium">CO₂: {microclimate.co2_ppm} ppm</span>
        </div>
      </div>

      {/* 2. Subsurface Soil Multi-Depth Strata */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500 ring-1 ring-blue-500/20">
                <Layers className="size-4" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                Subsurface Soil Strata
              </h3>
            </div>
            <span className="text-xs font-mono text-muted-foreground">
              Ψ: {soil.water_potential_kpa} kPa
            </span>
          </div>

          <div className="space-y-3 mt-4">
            {soil.layers.map((layer) => (
              <div
                key={layer.depth_cm}
                className="rounded-xl border border-border/60 bg-muted/20 p-2.5"
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-medium text-foreground">
                    {layer.depth_cm === 10
                      ? "10cm (Topsoil)"
                      : layer.depth_cm === 30
                      ? "30cm (Active Root Zone)"
                      : "60cm (Deep Moisture Reserve)"}
                  </span>
                  <span className="font-mono font-bold text-foreground">
                    {layer.moisture_percentage}%
                  </span>
                </div>

                {/* Depth progress bar */}
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      layer.moisture_percentage > 30
                        ? "bg-blue-500"
                        : layer.moisture_percentage > 22
                        ? "bg-emerald-500"
                        : "bg-amber-500"
                    }`}
                    style={{ width: `${Math.min(100, layer.moisture_percentage * 2)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[0.65rem] text-muted-foreground mt-1.5">
                  <span>Temp: {layer.temperature_celsius}°C</span>
                  <span>Salinity (EC): {layer.ec_ds_m} dS/m</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
          <span>pH: <strong className="text-foreground">{soil.ph}</strong></span>
          <span>N-P-K: <strong className="text-foreground">{soil.nitrogen_ppm}-{soil.phosphorus_ppm}-{soil.potassium_ppm}</strong></span>
          <span>OM: <strong className="text-foreground">{soil.organic_matter_percent}%</strong></span>
        </div>
      </div>

      {/* 3. Crop Phenology & Water Stress Index (CWSI) */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500 ring-1 ring-emerald-500/20">
                <Sparkles className="size-4" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                Crop Phenology Twin
              </h3>
            </div>
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[0.65rem] font-semibold text-emerald-600 dark:text-emerald-400">
              {crop.health_status}
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {/* GDD thermal units accumulation */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-muted-foreground">GDD Thermal Progress</span>
                <span className="font-mono text-foreground font-semibold">
                  {crop.growing_degree_days_accumulated} / {crop.gdd_stage_target} °C-d
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{
                    width: `${Math.min(
                      100,
                      (crop.growing_degree_days_accumulated / crop.gdd_stage_target) * 100
                    )}%`,
                  }}
                />
              </div>
            </div>

            {/* CWSI Crop Water Stress Index Meter */}
            <div className="rounded-xl border border-border/60 bg-muted/20 p-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Crop Water Stress Index (CWSI)</span>
                <span
                  className={`font-mono font-bold ${
                    crop.crop_water_stress_index > 0.45
                      ? "text-rose-500"
                      : crop.crop_water_stress_index > 0.3
                      ? "text-amber-500"
                      : "text-emerald-500"
                  }`}
                >
                  {crop.crop_water_stress_index.toFixed(2)} / 1.00
                </span>
              </div>
              <div className="mt-2 h-2.5 w-full rounded-full bg-muted flex overflow-hidden">
                <div className="w-1/3 bg-emerald-500/40" />
                <div className="w-1/3 bg-amber-500/40" />
                <div className="w-1/3 bg-rose-500/40" />
              </div>
              <div className="flex justify-between text-[0.65rem] text-muted-foreground mt-1">
                <span>0.0 (Optimal)</span>
                <span>0.4 (Stress Threshold)</span>
                <span>1.0 (Critical Deficit)</span>
              </div>
            </div>

            {/* Canopy indices */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg bg-muted/30 p-2 border border-border/40">
                <span className="text-[0.65rem] text-muted-foreground block">NDVI</span>
                <span className="font-mono font-bold text-emerald-500 text-sm">
                  {crop.canopy_ndvi}
                </span>
              </div>
              <div className="rounded-lg bg-muted/30 p-2 border border-border/40">
                <span className="text-[0.65rem] text-muted-foreground block">LAI</span>
                <span className="font-mono font-bold text-foreground text-sm">
                  {crop.leaf_area_index}
                </span>
              </div>
              <div className="rounded-lg bg-muted/30 p-2 border border-border/40">
                <span className="text-[0.65rem] text-muted-foreground block">Canopy T°</span>
                <span className="font-mono font-bold text-foreground text-sm">
                  {crop.canopy_temperature_c}°C
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
          <span>Stage: <strong className="text-foreground">{crop.growth_stage}</strong></span>
          <span>DAS: <strong className="text-foreground">{crop.days_after_sowing}d</strong></span>
        </div>
      </div>
    </div>
  );
}
