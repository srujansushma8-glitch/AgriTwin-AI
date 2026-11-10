"use client";

import React, { useState, useEffect } from "react";
import { History, Play, Pause, Calendar, CloudRain, Thermometer, Droplets } from "lucide-react";
import { TimelinePoint, fetchTimeline } from "@/lib/api";

interface TimelinePlayerProps {
  selectedPlotId: string;
}

export function TimelinePlayer({ selectedPlotId }: TimelinePlayerProps) {
  const [timeline, setTimeline] = useState<TimelinePoint[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(5); // Index 5 is 'Today'
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    fetchTimeline(selectedPlotId).then((res) => {
      setTimeline(res.timeline);
      const todayIdx = res.timeline.findIndex((p) => p.phase.includes("Live"));
      if (todayIdx !== -1) setCurrentIndex(todayIdx);
    });
  }, [selectedPlotId]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && timeline.length > 0) {
      timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % timeline.length);
      }, 1800);
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeline.length]);

  if (!timeline || timeline.length === 0) return null;

  const currentPoint = timeline[currentIndex] || timeline[0];

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500 ring-1 ring-purple-500/20">
            <History className="size-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Temporal Digital Twin Scrubber
            </h3>
            <span className="text-[0.65rem] text-muted-foreground">
              Past Actuals (5 Days) → Live Twin State → 7-Day Microclimate Forecast
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-muted/60 hover:bg-muted px-2.5 py-1 text-xs font-medium text-foreground transition-colors cursor-pointer"
          >
            {isPlaying ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
            <span>{isPlaying ? "Pause" : "Play Simulation"}</span>
          </button>
        </div>
      </div>

      {/* Scrubber slider and step markers */}
      <div className="mt-4 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-foreground text-sm">{currentPoint.date}</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[0.65rem] font-bold ${
                currentPoint.phase.includes("Live")
                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                  : currentPoint.phase.includes("Historical")
                  ? "bg-blue-500/15 text-blue-600 dark:text-blue-400"
                  : "bg-purple-500/15 text-purple-600 dark:text-purple-400"
              }`}
            >
              {currentPoint.phase}
            </span>
          </div>
          <span className="text-[0.65rem] text-muted-foreground font-mono">
            Step {currentIndex + 1} of {timeline.length}
          </span>
        </div>

        {/* Range slider */}
        <input
          type="range"
          min="0"
          max={timeline.length - 1}
          value={currentIndex}
          onChange={(e) => {
            setIsPlaying(false);
            setCurrentIndex(parseInt(e.target.value));
          }}
          className="w-full accent-emerald-500 cursor-pointer"
        />

        {/* Selected Point Metrics Pill */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          <div className="rounded-xl border border-border/60 bg-muted/20 p-2.5 flex items-center gap-2.5">
            <Thermometer className="size-4 text-amber-500" />
            <div>
              <span className="text-[0.65rem] text-muted-foreground block">Temp</span>
              <span className="font-mono font-bold text-foreground text-xs">
                {currentPoint.temp_c}°C
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-border/60 bg-muted/20 p-2.5 flex items-center gap-2.5">
            <Droplets className="size-4 text-blue-500" />
            <div>
              <span className="text-[0.65rem] text-muted-foreground block">Soil Moisture</span>
              <span className="font-mono font-bold text-foreground text-xs">
                {currentPoint.soil_moisture_pct}%
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-border/60 bg-muted/20 p-2.5 flex items-center gap-2.5">
            <CloudRain className="size-4 text-sky-500" />
            <div>
              <span className="text-[0.65rem] text-muted-foreground block">Rainfall</span>
              <span className="font-mono font-bold text-foreground text-xs">
                {currentPoint.rain_mm} mm
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-border/60 bg-muted/20 p-2.5 flex items-center gap-2.5">
            <Calendar className="size-4 text-purple-500" />
            <div>
              <span className="text-[0.65rem] text-muted-foreground block">VPD Deficit</span>
              <span className="font-mono font-bold text-foreground text-xs">
                {currentPoint.vpd_kpa} kPa
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
