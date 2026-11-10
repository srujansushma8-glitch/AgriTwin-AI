"use client";

import React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Sprout, ShieldCheck } from "lucide-react";
import { FieldPlot } from "@/lib/api";

interface HeaderProps {
  plots: FieldPlot[];
  selectedPlotId: string;
  onSelectPlot: (id: string) => void;
  onOpenAudit: () => void;
  backendOnline: boolean;
}

export function Header({
  plots,
  selectedPlotId,
  onSelectPlot,
  onOpenAudit,
  backendOnline,
}: HeaderProps) {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md px-4 lg:px-8 py-3.5 transition-colors">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 ring-1 ring-emerald-500/30 shadow-xs">
            <Sprout className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base lg:text-lg font-bold tracking-tight text-foreground">
                AgriTwin AI
              </h1>
              <span className="rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 px-2 py-0.5 text-[0.65rem] font-semibold text-emerald-600 dark:text-emerald-300 ring-1 ring-emerald-500/30">
                Digital Twin 2.5D
              </span>
            </div>
            <p className="text-xs text-muted-foreground hidden sm:block">
              Intelligent Digital Twin for Climate-Resilient Crop Production
            </p>
          </div>
        </div>

        {/* Central Controls: Plot Selector & Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-2.5 py-1.5 shadow-2xs">
            <span className="text-xs font-medium text-muted-foreground">Zone:</span>
            <select
              value={selectedPlotId}
              onChange={(e) => onSelectPlot(e.target.value)}
              className="bg-transparent text-xs font-semibold text-foreground focus:outline-none cursor-pointer"
            >
              {plots.map((p) => (
                <option key={p.id} value={p.id} className="bg-card text-foreground">
                  {p.name} ({p.crop.crop_name})
                </option>
              ))}
            </select>
          </div>

          {/* Engine status indicator */}
          <div className="flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-2.5 py-1 text-xs">
            <span
              className={`size-2 rounded-full ${
                backendOnline ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
              }`}
            />
            <span className="text-[0.7rem] font-medium text-muted-foreground hidden md:inline">
              {backendOnline ? "FastAPI Twin: Active (:8000)" : "Local Twin Mode"}
            </span>
          </div>
        </div>

        {/* Actions: Audit Report & Theme Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAudit}
            className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 px-3 py-1.5 text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
          >
            <ShieldCheck className="size-3.5" />
            <span>Resilience Audit</span>
          </button>

          <button
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
            className="flex size-8 items-center justify-center rounded-lg border border-border bg-card hover:bg-muted text-foreground transition-colors cursor-pointer"
          >
            {resolvedTheme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}
