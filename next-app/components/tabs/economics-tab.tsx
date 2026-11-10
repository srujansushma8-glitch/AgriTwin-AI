"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  TrendingUp,
  Calculator,
  IndianRupee,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  PieChart,
  Scale,
  RefreshCw,
  Download,
  Printer,
  FileSpreadsheet,
} from "lucide-react";
import {
  FieldItem,
  EconomicsData,
  fetchEconomics,
  EconomicsCalculationResponse,
  calculateEconomics,
  getExportCSVUrl,
} from "@/lib/api";
import { useTranslation } from "@/lib/i18n";

interface EconomicsTabProps {
  selectedField: FieldItem;
}

const CROP_BENCHMARKS: Record<
  string,
  {
    yield_t_ha: number;
    price_per_ton: number;
    seed: number;
    fertilizer: number;
    pesticide: number;
    labour: number;
    irrigation: number;
    machinery: number;
    harvesting: number;
    packaging: number;
    storage: number;
    freight: number;
  }
> = {
  Tomato: {
    yield_t_ha: 26.0,
    price_per_ton: 28000,
    seed: 5500,
    fertilizer: 16500,
    pesticide: 6800,
    labour: 26000,
    irrigation: 4800,
    machinery: 9500,
    harvesting: 11000,
    packaging: 6500,
    storage: 3000,
    freight: 5500,
  },
  "Ragi (Finger Millet)": {
    yield_t_ha: 3.8,
    price_per_ton: 42900,
    seed: 2800,
    fertilizer: 6800,
    pesticide: 2200,
    labour: 14000,
    irrigation: 2500,
    machinery: 7000,
    harvesting: 5500,
    packaging: 2200,
    storage: 1800,
    freight: 2800,
  },
  Sugarcane: {
    yield_t_ha: 85.0,
    price_per_ton: 3250,
    seed: 14000,
    fertilizer: 22000,
    pesticide: 4500,
    labour: 32000,
    irrigation: 12000,
    machinery: 18000,
    harvesting: 24000,
    packaging: 1500,
    storage: 0,
    freight: 12500,
  },
  "Rice / Paddy": {
    yield_t_ha: 5.6,
    price_per_ton: 23200,
    seed: 3500,
    fertilizer: 9500,
    pesticide: 3600,
    labour: 19500,
    irrigation: 6500,
    machinery: 9800,
    harvesting: 8500,
    packaging: 3200,
    storage: 2400,
    freight: 3800,
  },
  Wheat: {
    yield_t_ha: 4.8,
    price_per_ton: 24250,
    seed: 3800,
    fertilizer: 8400,
    pesticide: 2800,
    labour: 12500,
    irrigation: 4200,
    machinery: 9000,
    harvesting: 7200,
    packaging: 2600,
    storage: 2100,
    freight: 3200,
  },
  Maize: {
    yield_t_ha: 6.5,
    price_per_ton: 22250,
    seed: 4200,
    fertilizer: 10500,
    pesticide: 3200,
    labour: 15000,
    irrigation: 4500,
    machinery: 8800,
    harvesting: 7800,
    packaging: 3000,
    storage: 2200,
    freight: 3500,
  },
  Cotton: {
    yield_t_ha: 2.4,
    price_per_ton: 75210,
    seed: 4800,
    fertilizer: 12000,
    pesticide: 8500,
    labour: 28000,
    irrigation: 5500,
    machinery: 8000,
    harvesting: 14000,
    packaging: 3500,
    storage: 2500,
    freight: 4200,
  },
  Groundnut: {
    yield_t_ha: 2.8,
    price_per_ton: 67830,
    seed: 7500,
    fertilizer: 8500,
    pesticide: 3500,
    labour: 17500,
    irrigation: 4000,
    machinery: 8500,
    harvesting: 9000,
    packaging: 3000,
    storage: 2400,
    freight: 3600,
  },
  Banana: {
    yield_t_ha: 42.0,
    price_per_ton: 21000,
    seed: 16000,
    fertilizer: 28000,
    pesticide: 6500,
    labour: 34000,
    irrigation: 11000,
    machinery: 12000,
    harvesting: 16000,
    packaging: 8500,
    storage: 4000,
    freight: 14000,
  },
  Potato: {
    yield_t_ha: 28.0,
    price_per_ton: 21500,
    seed: 22000,
    fertilizer: 17500,
    pesticide: 6200,
    labour: 24000,
    irrigation: 5800,
    machinery: 11000,
    harvesting: 13500,
    packaging: 5200,
    storage: 4500,
    freight: 6000,
  },
  Carrot: {
    yield_t_ha: 22.0,
    price_per_ton: 26000,
    seed: 6500,
    fertilizer: 14000,
    pesticide: 4800,
    labour: 22000,
    irrigation: 4200,
    machinery: 8500,
    harvesting: 9500,
    packaging: 5800,
    storage: 3200,
    freight: 5000,
  },
  Beetroot: {
    yield_t_ha: 24.0,
    price_per_ton: 23500,
    seed: 5800,
    fertilizer: 13500,
    pesticide: 4200,
    labour: 21000,
    irrigation: 4000,
    machinery: 8200,
    harvesting: 9000,
    packaging: 5200,
    storage: 3000,
    freight: 4800,
  },
};

