"use client";

import React from "react";
import { Download, Globe, User, Database, CheckCircle2 } from "lucide-react";
import { FieldItem, getExportCSVUrl } from "@/lib/api";
import { useTranslation, SUPPORTED_LANGUAGES, Language } from "@/lib/i18n";

interface SettingsTabProps {
  selectedField: FieldItem;
}

export function SettingsTab({ selectedField }: SettingsTabProps) {
  const { t, language, setLanguage } = useTranslation();
  const exportUrl = getExportCSVUrl(selectedField.id);

  return (
    <div className="space-y-6 animate-in fade-in-50">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h2 className="text-base font-bold text-foreground">
            {t("settings.title")}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t("settings.subtitle")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Multilingual 5-Language Selection Grid */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-foreground mb-2 flex items-center gap-2">
            <Globe className="size-4 text-emerald-500" /> {t("settings.language")}
          </h3>
          <p className="text-xs text-muted-foreground mb-4">
            Select your preferred regional language. All dashboards, 3D controls, and agronomic reports translate instantly and persist across sessions.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = language === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code as Language)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? "border-[#173D2B] bg-[#E4EBDD] text-[#173D2B] font-bold shadow-xs ring-1 ring-[#173D2B]/30"
                      : "border-border bg-muted/20 text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  }`}
                >
                  <span className="text-xs block font-bold">{lang.nativeName}</span>
                  <span className="text-[0.65rem] opacity-75 block">{lang.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Data Export */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-foreground mb-2 flex items-center gap-2">
            <Download className="size-4 text-blue-500" /> {t("settings.exportData")}
          </h3>
          <p className="text-xs text-muted-foreground mb-4">
            Download 14-day persistent sensor telemetry (moisture, temperature, rainfall, VPD, stress) for {selectedField.name} in standard RFC 4180 CSV format.
          </p>

          <a
            href={exportUrl}
            download
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors shadow-xs cursor-pointer"
          >
            <Download className="size-4" />
            <span>{t("settings.exportData")}</span>
          </a>
        </div>

        {/* User Authentication Status */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3 flex items-center gap-2">
            <User className="size-4 text-purple-500" /> {t("settings.profile")}
          </h3>
          <div className="rounded-xl border border-border/60 bg-muted/20 p-3 text-xs space-y-1">
            <p>
              <strong className="text-foreground">Farmer Name:</strong> Ramesh Gowda (Demo Farm Manager)
            </p>
            <p>
              <strong className="text-foreground">Organization:</strong> Mandya Precision Growers FPO
            </p>
            <p>
              <strong className="text-foreground">Zone:</strong> Kaveri Basin Agro-Ecological Region
            </p>
            <p>
              <strong className="text-foreground">Active Field:</strong> {selectedField.name} ({selectedField.crop_type})
            </p>
          </div>
        </div>

        {/* Persistent Database Health */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3 flex items-center gap-2">
            <Database className="size-4 text-emerald-500" /> {t("settings.persistence")}
          </h3>
          <div className="rounded-xl border border-border/60 bg-muted/20 p-3 text-xs space-y-1">
            <p>
              <strong className="text-foreground">Engine:</strong> SQLAlchemy ORM + SQLite
            </p>
            <p>
              <strong className="text-foreground">Storage File:</strong> <code>backend/agritwin.db</code>
            </p>
            <p className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold mt-2">
              <CheckCircle2 className="size-4" /> Database Connected & Synchronized
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
