"use client";

import React, { useState, useEffect } from "react";
import {
  Compass,
  Sprout,
  Droplets,
  Thermometer,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Sparkles,
  Info,
  RefreshCw,
} from "lucide-react";
import {
  fetchCropRecommendations,
  CropRecommendation,
  FieldItem,
} from "@/lib/api";
import { useTranslation } from "@/lib/i18n";

interface CropPlannerTabProps {
  selectedField: FieldItem;
  onApplyCrop?: (cropName: string) => void;
}

export function CropPlannerTab({ selectedField, onApplyCrop }: CropPlannerTabProps) {
  const { t } = useTranslation();

  // Inputs
  const [soilType, setSoilType] = useState<string>(selectedField.soil_type || "Red soil");
  const [soilPh, setSoilPh] = useState<number>(selectedField.soil_ph || 6.8);
  const [nitrogen, setNitrogen] = useState<number>(selectedField.nitrogen_ppm || 32.0);
  const [phosphorus, setPhosphorus] = useState<number>(selectedField.phosphorus_ppm || 22.0);
  const [potassium, setPotassium] = useState<number>(selectedField.potassium_ppm || 180.0);
  const [organicCarbon, setOrganicCarbon] = useState<number>(selectedField.organic_carbon_pct || 0.75);
  const [waterAvailability, setWaterAvailability] = useState<string>(selectedField.water_availability || "Borewell + Canal");
  const [areaHectares, setAreaHectares] = useState<number>(selectedField.area_hectares || 2.0);
  const [budgetInr, setBudgetInr] = useState<number>(100000.0);
  const [preferredDuration, setPreferredDuration] = useState<number>(150);

  const [recommendations, setRecommendations] = useState<CropRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [methodology, setMethodology] = useState<string>("");

  const runRecommendation = async () => {
    setIsLoading(true);
    try {
      const res = await fetchCropRecommendations({
        soil_type: soilType,
        soil_ph: soilPh,
        nitrogen_ppm: nitrogen,
        phosphorus_ppm: phosphorus,
        potassium_ppm: potassium,
        organic_carbon_pct: organicCarbon,
        water_availability: waterAvailability,
        area_hectares: areaHectares,
        budget_inr: budgetInr,
        preferred_duration_days: preferredDuration,
      });
      setRecommendations(res.recommendations);
      setMethodology(res.methodology);
    } catch (err) {
      console.error("Failed to run crop recommendation:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runRecommendation();
  }, [selectedField.id]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-[#E5E1D6] bg-[#FFFEFA] p-6 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-[#E4EBDD] text-[#173D2B] border border-[#C9D9BE]">
            <Compass className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-[#173D2B]">
                AI Crop Planner & Suitability Intelligence
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E4EBDD] text-[#173D2B] border border-[#C9D9BE]">
                SCIENTIFIC DECISION MATRIX
              </span>
            </div>
            <p className="text-xs text-[#68756A] mt-0.5">
              Multi-criteria agronomic ranking evaluating soil chemistry, seasonal water reserves, and cultivation budget.
            </p>
          </div>
        </div>

        <button
          onClick={runRecommendation}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-[#173D2B] hover:bg-[#102F22] text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`size-3.5 ${isLoading ? "animate-spin" : ""}`} />
          <span>Re-evaluate Crop Rankings</span>
        </button>
      </div>

      {/* Grid: Input Controls (Left 4 cols) & Ranked Recommendations (Right 8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Farm & Soil Parameters Panel */}
        <div className="lg:col-span-4 rounded-2xl border border-[#E5E1D6] bg-[#FFFEFA] p-5 space-y-4 shadow-xs text-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E5E1D6]">
            <Filter className="size-4 text-[#173D2B]" />
            <h3 className="font-bold text-[#173D2B]">Field Soil & Constraints</h3>
          </div>

          <div>
            <label className="font-semibold text-[#68756A] block mb-1">Soil Type</label>
            <select
              value={soilType}
              onChange={(e) => setSoilType(e.target.value)}
              className="w-full rounded-xl border border-[#E5E1D6] bg-[#F8F4EB] px-3 py-2 text-[#20352A] font-medium outline-none focus:ring-1 focus:ring-[#173D2B]"
            >
              <option value="Red soil">Red soil (Sandy Loam)</option>
              <option value="Black soil">Black soil (Vertisol / Regur)</option>
              <option value="Loamy soil">Loamy soil (Rich Alluvial)</option>
              <option value="Clay soil">Clay soil (High Moisture Retention)</option>
              <option value="Sandy soil">Sandy soil (Light Texture)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-[#68756A] block mb-1">Soil pH</label>
              <input
                type="number"
                step="0.1"
                value={soilPh}
                onChange={(e) => setSoilPh(parseFloat(e.target.value) || 6.5)}
                className="w-full rounded-xl border border-[#E5E1D6] bg-[#F8F4EB] px-3 py-2 font-mono outline-none focus:ring-1 focus:ring-[#173D2B] text-[#20352A]"
              />
            </div>
            <div>
              <label className="font-semibold text-[#68756A] block mb-1">Organic Carbon (%)</label>
              <input
                type="number"
                step="0.05"
                value={organicCarbon}
                onChange={(e) => setOrganicCarbon(parseFloat(e.target.value) || 0.75)}
                className="w-full rounded-xl border border-[#E5E1D6] bg-[#F8F4EB] px-3 py-2 font-mono outline-none focus:ring-1 focus:ring-[#173D2B] text-[#20352A]"
              />
            </div>
          </div>

          {/* NPK */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="font-semibold text-[#68756A] block mb-1">N (ppm)</label>
              <input
                type="number"
                value={nitrogen}
                onChange={(e) => setNitrogen(parseFloat(e.target.value) || 0)}
                className="w-full rounded-xl border border-[#E5E1D6] bg-[#F8F4EB] px-2.5 py-1.5 font-mono outline-none focus:ring-1 focus:ring-[#173D2B] text-[#20352A]"
              />
            </div>
            <div>
              <label className="font-semibold text-[#68756A] block mb-1">P (ppm)</label>
              <input
                type="number"
                value={phosphorus}
                onChange={(e) => setPhosphorus(parseFloat(e.target.value) || 0)}
                className="w-full rounded-xl border border-[#E5E1D6] bg-[#F8F4EB] px-2.5 py-1.5 font-mono outline-none focus:ring-1 focus:ring-[#173D2B] text-[#20352A]"
              />
            </div>
            <div>
              <label className="font-semibold text-[#68756A] block mb-1">K (ppm)</label>
              <input
                type="number"
                value={potassium}
                onChange={(e) => setPotassium(parseFloat(e.target.value) || 0)}
                className="w-full rounded-xl border border-[#E5E1D6] bg-[#F8F4EB] px-2.5 py-1.5 font-mono outline-none focus:ring-1 focus:ring-[#173D2B] text-[#20352A]"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-[#68756A] block mb-1">Water Availability</label>
            <select
              value={waterAvailability}
              onChange={(e) => setWaterAvailability(e.target.value)}
              className="w-full rounded-xl border border-[#E5E1D6] bg-[#F8F4EB] px-3 py-2 text-[#20352A] font-medium outline-none focus:ring-1 focus:ring-[#173D2B]"
            >
              <option value="Borewell + Canal">Borewell + Canal (Perennial)</option>
              <option value="Borewell Only">Borewell Only (Moderate)</option>
              <option value="Canal Seasonal">Canal Seasonal</option>
              <option value="Rainfed (Dryland)">Rainfed (Dryland / Monsoon dependent)</option>
              <option value="Farm Pond Storage">Farm Pond Storage</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-[#68756A] block mb-1">Land Area (ha)</label>
              <input
                type="number"
                step="0.5"
                value={areaHectares}
                onChange={(e) => setAreaHectares(parseFloat(e.target.value) || 1.0)}
                className="w-full rounded-xl border border-[#E5E1D6] bg-[#F8F4EB] px-3 py-2 font-mono outline-none focus:ring-1 focus:ring-[#173D2B] text-[#20352A]"
              />
            </div>
            <div>
              <label className="font-semibold text-[#68756A] block mb-1">Max Duration (Days)</label>
              <input
                type="number"
                value={preferredDuration}
                onChange={(e) => setPreferredDuration(parseInt(e.target.value) || 120)}
                className="w-full rounded-xl border border-[#E5E1D6] bg-[#F8F4EB] px-3 py-2 font-mono outline-none focus:ring-1 focus:ring-[#173D2B] text-[#20352A]"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-[#68756A] block mb-1">Cultivation Budget (₹)</label>
            <input
              type="number"
              step="10000"
              value={budgetInr}
              onChange={(e) => setBudgetInr(parseFloat(e.target.value) || 50000)}
              className="w-full rounded-xl border border-[#E5E1D6] bg-[#F8F4EB] px-3 py-2 font-mono outline-none focus:ring-1 focus:ring-[#173D2B] text-[#20352A]"
            />
          </div>

          <button
            onClick={runRecommendation}
            className="w-full py-2.5 bg-[#173D2B] hover:bg-[#102F22] text-white font-bold rounded-xl transition-all cursor-pointer shadow-xs"
          >
            Update Suitability Analysis
          </button>
        </div>

        {/* Ranked Recommendations List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between text-xs text-[#68756A] px-1">
            <span>Ranked Recommendations (Top Matches for {selectedField.name})</span>
            <span className="font-mono text-[0.65rem]">{methodology}</span>
          </div>

          {isLoading && (
            <div className="rounded-2xl border border-[#E5E1D6] bg-[#FFFEFA] p-12 text-center text-xs text-[#68756A]">
              <RefreshCw className="size-6 animate-spin mx-auto mb-2 text-[#173D2B]" />
              <span>Simulating agronomic compatibility models...</span>
            </div>
          )}

          {!isLoading &&
            recommendations.map((crop, idx) => (
              <div
                key={crop.crop_name}
                className={`rounded-2xl border bg-[#FFFEFA] p-5 shadow-xs transition-all ${
                  idx === 0
                    ? "border-[#173D2B]/50 ring-1 ring-[#173D2B]/20"
                    : "border-[#E5E1D6]"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E5E1D6]">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex size-9 items-center justify-center rounded-xl font-black text-sm ${
                        idx === 0
                          ? "bg-[#173D2B] text-white shadow-xs"
                          : "bg-[#F8F4EB] text-[#68756A] border border-[#E5E1D6]"
                      }`}
                    >
                      #{idx + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-[#173D2B]">
                          {crop.crop_name}
                        </h4>
                        <span className="text-xs text-[#68756A] italic">
                          ({crop.scientific_name})
                        </span>
                      </div>
                      <span className="text-[0.7rem] text-[#68756A] font-medium">
                        Duration: {crop.cultivation_duration_days} Days • Harvest Window: {crop.estimated_harvest_window}
                      </span>
                    </div>
                  </div>

                  {/* Suitability Score Pill */}
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className="text-lg font-black font-mono text-[#173D2B]">
                        {crop.suitability_score}%
                      </div>
                      <span className="text-[0.6rem] text-[#68756A] uppercase font-semibold">
                        Suitability Index
                      </span>
                    </div>
                  </div>
                </div>

                {/* Agronomic & Financial Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 text-xs">
                  <div className="rounded-xl bg-[#F8F4EB] border border-[#E5E1D6] p-2.5">
                    <span className="text-[0.65rem] text-[#68756A] block">Water Need</span>
                    <span className="font-semibold text-[#20352A] truncate block">{crop.water_requirement.split("(")[0]}</span>
                  </div>
                  <div className="rounded-xl bg-[#F8F4EB] border border-[#E5E1D6] p-2.5">
                    <span className="text-[0.65rem] text-[#68756A] block">Expected Yield</span>
                    <span className="font-bold text-[#173D2B] font-mono">{crop.expected_yield_total_t} t ({crop.expected_yield_t_ha} t/ha)</span>
                  </div>
                  <div className="rounded-xl bg-[#F8F4EB] border border-[#E5E1D6] p-2.5">
                    <span className="text-[0.65rem] text-[#68756A] block">Estimated Cost</span>
                    <span className="font-bold text-[#20352A] font-mono">₹{crop.estimated_cost_inr.toLocaleString()}</span>
                  </div>
                  <div className="rounded-xl bg-[#F8F4EB] border border-[#E5E1D6] p-2.5">
                    <span className="text-[0.65rem] text-[#68756A] block">Expected Net Profit</span>
                    <span className="font-black text-[#173D2B] font-mono">₹{crop.estimated_net_profit_inr.toLocaleString()}</span>
                  </div>
                </div>

                {/* Key Agronomic Reasons */}
                <div className="pt-2 text-xs space-y-1">
                  <span className="text-[0.65rem] font-bold text-[#68756A] uppercase block">
                    Agronomic Fit Rationale:
                  </span>
                  {crop.recommendation_reasons.map((r, rIdx) => (
                    <div key={rIdx} className="flex items-start gap-1.5 text-[#20352A] font-medium text-[0.7rem]">
                      <CheckCircle2 className="size-3 text-[#173D2B] shrink-0 mt-0.5" />
                      <span>{r}</span>
                    </div>
                  ))}
                </div>

                {/* Primary Risks */}
                <div className="mt-3 pt-2 border-t border-[#E5E1D6] flex flex-wrap items-center justify-between gap-2 text-[0.68rem]">
                  <div className="flex items-center gap-1.5 text-amber-700 font-medium">
                    <AlertTriangle className="size-3 shrink-0" />
                    <span>Key Risks: {crop.main_risks.join(" • ")}</span>
                  </div>

                  {onApplyCrop && (
                    <button
                      onClick={() => onApplyCrop(crop.crop_name)}
                      className="px-3 py-1 bg-[#E4EBDD] hover:bg-[#D5E2CC] text-[#173D2B] font-bold rounded-lg transition-all cursor-pointer border border-[#C9D9BE]"
                    >
                      Select For Digital Twin
                    </button>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

