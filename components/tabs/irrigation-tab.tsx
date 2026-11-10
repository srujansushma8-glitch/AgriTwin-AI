"use client";

import React, { useState, useEffect } from "react";
import { Droplets, CheckCircle2 } from "lucide-react";
import { FieldItem, IrrigationDecision, fetchIrrigationDecision, applyIrrigation } from "@/lib/api";
import { useTranslation } from "@/lib/i18n";

interface IrrigationTabProps {
  selectedField: FieldItem;
  onRefreshData: () => void;
}

export function IrrigationTab({
  selectedField,
  onRefreshData,
}: IrrigationTabProps) {
  const { t } = useTranslation();
  const [decision, setDecision] = useState<IrrigationDecision | null>(null);
  const [applying, setApplying] = useState<string | null>(null);
  const [applyMessage, setApplyMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetchIrrigationDecision(selectedField.id).then((res) => {
      if (active) setDecision(res);
    });
    return () => {
      active = false;
    };
  }, [selectedField.id]);

  const handleApply = async (choice: string) => {
    setApplying(choice);
    try {
      const res = await applyIrrigation(selectedField.id, choice);
      setApplyMessage(res.message);
      // Reload decision
      const updated = await fetchIrrigationDecision(selectedField.id);
      setDecision(updated);
      onRefreshData();
    } catch {
      alert("Failed to apply irrigation");
    } finally {
      setApplying(null);
    }
  };

  if (!decision) return null;

  return (
    <div className="space-y-6 animate-in fade-in-50">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-2 rounded-full bg-blue-500 animate-pulse" />
            <h2 className="text-base font-bold text-foreground">
              {t("irrigation.title")}
            </h2>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t("irrigation.subtitle")} • {selectedField.name}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[0.65rem] text-muted-foreground uppercase font-bold block">
              {t("irrigation.currentMoisture")}
            </span>
            <span className="font-mono text-xl font-extrabold text-blue-600 dark:text-blue-400">
              {decision.current_root_moisture}%
            </span>
          </div>
          <div className="text-right">
            <span className="text-[0.65rem] text-muted-foreground uppercase font-bold block">
              {t("irrigation.optimalThreshold")}
            </span>
            <span className="font-mono text-xl font-bold text-foreground">
              {decision.optimal_threshold}%
            </span>
          </div>
        </div>
      </div>

      {/* Success Notification Banner */}
      {applyMessage && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-semibold text-emerald-700 dark:text-emerald-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
            <span>{applyMessage}</span>
          </div>
          <button
            onClick={() => setApplyMessage(null)}
            className="text-xs underline text-emerald-700 dark:text-emerald-300 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 4 Decision Support Options */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
          {t("irrigation.optionsTitle", "Compare & Evaluate Irrigation Actions:")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {decision.decision_options.map((opt) => (
            <div
              key={opt.option_id}
              className={`rounded-2xl border p-5 flex flex-col justify-between transition-all ${
                opt.recommended
                  ? "border-[#173D2B] bg-[#E4EBDD]/25 ring-1 ring-[#173D2B]/30 shadow-xs"
                  : "border-border bg-card"
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-bold text-foreground">{opt.title}</h4>
                  {opt.recommended && (
                    <span className="rounded-full bg-[#E4EBDD] px-2.5 py-0.5 text-[0.65rem] font-bold text-[#173D2B] border border-[#D0DEC4]">
                      {t("irrigation.recommended", "Recommended")}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2 mt-4 text-xs">
                  <div className="rounded-xl border border-border/60 bg-muted/20 p-2">
                    <span className="text-[0.65rem] text-muted-foreground block">{t("irrigation.waterVolume", "Water Volume")}</span>
                    <span className="font-mono font-bold text-[#173D2B]">
                      {opt.water_liters_per_ha.toLocaleString()} L/ha
                    </span>
                  </div>

                  <div className="rounded-xl border border-border/60 bg-muted/20 p-2">
                    <span className="text-[0.65rem] text-muted-foreground block">{t("irrigation.projectedMoisture", "Projected Moisture")}</span>
                    <span className="font-mono font-bold text-foreground">
                      {opt.projected_moisture}%
                    </span>
                  </div>

                  <div className="rounded-xl border border-border/60 bg-muted/20 p-2">
                    <span className="text-[0.65rem] text-muted-foreground block">{t("irrigation.cost", "Pumping Cost")}</span>
                    <span className="font-mono font-bold text-foreground">
                      ₹{opt.cost_inr}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground mt-3">
                  <strong>{t("irrigation.impact", "Expected Impact:")}</strong> {opt.yield_impact}
                </p>
              </div>

              {/* Apply Action Button */}
              <div className="mt-5 pt-3 border-t border-border/60 flex justify-end">
                <button
                  onClick={() => handleApply(opt.option_id)}
                  disabled={applying === opt.option_id}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    opt.recommended
                      ? "bg-[#173D2B] hover:bg-[#102F22] text-[#FFFEFA] shadow-xs"
                      : "border border-border bg-muted/60 hover:bg-muted text-foreground"
                  }`}
                >
                  <Droplets className="size-3.5" />
                  <span>
                    {applying === opt.option_id ? t("irrigation.applyingToTwin", "Applying to Twin...") : t("irrigation.simulateApply", "Simulate / Apply")}
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
