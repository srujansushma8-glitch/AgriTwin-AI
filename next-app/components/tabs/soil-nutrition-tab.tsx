"use client";

import React, { useState, useEffect } from "react";
import {
  Layers,
  HeartPulse,
  Sparkles,
  Info,
  CheckCircle2,
  AlertTriangle,
  Beaker,
  Scale,
  RefreshCw,
} from "lucide-react";
import {
  fetchSoilNutritionProfile,
  NutritionProfileResponse,
  FieldItem,
} from "@/lib/api";
import { useTranslation } from "@/lib/i18n";

interface SoilNutritionTabProps {
  selectedField: FieldItem;
}

export function SoilNutritionTab({ selectedField }: SoilNutritionTabProps) {
  const { t } = useTranslation();
  const [profile, setProfile] = useState<NutritionProfileResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    fetchSoilNutritionProfile(selectedField.crop_type)
      .then(setProfile)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [selectedField.crop_type]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-[#E4EBDD] text-[#173D2B] ring-1 ring-[#173D2B]/20">
            <HeartPulse className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-[#173D2B]">
                Soil-to-Nutrition Intelligence
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E4EBDD] text-[#173D2B] border border-[#D0DEC4]">
                ICMR-NIN IFCT 2024 BENCHMARK
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Tracing food nutrient density, macro/micronutrient composition, and agronomic soil health interactions.
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs text-muted-foreground block font-medium">Selected Field & Crop:</span>
          <span className="text-sm font-bold text-foreground">{selectedField.name} ({selectedField.crop_type})</span>
        </div>
      </div>

      {/* Scientific Integrity Disclaimer Card (MANDATORY REQUIREMENT) */}
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-foreground flex items-start gap-3">
        <Info className="size-5 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block text-amber-600 dark:text-amber-400">
            Scientific Provenance & Food Matrix Disclosure:
          </span>
          <p className="text-muted-foreground mt-0.5 leading-relaxed">
            Nutritional metrics displayed are based on standard reference benchmarks published by the <strong>National Institute of Nutrition (ICMR-NIN IFCT 2024)</strong>.
            While balanced soil N-P-K and organic carbon optimize crop vigor and seed protein fractions within genetic boundaries (±6%),
            <strong> soil analysis alone cannot mathematically substitute for destructive biochemical laboratory assay of harvested produce.</strong>
          </p>
        </div>
      </div>

      {/* Main Grid: Soil Chemistry (Left 4 cols) vs Harvested Nutritional Composition (Right 8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Soil Chemistry State */}
        <div className="lg:col-span-5 rounded-2xl border border-border bg-card p-5 space-y-4 shadow-xs text-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-border">
            <Beaker className="size-4 text-emerald-500" />
            <h3 className="font-bold text-foreground">Active Soil Chemical Health</h3>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center p-2.5 rounded-xl bg-muted/40">
              <span className="text-muted-foreground">Soil Profile Type:</span>
              <span className="font-bold text-foreground">{selectedField.soil_type}</span>
            </div>
            <div className="flex justify-between items-center p-2.5 rounded-xl bg-muted/40">
              <span className="text-muted-foreground">Soil Reaction (pH):</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {selectedField.soil_ph} ({selectedField.soil_ph >= 6.5 && selectedField.soil_ph <= 7.5 ? "Optimal Neutral" : "Mild Deviation"})
              </span>
            </div>
            <div className="flex justify-between items-center p-2.5 rounded-xl bg-muted/40">
              <span className="text-muted-foreground">Organic Carbon (OC):</span>
              <span className="font-mono font-bold text-foreground">{selectedField.organic_carbon_pct}%</span>
            </div>
            <div className="flex justify-between items-center p-2.5 rounded-xl bg-muted/40">
              <span className="text-muted-foreground">Available Nitrogen (N):</span>
              <span className="font-mono font-bold text-foreground">{selectedField.nitrogen_ppm} ppm</span>
            </div>
            <div className="flex justify-between items-center p-2.5 rounded-xl bg-muted/40">
              <span className="text-muted-foreground">Available Phosphorus (P):</span>
              <span className="font-mono font-bold text-foreground">{selectedField.phosphorus_ppm} ppm</span>
            </div>
            <div className="flex justify-between items-center p-2.5 rounded-xl bg-muted/40">
              <span className="text-muted-foreground">Available Potassium (K):</span>
              <span className="font-mono font-bold text-foreground">{selectedField.potassium_ppm} ppm</span>
            </div>
          </div>

          {profile && (
            <div className="pt-3 border-t border-border space-y-2">
              <span className="text-[0.65rem] font-bold text-muted-foreground uppercase block">
                Agronomic Soil Factor Feedback:
              </span>
              <p className="text-[0.7rem] text-muted-foreground leading-relaxed">
                • {profile.soil_nutrient_correlation.nitrogen_soil_impact}
              </p>
              <p className="text-[0.7rem] text-muted-foreground leading-relaxed">
                • {profile.soil_nutrient_correlation.calcium_enrichment}
              </p>
            </div>
          )}
        </div>

        {/* Nutritional Matrix */}
        <div className="lg:col-span-7 rounded-2xl border border-border bg-card p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Scale className="size-4 text-emerald-500" />
              <h3 className="text-sm font-bold text-foreground">
                Nutritional Composition (per 100g Edible Portion)
              </h3>
            </div>
            <span className="text-[0.65rem] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md font-bold">
              Reference Matrix
            </span>
          </div>

          {isLoading && (
            <div className="py-12 text-center text-xs text-muted-foreground">
              <RefreshCw className="size-5 animate-spin mx-auto mb-2 text-emerald-500" />
              <span>Fetching food composition data...</span>
            </div>
          )}

          {profile && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="rounded-xl border border-border/80 bg-muted/20 p-3 text-center">
                  <span className="text-[0.65rem] text-muted-foreground uppercase font-bold block">Protein</span>
                  <div className="text-xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1">
                    {profile.nutritional_composition_per_100g.protein_g}g
                  </div>
                  <span className="text-[0.6rem] text-muted-foreground">Essential amino acids</span>
                </div>

                <div className="rounded-xl border border-border/80 bg-muted/20 p-3 text-center">
                  <span className="text-[0.65rem] text-muted-foreground uppercase font-bold block">Dietary Fiber</span>
                  <div className="text-xl font-black font-mono text-amber-600 dark:text-amber-400 mt-1">
                    {profile.nutritional_composition_per_100g.dietary_fiber_g}g
                  </div>
                  <span className="text-[0.6rem] text-muted-foreground">Prebiotic gut motility</span>
                </div>

                <div className="rounded-xl border border-border/80 bg-muted/20 p-3 text-center">
                  <span className="text-[0.65rem] text-muted-foreground uppercase font-bold block">Carbohydrates</span>
                  <div className="text-xl font-black font-mono text-foreground mt-1">
                    {profile.nutritional_composition_per_100g.carbohydrates_g}g
                  </div>
                  <span className="text-[0.6rem] text-muted-foreground">Complex starches</span>
                </div>

                <div className="rounded-xl border border-border/80 bg-muted/20 p-3 text-center">
                  <span className="text-[0.65rem] text-muted-foreground uppercase font-bold block">Calcium</span>
                  <div className="text-xl font-black font-mono text-sky-600 dark:text-sky-400 mt-1">
                    {profile.nutritional_composition_per_100g.calcium_mg} mg
                  </div>
                  <span className="text-[0.6rem] text-muted-foreground">Bone mineralization</span>
                </div>

                <div className="rounded-xl border border-border/80 bg-muted/20 p-3 text-center">
                  <span className="text-[0.65rem] text-muted-foreground uppercase font-bold block">Iron</span>
                  <div className="text-xl font-black font-mono text-rose-600 dark:text-rose-400 mt-1">
                    {profile.nutritional_composition_per_100g.iron_mg} mg
                  </div>
                  <span className="text-[0.6rem] text-muted-foreground">Bioavailable heme/non-heme</span>
                </div>

                <div className="rounded-xl border border-border/80 bg-muted/20 p-3 text-center">
                  <span className="text-[0.65rem] text-muted-foreground uppercase font-bold block">Glycemic Index</span>
                  <div className="text-xl font-black font-mono text-foreground mt-1">
                    {profile.nutritional_composition_per_100g.glycemic_index}
                  </div>
                  <span className="text-[0.6rem] text-muted-foreground">
                    {profile.nutritional_composition_per_100g.glycemic_index <= 55 ? "Low GI (Diabetic friendly)" : "Moderate/High GI"}
                  </span>
                </div>
              </div>

              {/* Classification Badges */}
              <div className="rounded-xl bg-muted/30 p-3 border border-border/80 space-y-1 text-xs">
                <div className="flex items-center justify-between text-[0.7rem]">
                  <span className="text-muted-foreground">Data Attribution:</span>
                  <span className="font-semibold text-foreground">ICMR-National Institute of Nutrition (NIN) IFCT 2024</span>
                </div>
                <div className="flex items-center justify-between text-[0.7rem]">
                  <span className="text-muted-foreground">Certification Tier:</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">Standard Reference Food Matrix</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

