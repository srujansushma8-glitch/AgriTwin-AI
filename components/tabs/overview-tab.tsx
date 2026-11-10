"use client";

import React, { useState, useMemo } from "react";
import {
  Thermometer,
  Droplets,
  Flame,
  AlertTriangle,
  Sprout,
  Activity,
  ArrowUpRight,
  TrendingUp,
  Satellite,
  Calendar,
  ShieldAlert,
  Mic,
  Box,
  HeartPulse,
  Compass,
  Layers,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  ChevronRight,
  MapPin,
  RefreshCw,
  Sun,
  CloudRain,
  Scale,
  Search,
  Bell,
  User,
  ShieldCheck,
  TrendingDown,
  Info,
  Radio,
  Gauge,
  Wifi,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
} from "recharts";
import { DashboardOverview, FieldItem } from "@/lib/api";
import { NavTab } from "../sidebar";
import { MarketPriceChart } from "../market-price-chart";
import { RealCropBanner } from "../real-crop-banner";
import {
  useTranslation,
  translateCrop,
  translateGrowthStage,
  translateSoil,
} from "@/lib/i18n";
import {
  getCropImage,
  getCropImageSet,
  normalizeCropId,
  CROP_IMAGE_DATABASE,
} from "@/lib/crop-images";

export interface CropProfile {
  name: string;
  category: "Horticulture" | "Grains & Pulses" | "Cash Crops" | "Commercial";
  variety: string;
  durationDays: number;
  expectedYieldTonnesHa: number;
  waterReqDaily: string;
  mandiBenchmark: string;
  modalPriceQtl: number;
  modalPriceUnit: string;
  soilTarget: number;
  growthStage: string;
  icon: string;
}

