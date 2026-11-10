"use client";

import React, { useState, useEffect } from "react";
import {
  Flame,
  CloudRain,
  SunMedium,
  TrendingDown,
  TrendingUp,
  ShieldCheck,
  RotateCcw,
  Sliders,
  Activity,
  Thermometer,
  Droplets,
  Wind,
  Sun,
  Gauge,
  Clock,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  Calendar,
} from "lucide-react";
import { FieldItem, ClimateScenarioResult, runScenarioSimulation } from "@/lib/api";
import { useTranslation } from "@/lib/i18n";

interface ClimateTabProps {
  selectedField: FieldItem;
}

const PRESETS = [
  { id: "Normal", name: "1. Normal Climate", temp: 0, rain: 0, dry: 0, heat: 0, co2: 0 },
  { id: "Moderate Temp", name: "2. Moderate Temp (+2.5°C)", temp: 2.5, rain: -10, dry: 4, heat: 1, co2: 30 },
  { id: "Severe Heatwave", name: "3. Severe Heatwave (+5.0°C)", temp: 5.0, rain: -25, dry: 8, heat: 6, co2: 50 },
  { id: "Reduced Rain", name: "4. Reduced Rainfall (-40%)", temp: 1.5, rain: -40, dry: 12, heat: 2, co2: 20 },
  { id: "Prolonged Drought", name: "5. Prolonged Drought (21 Days)", temp: 4.0, rain: -80, dry: 21, heat: 5, co2: 40 },
  { id: "Excessive Rain", name: "6. Excessive Rainfall (+100%)", temp: -1.0, rain: 100, dry: 0, heat: 0, co2: 0 },
  { id: "Combined Stress", name: "7. Combined Stress (+4.5°C, -60% Rain)", temp: 4.5, rain: -60, dry: 16, heat: 7, co2: 60 },
  { id: "Custom", name: "8. Custom Scenario", temp: 3.5, rain: -35, dry: 10, heat: 4, co2: 80 },
];

const SEVEN_DAY_FORECAST = [
  { day: "Today", date: "Nov 06", condition: "Clear & Sunny", tempMax: 30, tempMin: 19, rainProb: 5, rainMm: 0.0, wind: "8 km/h W", spraySafe: true },
  { day: "Tomorrow", date: "Nov 07", condition: "Partly Cloudy", tempMax: 31, tempMin: 20, rainProb: 15, rainMm: 0.0, wind: "10 km/h WSW", spraySafe: true },
  { day: "Saturday", date: "Nov 08", condition: "Scattered Clouds", tempMax: 29, tempMin: 20, rainProb: 20, rainMm: 0.4, wind: "12 km/h SW", spraySafe: true },
  { day: "Sunday", date: "Nov 09", condition: "Light Afternoon Shower", tempMax: 28, tempMin: 19, rainProb: 65, rainMm: 4.2, wind: "14 km/h S", spraySafe: false },
  { day: "Monday", date: "Nov 10", condition: "Isolated Showers", tempMax: 27, tempMin: 18, rainProb: 40, rainMm: 2.0, wind: "11 km/h SW", spraySafe: false },
  { day: "Tuesday", date: "Nov 11", condition: "Clear Sky", tempMax: 30, tempMin: 18, rainProb: 10, rainMm: 0.0, wind: "9 km/h W", spraySafe: true },
  { day: "Wednesday", date: "Nov 12", condition: "Sunny & Mild", tempMax: 31, tempMin: 19, rainProb: 5, rainMm: 0.0, wind: "7 km/h NW", spraySafe: true },
];

