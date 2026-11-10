"use client";

import React, { useState, useEffect } from "react";
import { AlertTriangle, CheckCircle2, Clock, Check } from "lucide-react";
import { AlertItem, fetchAlerts, acknowledgeAlert } from "@/lib/api";
import { useTranslation } from "@/lib/i18n";

export function AlertsTab() {
  const { t } = useTranslation();
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  useEffect(() => {
    let active = true;
    fetchAlerts()
      .then((data) => {
        if (active) setAlerts(data);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const handleAck = async (id: number) => {
    await acknowledgeAlert(id);
    const data = await fetchAlerts();
    setAlerts(data);
  };

  const unreadAlerts = alerts.filter((a) => !a.is_read);

  return (
    <div className="space-y-6 animate-in fade-in-50">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E5E1D6]">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-2 rounded-full bg-rose-500 animate-ping" />
            <h2 className="text-xl font-black text-[#173D2B]">
              {t("alerts.title")}
            </h2>
          </div>
          <p className="text-xs text-[#68756A] mt-0.5">
            {t("alerts.subtitle")}
          </p>
        </div>

        <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-700 border border-rose-200">
          {unreadAlerts.length} {t("alerts.unresolved")}
        </span>
      </div>

      {/* Alerts list */}
      <div className="space-y-4">
        {alerts.length === 0 ? (
          <div className="rounded-2xl border border-[#E5E1D6] bg-[#FFFEFA] p-8 text-center text-xs text-[#68756A] shadow-xs">
            <CheckCircle2 className="size-8 mx-auto text-[#173D2B] mb-2" />
            <p>{t("alerts.allClear")}</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`rounded-2xl border p-5 transition-all shadow-xs ${
                alert.is_read
                  ? "border-[#E5E1D6] bg-[#F8F4EB]/60 opacity-75"
                  : alert.severity === "Critical"
                  ? "border-rose-300 bg-rose-50/50 shadow-md ring-1 ring-rose-200"
                  : alert.severity === "High"
                  ? "border-amber-300 bg-amber-50/50 shadow-sm"
                  : "border-[#E5E1D6] bg-[#FFFEFA]"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl ${
                      alert.severity === "Critical"
                        ? "bg-rose-600 text-white"
                        : alert.severity === "High"
                        ? "bg-amber-600 text-white"
                        : "bg-[#173D2B] text-white"
                    }`}
                  >
                    <AlertTriangle className="size-4" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-[#173D2B]">{alert.title}</h3>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[0.65rem] font-bold ${
                          alert.severity === "Critical"
                            ? "bg-rose-100 text-rose-700 border border-rose-200"
                            : alert.severity === "High"
                            ? "bg-amber-100 text-amber-800 border border-amber-200"
                            : "bg-[#E4EBDD] text-[#173D2B] border border-[#C9D9BE]"
                        }`}
                      >
                        {alert.severity} Priority
                      </span>
                    </div>

                    <div className="mt-2 space-y-1.5 text-xs">
                      <p>
                        <strong className="text-[#20352A]">Condition Detected:</strong>{" "}
                        <span className="text-[#68756A]">{alert.condition}</span>
                      </p>
                      <p>
                        <strong className="text-[#20352A]">Potential Impact:</strong>{" "}
                        <span className="text-rose-700 font-semibold">
                          {alert.potential_impact}
                        </span>
                      </p>
                      <p className="rounded-xl bg-[#F8F4EB] p-3 border border-[#E5E1D6]">
                        <strong className="text-[#173D2B]">
                          Recommended Action:
                        </strong>{" "}
                        <span className="text-[#20352A]">{alert.preventive_action}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Acknowledge Button */}
                <div className="flex flex-col items-end gap-2">
                  <span className="text-[0.65rem] text-[#68756A] font-mono flex items-center gap-1">
                    <Clock className="size-3" />
                    {new Date(alert.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>

                  {!alert.is_read ? (
                    <button
                      onClick={() => handleAck(alert.id)}
                      className="flex items-center gap-1.5 rounded-xl border border-[#C9D9BE] bg-[#E4EBDD] hover:bg-[#D5E2CC] text-[#173D2B] text-xs font-bold px-3 py-1.5 transition-colors cursor-pointer shadow-2xs"
                    >
                      <Check className="size-3.5 text-[#173D2B]" />
                      <span>Acknowledge</span>
                    </button>
                  ) : (
                    <span className="text-[0.65rem] font-bold text-[#173D2B] flex items-center gap-1">
                      <CheckCircle2 className="size-3 text-[#173D2B]" /> Resolved
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