export const CROP_INTELLIGENCE_REGISTRY: Record<string, CropProfile> = {
  "Carrot": {
    name: "Carrot",
    category: "Horticulture",
    variety: "Super Kuroda / Pusa Rudhira",
    durationDays: 95,
    expectedYieldTonnesHa: 25.0,
    waterReqDaily: "3.8 mm / day",
    mandiBenchmark: "Bengaluru APMC (Yeshwanthpur)",
    modalPriceQtl: 2800,
    modalPriceUnit: "₹28/kg",
    soilTarget: 32.0,
    growthStage: "Root Swelling & Carotene Synthesis (Stage 4/5)",
    icon: "🥕",
  },
  "Beetroot": {
    name: "Beetroot",
    category: "Horticulture",
    variety: "Detroit Dark Red",
    durationDays: 75,
    expectedYieldTonnesHa: 22.0,
    waterReqDaily: "3.2 mm / day",
    mandiBenchmark: "Mysuru Bandipalya APMC",
    modalPriceQtl: 2400,
    modalPriceUnit: "₹24/kg",
    soilTarget: 30.0,
    growthStage: "Hypocotyl Bulbing (Stage 3/5)",
    icon: "🍠",
  },
  "Potato": {
    name: "Potato",
    category: "Horticulture",
    variety: "Kufri Jyoti / Kufri Surya",
    durationDays: 105,
    expectedYieldTonnesHa: 30.0,
    waterReqDaily: "4.5 mm / day",
    mandiBenchmark: "Hassan APMC (Channarayapatna)",
    modalPriceQtl: 2100,
    modalPriceUnit: "₹21/kg",
    soilTarget: 34.0,
    growthStage: "Tuber Bulking & Starch Accumulation (Stage 4/5)",
    icon: "🥔",
  },
  "Tomato": {
    name: "Tomato",
    category: "Horticulture",
    variety: "Arka Rakshak F1 Hybrid",
    durationDays: 120,
    expectedYieldTonnesHa: 28.5,
    waterReqDaily: "4.8 mm / day",
    mandiBenchmark: "Kolar APMC (Asia's 2nd Largest)",
    modalPriceQtl: 2200,
    modalPriceUnit: "₹22/kg",
    soilTarget: 33.0,
    growthStage: "Fruiting & Ripening (Stage 4/5)",
    icon: "🍅",
  },
  "Onion": {
    name: "Onion",
    category: "Horticulture",
    variety: "Bhima Super / Arka Kalyan",
    durationDays: 125,
    expectedYieldTonnesHa: 24.0,
    waterReqDaily: "3.5 mm / day",
    mandiBenchmark: "Yeshwanthpur APMC (Bengaluru)",
    modalPriceQtl: 2450,
    modalPriceUnit: "₹24.5/kg",
    soilTarget: 29.0,
    growthStage: "Bulb Swelling & Scale Layering (Stage 4/5)",
    icon: "🧅",
  },
  "Ragi (Finger Millet)": {
    name: "Ragi (Finger Millet)",
    category: "Grains & Pulses",
    variety: "GPU-28 / ML-365",
    durationDays: 110,
    expectedYieldTonnesHa: 3.8,
    waterReqDaily: "3.2 mm / day",
    mandiBenchmark: "Mandya APMC",
    modalPriceQtl: 3850,
    modalPriceUnit: "₹38.5/kg",
    soilTarget: 24.5,
    growthStage: "Maturity / Grain Fill (Stage 4/5)",
    icon: "🌾",
  },
  "Sugarcane": {
    name: "Sugarcane",
    category: "Cash Crops",
    variety: "Co 86032 Nayana / VSI 434",
    durationDays: 360,
    expectedYieldTonnesHa: 92.0,
    waterReqDaily: "7.5 mm / day",
    mandiBenchmark: "Mandya Sugar Mill Gate (FRP)",
    modalPriceQtl: 320,
    modalPriceUnit: "₹320/qtl",
    soilTarget: 48.0,
    growthStage: "Grand Growth Stage (Stage 3/4)",
    icon: "🎋",
  },
  "Groundnut": {
    name: "Groundnut",
    category: "Grains & Pulses",
    variety: "TMV-2 Spanish Bunch",
    durationDays: 105,
    expectedYieldTonnesHa: 2.85,
    waterReqDaily: "3.4 mm / day",
    mandiBenchmark: "Tumakuru APMC",
    modalPriceQtl: 6250,
    modalPriceUnit: "₹62.5/kg",
    soilTarget: 28.0,
    growthStage: "Pegging & Pod Sizing (Stage 3/5)",
    icon: "🥜",
  },
  "Rice / Paddy": {
    name: "Rice / Paddy",
    category: "Grains & Pulses",
    variety: "BPT-5204 (Sona Masoori)",
    durationDays: 135,
    expectedYieldTonnesHa: 5.5,
    waterReqDaily: "8.0 mm / day",
    mandiBenchmark: "Raichur APMC (Rice Hub)",
    modalPriceQtl: 2350,
    modalPriceUnit: "₹23.5/kg",
    soilTarget: 52.0,
    growthStage: "Panicle Initiation & Flowering",
    icon: "🍚",
  },
  "Wheat": {
    name: "Wheat",
    category: "Grains & Pulses",
    variety: "GW-322 / Sharbati",
    durationDays: 115,
    expectedYieldTonnesHa: 4.2,
    waterReqDaily: "3.6 mm / day",
    mandiBenchmark: "Dharwad APMC",
    modalPriceQtl: 2480,
    modalPriceUnit: "₹24.8/kg",
    soilTarget: 26.0,
    growthStage: "Grain Filling & Milk Stage",
    icon: "🌾",
  },
  "Maize": {
    name: "Maize",
    category: "Grains & Pulses",
    variety: "DKC-9108 (Bio-Seed)",
    durationDays: 105,
    expectedYieldTonnesHa: 6.8,
    waterReqDaily: "4.2 mm / day",
    mandiBenchmark: "Davanagere APMC (Corn Capital)",
    modalPriceQtl: 2180,
    modalPriceUnit: "₹21.8/kg",
    soilTarget: 30.0,
    growthStage: "Tasseling & Silking Stage",
    icon: "🌽",
  },
  "Cotton": {
    name: "Cotton",
    category: "Commercial",
    variety: "Bt RCH-2",
    durationDays: 160,
    expectedYieldTonnesHa: 2.4,
    waterReqDaily: "5.2 mm / day",
    mandiBenchmark: "Raichur APMC (Cotton Hub)",
    modalPriceQtl: 7200,
    modalPriceUnit: "₹72/kg",
    soilTarget: 28.0,
    growthStage: "Boll Maturation & Bursting",
    icon: "🌱",
  },
  "Banana": {
    name: "Banana",
    category: "Commercial",
    variety: "Grand Naine (G9)",
    durationDays: 330,
    expectedYieldTonnesHa: 42.0,
    waterReqDaily: "9.0 mm / day",
    mandiBenchmark: "Nanjangud APMC / Mysuru",
    modalPriceQtl: 2100,
    modalPriceUnit: "₹21/kg",
    soilTarget: 45.0,
    growthStage: "Shooting & Finger Sizing",
    icon: "🍌",
  },
};

interface OverviewTabProps {
  overview: DashboardOverview | null;
  selectedField: FieldItem;
  onNavigateTab: (tab: NavTab) => void;
  onSelectCrop?: (cropName: string) => void;
  selectedCrop?: string;
}

