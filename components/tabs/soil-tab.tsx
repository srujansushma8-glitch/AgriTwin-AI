"use client";

import React, { useState, useEffect } from "react";
import { ShieldCheck, Sparkles } from "lucide-react";
import { FieldItem, SoilHealthAnalysis, fetchSoilAnalysis } from "@/lib/api";
import { useTranslation } from "@/lib/i18n";

interface SoilTabProps {
  selectedField: FieldItem;
}

export function SoilTab({ selectedField }: SoilTabProps) {
  const { t } = useTranslation();
  const [soil, setSoil] = useState<SoilHealthAnalysis | null>(null);

  useEffect(() => {
    let active = true;
    fetchSoilAnalysis(selectedField.id).then((res) => {
      if (active) setSoil(res);
    });
    return () => {
      active = false;
    };
  }, [selectedField.id]);

  if (!soil) return null;

  return (
    <div className="space-y-6 animate-in fade-in-50">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-2 rounded-full bg-emerald-500" />
            <h2 className="text-base font-bold text-foreground">
              {t("soil.title")}
            </h2>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t("soil.subtitle")} • {selectedField.name} ({soil.soil_type})
          </p>
        </div>

        <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          pH Status: {soil.ph_rating}
        </span>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* pH */}
        <div className="rounded-xl border border-border bg-card p-4 shadow-2xs">
          <span className="text-[0.65rem] text-muted-foreground block">{t("soil.reaction")}</span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-3xl font-extrabold font-mono text-foreground">{soil.ph}</span>
          </div>
          <span className="text-[0.65rem] text-emerald-600 dark:text-emerald-400 mt-1 block font-semibold">
            {soil.ph_rating}
          </span>
        </div>

        {/* Nitrogen */}
        <div className="rounded-xl border border-border bg-card p-4 shadow-2xs">
          <span className="text-[0.65rem] text-muted-foreground block">{t("soil.nitrogen")}</span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-3xl font-extrabold font-mono text-foreground">{soil.nitrogen_ppm}</span>
            <span className="text-xs text-muted-foreground">ppm</span>
          </div>
          <span className="text-[0.65rem] text-muted-foreground mt-1 block">Medium Range (25-45 ppm)</span>
        </div>

        {/* Phosphorus */}
        <div className="rounded-xl border border-border bg-card p-4 shadow-2xs">
          <span className="text-[0.65rem] text-muted-foreground block">{t("soil.phosphorus")}</span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-3xl font-extrabold font-mono text-foreground">{soil.phosphorus_ppm}</span>
            <span className="text-xs text-muted-foreground">ppm</span>
          </div>
          <span className="text-[0.65rem] text-muted-foreground mt-1 block">Optimal (15-30 ppm)</span>
        </div>

        {/* Potassium */}
        <div className="rounded-xl border border-border bg-card p-4 shadow-2xs">
          <span className="text-[0.65rem] text-muted-foreground block">Potassium (K) & Organic Carbon</span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-3xl font-extrabold font-mono text-foreground">{soil.potassium_ppm}</span>
            <span className="text-xs text-muted-foreground">ppm</span>
          </div>
          <span className="text-[0.65rem] text-emerald-600 dark:text-emerald-400 mt-1 block font-semibold">
            OC: {soil.organic_carbon_pct}% (High Retention)
          </span>
        </div>
      </div>

      {/* Crop Suitability Matrix & Improvement Protocols */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Crop Suitability */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3 flex items-center gap-2">
            <Sparkles className="size-4 text-emerald-500" /> {t("soil.karnatakaMatrix")}
          </h3>

          <div className="space-y-3">
            {soil.crop_suitability.map((item, idx) => (
              <div key={idx} className="rounded-xl border border-border/60 bg-muted/20 p-3 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-foreground">{item.crop}</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold font-mono">
                    {item.suitability}
                  </span>
                </div>
                <p className="text-[0.7rem] text-muted-foreground">{item.notes}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Soil Improvement Protocols */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3 flex items-center gap-2">
            <ShieldCheck className="size-4 text-emerald-500" /> {t("soil.protocols")}
          </h3>

          <ul className="space-y-3 text-xs">
            {soil.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-3 rounded-xl border border-border/60 bg-muted/20 p-3">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[0.65rem]">
                  {i + 1}
                </span>
                <span className="text-foreground leading-relaxed">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
