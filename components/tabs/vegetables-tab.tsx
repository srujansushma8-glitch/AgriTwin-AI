"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Sprout,
  Droplets,
  Thermometer,
  Calendar,
  AlertTriangle,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Box,
  Mic,
  ChevronRight,
  Info,
  Scale,
  Sparkles,
  Layers,
  ArrowRight,
  Compass,
} from "lucide-react";
import {
  fetchVegetables,
  VegetableDetail,
  FieldItem,
} from "@/lib/api";
import { useTranslation } from "@/lib/i18n";
import { getCropImage } from "@/lib/crop-images";

interface VegetablesTabProps {
  selectedField: FieldItem;
  onSetCrop?: (cropName: string) => void;
  onNavigateTab?: (tab: string, context?: any) => void;
}

export function VegetablesTab({
  selectedField,
  onSetCrop,
  onNavigateTab,
}: VegetablesTabProps) {
  const { t } = useTranslation();
  const [vegetables, setVegetables] = useState<VegetableDetail[]>([]);
  const [selectedVegName, setSelectedVegName] = useState<string>("Carrot");
  const [selectedStageIdx, setSelectedStageIdx] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [cropSetSuccess, setCropSetSuccess] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    fetchVegetables()
      .then((data) => {
        if (data.vegetables && data.vegetables.length > 0) {
          setVegetables(data.vegetables);
          // If the field is already one of the vegetables, default to it
          const match = data.vegetables.find(
            (v) => v.name.toLowerCase() === selectedField.crop_type.toLowerCase()
          );
          if (match) setSelectedVegName(match.name);
          else setSelectedVegName(data.vegetables[0].name);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [selectedField.crop_type]);

  const currentVeg =
    vegetables.find((v) => v.name === selectedVegName) ||
    vegetables[0] ||
    null;

  const handleSetActiveCrop = () => {
    if (!currentVeg) return;
    if (onSetCrop) {
      onSetCrop(currentVeg.name);
    }
    setCropSetSuccess(true);
    setTimeout(() => setCropSetSuccess(false), 3000);
  };

  if (isLoading || !currentVeg) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
          <p className="text-sm font-semibold text-muted-foreground">
            Loading Horticultural Vegetable Intelligence...
          </p>
        </div>
      </div>
    );
  }

  const activeStage = currentVeg.growth_stages[selectedStageIdx] || currentVeg.growth_stages[0];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-[#E5E1D6] bg-[#FFFEFA] p-6 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-[#E4EBDD] text-[#173D2B] border border-[#C9D9BE]">
            <Sprout className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-[#173D2B]">
                Vegetables & Horticulture Intelligence
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E4EBDD] text-[#173D2B] border border-[#C9D9BE]">
                14 AGRONOMIC DIMENSIONS
              </span>
            </div>
            <p className="text-xs text-[#68756A] mt-0.5">
              Comprehensive growth models, irrigation schedules, pest diagnostics, APMC price benchmarks, and post-harvest storage.
            </p>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab?.("twin3d")}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border border-[#E5E1D6] bg-[#F8F4EB] hover:bg-[#E4EBDD] text-[#173D2B] transition-all cursor-pointer shadow-2xs"
          >
            <Box className="size-3.5 text-[#173D2B]" />
            <span>3D Farm Twin</span>
          </button>
          <button
            onClick={() => onNavigateTab?.("voice-agronomist")}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#173D2B] text-white hover:bg-[#102F22] transition-all cursor-pointer shadow-xs"
          >
            <Mic className="size-3.5" />
            <span>Voice Agronomist</span>
          </button>
        </div>
      </div>

      {/* Vegetable Selector Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {vegetables.map((veg) => {
          const isSelected = veg.name === currentVeg.name;
          return (
            <button
              key={veg.name}
              onClick={() => {
                setSelectedVegName(veg.name);
                setSelectedStageIdx(0);
              }}
              className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? "border-[#173D2B] bg-[#E4EBDD] shadow-xs"
                  : "border-[#E5E1D6] bg-[#FFFEFA] hover:bg-[#F8F4EB]"
              }`}
            >
              <div className="relative size-12 shrink-0 rounded-lg overflow-hidden border border-[#E5E1D6] bg-[#F8F4EB] p-1 flex items-center justify-center">
                <img
                  src={veg.image_url || getCropImage(veg.name, "main")}
                  alt={veg.name}
                  className="size-10 object-contain drop-shadow-sm"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = getCropImage(veg.name, "main");
                  }}
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-[#173D2B] truncate">
                    {veg.name}
                  </h4>
                  {isSelected && (
                    <CheckCircle2 className="size-3.5 text-[#173D2B] shrink-0" />
                  )}
                </div>
                <p className="text-[0.65rem] text-[#68756A] truncate italic">
                  {veg.scientific_name}
                </p>
                <div className="mt-1 flex items-center gap-1.5 text-[0.65rem] font-bold text-[#173D2B]">
                  <span>{veg.growth_duration_days} Days</span>
                  <span>•</span>
                  <span>₹{veg.current_modal_price_qtl / 100}/kg</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Hero Card for Selected Vegetable */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Hero Profile */}
        <div className="lg:col-span-4 rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col justify-between space-y-6">
          <div>
            <div className="relative w-full h-48 rounded-xl bg-gradient-to-b from-emerald-500/5 to-emerald-500/15 border border-border flex items-center justify-center p-4 overflow-hidden">
              <img
                src={currentVeg.image_url || getCropImage(currentVeg.name, "main")}
                alt={currentVeg.name}
                className="max-h-40 max-w-full object-contain filter drop-shadow-lg"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = getCropImage(currentVeg.name, "main");
                }}
              />
              <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[0.65rem] font-bold bg-card/80 backdrop-blur-sm border border-border text-foreground">
                {currentVeg.family}
              </span>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-foreground">
                  {currentVeg.name}
                </h3>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  {currentVeg.avg_yield_t_ha} t/ha Target
                </span>
              </div>
              <p className="text-xs text-muted-foreground italic mt-0.5">
                {currentVeg.scientific_name}
              </p>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 gap-2.5 mt-5">
              <div className="p-2.5 rounded-xl bg-muted/40 border border-border/60">
                <div className="flex items-center gap-1.5 text-muted-foreground text-[0.65rem] font-semibold">
                  <Calendar className="size-3 text-emerald-500" />
                  <span>Growth Duration</span>
                </div>
                <div className="text-sm font-bold text-foreground mt-0.5">
                  {currentVeg.growth_duration_days} Days
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-muted/40 border border-border/60">
                <div className="flex items-center gap-1.5 text-muted-foreground text-[0.65rem] font-semibold">
                  <Thermometer className="size-3 text-amber-500" />
                  <span>Ideal Temp</span>
                </div>
                <div className="text-sm font-bold text-foreground mt-0.5">
                  {currentVeg.ideal_temp_c[0]}°C – {currentVeg.ideal_temp_c[1]}°C
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-muted/40 border border-border/60">
                <div className="flex items-center gap-1.5 text-muted-foreground text-[0.65rem] font-semibold">
                  <Droplets className="size-3 text-blue-500" />
                  <span>Water Requirement</span>
                </div>
                <div className="text-sm font-bold text-foreground mt-0.5">
                  {currentVeg.water_req_mm} mm
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-muted/40 border border-border/60">
                <div className="flex items-center gap-1.5 text-muted-foreground text-[0.65rem] font-semibold">
                  <TrendingUp className="size-3 text-emerald-500" />
                  <span>Modal APMC Price</span>
                </div>
                <div className="text-sm font-bold text-foreground mt-0.5">
                  ₹{currentVeg.current_modal_price_qtl} / qtl
                </div>
              </div>
            </div>

            {/* Nutrition Density Chips */}
            <div className="mt-5 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-foreground">
                <span>Nutritional Profile (per 100g)</span>
                <span className="text-[0.65rem] text-muted-foreground font-normal">GI: {currentVeg.nutrition.glycemic_index}</span>
              </div>
              <div className="flex flex-wrap gap-1.5 text-[0.68rem]">
                <span className="px-2 py-0.5 rounded-md bg-muted border border-border text-foreground font-medium">
                  Protein: {currentVeg.nutrition.protein_g}g
                </span>
                <span className="px-2 py-0.5 rounded-md bg-muted border border-border text-foreground font-medium">
                  Fiber: {currentVeg.nutrition.dietary_fiber_g}g
                </span>
                <span className="px-2 py-0.5 rounded-md bg-muted border border-border text-foreground font-medium">
                  Carbs: {currentVeg.nutrition.carbs_g}g
                </span>
                <span className="px-2 py-0.5 rounded-md bg-muted border border-border text-foreground font-medium">
                  Vit C: {currentVeg.nutrition.vitamin_c_mg}mg
                </span>
                <span className="px-2 py-0.5 rounded-md bg-muted border border-border text-foreground font-medium">
                  Potassium: {currentVeg.nutrition.potassium_mg}mg
                </span>
                {currentVeg.nutrition.beta_carotene_ug && (
                  <span className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 font-semibold">
                    β-Carotene: {currentVeg.nutrition.beta_carotene_ug}µg
                  </span>
                )}
                {currentVeg.nutrition.betalains_mg && (
                  <span className="px-2 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-400 font-semibold">
                    Betalains: {currentVeg.nutrition.betalains_mg}mg
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Button: Set as Active Crop */}
          <div className="space-y-2 pt-4 border-t border-border">
            <button
              onClick={handleSetActiveCrop}
              className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm ${
                cropSetSuccess
                  ? "bg-emerald-600 text-white"
                  : "bg-emerald-500 hover:bg-emerald-600 text-white"
              }`}
            >
              {cropSetSuccess ? (
                <>
                  <CheckCircle2 className="size-4" />
                  <span>Active Farm Crop Updated to {currentVeg.name}!</span>
                </>
              ) : (
                <>
                  <Sprout className="size-4" />
                  <span>Set as Active Farm Crop</span>
                </>
              )}
            </button>
            <p className="text-[0.65rem] text-center text-muted-foreground">
              Updates 3D digital twin, microclimate alerts, soil models, and voice agronomist telemetry.
            </p>
          </div>
        </div>

        {/* Right Tabbed Details (14 Dimensions) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Dimension 1 & 2: Soil, Climate & Water Requirements */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Compass className="size-4 text-emerald-500" />
                <h4 className="text-sm font-bold text-foreground">
                  Soil, Climate & Irrigation Architecture
                </h4>
              </div>
              <span className="text-xs font-semibold text-muted-foreground">
                pH Range: {currentVeg.ideal_ph[0]} – {currentVeg.ideal_ph[1]}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-muted/30 border border-border">
                <div className="text-[0.68rem] font-bold uppercase text-muted-foreground">
                  Suitable Soil
                </div>
                <div className="text-xs font-semibold text-foreground mt-1">
                  {currentVeg.suitable_soil}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-muted/30 border border-border">
                <div className="text-[0.68rem] font-bold uppercase text-muted-foreground">
                  Climate & Season
                </div>
                <div className="text-xs font-semibold text-foreground mt-1">
                  {currentVeg.suitable_climate}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-muted/30 border border-border">
                <div className="text-[0.68rem] font-bold uppercase text-muted-foreground">
                  Drought Tolerance
                </div>
                <div className="text-xs font-semibold text-foreground mt-1">
                  {currentVeg.drought_tolerance}
                </div>
              </div>
            </div>

            {/* Irrigation Protocol */}
            <div className="p-3.5 rounded-xl bg-blue-500/5 border border-blue-500/20 text-xs">
              <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold mb-1">
                <Droplets className="size-3.5" />
                <span>Irrigation & Moisture Recommendation</span>
              </div>
              <p className="text-foreground leading-relaxed">
                {currentVeg.irrigation_recommendations}
              </p>
            </div>
          </div>

          {/* Dimension 3: Nutrients & Fertilizer Schedule */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Layers className="size-4 text-emerald-500" />
                <h4 className="text-sm font-bold text-foreground">
                  Nutrient Budget & Precision Fertilizer Protocol
                </h4>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold">
                <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  N: {currentVeg.nutrient_requirements_npk[0]} kg/ha
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  P: {currentVeg.nutrient_requirements_npk[1]} kg/ha
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  K: {currentVeg.nutrient_requirements_npk[2]} kg/ha
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-muted/30 border border-border text-xs leading-relaxed text-foreground">
              <div className="font-bold text-foreground mb-1 flex items-center gap-1.5">
                <Sparkles className="size-3.5 text-emerald-500" />
                <span>Agronomic Prescription</span>
              </div>
              {currentVeg.fertilizer_recommendations}
            </div>
          </div>

          {/* Dimension 4: 5-Stage Growth Timeline */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="size-4 text-emerald-500" />
                <h4 className="text-sm font-bold text-foreground">
                  Crop Growth Stages Timeline (5 Phenological Stages)
                </h4>
              </div>
              <span className="text-xs text-muted-foreground">
                Click stage to view care instructions
              </span>
            </div>

            {/* Stepper Buttons */}
            <div className="grid grid-cols-5 gap-2">
              {currentVeg.growth_stages.map((stg, idx) => {
                const isActive = idx === selectedStageIdx;
                return (
                  <button
                    key={stg.stage}
                    onClick={() => setSelectedStageIdx(idx)}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      isActive
                        ? "border-emerald-500 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold"
                        : "border-border bg-muted/30 hover:bg-muted text-muted-foreground"
                    }`}
                  >
                    <div className="text-[0.65rem] uppercase font-bold">
                      Stage {stg.stage}
                    </div>
                    <div className="text-xs font-semibold truncate mt-0.5">
                      {stg.name}
                    </div>
                    <div className="text-[0.62rem] opacity-80 mt-0.5">
                      {stg.days}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Stage Detailed View */}
            <div className="p-4 rounded-xl bg-muted/40 border border-border flex items-start gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500 text-white font-bold text-xs">
                {activeStage.stage}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold text-foreground">
                    {activeStage.name} ({activeStage.days})
                  </h5>
                  <span className="text-[0.65rem] font-semibold text-emerald-600 dark:text-emerald-400">
                    Phenological Target
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {activeStage.desc}
                </p>
              </div>
            </div>
          </div>

          {/* Dimension 5: Common Diseases & Plant Pathology */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="size-4 text-rose-500" />
                <h4 className="text-sm font-bold text-foreground">
                  Pathology, Common Diseases & Symptoms
                </h4>
              </div>
              <span className="text-xs text-rose-600 dark:text-rose-400 font-semibold">
                IPM Diagnostic Database
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {currentVeg.common_diseases.map((dis, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/20 text-xs flex items-start gap-2.5"
                >
                  <ShieldCheck className="size-4 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-foreground">
                      {dis}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dimension 6, 7 & 8: Harvesting, Market Intelligence & Storage */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Harvesting Info */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                <Calendar className="size-4 text-emerald-500" />
                <span>Harvesting Guide</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {currentVeg.harvesting_info}
              </p>
            </div>

            {/* Market Price & APMC */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                  <TrendingUp className="size-4 text-emerald-500" />
                  <span>Market Intelligence</span>
                </div>
                <button
                  onClick={() => onNavigateTab?.("market")}
                  className="text-[0.65rem] text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
                >
                  Sell Advisor →
                </button>
              </div>
              <div className="text-xs text-foreground font-semibold">
                Benchmark Mandi: {currentVeg.benchmark_mandi}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {currentVeg.market_price_info}
              </p>
            </div>

            {/* Storage Recommendations */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                <Scale className="size-4 text-blue-500" />
                <span>Cold Storage & Post-Harvest</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {currentVeg.storage_recommendations}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