export function OverviewTab({
  overview,
  selectedField,
  onNavigateTab,
  onSelectCrop,
  selectedCrop,
}: OverviewTabProps) {
  const { t, language } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [justChangedCrop, setJustChangedCrop] = useState<string | null>(null);

  // 24-Hour telemetry wavy dataset for Middle-Left Card (called unconditionally at top level to satisfy Rules of Hooks)
  const telemetryData = useMemo(() => {
    const hours = ["00:00", "03:00", "06:00", "09:00", "12:00", "15:00", "18:00", "21:00"];
    const baseMoisture = overview?.soil_moisture_root_zone ?? 28.5;
    const baseTemp = overview?.ambient_temperature ?? 24.8;

    return hours.map((h, i) => {
      const moistureNoise = Math.sin(i * 1.1) * 2.5;
      const tempNoise = Math.sin(i * 0.9 - 1.2) * 3.5;
      return {
        time: h,
        moisture: Math.round((baseMoisture + moistureNoise) * 10) / 10,
        temp: Math.round((baseTemp + tempNoise) * 10) / 10,
      };
    });
  }, [overview?.soil_moisture_root_zone, overview?.ambient_temperature]);

  if (!overview) return null;

  // Resolve active crop
  const activeCropName = selectedCrop || selectedField.crop_type || "Potato";
  const cropId = normalizeCropId(activeCropName);
  const cropImageSet = getCropImageSet(cropId);

  const matchedKey =
    Object.keys(CROP_INTELLIGENCE_REGISTRY).find(
      (k) => k.toLowerCase() === activeCropName.toLowerCase() || activeCropName.toLowerCase().includes(k.toLowerCase())
    ) || "Potato";
  const cropProfile = CROP_INTELLIGENCE_REGISTRY[matchedKey] || CROP_INTELLIGENCE_REGISTRY["Potato"];

  const areaAcres = (selectedField.area_hectares * 2.47105).toFixed(2);
  const daysAfterSowing = Math.max(
    1,
    Math.floor(
      (new Date().getTime() - new Date(selectedField.sowing_date || "2026-06-15").getTime()) /
        (1000 * 60 * 60 * 24)
    ) || 42
  );
  const healthPercent = Math.min(
    100,
    Math.max(50, Math.round(selectedField.resilience_score * 0.95 + 8))
  );
  const ndviScore = (0.55 + (healthPercent / 100) * 0.32).toFixed(2);
  const estimatedTonnage = (selectedField.area_hectares * cropProfile.expectedYieldTonnesHa).toFixed(1);
  const estimatedRevenueInr = Math.round(
    parseFloat(estimatedTonnage) * (cropProfile.modalPriceQtl * 10)
  ).toLocaleString("en-IN");

  const handleCropChange = (newCrop: string) => {
    if (onSelectCrop) {
      onSelectCrop(newCrop);
    }
    setJustChangedCrop(newCrop);
    setTimeout(() => setJustChangedCrop(null), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 pb-12 font-sans">
      {/* ==================== 1. TOP HEADER BAR ==================== */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-3xl bg-[#FFFEFA] border border-[#E5E1D6] shadow-[0_10px_30px_rgba(23,61,43,0.04)] relative overflow-hidden">
        <div className="flex items-center gap-4 relative z-10">
          {/* Verified Crop Thumbnail Avatar with Forest Green Ring */}
          <div className="size-14 rounded-2xl overflow-hidden border-2 border-[#173D2B]/30 shrink-0 bg-[#F8F4EB] shadow-xs relative group">
            <img
              src={cropImageSet.thumb}
              alt={cropImageSet.altText}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              onError={(e) => {
                (e.target as HTMLImageElement).src = cropImageSet.main;
              }}
            />
            <span className="absolute bottom-0 inset-x-0 h-1 bg-[#173D2B]" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-[#173D2B] tracking-tight">
                {t("Good morning,")} {selectedField.farmer_name || "Ramesh Gowda"}
              </h1>
              <span className="size-2.5 rounded-full bg-[#173D2B] animate-pulse" />
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#68756A] mt-1 font-medium">
              <span className="flex items-center gap-1 font-bold text-[#173D2B]">
                <MapPin className="size-3 text-[#173D2B]" />
                {selectedField.location || "Hassan, Karnataka"}
              </span>
              <span>•</span>
              <span className="text-[#173D2B] font-bold">
                {overview.ambient_temperature || 24.8}°C • Telemetry Active
              </span>
              <span>•</span>
              <span>Plot: <strong className="text-[#173D2B]">{selectedField.name}</strong></span>
              <span>•</span>
              <span className="text-[#2E7D32] font-bold">{cropImageSet.variety}</span>
            </div>
          </div>
        </div>

        {/* Header Right Actions: Search + Crop Selector + Notifications */}
        <div className="flex flex-wrap items-center gap-3 relative z-10">
          {/* Quick Search */}
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#F8F4EB] border border-[#E5E1D6] text-xs text-[#20352A] w-48 sm:w-56 focus-within:border-[#173D2B] transition-colors shadow-2xs">
            <Search className="size-3.5 text-[#68756A]" />
            <input
              type="text"
              placeholder={t("Search farm metrics...")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-xs text-[#20352A] placeholder:text-[#68756A] w-full"
            />
          </div>

          {/* Active Crop Dropdown Selector for All 12 Crops */}
          <div className="flex items-center gap-2 p-1.5 px-3 rounded-2xl bg-[#F8F4EB] border border-[#E5E1D6] shadow-2xs hover:border-[#173D2B] transition-colors">
            <Sprout className="size-4 text-[#173D2B]" />
            <select
              value={matchedKey}
              onChange={(e) => handleCropChange(e.target.value)}
              aria-label="Select active farm crop"
              className="bg-transparent text-xs font-black text-[#173D2B] outline-none cursor-pointer pr-1"
            >
              <optgroup label={t("Horticultural Vegetables", "Horticultural Vegetables")}>
                <option value="Potato" className="bg-[#FFFEFA] text-[#20352A]">🥔 {translateCrop("Potato", language)} (Kufri Jyoti)</option>
                <option value="Carrot" className="bg-[#FFFEFA] text-[#20352A]">🥕 {translateCrop("Carrot", language)} (Super Kuroda)</option>
                <option value="Beetroot" className="bg-[#FFFEFA] text-[#20352A]">🍠 {translateCrop("Beetroot", language)} (Detroit Dark Red)</option>
                <option value="Tomato" className="bg-[#FFFEFA] text-[#20352A]">🍅 {translateCrop("Tomato", language)} (Arka Rakshak F1)</option>
              </optgroup>
              <optgroup label={t("Grains & Pulses", "Grains & Pulses")}>
                <option value="Ragi (Finger Millet)" className="bg-[#FFFEFA] text-[#20352A]">🌾 {translateCrop("Ragi (Finger Millet)", language)} (ML-365)</option>
                <option value="Rice / Paddy" className="bg-[#FFFEFA] text-[#20352A]">🍚 {translateCrop("Rice / Paddy", language)} (Sona Masoori)</option>
                <option value="Wheat" className="bg-[#FFFEFA] text-[#20352A]">🌾 {translateCrop("Wheat", language)} (GW-322)</option>
                <option value="Maize" className="bg-[#FFFEFA] text-[#20352A]">🌽 {translateCrop("Maize", language)} (DKC-9108)</option>
                <option value="Groundnut" className="bg-[#FFFEFA] text-[#20352A]">🥜 {translateCrop("Groundnut", language)} (TMV-2)</option>
              </optgroup>
              <optgroup label={t("Cash & Commercial Crops", "Cash & Commercial Crops")}>
                <option value="Sugarcane" className="bg-[#FFFEFA] text-[#20352A]">🎋 {translateCrop("Sugarcane", language)} (Co 86032)</option>
                <option value="Cotton" className="bg-[#FFFEFA] text-[#20352A]">🌱 {translateCrop("Cotton", language)} (Bt RCH-2)</option>
                <option value="Banana" className="bg-[#FFFEFA] text-[#20352A]">🍌 {translateCrop("Banana", language)} (Grand Naine)</option>
              </optgroup>
            </select>
          </div>

          <button
            onClick={() => onNavigateTab("alerts")}
            title="Notifications"
            className="size-10 rounded-2xl bg-[#F8F4EB] border border-[#E5E1D6] hover:border-[#173D2B] text-[#173D2B] flex items-center justify-center transition-colors cursor-pointer relative shadow-2xs"
          >
            <Bell className="size-4 text-[#173D2B]" />
            {overview.active_alerts_count > 0 && (
              <span className="absolute -top-1 -right-1 size-4 rounded-full bg-[#173D2B] text-[0.6rem] font-bold flex items-center justify-center text-white shadow-xs">
                {overview.active_alerts_count}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ==================== 2. ENTERPRISE LIVE TELEMETRY BAR ==================== */}
      <div className="rounded-2xl border border-[#E5E1D6] bg-[#F2EDE2] p-3 px-4 flex flex-wrap items-center justify-between gap-3 text-xs shadow-2xs">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
          <div className="flex items-center gap-1.5 text-[#173D2B] font-bold">
            <span className="size-2 rounded-full bg-[#173D2B] animate-ping" />
            <span className="font-mono uppercase tracking-wider text-[0.68rem]">{t("IoT Sensor Mesh: Online (12 Nodes)")}</span>
          </div>
          <span className="text-[#E5E1D6] hidden sm:inline">|</span>
          <div className="flex items-center gap-1.5 text-[#68756A]">
            <Clock className="size-3.5 text-[#173D2B]" />
            <span>{t("Sown:")} <strong className="text-[#173D2B] font-mono">{selectedField.sowing_date}</strong></span>
            <span className="px-2 py-0.5 rounded-md bg-[#E4EBDD] text-[#173D2B] font-bold font-mono text-[0.65rem] border border-[#A9B99B]/40">
              {daysAfterSowing} DAS
            </span>
          </div>
          <span className="text-[#E5E1D6] hidden sm:inline">|</span>
          <div className="flex items-center gap-1.5 text-[#68756A]">
            <Droplets className="size-3.5 text-[#2E7D32]" />
            <span>{t("Root Moisture:")} <strong className="text-[#173D2B] font-mono">{overview.soil_moisture_root_zone}%</strong></span>
          </div>
          <span className="text-[#E5E1D6] hidden sm:inline">|</span>
          <div className="flex items-center gap-1.5 text-[#68756A]">
            <Gauge className="size-3.5 text-[#C9A65B]" />
            <span>VPD: <strong className="text-[#173D2B] font-mono">{overview.vpd_kpa || 1.15} kPa</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[0.65rem] text-[#68756A] font-semibold">{t("Synced: Just Now")}</span>
          <span className="size-1.5 rounded-full bg-[#173D2B]" />
        </div>
      </div>

      {/* Confirmation Pill when Crop Changes */}
      {justChangedCrop && (
        <div className="p-3.5 rounded-2xl bg-[#E4EBDD] border border-[#A9B99B] text-xs font-bold text-[#173D2B] flex items-center gap-2 animate-in fade-in duration-300 shadow-xs">
          <CheckCircle2 className="size-4 shrink-0 text-[#173D2B]" />
          <span>Active crop switched to {justChangedCrop}! Real botanical photography, 3D digital twin, and market analytics synchronized.</span>
        </div>
      )}

      {/* ==================== 3. EIGHT CORE DASHBOARD STATISTICS CARDS ==================== */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {/* Card 1: Total Farm Area */}
        <div className="rounded-2xl border border-[#E5E1D6] bg-[#FFFEFA] p-3.5 shadow-2xs hover:border-[#173D2B]/50 transition-all group">
          <span className="text-[0.65rem] font-black uppercase text-[#68756A] block truncate">
            {t("1. Total Land Area")}
          </span>
          <div className="mt-1.5 text-lg font-black font-mono text-[#173D2B]">
            {selectedField.area_hectares} {t("ha")}
          </div>
          <span className="text-[0.65rem] text-[#2E7D32] font-bold mt-0.5 block">
            {areaAcres} {t("Acres")}
          </span>
        </div>

        {/* Card 2: Active Crop & Variety */}
        <div className="rounded-2xl border border-[#E5E1D6] bg-[#FFFEFA] p-3.5 shadow-2xs hover:border-[#173D2B]/50 transition-all group">
          <span className="text-[0.65rem] font-black uppercase text-[#68756A] block truncate">
            {t("2. Selected Crop")}
          </span>
          <div className="mt-1.5 text-base font-black text-[#173D2B] truncate flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-[#173D2B]" />
            {translateCrop(cropProfile.name, language)}
          </div>
          <span className="text-[0.65rem] text-[#68756A] font-semibold mt-0.5 block truncate">
            {cropImageSet.variety}
          </span>
        </div>

        {/* Card 3: Overall Crop Health */}
        <div
          onClick={() => onNavigateTab("health")}
          className="rounded-2xl border border-[#E5E1D6] bg-[#FFFEFA] p-3.5 shadow-2xs hover:border-[#173D2B]/50 transition-all cursor-pointer group"
        >
          <span className="text-[0.65rem] font-black uppercase text-[#68756A] block truncate">
            {t("3. Crop Health")}
          </span>
          <div className="mt-1.5 text-lg font-black font-mono text-[#173D2B] group-hover:scale-105 transition-transform">
            {healthPercent}%
          </div>
          <span className="text-[0.65rem] text-[#2E7D32] font-bold mt-0.5 block truncate">
            NDVI {ndviScore} • {t("Vigorous")}
          </span>
        </div>

        {/* Card 4: Soil Health Score */}
        <div
          onClick={() => onNavigateTab("soil")}
          className="rounded-2xl border border-[#E5E1D6] bg-[#FFFEFA] p-3.5 shadow-2xs hover:border-[#173D2B]/50 transition-all cursor-pointer group"
        >
          <span className="text-[0.65rem] font-black uppercase text-[#68756A] block truncate">
            {t("4. Soil Resilience")}
          </span>
          <div className="mt-1.5 text-lg font-black font-mono text-[#173D2B]">
            {Math.round(selectedField.resilience_score * 0.98)}/100
          </div>
          <span className="text-[0.65rem] text-[#68756A] font-semibold mt-0.5 block truncate">
            pH {selectedField.soil_ph} • {t("Balanced")}
          </span>
        </div>

        {/* Card 5: Estimated Harvest */}
        <div
          onClick={() => onNavigateTab("yield")}
          className="rounded-2xl border border-[#E5E1D6] bg-[#FFFEFA] p-3.5 shadow-2xs hover:border-[#173D2B]/50 transition-all cursor-pointer group"
        >
          <span className="text-[0.65rem] font-black uppercase text-[#68756A] block truncate">
            {t("5. Est. Harvest")}
          </span>
          <div className="mt-1.5 text-lg font-black font-mono text-[#173D2B]">
            {estimatedTonnage} {t("Tonnes")}
          </div>
          <span className="text-[0.65rem] text-[#68756A] font-semibold mt-0.5 block truncate">
            {cropProfile.expectedYieldTonnesHa} {t("t/ha model", "t/ha")}
          </span>
        </div>

        {/* Card 6: Estimated Farm Value */}
        <div
          onClick={() => onNavigateTab("yield")}
          className="rounded-2xl border border-[#E5E1D6] bg-[#FFFEFA] p-3.5 shadow-2xs hover:border-[#173D2B]/50 transition-all cursor-pointer group"
        >
          <span className="text-[0.65rem] font-black uppercase text-[#68756A] block truncate">
            {t("6. Farm Value")}
          </span>
          <div className="mt-1.5 text-lg font-black font-mono text-[#173D2B]">
            ₹{estimatedRevenueInr}
          </div>
          <span className="text-[0.65rem] text-[#2E7D32] font-bold mt-0.5 block">
            {t("Net Margin +32%")}
          </span>
        </div>

        {/* Card 7: Current Market Price */}
        <div
          onClick={() => onNavigateTab("market")}
          className="rounded-2xl border border-[#E5E1D6] bg-[#FFFEFA] p-3.5 shadow-2xs hover:border-[#173D2B]/50 transition-all cursor-pointer group"
        >
          <span className="text-[0.65rem] font-black uppercase text-[#68756A] block truncate">
            {t("7. Market Modal")}
          </span>
          <div className="mt-1.5 text-lg font-black font-mono text-[#173D2B]">
            ₹{cropProfile.modalPriceQtl}
          </div>
          <span className="text-[0.65rem] text-[#68756A] font-semibold mt-0.5 block truncate">
            {cropProfile.modalPriceUnit}
          </span>
        </div>

        {/* Card 8: Weather Conditions */}
        <div
          onClick={() => onNavigateTab("climate")}
          className="rounded-2xl border border-[#E5E1D6] bg-[#FFFEFA] p-3.5 shadow-2xs hover:border-[#173D2B]/50 transition-all cursor-pointer group"
        >
          <span className="text-[0.65rem] font-black uppercase text-[#68756A] block truncate">
            {t("8. Weather")}
          </span>
          <div className="mt-1.5 text-lg font-black font-mono text-[#173D2B]">
            {overview.ambient_temperature || 24.8}°C
          </div>
          <span className="text-[0.65rem] text-[#2E7D32] font-semibold mt-0.5 block truncate">
            RH {overview.humidity || 68}% • 0mm
          </span>
        </div>
      </div>

      {/* ==================== 3B. DIGITAL MULTI-CROP FIELD PRICE BOARD ==================== */}
      <div className="rounded-2xl border border-[#E5E1D6] bg-[#FFFEFA] p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-[#173D2B] animate-pulse"></span>
          <span className="text-xs font-black text-[#173D2B] uppercase tracking-wider font-mono">
            {t("Digital Multi-Crop Field Board:")}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {[
            { name: "Potato", icon: "🥔", price: 2100, delta: "+5.5%", up: true },
            { name: "Onion", icon: "🧅", price: 2450, delta: "+6.1%", up: true },
            { name: "Carrot", icon: "🥕", price: 2800, delta: "+2.9%", up: true },
            { name: "Beetroot", icon: "🍠", price: 2400, delta: "-1.6%", up: false },
            { name: "Tomato", icon: "🍅", price: 2200, delta: "+5.7%", up: true },
          ].map((c) => (
            <button
              key={c.name}
              onClick={() => handleCropChange(c.name)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer border ${
                matchedKey.toLowerCase() === c.name.toLowerCase()
                  ? "bg-[#E4EBDD] text-[#173D2B] border-[#A9B99B] shadow-2xs font-black"
                  : "bg-[#F8F4EB] text-[#20352A] border-[#E5E1D6] hover:bg-[#F2EDE2]"
              }`}
            >
              <span>{c.icon}</span>
              <span>{translateCrop(c.name, language)}:</span>
              <span className="text-[#173D2B] font-bold">₹{c.price}</span>
              <span className={`text-[0.62rem] ${c.up ? "text-[#2E7D32]" : "text-rose-600"}`}>
                ({c.delta})
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={() => onNavigateTab("market")}
          className="text-xs font-bold text-[#173D2B] hover:text-[#102F22] flex items-center gap-1 bg-[#F8F4EB] hover:bg-[#E4EBDD] px-3.5 py-1.5 rounded-xl border border-[#E5E1D6] transition-all cursor-pointer self-start md:self-auto shrink-0 shadow-2xs"
        >
          <span>{t("Storage Profit/Loss Customizer")}</span>
          <ArrowRight className="size-3" />
        </button>
      </div>

      {/* ==================== 4. MAIN ANALYTICS GRID ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT / CENTER COLUMN (Col-span 8 on large screens) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Top Big Chart: CROP MARKET PRICE INTELLIGENCE */}
          <div className="rounded-3xl border border-[#E5E1D6] bg-[#FFFEFA] p-6 shadow-sm">
            <MarketPriceChart
              selectedCrop={matchedKey}
              onCropChange={(c) => handleCropChange(c)}
            />
          </div>

          {/* Middle Row: Dual Wavy Telemetry Chart + Circular Vitality Gauge */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Middle-Left: Dual Wavy Line Chart (Soil Moisture & Temperature) */}
            <div className="md:col-span-7 rounded-3xl border border-[#E5E1D6] bg-[#FFFEFA] p-5 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="size-8 rounded-xl bg-[#E4EBDD] flex items-center justify-center text-[#173D2B]">
                      <Droplets className="size-4 text-[#173D2B]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#173D2B]">
                        {t("Soil Moisture & Thermal Waveform")}
                      </h3>
                      <p className="text-[0.68rem] text-[#68756A]">{t("Continuous telemetry diurnal pattern")}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[0.65rem] font-bold bg-[#E4EBDD] text-[#173D2B] border border-[#D0DEC4]">
                    {t("24-Hour Diurnal")}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-[#68756A] mt-3">
                  <span className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-[#173D2B]" />
                    {t("Root Zone Moisture")} ({overview.soil_moisture_root_zone || 28.5}%)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-[#C9A65B]" />
                    {t("Soil Temp")} ({overview.soil_temperature || 24.0}°C)
                  </span>
                </div>
              </div>

              {/* Dual Wavy Curve Chart */}
              <div className="h-44 w-full mt-3">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={telemetryData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="moistureGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#173D2B" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#173D2B" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#C9A65B" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#C9A65B" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="time"
                      stroke="#68756A"
                      fontSize={10}
                      tickLine={false}
                      axisLine={{ stroke: "#E5E1D6" }}
                    />
                    <YAxis
                      stroke="#68756A"
                      fontSize={10}
                      tickLine={false}
                      axisLine={{ stroke: "#E5E1D6" }}
                    />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: "#FFFEFA",
                        borderColor: "#E5E1D6",
                        borderRadius: "14px",
                        fontSize: "11px",
                        color: "#20352A",
                        boxShadow: "0 8px 24px rgba(23,61,43,0.08)",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="moisture"
                      stroke="#173D2B"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#moistureGrad)"
                    />
                    <Area
                      type="monotone"
                      dataKey="temp"
                      stroke="#C9A65B"
                      strokeWidth={2}
                      strokeDasharray="4 4"
                      fillOpacity={1}
                      fill="url(#tempGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Middle-Right: Circular Progress Ring (Crop Vitality & Leaf SPAD) */}
            <div className="md:col-span-5 rounded-3xl border border-[#E5E1D6] bg-[#FFFEFA] p-5 shadow-sm flex flex-col justify-between items-center text-center">
              <div className="w-full flex items-center justify-between">
                <span className="text-xs font-bold text-[#173D2B]">
                  {t("Canopy Vitality & SPAD")}
                </span>
                <span className="text-[0.65rem] font-bold text-[#173D2B] bg-[#E4EBDD] px-2.5 py-0.5 rounded-full border border-[#D0DEC4]">
                  {t("Optimal")}
                </span>
              </div>

              {/* Circular SVG Donut Gauge */}
              <div className="relative size-36 my-2 flex items-center justify-center">
                <svg className="size-full -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="46"
                    className="stroke-[#E4EBDD]"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="46"
                    className="stroke-[#173D2B]"
                    strokeWidth="10"
                    strokeDasharray={289}
                    strokeDashoffset={289 - (289 * healthPercent) / 100}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="34"
                    className="stroke-[#C9A65B]"
                    strokeWidth="4"
                    strokeDasharray={213}
                    strokeDashoffset={213 - (213 * 54.8) / 100}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>

                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-2xl font-black font-mono text-[#173D2B]">
                    {healthPercent}%
                  </span>
                  <span className="text-[0.62rem] text-[#68756A] font-semibold">
                    {t("Health Index")}
                  </span>
                </div>
              </div>

              <div className="w-full grid grid-cols-2 gap-2 text-left pt-2 border-t border-[#E5E1D6] text-xs">
                <div>
                  <span className="text-[0.65rem] text-[#68756A] block">{t("SPAD Chlorophyll")}</span>
                  <strong className="text-[#173D2B] font-mono text-sm">54.8</strong>
                </div>
                <div>
                  <span className="text-[0.65rem] text-[#68756A] block">{t("Canopy Density")}</span>
                  <strong className="text-[#C9A65B] font-mono text-sm">88.4%</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row: Soil Conditions + Yield Delivery Forecast + Crop Nutrition */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1: Soil Conditions & Tilth */}
            <div
              onClick={() => onNavigateTab("soil")}
              className="rounded-2xl border border-[#E5E1D6] bg-[#FFFEFA] p-4 shadow-sm hover:border-[#173D2B] hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between pb-2 border-b border-[#E5E1D6]">
                <span className="text-xs font-bold text-[#173D2B]">{t("Soil Chemistry")}</span>
                <span className="text-[0.62rem] text-[#173D2B] font-bold bg-[#E4EBDD] px-2 py-0.5 rounded-full">{t("Target")} {cropProfile.soilTarget}%</span>
              </div>
              <div className="mt-3 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#68756A]">{t("Soil Type:")}</span>
                  <strong className="text-[#20352A]">{translateSoil(selectedField.soil_type, language)}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#68756A]">{t("pH Level:")}</span>
                  <strong className="text-[#173D2B] font-mono">{selectedField.soil_ph} ({t("Balanced")})</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#68756A]">{t("Organic Carbon:")}</span>
                  <strong className="text-[#20352A] font-mono">{selectedField.organic_carbon_pct}%</strong>
                </div>
              </div>
            </div>

            {/* Card 2: Yield Delivery Forecast */}
            <div
              onClick={() => onNavigateTab("yield")}
              className="rounded-2xl border border-[#E5E1D6] bg-[#FFFEFA] p-4 shadow-sm hover:border-[#173D2B] hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between pb-2 border-b border-[#E5E1D6]">
                <span className="text-xs font-bold text-[#173D2B]">{t("Delivery Forecast")}</span>
                <span className="text-[0.62rem] text-[#C9A65B] font-bold bg-[#F8F4EB] px-2 py-0.5 rounded-full">{t("Bulking Stage")}</span>
              </div>
              <div className="mt-3 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#68756A]">{t("Est. Harvest:")}</span>
                  <strong className="text-[#173D2B] font-mono">{estimatedTonnage} {t("Tonnes")}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#68756A]">{t("Expected Date:")}</span>
                  <strong className="text-[#20352A]">{selectedField.expected_harvest_date}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#68756A]">{t("Farm Revenue:")}</span>
                  <strong className="text-[#2E7D32] font-mono font-bold">₹{estimatedRevenueInr}</strong>
                </div>
              </div>
            </div>

            {/* Card 3: Crop Nutrition & NPK */}
            <div
              onClick={() => onNavigateTab("soilNutrition")}
              className="rounded-2xl border border-[#E5E1D6] bg-[#FFFEFA] p-4 shadow-sm hover:border-[#173D2B] hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between pb-2 border-b border-[#E5E1D6]">
                <span className="text-xs font-bold text-[#173D2B]">{t("NPK Reserves")}</span>
                <span className="text-[0.62rem] text-[#173D2B] font-bold bg-[#E4EBDD] px-2 py-0.5 rounded-full">{t("Fertile")}</span>
              </div>
              <div className="mt-3 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#68756A]">{t("Nitrogen (N):")}</span>
                  <strong className="text-[#20352A] font-mono">{selectedField.nitrogen_ppm} ppm</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#68756A]">{t("Phosphorus (P):")}</span>
                  <strong className="text-[#20352A] font-mono">{selectedField.phosphorus_ppm} ppm</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#68756A]">{t("Potassium (K):")}</span>
                  <strong className="text-[#20352A] font-mono">{selectedField.potassium_ppm} ppm</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (Col-span 4 on large screens): VERIFIED CROP PHOTOGRAPHY */}
        <div className="lg:col-span-4 space-y-4">
          <RealCropBanner
            cropName={matchedKey}
            fieldName={selectedField.name}
            location={selectedField.location}
            onOpen3DTwin={() => onNavigateTab("twin3d")}
            onOpenHealth={() => onNavigateTab("health")}
          />
        </div>
      </div>

      {/* ==================== 5. EXPLORE FARM INTELLIGENCE MODULES ==================== */}
      <div className="pt-4 border-t border-[#E5E1D6]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#173D2B]">
              {t("Direct Farm Intelligence Modules")}
            </h3>
            <p className="text-[0.72rem] text-[#68756A]">
              {t("Select any module to open detailed diagnostics")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            onClick={() => onNavigateTab("twin3d")}
            className="rounded-2xl border border-[#E5E1D6] bg-[#FFFEFA] p-4 hover:border-[#173D2B] hover:shadow-md transition-all cursor-pointer group flex items-center justify-between shadow-xs"
          >
            <div className="flex items-center gap-3">
              <div className="size-11 rounded-2xl bg-[#E4EBDD] border border-[#D0DEC4] flex items-center justify-center text-[#173D2B] group-hover:scale-105 transition-transform">
                <Box className="size-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#173D2B]">{t("3D Digital Twin")}</h4>
                <p className="text-[0.68rem] text-[#68756A]">{t("360° real terrain & strata")}</p>
              </div>
            </div>
            <ArrowUpRight className="size-4 text-[#173D2B] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>

          <div
            onClick={() => onNavigateTab("voice-agronomist")}
            className="rounded-2xl border border-[#E5E1D6] bg-[#FFFEFA] p-4 hover:border-[#173D2B] hover:shadow-md transition-all cursor-pointer group flex items-center justify-between shadow-xs"
          >
            <div className="flex items-center gap-3">
              <div className="size-11 rounded-2xl bg-[#F8F4EB] border border-[#E5E1D6] flex items-center justify-center text-[#173D2B] group-hover:scale-105 transition-transform">
                <Mic className="size-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#173D2B]">{t("AI Voice Agronomist")}</h4>
                <p className="text-[0.68rem] text-[#68756A]">{t("9 Indian languages assistance")}</p>
              </div>
            </div>
            <ArrowUpRight className="size-4 text-[#173D2B] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>

          <div
            onClick={() => onNavigateTab("health")}
            className="rounded-2xl border border-[#E5E1D6] bg-[#FFFEFA] p-4 hover:border-[#173D2B] hover:shadow-md transition-all cursor-pointer group flex items-center justify-between shadow-xs"
          >
            <div className="flex items-center gap-3">
              <div className="size-11 rounded-2xl bg-[#E4EBDD] border border-[#D0DEC4] flex items-center justify-center text-[#173D2B] group-hover:scale-105 transition-transform">
                <Sparkles className="size-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#173D2B]">{t("AI Crop Health")}</h4>
                <p className="text-[0.68rem] text-[#68756A]">{t("Vision ML leaf pathology")}</p>
              </div>
            </div>
            <ArrowUpRight className="size-4 text-[#173D2B] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>

          <div
            onClick={() => onNavigateTab("market")}
            className="rounded-2xl border border-[#E5E1D6] bg-[#FFFEFA] p-4 hover:border-[#173D2B] hover:shadow-md transition-all cursor-pointer group flex items-center justify-between shadow-xs"
          >
            <div className="flex items-center gap-3">
              <div className="size-11 rounded-2xl bg-[#F8F4EB] border border-[#E5E1D6] flex items-center justify-center text-[#173D2B] group-hover:scale-105 transition-transform">
                <TrendingUp className="size-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#173D2B]">{t("Market Intelligence")}</h4>
                <p className="text-[0.68rem] text-[#68756A]">{t("APMC prices & holding advisor")}</p>
              </div>
            </div>
            <ArrowUpRight className="size-4 text-[#173D2B] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
}