export function EconomicsTab({ selectedField }: EconomicsTabProps) {
  const { t } = useTranslation();
  const [econ, setEcon] = useState<EconomicsData | null>(null);

  // Traceable calculator state
  const [cropName, setCropName] = useState<string>(selectedField.crop_type || "Tomato");
  const [areaHectares, setAreaHectares] = useState<number>(selectedField.area_hectares || 1.8);
  const [yieldTonnesPerHa, setYieldTonnesPerHa] = useState<number>(24.0);
  const [pricePerTon, setPricePerTon] = useState<number>(28000);
  const [seedCost, setSeedCost] = useState<number>(5500);
  const [fertCost, setFertCost] = useState<number>(16500);
  const [pestCost, setPestCost] = useState<number>(6800);
  const [labourCost, setLabourCost] = useState<number>(26000);
  const [irrigationCost, setIrrigationCost] = useState<number>(4800);
  const [machineryCost, setMachineryCost] = useState<number>(9500);
  const [harvestCost, setHarvestCost] = useState<number>(11000);
  const [packagingCost, setPackagingCost] = useState<number>(6500);
  const [storageCost, setStorageCost] = useState<number>(3000);
  const [freightCost, setFreightCost] = useState<number>(5500);
  const [commissionPct, setCommissionPct] = useState<number>(1.5);

  const [calcResult, setCalcResult] = useState<EconomicsCalculationResponse | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);

  // Load field economics summary
  useEffect(() => {
    let active = true;
    fetchEconomics(selectedField.id).then((res) => {
      if (active) setEcon(res);
    });
    return () => {
      active = false;
    };
  }, [selectedField.id]);

  // Load benchmark presets when crop or field changes
  const applyBenchmark = (crop: string) => {
    const bm =
      CROP_BENCHMARKS[crop] ||
      (crop.toLowerCase().includes("ragi")
        ? CROP_BENCHMARKS["Ragi (Finger Millet)"]
        : crop.toLowerCase().includes("paddy")
        ? CROP_BENCHMARKS["Rice / Paddy"]
        : CROP_BENCHMARKS["Tomato"]);

    setYieldTonnesPerHa(bm.yield_t_ha);
    setPricePerTon(bm.price_per_ton);
    setSeedCost(bm.seed);
    setFertCost(bm.fertilizer);
    setPestCost(bm.pesticide);
    setLabourCost(bm.labour);
    setIrrigationCost(bm.irrigation);
    setMachineryCost(bm.machinery);
    setHarvestCost(bm.harvesting);
    setPackagingCost(bm.packaging);
    setStorageCost(bm.storage);
    setFreightCost(bm.freight);
  };

  useEffect(() => {
    setCropName(selectedField.crop_type);
    setAreaHectares(selectedField.area_hectares || 1.8);
    applyBenchmark(selectedField.crop_type);
  }, [selectedField.crop_type, selectedField.area_hectares]);

  // Compute economics
  const handleCalculate = async () => {
    setIsCalculating(true);
    try {
      const res = await calculateEconomics({
        crop_name: cropName,
        area_hectares: Number(areaHectares),
        expected_yield_t_ha: Number(yieldTonnesPerHa),
        selling_price_per_ton_inr: Number(pricePerTon),
        seed_cost_inr: Number(seedCost),
        fertilizer_cost_inr: Number(fertCost),
        pesticide_cost_inr: Number(pestCost),
        labour_cost_inr: Number(labourCost),
        irrigation_power_cost_inr: Number(irrigationCost),
        machinery_tractor_cost_inr: Number(machineryCost),
        harvesting_cost_inr: Number(harvestCost),
        packaging_bags_cost_inr: Number(packagingCost),
        storage_cost_inr: Number(storageCost),
        transport_cost_inr: Number(freightCost),
        mandi_commission_pct: Number(commissionPct),
      });
      setCalcResult(res);
    } catch {
      // Keep previous
    } finally {
      setIsCalculating(false);
    }
  };

  // Run initial calculation when ready
  useEffect(() => {
    handleCalculate();
  }, [cropName]);

  return (
    <div className="space-y-6 animate-in fade-in-50">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E5E1D6]">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-2 rounded-full bg-[#173D2B] animate-pulse" />
            <h2 className="text-xl font-black text-[#173D2B]">
              {t("economics.title")}
            </h2>
          </div>
          <p className="text-xs text-[#68756A] mt-0.5">
            {t("economics.subtitle")} • {selectedField.name} ({cropName})
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {econ && (
            <span className="rounded-full bg-[#E4EBDD] px-3 py-1 text-xs font-bold text-[#173D2B] border border-[#C9D9BE] font-mono">
              {t("economics.msp")}: ₹{econ.price_per_ton_inr.toLocaleString()} / tonne
            </span>
          )}
          <a
            href={getExportCSVUrl(selectedField.id)}
            download={`agritwin_telemetry_${selectedField.id}.csv`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E5E1D6] bg-[#FFFEFA] hover:bg-[#E4EBDD] text-xs font-bold text-[#173D2B] transition-colors shadow-2xs"
          >
            <Download className="size-3.5 text-[#173D2B]" />
            <span>Export CSV</span>
          </a>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E5E1D6] bg-[#F8F4EB] hover:bg-[#E4EBDD] text-xs font-bold text-[#173D2B] cursor-pointer transition-colors shadow-2xs"
          >
            <Printer className="size-3.5 text-[#173D2B]" />
            <span>Print / PDF Report</span>
          </button>
        </div>
      </div>

      {/* Primary Financial Overview Cards */}
      {econ && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Gross Expected Revenue */}
          <div className="rounded-2xl border border-[#E5E1D6] bg-[#FFFEFA] p-5 shadow-xs">
            <span className="text-xs text-[#68756A] font-semibold block">
              {t("economics.grossRev")}
            </span>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-extrabold font-mono text-[#173D2B]">
                ₹{econ.expected_gross_revenue_inr.toLocaleString()}
              </span>
            </div>
            <span className="text-[0.65rem] text-[#68756A] mt-1 block">
              {econ.expected_production_tons} tonnes across {econ.area_hectares} ha
            </span>
          </div>

          {/* Input Costs */}
          <div className="rounded-2xl border border-[#E5E1D6] bg-[#FFFEFA] p-5 shadow-xs">
            <span className="text-xs text-[#68756A] font-semibold block">
              {t("economics.costs")}
            </span>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-extrabold font-mono text-[#20352A]">
                ₹{econ.estimated_input_costs_inr.toLocaleString()}
              </span>
            </div>
            <span className="text-[0.65rem] text-[#68756A] mt-1 block">
              Seeds, precision fertigation, electricity & labor
            </span>
          </div>

          {/* Net Profit */}
          <div className="rounded-2xl border border-[#C9D9BE] bg-[#E4EBDD] p-5 shadow-xs">
            <span className="text-xs text-[#173D2B] font-bold block">
              {t("economics.netProfit")}
            </span>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-extrabold font-mono text-[#173D2B]">
                ₹{econ.estimated_net_profit_inr.toLocaleString()}
              </span>
            </div>
            <span className="text-[0.65rem] text-[#173D2B] font-semibold mt-1 block">
              Healthy yield trajectory
            </span>
          </div>
        </div>
      )}

      {/* Preventive Twin Value Banner */}
      {econ && (
        <div className="rounded-2xl border border-[#E5E1D6] bg-[#FFFEFA] p-5 flex flex-wrap items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-[#E4EBDD] text-[#173D2B] border border-[#C9D9BE]">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#173D2B]">
                {t("economics.savings")}
              </h3>
              <p className="text-xs text-[#68756A]">
                {t("economics.savingsNote")}
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[0.65rem] text-[#68756A] uppercase font-bold block">
              {t("economics.savings")}
            </span>
            <span className="font-mono text-2xl font-black text-[#173D2B]">
              +₹{econ.savings_from_preventive_twin_irrigation_inr.toLocaleString()}
            </span>
          </div>
        </div>
      )}

      {/* Comprehensive Traceable Profit & Investment Calculator */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/30">
              <Calculator className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-foreground">
                  Traceable Profit & Cultivation Investment Calculator
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[0.62rem] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Itemized Line-Item Engine
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Rigorous financial modeling with transparent arithmetic and 3-scenario sensitivity analysis
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => applyBenchmark(cropName)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-muted/40 hover:bg-muted text-xs font-semibold text-foreground cursor-pointer transition-colors"
            >
              <RefreshCw className="size-3.5" />
              <span>Reset to {cropName} Benchmark</span>
            </button>
            <button
              onClick={handleCalculate}
              disabled={isCalculating}
              className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs cursor-pointer disabled:opacity-60 transition-all"
            >
              <Sparkles className="size-3.5" />
              <span>{isCalculating ? "Calculating..." : "Recalculate Economics"}</span>
            </button>
          </div>
        </div>

        {/* Input Parameters Form */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-xl border border-border/60 bg-muted/20">
          <div>
            <label className="text-[0.7rem] font-semibold text-muted-foreground block mb-1">
              Cultivated Crop
            </label>
            <select
              value={cropName}
              onChange={(e) => {
                setCropName(e.target.value);
                applyBenchmark(e.target.value);
              }}
              className="w-full px-3 py-1.5 rounded-lg border border-border bg-background text-xs font-bold text-foreground cursor-pointer"
            >
              {Object.keys(CROP_BENCHMARKS).map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[0.7rem] font-semibold text-muted-foreground block mb-1">
              Land Area (Hectares)
            </label>
            <input
              type="number"
              step="0.1"
              value={areaHectares}
              onChange={(e) => setAreaHectares(Number(e.target.value))}
              className="w-full px-3 py-1.5 rounded-lg border border-border bg-background text-xs font-mono font-bold text-foreground"
            />
            <span className="text-[0.62rem] text-muted-foreground mt-0.5 block">
              ≈ {(areaHectares * 2.47105).toFixed(1)} Acres
            </span>
          </div>

          <div>
            <label className="text-[0.7rem] font-semibold text-muted-foreground block mb-1">
              Expected Yield (Tonnes / Ha)
            </label>
            <input
              type="number"
              step="0.5"
              value={yieldTonnesPerHa}
              onChange={(e) => setYieldTonnesPerHa(Number(e.target.value))}
              className="w-full px-3 py-1.5 rounded-lg border border-border bg-background text-xs font-mono font-bold text-foreground"
            />
            <span className="text-[0.62rem] text-muted-foreground mt-0.5 block">
              Total: {(yieldTonnesPerHa * areaHectares).toFixed(1)} T ({(yieldTonnesPerHa * areaHectares * 10).toFixed(0)} Qtl)
            </span>
          </div>

          <div>
            <label className="text-[0.7rem] font-semibold text-muted-foreground block mb-1">
              Target Price (₹ / Tonne)
            </label>
            <input
              type="number"
              step="100"
              value={pricePerTon}
              onChange={(e) => setPricePerTon(Number(e.target.value))}
              className="w-full px-3 py-1.5 rounded-lg border border-border bg-background text-xs font-mono font-bold text-foreground"
            />
            <span className="text-[0.62rem] text-muted-foreground mt-0.5 block">
              ₹{(pricePerTon / 10).toFixed(0)} / Quintal
            </span>
          </div>
        </div>

        {/* Itemized Expenses Inputs */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
              <PieChart className="size-4 text-emerald-500" /> Itemized Cultivation & Operating Expenses (₹)
            </h4>
            <span className="text-[0.68rem] text-muted-foreground">Adjust line items as per local rates</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <div className="rounded-xl border border-border bg-card p-3">
              <label className="text-[0.65rem] text-muted-foreground block mb-1">Seeds / Planting (₹)</label>
              <input
                type="number"
                value={seedCost}
                onChange={(e) => setSeedCost(Number(e.target.value))}
                className="w-full px-2 py-1 rounded border border-border bg-background text-xs font-mono font-bold text-foreground"
              />
            </div>

            <div className="rounded-xl border border-border bg-card p-3">
              <label className="text-[0.65rem] text-muted-foreground block mb-1">Fertilizer & Nutrients (₹)</label>
              <input
                type="number"
                value={fertCost}
                onChange={(e) => setFertCost(Number(e.target.value))}
                className="w-full px-2 py-1 rounded border border-border bg-background text-xs font-mono font-bold text-foreground"
              />
            </div>

            <div className="rounded-xl border border-border bg-card p-3">
              <label className="text-[0.65rem] text-muted-foreground block mb-1">Pesticides & Bio-control (₹)</label>
              <input
                type="number"
                value={pestCost}
                onChange={(e) => setPestCost(Number(e.target.value))}
                className="w-full px-2 py-1 rounded border border-border bg-background text-xs font-mono font-bold text-foreground"
              />
            </div>

            <div className="rounded-xl border border-border bg-card p-3">
              <label className="text-[0.65rem] text-muted-foreground block mb-1">Field Labour (₹)</label>
              <input
                type="number"
                value={labourCost}
                onChange={(e) => setLabourCost(Number(e.target.value))}
                className="w-full px-2 py-1 rounded border border-border bg-background text-xs font-mono font-bold text-foreground"
              />
            </div>

            <div className="rounded-xl border border-border bg-card p-3">
              <label className="text-[0.65rem] text-muted-foreground block mb-1">Irrigation & Power (₹)</label>
              <input
                type="number"
                value={irrigationCost}
                onChange={(e) => setIrrigationCost(Number(e.target.value))}
                className="w-full px-2 py-1 rounded border border-border bg-background text-xs font-mono font-bold text-foreground"
              />
            </div>

            <div className="rounded-xl border border-border bg-card p-3">
              <label className="text-[0.65rem] text-muted-foreground block mb-1">Tractor & Machinery (₹)</label>
              <input
                type="number"
                value={machineryCost}
                onChange={(e) => setMachineryCost(Number(e.target.value))}
                className="w-full px-2 py-1 rounded border border-border bg-background text-xs font-mono font-bold text-foreground"
              />
            </div>

            <div className="rounded-xl border border-border bg-card p-3">
              <label className="text-[0.65rem] text-muted-foreground block mb-1">Harvesting Labour (₹)</label>
              <input
                type="number"
                value={harvestCost}
                onChange={(e) => setHarvestCost(Number(e.target.value))}
                className="w-full px-2 py-1 rounded border border-border bg-background text-xs font-mono font-bold text-foreground"
              />
            </div>

            <div className="rounded-xl border border-border bg-card p-3">
              <label className="text-[0.65rem] text-muted-foreground block mb-1">Packaging / Bags (₹)</label>
              <input
                type="number"
                value={packagingCost}
                onChange={(e) => setPackagingCost(Number(e.target.value))}
                className="w-full px-2 py-1 rounded border border-border bg-background text-xs font-mono font-bold text-foreground"
              />
            </div>

            <div className="rounded-xl border border-border bg-card p-3">
              <label className="text-[0.65rem] text-muted-foreground block mb-1">Storage / Godown (₹)</label>
              <input
                type="number"
                value={storageCost}
                onChange={(e) => setStorageCost(Number(e.target.value))}
                className="w-full px-2 py-1 rounded border border-border bg-background text-xs font-mono font-bold text-foreground"
              />
            </div>

            <div className="rounded-xl border border-border bg-card p-3">
              <label className="text-[0.65rem] text-muted-foreground block mb-1">Freight Transport (₹)</label>
              <input
                type="number"
                value={freightCost}
                onChange={(e) => setFreightCost(Number(e.target.value))}
                className="w-full px-2 py-1 rounded border border-border bg-background text-xs font-mono font-bold text-foreground"
              />
            </div>
          </div>
        </div>

        {/* Live Calculation Results */}
        {calcResult && (
          <div className="space-y-6 pt-4 border-t border-border">
            {/* KPI Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="rounded-xl border border-border bg-card p-4">
                <span className="text-[0.68rem] text-muted-foreground block">Gross Farm Revenue</span>
                <span className="text-2xl font-extrabold font-mono text-foreground mt-1 block">
                  ₹{calcResult.summary.gross_revenue_inr.toLocaleString()}
                </span>
                <span className="text-[0.62rem] text-muted-foreground mt-1 block">
                  {calcResult.yield_parameters.total_yield_tonnes.toFixed(1)} tonnes @ ₹{calcResult.price_parameters.selling_price_per_qtl_inr}/qtl
                </span>
              </div>

              <div className="rounded-xl border border-border bg-card p-4">
                <span className="text-[0.68rem] text-muted-foreground block">Total Cultivation Cost</span>
                <span className="text-2xl font-extrabold font-mono text-rose-600 dark:text-rose-400 mt-1 block">
                  ₹{calcResult.summary.total_cultivation_cost_inr.toLocaleString()}
                </span>
                <span className="text-[0.62rem] text-muted-foreground mt-1 block">
                  ₹{calcResult.summary.cost_per_hectare_inr.toLocaleString()} / ha
                </span>
              </div>

              <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4">
                <span className="text-[0.68rem] text-emerald-700 dark:text-emerald-300 font-semibold block">
                  Net Realized Profit
                </span>
                <span className="text-2xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400 mt-1 block">
                  ₹{calcResult.summary.net_profit_inr.toLocaleString()}
                </span>
                <span className="text-[0.62rem] text-emerald-700 dark:text-emerald-300 mt-1 block font-medium">
                  ₹{calcResult.summary.profit_per_acre_inr.toLocaleString()} / Acre
                </span>
              </div>

              <div className="rounded-xl border border-blue-500/40 bg-blue-500/10 p-4">
                <span className="text-[0.68rem] text-blue-700 dark:text-blue-300 font-semibold block">
                  Return on Investment & Breakeven
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-extrabold font-mono text-blue-600 dark:text-blue-400">
                    {calcResult.summary.return_on_investment_pct.toFixed(1)}%
                  </span>
                  <span className="text-xs text-muted-foreground">ROI</span>
                </div>
                <span className="text-[0.62rem] text-muted-foreground mt-1 block">
                  Breakeven: ₹{calcResult.summary.breakeven_price_per_qtl_inr.toFixed(0)} / qtl
                </span>
              </div>
            </div>

            {/* 3 Sensitivity Scenarios Table */}
            <div className="rounded-xl border border-border bg-card p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <Scale className="size-4 text-emerald-500" /> Sensitivity Analysis Scenarios
                </h4>
                <span className="text-[0.68rem] text-muted-foreground">
                  Evaluating market price swings & climatic yield shocks
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Optimistic */}
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <ArrowUpRight className="size-4" /> Optimistic Scenario
                    </span>
                    <span className="text-[0.62rem] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold">
                      +15% Yield / +10% Price
                    </span>
                  </div>
                  <div className="pt-2 border-t border-emerald-500/20 space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Gross Revenue:</span>
                      <span className="font-mono font-bold text-foreground">
                        ₹{calcResult.scenarios.optimistic.gross_revenue_inr.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Net Profit:</span>
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        ₹{calcResult.scenarios.optimistic.net_profit_inr.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-[0.7rem] pt-1">
                      <span className="text-muted-foreground">Profit / Acre:</span>
                      <span className="font-mono font-semibold text-foreground">
                        ₹{calcResult.scenarios.optimistic.profit_per_acre_inr.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Expected Baseline */}
                <div className="rounded-xl border border-blue-500/30 bg-blue-500/5 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                      <TrendingUp className="size-4" /> Expected Baseline
                    </span>
                    <span className="text-[0.62rem] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-700 dark:text-blue-300 font-bold">
                      Current Settings
                    </span>
                  </div>
                  <div className="pt-2 border-t border-blue-500/20 space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Gross Revenue:</span>
                      <span className="font-mono font-bold text-foreground">
                        ₹{calcResult.scenarios.expected.gross_revenue_inr.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Net Profit:</span>
                      <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                        ₹{calcResult.scenarios.expected.net_profit_inr.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-[0.7rem] pt-1">
                      <span className="text-muted-foreground">Profit / Acre:</span>
                      <span className="font-mono font-semibold text-foreground">
                        ₹{calcResult.scenarios.expected.profit_per_acre_inr.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Pessimistic */}
                <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <ArrowDownRight className="size-4" /> Pessimistic Stress
                    </span>
                    <span className="text-[0.62rem] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold">
                      -20% Yield / -15% Price
                    </span>
                  </div>
                  <div className="pt-2 border-t border-amber-500/20 space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Gross Revenue:</span>
                      <span className="font-mono font-bold text-foreground">
                        ₹{calcResult.scenarios.pessimistic.gross_revenue_inr.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Net Profit:</span>
                      <span
                        className={`font-mono font-bold ${
                          calcResult.scenarios.pessimistic.net_profit_inr >= 0
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-rose-600"
                        }`}
                      >
                        ₹{calcResult.scenarios.pessimistic.net_profit_inr.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-[0.7rem] pt-1">
                      <span className="text-muted-foreground">Profit / Acre:</span>
                      <span className="font-mono font-semibold text-foreground">
                        ₹{calcResult.scenarios.pessimistic.profit_per_acre_inr.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Traceable Formula & Integrity Disclosure */}
            <div className="p-4 rounded-xl border border-border/60 bg-muted/20 text-xs text-muted-foreground space-y-1 font-mono">
              <span className="font-bold text-foreground block font-sans text-xs">
                Traceable Computational Formula:
              </span>
              <p className="text-[0.72rem] leading-relaxed">
                {calcResult.traceable_formula}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
