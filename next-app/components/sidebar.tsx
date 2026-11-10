"use client";

import React, { useState } from "react";
import {
  LayoutDashboard,
  MapPin,
  Box,
  Sparkles,
  Droplets,
  Layers,
  Store,
  Mic,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sprout,
  SunMedium,
  Shield,
  Activity,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n";

export type NavTab =
  | "overview"
  | "fields"
  | "twin3d"
  | "health"
  | "market"
  | "climate"
  | "soil"
  | "irrigation"
  | "voice-agronomist"
  | "yield"
  | "cropPlanner"
  | "soilNutrition"
  | "advisor"
  | "alerts"
  | "security"
  | "research"
  | "settings";

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  alertCount: number;
}

export function Sidebar({
  activeTab,
  onSelectTab,
  alertCount,
}: SidebarProps) {
  const { t } = useTranslation();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  // Grouped items matching the design system specifications
  const navSections = [
    {
      heading: "Overview & Land",
      items: [
        { id: "overview" as NavTab, label: "Dashboard", icon: LayoutDashboard },
        { id: "fields" as NavTab, label: "My Farm", icon: MapPin },
        { id: "twin3d" as NavTab, label: "Digital Twin – 3D Land", icon: Box },
      ],
    },
    {
      heading: "Agronomic AI",
      items: [
        { id: "health" as NavTab, label: "AI Crop Health", icon: Sparkles },
        { id: "market" as NavTab, label: "Market Intelligence & Prices", icon: Store },
        { id: "climate" as NavTab, label: "Weather Intelligence", icon: SunMedium },
        { id: "soil" as NavTab, label: "Soil Analysis", icon: Layers },
        { id: "irrigation" as NavTab, label: "Irrigation Management", icon: Droplets },
      ],
    },
    {
      heading: "Intelligence & Tools",
      items: [
        { id: "voice-agronomist" as NavTab, label: "AI Farmer Assistant", icon: Mic },
        { id: "yield" as NavTab, label: "Reports & Analytics", icon: FileText },
        { id: "settings" as NavTab, label: "Settings", icon: Settings },
      ],
    },
  ];

  return (
    <aside
      className={`shrink-0 border-r border-[#E5E1D6] bg-[#F8F4EB] text-[#20352A] flex flex-col justify-between p-3.5 transition-all duration-300 hidden md:flex z-30 select-none ${
        isCollapsed ? "w-20" : "w-68"
      }`}
    >
      <div>
        {/* Brand Header */}
        <div className="flex items-center justify-between px-1.5 py-2 mb-5">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-[#173D2B] text-[#A3E635] shadow-sm">
              <Sprout className="size-5 text-[#A3E635]" />
            </div>
            {!isCollapsed && (
              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="text-base font-black tracking-tight text-[#173D2B]">
                    AgriTwin AI
                  </h2>
                  <span className="size-2 rounded-full bg-[#31D17C] animate-pulse" />
                </div>
                <p className="text-[0.62rem] text-[#68756A] font-bold uppercase tracking-wider">
                  {t("Agricultural Intelligence")}
                </p>
              </div>
            )}
          </div>

          {/* Collapse/Expand Toggle Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            className="flex size-7 items-center justify-center rounded-xl bg-white hover:bg-[#F2EDE2] text-[#68756A] hover:text-[#173D2B] border border-[#E5E1D6] transition-colors cursor-pointer shadow-2xs"
          >
            {isCollapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="space-y-4">
          {navSections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              {!isCollapsed && (
                <div className="px-2.5 py-1 text-[0.65rem] font-black uppercase tracking-wider text-[#68756A]">
                  {t(section.heading)}
                </div>
              )}
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectTab(item.id)}
                    title={isCollapsed ? t(item.label) : undefined}
                    className={`w-full flex items-center justify-between px-3 py-2.5 text-xs rounded-2xl font-bold transition-all cursor-pointer relative group ${
                      isActive
                        ? "bg-[#E4EBDD] text-[#173D2B] border border-[#A9B99B]/60 shadow-xs"
                        : "text-[#68756A] hover:bg-[#F2EDE2] hover:text-[#173D2B]"
                    }`}
                  >
                    <div className={`flex items-center gap-3 ${isCollapsed ? "mx-auto" : ""}`}>
                      <Icon
                        className={`size-4.5 shrink-0 transition-colors ${
                          isActive ? "text-[#173D2B]" : "text-[#68756A] group-hover:text-[#173D2B]"
                        }`}
                      />
                      {!isCollapsed && (
                        <span className="truncate">{t(item.label)}</span>
                      )}
                    </div>

                    {!isCollapsed && item.id === "health" && alertCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[0.65rem] font-black bg-[#173D2B] text-white">
                        {alertCount}
                      </span>
                    )}

                    {/* Active Left Indicator Pip */}
                    {isActive && (
                      <span className="absolute left-1 top-2.5 bottom-2.5 w-1 rounded-full bg-[#173D2B]" />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Footer System Status */}
      <div className="pt-3 border-t border-[#E5E1D6] text-[0.7rem] text-[#68756A]">
        {!isCollapsed ? (
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-[#173D2B] animate-pulse" />
              <span className="font-bold text-[#173D2B]">Twin Telemetry</span>
            </div>
            <span className="font-mono text-[#173D2B] text-[0.65rem] font-black bg-[#E4EBDD] px-2 py-0.5 rounded-md border border-[#A9B99B]/40">
              ONLINE
            </span>
          </div>
        ) : (
          <div className="flex justify-center">
            <span className="size-2 rounded-full bg-[#173D2B]" />
          </div>
        )}
      </div>
    </aside>
  );
}
