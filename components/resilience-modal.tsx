"use client";

import React, { useEffect, useState } from "react";
import { X, ShieldCheck, AlertTriangle, CheckCircle, FileText } from "lucide-react";
import { ResilienceAuditReport, fetchResilienceAudit } from "@/lib/api";

interface ResilienceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ResilienceModal({ isOpen, onClose }: ResilienceModalProps) {
  const [report, setReport] = useState<ResilienceAuditReport | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchResilienceAudit().then(setReport);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl border border-[#E5E1D6] bg-[#FFFEFA] p-6 shadow-2xl text-[#20352A] animate-in fade-in-50 zoom-in-95">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#E5E1D6]">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-[#E4EBDD] text-[#173D2B] border border-[#C9D9BE]">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-[#173D2B]">
                Farm Climate Resilience Audit Scorecard
              </h3>
              <p className="text-xs text-[#68756A]">
                {report?.farm_name || "AgriTwin Agro-Ecosystem"} • Assessment: {report?.assessment_date || "2026-11-05"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-xl border border-[#E5E1D6] bg-[#F8F4EB] hover:bg-[#E4EBDD] text-[#68756A] hover:text-[#173D2B] transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {report && (
          <div className="mt-5 space-y-5">
            {/* KPI Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-2xl border border-[#C9D9BE] bg-[#E4EBDD] p-4 text-center">
                <span className="text-xs font-bold text-[#173D2B] block">Overall Resilience Index</span>
                <span className="text-3xl font-black font-mono text-[#173D2B] mt-1 block">
                  {report.overall_resilience_index}/100
                </span>
                <span className="text-[0.65rem] text-[#173D2B] font-bold mt-1 block">
                  Grade A- • Resilient
                </span>
              </div>

              <div className="rounded-2xl border border-[#E5E1D6] bg-[#F8F4EB] p-4 text-center">
                <span className="text-xs font-semibold text-[#68756A] block">High Risk Zones</span>
                <span className="text-3xl font-black font-mono text-[#20352A] mt-1 block">
                  {report.high_risk_zones_count}
                </span>
                <span className="text-[0.65rem] text-[#68756A] mt-1 block">
                  Requires Adaptive Protocols
                </span>
              </div>

              <div className="rounded-2xl border border-[#E5E1D6] bg-[#F8F4EB] p-4 text-center">
                <span className="text-xs font-semibold text-[#68756A] block">Soil Carbon Buffer</span>
                <span className="text-lg font-black text-[#173D2B] mt-2 block">
                  High Retention
                </span>
                <span className="text-[0.65rem] text-[#68756A] mt-1 block">
                  3.6% Avg Organic Matter
                </span>
              </div>
            </div>

            {/* Vulnerability Dimensions */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-[#173D2B] uppercase tracking-wider text-[0.7rem]">
                Climate Vulnerability Dimensions:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="rounded-xl border border-[#E5E1D6] bg-[#FFFEFA] p-3 shadow-2xs">
                  <div className="flex items-center gap-2 font-bold text-[#173D2B] mb-1">
                    <AlertTriangle className="size-3.5 text-amber-600" />
                    <span>Water Stress Exposure</span>
                  </div>
                  <p className="text-[#68756A] text-[0.75rem]">
                    {report.water_stress_vulnerability}
                  </p>
                </div>

                <div className="rounded-xl border border-[#E5E1D6] bg-[#FFFEFA] p-3 shadow-2xs">
                  <div className="flex items-center gap-2 font-bold text-[#173D2B] mb-1">
                    <CheckCircle className="size-3.5 text-[#173D2B]" />
                    <span>Heatwave Buffering Capacity</span>
                  </div>
                  <p className="text-[#68756A] text-[0.75rem]">
                    {report.heatwave_readiness}
                  </p>
                </div>
              </div>
            </div>

            {/* Key Agronomic Recommendations */}
            <div className="rounded-xl border border-[#E5E1D6] bg-[#F8F4EB] p-4 text-xs">
              <h4 className="font-bold text-[#173D2B] uppercase tracking-wider text-[0.7rem] mb-2 flex items-center gap-1.5">
                <FileText className="size-3.5 text-[#173D2B]" />
                <span>Priority Adaptive Interventions:</span>
              </h4>
              <ul className="space-y-1.5 text-[#20352A]">
                {report.key_recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#173D2B] font-bold">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Zone breakdown table */}
            <div>
              <h4 className="font-bold text-[#173D2B] uppercase tracking-wider text-[0.7rem] mb-2">
                Zone Telemetry Breakdown
              </h4>
              <div className="overflow-x-auto rounded-xl border border-[#E5E1D6]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8F4EB] text-[#68756A] font-semibold border-b border-[#E5E1D6]">
                    <tr>
                      <th className="p-2.5">Zone Name</th>
                      <th className="p-2.5">Crop</th>
                      <th className="p-2.5">Resilience</th>
                      <th className="p-2.5">Risk Level</th>
                      <th className="p-2.5">CWSI Stress</th>
                      <th className="p-2.5">Root Moisture</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E1D6]">
                    {report.zone_summaries.map((z) => (
                      <tr key={z.plot_id} className="hover:bg-[#F8F4EB]/50">
                        <td className="p-2.5 font-bold text-[#173D2B]">{z.name}</td>
                        <td className="p-2.5 text-[#68756A]">{z.crop}</td>
                        <td className="p-2.5 font-mono font-bold text-[#173D2B]">{z.resilience_score}/100</td>
                        <td className="p-2.5">
                          <span
                            className={`rounded-full px-2 py-0.5 text-[0.65rem] font-bold ${
                              z.risk_level === "Low"
                                ? "bg-[#E4EBDD] text-[#173D2B] border border-[#C9D9BE]"
                                : z.risk_level === "Moderate"
                                ? "bg-amber-100 text-amber-800 border border-amber-200"
                                : "bg-rose-100 text-rose-700 border border-rose-200"
                            }`}
                          >
                            {z.risk_level}
                          </span>
                        </td>
                        <td className="p-2.5 font-mono text-[#68756A]">{z.cwsi}</td>
                        <td className="p-2.5 font-mono font-bold text-[#173D2B]">{z.root_moisture}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Footer actions */}
        <div className="mt-6 pt-4 border-t border-[#E5E1D6] flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-xl border border-[#E5E1D6] bg-[#F8F4EB] hover:bg-[#E4EBDD] px-4 py-2 text-xs font-bold text-[#173D2B] transition-colors cursor-pointer"
          >
            Close Audit
          </button>
        </div>
      </div>
    </div>
  );
}
