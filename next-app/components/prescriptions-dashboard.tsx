"use client";

import React, { useState, useEffect } from "react";
import {
  Droplets,
  Sprout,
  Sparkles,
  CheckCircle2,
  Zap,
  Leaf,
} from "lucide-react";
import { PrescriptionPlan, fetchPrescriptions } from "@/lib/api";

interface PrescriptionsDashboardProps {
  selectedPlotId: string;
}

export function PrescriptionsDashboard({ selectedPlotId }: PrescriptionsDashboardProps) {
  const [plans, setPlans] = useState<PrescriptionPlan[]>([]);
  const [appliedActions, setAppliedActions] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchPrescriptions(selectedPlotId).then(setPlans);
  }, [selectedPlotId]);

  const toggleApply = (key: string) => {
    setAppliedActions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const plan = plans.find((p) => p.plot_id === selectedPlotId) || plans[0];

  if (!plan) return null;

  return (
    <div className="rounded-2xl border border-[#E5E1D6] bg-[#FFFEFA] p-5 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E5E1D6]">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-2 rounded-full bg-[#173D2B] animate-pulse" />
            <h2 className="text-sm font-black tracking-tight text-[#173D2B] uppercase">
              Adaptive Resource & Fertigation Prescriptions
            </h2>
          </div>
          <p className="text-xs text-[#68756A] mt-0.5">
            Automated precision dosing for {plan.plot_name} • Dynamic Root Zone Replenishment
          </p>
        </div>

        {/* Water & Carbon Savings KPI */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-[#E5E1D6] bg-[#F8F4EB] px-3 py-1.5 text-xs shadow-2xs">
            <Droplets className="size-4 text-[#173D2B]" />
            <div>
              <span className="text-[0.65rem] text-[#68756A] block">Water Saved</span>
              <span className="font-mono font-bold text-[#173D2B]">
                +{plan.water_savings_estimated_percent}%
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-[#E5E1D6] bg-[#F8F4EB] px-3 py-1.5 text-xs shadow-2xs">
            <Leaf className="size-4 text-[#173D2B]" />
            <div>
              <span className="text-[0.65rem] text-[#68756A] block">Carbon Offset</span>
              <span className="font-mono font-bold text-[#173D2B]">
                {plan.carbon_offset_kg} kg CO₂e
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Moisture Root Gap indicator */}
      <div className="mt-4 rounded-xl border border-[#E5E1D6] bg-[#F8F4EB] p-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-lg bg-[#E4EBDD] text-[#173D2B] border border-[#C9D9BE]">
            <Zap className="size-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-[#173D2B]">
              Root Zone Moisture Optimization
            </span>
            <div className="flex items-center gap-2 text-xs text-[#68756A] mt-0.5">
              <span>Current: <strong className="text-[#20352A]">{plan.current_moisture_root_zone}%</strong></span>
              <span>→</span>
              <span>Target: <strong className="text-[#173D2B]">{plan.target_moisture_root_zone}%</strong></span>
            </div>
          </div>
        </div>

        <div className="text-xs text-[#68756A] font-mono font-bold">
          Last Synced: {plan.generated_at}
        </div>
      </div>

      {/* Prescriptions List */}
      <div className="mt-4 space-y-3">
        {plan.actions.map((action, idx) => {
          const actionKey = `${plan.plot_id}-${idx}`;
          const isApplied = appliedActions[actionKey];

          return (
            <div
              key={idx}
              className={`rounded-xl border p-4 transition-all ${
                isApplied
                  ? "border-[#173D2B] bg-[#E4EBDD]/60 shadow-xs"
                  : "border-[#E5E1D6] bg-[#FFFEFA] hover:border-[#173D2B]/50"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className="mt-0.5 flex size-8 items-center justify-center rounded-lg bg-[#E4EBDD] text-[#173D2B] border border-[#C9D9BE]"
                  >
                    {action.action_type === "Irrigation" ? (
                      <Droplets className="size-4" />
                    ) : action.action_type === "Fertigation" ? (
                      <Sprout className="size-4" />
                    ) : (
                      <Sparkles className="size-4" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-[#173D2B]">{action.title}</h4>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[0.65rem] font-bold ${
                          action.urgency === "Immediate"
                            ? "bg-rose-100 text-rose-700 border border-rose-200"
                            : action.urgency === "Within 24 Hours"
                            ? "bg-amber-100 text-amber-800 border border-amber-200"
                            : "bg-[#E4EBDD] text-[#173D2B] border border-[#C9D9BE]"
                        }`}
                      >
                        {action.urgency}
                      </span>
                    </div>
                    <p className="text-xs text-[#68756A] mt-1 max-w-2xl">
                      {action.details}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs">
                      {action.water_volume_liters_per_ha && (
                        <span className="font-mono text-[#173D2B] font-bold">
                          Vol: {action.water_volume_liters_per_ha.toLocaleString()} L/ha
                        </span>
                      )}
                      {action.npk_ratio && (
                        <span className="font-mono text-[#173D2B] font-bold">
                          NPK: {action.npk_ratio}
                        </span>
                      )}
                      <span className="text-[#68756A]">
                        Yield Benefit: <strong className="text-[#173D2B]">{action.efficiency_gain}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Apply Button */}
                <button
                  onClick={() => toggleApply(actionKey)}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
                    isApplied
                      ? "bg-[#173D2B] text-white shadow-xs"
                      : "border border-[#C9D9BE] bg-[#E4EBDD] hover:bg-[#D5E2CC] text-[#173D2B]"
                  }`}
                >
                  <CheckCircle2 className="size-3.5" />
                  <span>{isApplied ? "Prescription Enacted" : "Simulate / Apply"}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