export function ClimateTab({ selectedField }: ClimateTabProps) {
  const { t } = useTranslation();
  const [selectedPreset, setSelectedPreset] = useState("Combined Stress");
  const [tempDelta, setTempDelta] = useState(4.5);
  const [rainDelta, setRainDelta] = useState(-60);
  const [dryDays, setDryDays] = useState(16);
  const [heatwaveDays, setHeatwaveDays] = useState(7);
  const [co2Delta, setCo2Delta] = useState(60);

  const [result, setResult] = useState<ClimateScenarioResult | null>(null);

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setSelectedPreset(preset.id);
    setTempDelta(preset.temp);
    setRainDelta(preset.rain);
    setDryDays(preset.dry);
    setHeatwaveDays(preset.heat);
    setCo2Delta(preset.co2);
  };

  useEffect(() => {
    let active = true;
    runScenarioSimulation({
      field_id: selectedField.id,
      preset_name: selectedPreset,
      temperature_delta_c: tempDelta,
      rainfall_delta_percent: rainDelta,
      consecutive_dry_days: dryDays,
      heatwave_days: heatwaveDays,
      co2_elevation_ppm: co2Delta,
    }).then((res) => {
      if (active) setResult(res);
    });

    return () => {
      active = false;
    };
  }, [selectedField.id, selectedPreset, tempDelta, rainDelta, dryDays, heatwaveDays, co2Delta]);

  return (
    <div className="space-y-6 animate-in fade-in-50">
      {/* Field Location & Weather Station Header */}
      <div className="rounded-2xl border border-[#E5E1D6] bg-[#FFFEFA] p-4 sm:p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[0.65rem] font-bold bg-[#E4EBDD] text-[#173D2B] border border-[#D0DEC4]">
                <span className="size-1.5 rounded-full bg-[#173D2B] animate-pulse" />
                Live Agrometeorological Stream
              </span>
              <span className="text-[0.65rem] font-mono text-[#68756A]">Station ID: AWS-IN-{(selectedField.id || "01").toUpperCase()}</span>
            </div>
            <h2 className="text-lg font-bold text-[#173D2B] flex items-center gap-2">
              <MapPin className="size-4 text-[#173D2B]" />
              {selectedField.name} — {selectedField.location || "Hassan, Karnataka"}
            </h2>
            <p className="text-xs text-[#68756A]">
              Coordinates: <span className="font-mono text-[#20352A]">{selectedField.lat?.toFixed(4) || "13.0033"}°N, {selectedField.lng?.toFixed(4) || "76.1004"}°E</span> • Elevation: <span className="font-mono text-[#20352A]">{selectedField.elevation_m || 670} m MSL</span> • Active Crop: <span className="text-[#173D2B] font-bold">{selectedField.crop_type} ({selectedField.crop_variety || "Standard"})</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => applyPreset(PRESETS[0])}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E5E1D6] bg-[#F8F4EB] hover:bg-[#E4EBDD] text-xs font-semibold text-[#173D2B] cursor-pointer transition-colors"
            >
              <RotateCcw className="size-3.5 text-[#173D2B]" />
              <span>{t("common.reset", "Reset Baseline")}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 6 Microclimate Parameters */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="rounded-2xl border border-[#E5E1D6] bg-[#FFFEFA] p-3.5 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between text-[#68756A]">
            <span className="text-[0.65rem] font-medium uppercase tracking-wider">Air Temp</span>
            <Thermometer className="size-3.5 text-rose-500" />
          </div>
          <div className="mt-2">
            <span className="text-xl font-bold font-mono text-[#173D2B]">24.8°C</span>
            <span className="text-[0.65rem] block text-[#68756A]">Min 19.2° / Max 31.0°</span>
          </div>
          <span className="text-[0.65rem] text-[#2E7D32] font-semibold mt-1">Normal Canopy Range</span>
        </div>

        <div className="rounded-2xl border border-[#E5E1D6] bg-[#FFFEFA] p-3.5 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between text-[#68756A]">
            <span className="text-[0.65rem] font-medium uppercase tracking-wider">Relative Humidity</span>
            <Droplets className="size-3.5 text-sky-600" />
          </div>
          <div className="mt-2">
            <span className="text-xl font-bold font-mono text-[#173D2B]">68%</span>
            <span className="text-[0.65rem] block text-[#68756A]">Dew Point 18.4°C</span>
          </div>
          <span className="text-[0.65rem] text-[#2E7D32] font-semibold mt-1">Optimal Foliage Band</span>
        </div>

        <div className="rounded-2xl border border-[#E5E1D6] bg-[#FFFEFA] p-3.5 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between text-[#68756A]">
            <span className="text-[0.65rem] font-medium uppercase tracking-wider">24h Rainfall</span>
            <CloudRain className="size-3.5 text-cyan-600" />
          </div>
          <div className="mt-2">
            <span className="text-xl font-bold font-mono text-[#173D2B]">0.0 mm</span>
            <span className="text-[0.65rem] block text-[#68756A]">7d Total: 14.2 mm</span>
          </div>
          <span className="text-[0.65rem] text-[#68756A] font-medium mt-1">Dry Surface Condition</span>
        </div>

        <div className="rounded-2xl border border-[#E5E1D6] bg-[#FFFEFA] p-3.5 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between text-[#68756A]">
            <span className="text-[0.65rem] font-medium uppercase tracking-wider">Wind Speed</span>
            <Wind className="size-3.5 text-teal-600" />
          </div>
          <div className="mt-2">
            <span className="text-xl font-bold font-mono text-[#173D2B]">8.4 km/h</span>
            <span className="text-[0.65rem] block text-[#68756A]">Direction: WSW (240°)</span>
          </div>
          <span className="text-[0.65rem] text-[#2E7D32] font-semibold mt-1">Safe for Spraying</span>
        </div>

        <div className="rounded-2xl border border-[#E5E1D6] bg-[#FFFEFA] p-3.5 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between text-[#68756A]">
            <span className="text-[0.65rem] font-medium uppercase tracking-wider">VPD (Canopy Deficit)</span>
            <Gauge className="size-3.5 text-amber-600" />
          </div>
          <div className="mt-2">
            <span className="text-xl font-bold font-mono text-[#173D2B]">1.15 kPa</span>
            <span className="text-[0.65rem] block text-[#68756A]">Band: 0.8 - 1.2 kPa</span>
          </div>
          <span className="text-[0.65rem] text-[#C9A65B] font-semibold mt-1">Max Stomatal Conductance</span>
        </div>

        <div className="rounded-2xl border border-[#E5E1D6] bg-[#FFFEFA] p-3.5 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between text-[#68756A]">
            <span className="text-[0.65rem] font-medium uppercase tracking-wider">Solar Radiation</span>
            <Sun className="size-3.5 text-amber-500" />
          </div>
          <div className="mt-2">
            <span className="text-xl font-bold font-mono text-[#173D2B]">680 W/m²</span>
            <span className="text-[0.65rem] block text-[#68756A]">UV Index: 6 (Moderate)</span>
          </div>
          <span className="text-[0.65rem] text-[#2E7D32] font-semibold mt-1">Active Photosynthesis</span>
        </div>
      </div>

      {/* Agricultural Spraying Window & Advisory Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-[#D0DEC4] bg-[#FFFEFA] p-4 flex items-start gap-3 shadow-xs">
          <div className="p-2.5 rounded-xl bg-[#E4EBDD] text-[#173D2B]">
            <Clock className="size-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#173D2B]">Optimal Agricultural Spraying Window</span>
              <span className="px-2 py-0.5 rounded-full text-[0.6rem] font-bold bg-[#E4EBDD] text-[#173D2B] border border-[#D0DEC4]">
                FAVORABLE
              </span>
            </div>
            <p className="text-xs text-[#68756A]">
              Current meteorological conditions are safe for foliar spraying and bio-pesticide applications until <span className="text-[#173D2B] font-semibold">10:30 AM</span>. Wind speed is 8.4 km/h (&lt; 10 km/h threshold) with minimal drift risk.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-[#E5E1D6] bg-[#FFFEFA] p-4 flex items-start gap-3 shadow-xs">
          <div className="p-2.5 rounded-xl bg-[#F8F4EB] text-[#2E7D32]">
            <CheckCircle2 className="size-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#173D2B]">Heat Stress & Pollination Risk</span>
              <span className="px-2 py-0.5 rounded-full text-[0.6rem] font-bold bg-[#E4EBDD] text-[#173D2B] border border-[#D0DEC4]">
                SAFE
              </span>
            </div>
            <p className="text-xs text-[#68756A]">
              Maximum forecast temperature of 31.0°C is within the thermal safety threshold (&lt; 34.0°C) for {selectedField.crop_type}. No vegetative wilting or blossom drop expected.
            </p>
          </div>
        </div>
      </div>

      {/* 7-Day Precision Agronomic Weather Forecast */}
      <div className="rounded-2xl border border-[#E5E1D6] bg-[#FFFEFA] p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="size-4 text-[#173D2B]" />
            <span className="text-sm font-bold text-[#173D2B]">7-Day Precision Agronomic Forecast</span>
          </div>
          <span className="text-xs text-[#68756A]">Updated 15 mins ago • ECMWF + IMD High-Res Radar</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {SEVEN_DAY_FORECAST.map((fc, i) => (
            <div
              key={i}
              className={`rounded-xl border p-3 flex flex-col justify-between transition-all ${
                i === 0
                  ? "border-[#173D2B] bg-[#E4EBDD]/50 shadow-xs"
                  : "border-[#E5E1D6] bg-[#F8F4EB] hover:bg-[#FFFEFA]"
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-[#173D2B]">{fc.day}</span>
                  <span className="text-[0.65rem] text-[#68756A] font-mono">{fc.date}</span>
                </div>
                <div className="my-2">
                  <span className="text-sm font-semibold text-[#20352A] block truncate">{fc.condition}</span>
                  <div className="flex items-baseline gap-1.5 mt-1 font-mono">
                    <span className="text-base font-bold text-[#173D2B]">{fc.tempMax}°</span>
                    <span className="text-xs text-[#68756A]">/ {fc.tempMin}°C</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-[#E5E1D6] text-[0.65rem]">
                <div className="flex justify-between text-[#68756A]">
                  <span>Rain Chance:</span>
                  <span className={`font-mono font-bold ${fc.rainProb > 30 ? "text-cyan-700" : "text-[#20352A]"}`}>
                    {fc.rainProb}%
                  </span>
                </div>
                <div className="flex justify-between text-[#68756A]">
                  <span>Wind:</span>
                  <span className="font-mono text-[#20352A]">{fc.wind}</span>
                </div>
                <div className="mt-2 text-center">
                  <span
                    className={`inline-block px-1.5 py-0.5 rounded text-[0.6rem] font-semibold w-full text-center ${
                      fc.spraySafe
                        ? "bg-[#E4EBDD] text-[#173D2B] border border-[#D0DEC4]"
                        : "bg-amber-100 text-amber-800 border border-amber-200"
                    }`}
                  >
                    {fc.spraySafe ? "Spray Safe" : "Spray Caution"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preset Scenario Selectors for Climate Resilience Simulator */}
      <div className="pt-2 border-t border-[#E5E1D6]">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold text-[#173D2B] flex items-center gap-2">
              <Sliders className="size-4 text-[#173D2B]" />
              Climate Resilience & Extreme Weather Simulator
            </h3>
            <p className="text-xs text-[#68756A]">
              Stress test {selectedField.crop_type} crop yield against climate shocks, heatwaves, and prolonged dry spells.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => applyPreset(p)}
              className={`p-2.5 rounded-xl border text-xs text-left font-medium transition-all cursor-pointer ${
                selectedPreset === p.id
                  ? "border-[#173D2B] bg-[#173D2B] text-[#FFFEFA] font-bold shadow-xs"
                  : "border-[#E5E1D6] bg-[#FFFEFA] hover:bg-[#F8F4EB] text-[#68756A]"
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Sliders & Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sliders (5 cols) */}
        <div className="lg:col-span-5 rounded-3xl border border-[#E5E1D6] bg-[#FFFEFA] p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-[#173D2B] border-b border-[#E5E1D6] pb-2">
            <span className="flex items-center gap-1.5">
              <Sliders className="size-4 text-[#173D2B]" /> {t("climate.sliders", "Climate Shock Controls")}
            </span>
            <span className="text-[0.65rem] text-[#68756A] font-mono">Interactive</span>
          </div>

          {/* Temp Shift */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground flex items-center gap-1">
                <Flame className="size-3.5 text-rose-500" /> {t("climate.tempDelta", "Temperature Elevation (°C)")}
              </span>
              <span className="font-mono font-bold text-foreground">
                {tempDelta > 0 ? `+${tempDelta}` : tempDelta}°C
              </span>
            </div>
            <input
              type="range"
              min="-4"
              max="10"
              step="0.5"
              value={tempDelta}
              onChange={(e) => {
                setSelectedPreset("Custom");
                setTempDelta(parseFloat(e.target.value));
              }}
              className="w-full accent-rose-500 cursor-pointer"
            />
          </div>

          {/* Rainfall Anomaly */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground flex items-center gap-1">
                <CloudRain className="size-3.5 text-blue-500" /> {t("climate.rainDelta", "Precipitation Change (%)")}
              </span>
              <span className="font-mono font-bold text-foreground">
                {rainDelta > 0 ? `+${rainDelta}` : rainDelta}%
              </span>
            </div>
            <input
              type="range"
              min="-100"
              max="120"
              step="5"
              value={rainDelta}
              onChange={(e) => {
                setSelectedPreset("Custom");
                setRainDelta(parseInt(e.target.value));
              }}
              className="w-full accent-blue-500 cursor-pointer"
            />
          </div>

          {/* Dry Days */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground flex items-center gap-1">
                <SunMedium className="size-3.5 text-amber-500" /> {t("climate.dryDays", "Consecutive Dry Days")}
              </span>
              <span className="font-mono font-bold text-foreground">{dryDays} days</span>
            </div>
            <input
              type="range"
              min="0"
              max="28"
              step="1"
              value={dryDays}
              onChange={(e) => {
                setSelectedPreset("Custom");
                setDryDays(parseInt(e.target.value));
              }}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Heatwave Days */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground flex items-center gap-1">
                <Flame className="size-3.5 text-orange-500" /> Heatwave Peak Days (&gt;37°C)
              </span>
              <span className="font-mono font-bold text-foreground">{heatwaveDays} days</span>
            </div>
            <input
              type="range"
              min="0"
              max="12"
              step="1"
              value={heatwaveDays}
              onChange={(e) => {
                setSelectedPreset("Custom");
                setHeatwaveDays(parseInt(e.target.value));
              }}
              className="w-full accent-orange-500 cursor-pointer"
            />
          </div>

          {/* CO2 Elevation */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">CO₂ Atmospheric Elevation</span>
              <span className="font-mono font-bold text-foreground">+{co2Delta} ppm</span>
            </div>
            <input
              type="range"
              min="0"
              max="300"
              step="10"
              value={co2Delta}
              onChange={(e) => {
                setSelectedPreset("Custom");
                setCo2Delta(parseInt(e.target.value));
              }}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Results & 14-Day Trajectory (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {result && (
            <>
              {/* Primary KPI Outputs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-xl border border-border bg-card p-3 shadow-2xs">
                  <span className="text-[0.65rem] text-muted-foreground block">Projected Yield</span>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-xl font-bold font-mono text-foreground">
                      {result.projected_yield_t_ha}
                    </span>
                    <span className="text-xs text-muted-foreground">t/ha</span>
                  </div>
                  <span className="text-[0.65rem] text-muted-foreground">
                    Base: {result.baseline_yield_t_ha} t/ha
                  </span>
                </div>

                <div
                  className={`rounded-xl border p-3 shadow-2xs ${
                    result.yield_change_percentage < 0
                      ? "border-rose-500/30 bg-rose-500/10"
                      : "border-emerald-500/30 bg-emerald-500/10"
                  }`}
                >
                  <span className="text-[0.65rem] text-muted-foreground block">Yield Impact</span>
                  <div className="mt-1 flex items-center gap-1">
                    {result.yield_change_percentage < 0 ? (
                      <TrendingDown className="size-4 text-rose-500" />
                    ) : (
                      <TrendingUp className="size-4 text-emerald-500" />
                    )}
                    <span
                      className={`text-xl font-bold font-mono ${
                        result.yield_change_percentage < 0 ? "text-rose-500" : "text-emerald-500"
                      }`}
                    >
                      {result.yield_change_percentage > 0 ? "+" : ""}
                      {result.yield_change_percentage}%
                    </span>
                  </div>
                  <span className="text-[0.65rem] font-medium text-foreground">
                    {result.water_stress_level} Stress
                  </span>
                </div>

                <div className="rounded-xl border border-border bg-card p-3 shadow-2xs">
                  <span className="text-[0.65rem] text-muted-foreground block">Pollination Risk</span>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span
                      className={`text-xl font-bold font-mono ${
                        result.pollination_risk_pct > 35 ? "text-rose-500" : "text-foreground"
                      }`}
                    >
                      {result.pollination_risk_pct}%
                    </span>
                  </div>
                  <span className="text-[0.65rem] text-muted-foreground">Flower Abscission</span>
                </div>

                <div className="rounded-xl border border-border bg-card p-3 shadow-2xs">
                  <span className="text-[0.65rem] text-muted-foreground block">Financial Penalty</span>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-lg font-bold font-mono text-rose-500">
                      ₹{result.financial_impact_inr.toLocaleString()}
                    </span>
                  </div>
                  <span className="text-[0.65rem] text-muted-foreground">
                    Across {selectedField.area_hectares} ha
                  </span>
                </div>
              </div>

              {/* 14-Day Simulation Trajectory */}
              <div className="rounded-2xl border border-border bg-card p-4">
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    <Activity className="size-3.5 text-blue-500" /> 14-Day Simulated Moisture & Stress Trajectory
                  </span>
                  <span className="text-[0.65rem] text-muted-foreground">Day 1 to 14</span>
                </div>

                <div className="grid grid-cols-14 gap-1 items-end h-24 pt-2">
                  {result.trajectory_14d.map((pt) => {
                    const heightPct = Math.min(100, Math.max(15, (pt.soil_moisture_pct / 38) * 100));
                    return (
                      <div
                        key={pt.day}
                        title={`Day ${pt.day}: ${pt.soil_moisture_pct}% Moisture | Stress: ${pt.crop_stress_index}`}
                        className="flex flex-col items-center h-full justify-end group cursor-pointer"
                      >
                        <div
                          className={`w-full rounded-t-xs transition-all ${
                            pt.crop_stress_index > 0.45
                              ? "bg-rose-500"
                              : pt.crop_stress_index > 0.25
                              ? "bg-amber-500"
                              : "bg-blue-500"
                          }`}
                          style={{ height: `${heightPct}%` }}
                        />
                        <span className="text-[0.55rem] font-mono text-muted-foreground mt-1 group-hover:text-foreground">
                          {pt.day}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Regenerative Interventions */}
              <div className="rounded-2xl border border-[#D0DEC4] bg-[#E4EBDD]/40 p-4 shadow-xs">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#173D2B] mb-2">
                  <ShieldCheck className="size-4" />
                  <span>AI Regenerative Adaptation Strategies:</span>
                </div>
                <ul className="space-y-1.5 text-xs text-[#20352A]">
                  {result.recommended_interventions.map((strat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#173D2B] font-bold">•</span>
                      <span>{strat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
