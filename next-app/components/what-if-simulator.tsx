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
} from "lucide-react";
import { FieldPlot, ClimateSimulationResponse, runSimulation } from "@/lib/api";

interface WhatIfSimulatorProps {
  plot: FieldPlot;
}

export function WhatIfSimulator({ plot }: WhatIfSimulatorProps) {
  const [tempDelta, setTempDelta] = useState<number>(3.5);
  const [rainDelta, setRainDelta] = useState<number>(-35);
  const [dryDays, setDryDays] = useState<number>(10);
  const [heatwaveDays, setHeatwaveDays] = useState<number>(4);
  const [co2Delta, setCo2Delta] = useState<number>(80);

  const [result, setResult] = useState<ClimateSimulationResponse | null>(null);

  useEffect(() => {
    let active = true;
    runSimulation({
      plot_id: plot.id,
      temperature_delta_c: tempDelta,
      rainfall_delta_percent: rainDelta,
      consecutive_dry_days: dryDays,
      heatwave_intensity_days: heatwaveDays,
      co2_elevation_ppm: co2Delta,
    }).then((res) => {
      if (active) {
        setResult(res);
      }
    });

    return () => {
      active = false;
    };
  }, [plot.id, tempDelta, rainDelta, dryDays, heatwaveDays, co2Delta]);

  const resetToBaseline = () => {
    setTempDelta(0);
    setRainDelta(0);
    setDryDays(0);
    setHeatwaveDays(0);
    setCo2Delta(0);
  };

  return (
    <div className="rounded-2xl border border-[#E5E1D6] bg-[#FFFEFA] p-5 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E5E1D6]">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-2 rounded-full bg-[#173D2B] animate-pulse" />
            <h2 className="text-sm font-black tracking-tight text-[#173D2B] uppercase">
              Climate Stress & What-If Twin Simulator
            </h2>
          </div>
          <p className="text-xs text-[#68756A] mt-0.5">
            Model extreme climate shocks, heatwaves, and drought scenarios on {plot.name} ({plot.crop.crop_name})
          </p>
        </div>

        <button
          onClick={resetToBaseline}
          className="inline-flex items-center gap-1.5 rounded-xl border border-[#E5E1D6] bg-[#F8F4EB] hover:bg-[#E4EBDD] text-[#173D2B] px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer shadow-2xs"
        >
          <RotateCcw className="size-3 text-[#173D2B]" />
          <span>Reset Baseline</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-5">
        {/* Sliders Workbench (5 cols) */}
        <div className="lg:col-span-5 space-y-4 rounded-xl border border-[#E5E1D6] bg-[#F8F4EB] p-4 text-[#20352A]">
          <div className="flex items-center justify-between text-xs font-bold text-[#173D2B] mb-1">
            <span className="flex items-center gap-1.5">
              <Sliders className="size-3.5 text-[#173D2B]" /> Climate Shock Parameters
            </span>
            <span className="text-[0.65rem] text-[#68756A]">Interactive</span>
          </div>

          {/* 1. Temp surge */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-[#68756A] flex items-center gap-1 font-medium">
                <Flame className="size-3 text-[#C9A65B]" /> Temperature Shift (ΔT)
              </span>
              <span className="font-mono font-bold text-[#173D2B]">
                {tempDelta > 0 ? `+${tempDelta}` : tempDelta}°C
              </span>
            </div>
            <input
              type="range"
              min="-4"
              max="10"
              step="0.5"
              value={tempDelta}
              onChange={(e) => setTempDelta(parseFloat(e.target.value))}
              className="w-full accent-[#C9A65B] cursor-pointer"
            />
            <div className="flex justify-between text-[0.65rem] text-[#68756A]">
              <span>-4°C (Cooling)</span>
              <span>Baseline</span>
              <span>+10°C (Extreme Heat)</span>
            </div>
          </div>

          {/* 2. Rainfall anomaly */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-[#68756A] flex items-center gap-1 font-medium">
                <CloudRain className="size-3 text-teal-600" /> Rainfall Anomaly
              </span>
              <span className="font-mono font-bold text-[#173D2B]">
                {rainDelta > 0 ? `+${rainDelta}` : rainDelta}%
              </span>
            </div>
            <input
              type="range"
              min="-100"
              max="150"
              step="5"
              value={rainDelta}
              onChange={(e) => setRainDelta(parseInt(e.target.value))}
              className="w-full accent-teal-600 cursor-pointer"
            />
            <div className="flex justify-between text-[0.65rem] text-[#68756A]">
              <span>-100% (No Rain)</span>
              <span>Normal</span>
              <span>+150% (Torrential)</span>
            </div>
          </div>

          {/* 3. Consecutive dry spell */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-[#68756A] flex items-center gap-1 font-medium">
                <SunMedium className="size-3 text-amber-600" /> Consecutive Dry Days
              </span>
              <span className="font-mono font-bold text-[#173D2B]">{dryDays} days</span>
            </div>
            <input
              type="range"
              min="0"
              max="28"
              step="1"
              value={dryDays}
              onChange={(e) => setDryDays(parseInt(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer"
            />
            <div className="flex justify-between text-[0.65rem] text-[#68756A]">
              <span>0 days</span>
              <span>14 days</span>
              <span>28 days (Severe Flash Drought)</span>
            </div>
          </div>

          {/* 4. Heatwave days */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-[#68756A] flex items-center gap-1 font-medium">
                <Flame className="size-3 text-orange-600" /> Heatwave Peak Days (&gt;38°C)
              </span>
              <span className="font-mono font-bold text-[#173D2B]">{heatwaveDays} days</span>
            </div>
            <input
              type="range"
              min="0"
              max="12"
              step="1"
              value={heatwaveDays}
              onChange={(e) => setHeatwaveDays(parseInt(e.target.value))}
              className="w-full accent-orange-600 cursor-pointer"
            />
          </div>

          {/* 5. CO2 Elevation */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-[#68756A] font-medium">Elevated CO₂ Fertilization</span>
              <span className="font-mono font-bold text-[#173D2B]">+{co2Delta} ppm</span>
            </div>
            <input
              type="range"
              min="0"
              max="350"
              step="10"
              value={co2Delta}
              onChange={(e) => setCo2Delta(parseInt(e.target.value))}
              className="w-full accent-[#173D2B] cursor-pointer"
            />
          </div>
        </div>

        {/* Simulation Outputs & Trajectory (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          {result && (
            <>
              {/* Primary Impact Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-xl border border-[#E5E1D6] bg-[#FFFEFA] p-3 shadow-2xs">
                  <span className="text-[0.65rem] text-[#68756A] block">Projected Yield</span>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-xl font-bold font-mono text-[#173D2B]">
                      {result.projected_yield_t_ha}
                    </span>
                    <span className="text-xs text-[#68756A]">t/ha</span>
                  </div>
                  <span className="text-[0.65rem] text-[#68756A]">
                    Base: {result.baseline_yield_t_ha} t/ha
                  </span>
                </div>

                <div
                  className={`rounded-xl border p-3 shadow-2xs ${
                    result.yield_change_percentage < 0
                      ? "border-rose-200 bg-rose-50"
                      : "border-[#C9D9BE] bg-[#E4EBDD]"
                  }`}
                >
                  <span className="text-[0.65rem] text-[#68756A] block">Yield Impact</span>
                  <div className="mt-1 flex items-center gap-1">
                    {result.yield_change_percentage < 0 ? (
                      <TrendingDown className="size-4 text-rose-600" />
                    ) : (
                      <TrendingUp className="size-4 text-[#173D2B]" />
                    )}
                    <span
                      className={`text-xl font-bold font-mono ${
                        result.yield_change_percentage < 0 ? "text-rose-700" : "text-[#173D2B]"
                      }`}
                    >
                      {result.yield_change_percentage > 0 ? "+" : ""}
                      {result.yield_change_percentage}%
                    </span>
                  </div>
                  <span className="text-[0.65rem] font-bold text-[#173D2B]">
                    {result.water_stress_classification}
                  </span>
                </div>

                <div className="rounded-xl border border-[#E5E1D6] bg-[#FFFEFA] p-3 shadow-2xs">
                  <span className="text-[0.65rem] text-[#68756A] block">Pollination Risk</span>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span
                      className={`text-xl font-bold font-mono ${
                        result.pollination_failure_probability > 0.4
                          ? "text-rose-600"
                          : "text-[#173D2B]"
                      }`}
                    >
                      {(result.pollination_failure_probability * 100).toFixed(0)}%
                    </span>
                  </div>
                  <span className="text-[0.65rem] text-[#68756A]">
                    Flower Abscission
                  </span>
                </div>

                <div className="rounded-xl border border-[#E5E1D6] bg-[#FFFEFA] p-3 shadow-2xs">
                  <span className="text-[0.65rem] text-[#68756A] block">Economic Penalty</span>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-xl font-bold font-mono text-rose-600">
                      ${result.economic_impact_estimate_usd.toLocaleString()}
                    </span>
                  </div>
                  <span className="text-[0.65rem] text-[#68756A]">
                    Across {plot.area_hectares} ha
                  </span>
                </div>
              </div>

              {/* 14-Day Trajectory Mini Visual Graph */}
              <div className="rounded-xl border border-[#E5E1D6] bg-[#F8F4EB] p-3.5">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-[#173D2B] flex items-center gap-1.5">
                    <Activity className="size-3.5 text-[#173D2B]" /> 14-Day Root Moisture Depletion & Stress Trajectory
                  </span>
                  <span className="text-[0.65rem] text-[#68756A] font-semibold">Day 1 to 14</span>
                </div>

                <div className="grid grid-cols-14 gap-1 items-end h-20 pt-2">
                  {result.trajectory.map((point) => {
                    const heightPct = Math.min(100, Math.max(15, (point.projected_soil_moisture / 40) * 100));
                    return (
                      <div
                        key={point.day}
                        title={`Day ${point.day}: ${point.projected_soil_moisture}% Moisture | Stress: ${point.crop_stress_index}`}
                        className="group flex flex-col items-center h-full justify-end"
                      >
                        <div
                          className={`w-full rounded-t-xs transition-all ${
                            point.crop_stress_index > 0.5
                              ? "bg-rose-500"
                              : point.crop_stress_index > 0.3
                              ? "bg-amber-500"
                              : "bg-[#173D2B]"
                          }`}
                          style={{ height: `${heightPct}%` }}
                        />
                        <span className="text-[0.55rem] font-mono text-[#68756A] mt-1 group-hover:text-[#173D2B]">
                          {point.day}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Prescribed Regenerative Climate Mitigation Protocols */}
              <div className="rounded-xl border border-[#C9D9BE] bg-[#E4EBDD] p-3.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#173D2B] mb-2">
                  <ShieldCheck className="size-4" />
                  <span>AI Regenerative Mitigation Protocols for Shock Resilience:</span>
                </div>
                <ul className="space-y-1.5 text-xs text-[#20352A]">
                  {result.mitigation_strategies.map((strat, idx) => (
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
