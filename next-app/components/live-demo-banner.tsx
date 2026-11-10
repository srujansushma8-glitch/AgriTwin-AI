"use client";

import React, { useState, useEffect } from "react";
import {
  Activity,
  Droplets,
  Thermometer,
  Wind,
  Sun,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Info,
  ChevronRight,
  Gauge,
} from "lucide-react";
import { fetchLiveTelemetry, LiveTelemetryResponse } from "@/lib/api";
import { useTranslation } from "@/lib/i18n";

interface LiveDemoBannerProps {
  fieldId: string;
  onNavigateStep?: (tabId: string) => void;
}

export function LiveDemoBanner({ fieldId, onNavigateStep }: LiveDemoBannerProps) {
  const { t } = useTranslation();
  const [telemetry, setTelemetry] = useState<LiveTelemetryResponse | null>(null);
  const [isJudgeMode, setIsJudgeMode] = useState<boolean>(true);
  const [activeStep, setActiveStep] = useState<number>(0);

  const DEMO_STEPS = [
    { id: "twin3d", title: t("banner.step1.title", "1. 3D Twin & Real Geography"), hint: t("banner.step1.hint", "Rotate 360°, inspect 4 plots, eye-level field walk") },
    { id: "voice-agronomist", title: t("banner.step.voice", "AI Voice Agronomist"), hint: t("banner.step.voiceHint", "Talk to Kisan Mitra in Kannada, Hindi, and 9 languages") },
    { id: "fields", title: t("banner.step2.title", "2. Geospatial Plot Picker"), hint: t("banner.step2.hint", "Set district, elevation, and cadastral coordinates") },
    { id: "climate", title: t("banner.step3.title", "3. Climate What-If Lab"), hint: t("banner.step3.hint", "Simulate +4°C heatwave or 7-day drought shock") },
    { id: "irrigation", title: t("banner.step4.title", "4. Smart Irrigation"), hint: t("banner.step4.hint", "Compare pulse drip vs flood irrigation water savings") },
    { id: "security", title: t("banner.step5.title", "5. Cybersecurity Center"), hint: t("banner.step5.hint", "Surveil sensor telemetry tampering & brute-force defense") },
  ];

  useEffect(() => {
    let isMounted = true;
    const poll = async () => {
      try {
        const data = await fetchLiveTelemetry(fieldId);
        if (isMounted) setTelemetry(data);
      } catch (err) {
        // Fallback gracefully
      }
    };

    poll();
    const interval = setInterval(poll, 2500);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [fieldId]);

  return (
    <div className="bg-[#F2EDE2] border-b border-[#E5E1D6] text-[#20352A] px-4 py-2 text-xs flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
      {/* Left: Live Stream Ticker */}
      <div className="flex items-center gap-3 overflow-x-auto scrollbar-none py-1">
        {/* Pulsing Live indicator */}
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E4EBDD] text-[#173D2B] border border-[#A9B99B]/50 font-bold shrink-0">
          <span className="size-2 rounded-full bg-[#173D2B] animate-ping" />
          <span className="text-[0.65rem] tracking-wider uppercase font-mono font-black">
            {t("header.liveTelemetry", "LIVE TELEMETRY")}
          </span>
        </div>

        {/* Live Metrics */}
        {telemetry && (
          <div className="flex items-center gap-4 text-[#68756A] font-mono text-[0.7rem] shrink-0 font-bold">
            <span className="flex items-center gap-1">
              <Thermometer className="size-3.5 text-[#C9A65B]" />
              <span className="text-[#20352A]">{telemetry.live_telemetry.ambient_temp_c}°C</span>
            </span>
            <span className="flex items-center gap-1">
              <Droplets className="size-3.5 text-[#2E7D32]" />
              {t("banner.root", "Root:")} <span className="text-[#20352A]">{telemetry.live_telemetry.soil_moisture_30cm_root}%</span>
            </span>
            <span className="flex items-center gap-1">
              <Sun className="size-3.5 text-[#C9A65B]" />
              {t("banner.vpd", "VPD:")} <span className="text-[#20352A]">{telemetry.live_telemetry.vpd_kpa} kPa</span>
            </span>
            <span className="flex items-center gap-1">
              <Gauge className="size-3.5 text-[#173D2B]" />
              {t("banner.valve", "Valve:")} <strong className="text-[#173D2B] font-sans">{telemetry.irrigation_status.valve_state}</strong>
            </span>
            <span className="flex items-center gap-1">
              <Activity className="size-3.5 text-[#173D2B]" />
              {t("banner.health", "Health:")} <span className="text-[#20352A]">{telemetry.crop_health_live.health_index}%</span>
            </span>
          </div>
        )}

        {/* Simulated Provenance Pill */}
        <span className="hidden lg:inline-flex items-center gap-1 text-[0.6rem] text-[#68756A] font-mono bg-white px-2 py-0.5 rounded-md border border-[#E5E1D6] shrink-0 font-semibold">
          <Info className="size-3 text-[#173D2B]" />
          {t("banner.simulatedStream", "FAO-56 Penman-Monteith Stream")}
        </span>
      </div>

      {/* Right: Judge Guided Tour Stepper */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => setIsJudgeMode(!isJudgeMode)}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.7rem] font-bold transition-all cursor-pointer shadow-2xs ${
            isJudgeMode
              ? "bg-[#173D2B] text-white"
              : "bg-white text-[#68756A] border border-[#E5E1D6] hover:text-[#173D2B]"
          }`}
        >
          <Sparkles className="size-3 text-[#A3E635]" />
          <span>{t("banner.judgeWalkthrough", "Demo Walkthrough")}</span>
        </button>

        {isJudgeMode && (
          <div className="flex items-center gap-1 bg-white border border-[#E5E1D6] rounded-xl p-1 shadow-2xs">
            {DEMO_STEPS.map((step, idx) => (
              <button
                key={step.id}
                onClick={() => {
                  setActiveStep(idx);
                  if (onNavigateStep) onNavigateStep(step.id);
                }}
                className={`px-2 py-0.5 rounded-lg text-[0.65rem] font-bold transition-all cursor-pointer ${
                  activeStep === idx
                    ? "bg-[#E4EBDD] text-[#173D2B] border border-[#A9B99B]/40"
                    : "text-[#68756A] hover:text-[#173D2B]"
                }`}
                title={step.hint}
              >
                {step.title.split(".")[0]}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

