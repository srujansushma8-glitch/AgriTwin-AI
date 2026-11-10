"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Sidebar, NavTab } from "@/components/sidebar";
import { OverviewTab } from "@/components/tabs/overview-tab";
import { FieldsTab } from "@/components/tabs/fields-tab";
import { ClimateTab } from "@/components/tabs/climate-tab";
import { CropHealthTab } from "@/components/tabs/crop-health-tab";
import { IrrigationTab } from "@/components/tabs/irrigation-tab";
import { AlertsTab } from "@/components/tabs/alerts-tab";
import { SoilTab } from "@/components/tabs/soil-tab";
import { EconomicsTab } from "@/components/tabs/economics-tab";
import { ResearchTab } from "@/components/tabs/research-tab";
import { SettingsTab } from "@/components/tabs/settings-tab";
import { SecurityTab } from "@/components/tabs/security-tab";
import { CropPlannerTab } from "@/components/tabs/crop-planner-tab";
import { MarketTab } from "@/components/tabs/market-tab";
import { SoilNutritionTab } from "@/components/tabs/soil-nutrition-tab";
import { VoiceAgronomistTab } from "@/components/tabs/voice-agronomist-tab";
import { FloatingVoiceAssistant } from "@/components/floating-voice-assistant";
import { Interactive3DTwin } from "@/components/interactive-3d-twin";
import { CopilotChat } from "@/components/copilot-chat";
import { AuthModal } from "@/components/auth-modal";
import { AuthPortal } from "@/components/auth-portal";
import { LiveDemoBanner } from "@/components/live-demo-banner";
import {
  FieldItem,
  DashboardOverview,
  Twin3DData,
  AlertItem,
  FALLBACK_FIELD,
  fetchFields,
  fetchDashboardOverview,
  fetchTwin3DData,
  fetchAlerts,
  updateField,
  AuthLoginResponse,
} from "@/lib/api";
import { SupportedCrop } from "@/lib/crop-engine";
import { useTheme } from "next-themes";
import {
  Sun,
  Moon,
  Sprout,
  Globe,
  Shield,
  User,
  LogOut,
  MapPin,
  Bell,
  Thermometer,
  Droplets,
  Activity,
  Layers,
} from "lucide-react";
import { useTranslation, SUPPORTED_LANGUAGES, Language, translateCrop } from "@/lib/i18n";

const getTabCategory = (tab: NavTab) => {
  switch (tab) {
    case "overview":
    case "fields":
    case "twin3d":
      return "Overview & Land";
    case "health":
    case "market":
    case "climate":
    case "soil":
    case "soilNutrition":
    case "irrigation":
    case "cropPlanner":
      return "Agronomic AI";
    default:
      return "Intelligence & Tools";
  }
};

const getTabTitle = (tab: NavTab) => {
  switch (tab) {
    case "overview":
      return "Dashboard";
    case "fields":
      return "My Farm";
    case "twin3d":
      return "Digital Twin – 3D Land";
    case "health":
      return "AI Crop Health";
    case "market":
      return "Market Intelligence & Prices";
    case "climate":
      return "Weather Intelligence";
    case "soil":
      return "Soil Analysis";
    case "soilNutrition":
      return "Soil Stoichiometry & NPK";
    case "irrigation":
      return "Irrigation Management";
    case "voice-agronomist":
      return "AI Farmer Assistant";
    case "yield":
      return "Reports & Analytics";
    case "settings":
      return "Settings";
    case "alerts":
      return "Multi-Hazard Alerts";
    case "security":
      return "Cybersecurity Center";
    case "research":
      return "Research Agronomy";
    case "cropPlanner":
      return "Crop Planning & Rotations";
    default:
      return "Dashboard";
  }
};

export default function AgriTwinPlatform() {
  const { t, language, setLanguage } = useTranslation();
  const [activeTab, setActiveTab] = useState<NavTab>("overview");
  const [fields, setFields] = useState<FieldItem[]>([FALLBACK_FIELD]);
  const [selectedFieldId, setSelectedFieldId] = useState<string>(FALLBACK_FIELD.id);
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [twinData, setTwinData] = useState<Twin3DData | null>(null);
  const [active3DLayer, setActive3DLayer] = useState<string>("health");
  const [selected3DZone, setSelected3DZone] = useState<string | null>(null);
  const [selectedCrop, setSelectedCrop] = useState<SupportedCrop>("Tomato");
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [backendOnline, setBackendOnline] = useState<boolean>(true);

  // Auth state: start with null so Login Page ALWAYS appears first!
  const [currentUser, setCurrentUser] = useState<AuthLoginResponse | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  const { resolvedTheme, setTheme } = useTheme();

  // Reset any cached session on initial entry to ensure Login Page appears first
  useEffect(() => {
    try {
      localStorage.removeItem("agritwin_token");
      localStorage.removeItem("agritwin_user");
      sessionStorage.removeItem("agritwin_token");
      sessionStorage.removeItem("agritwin_user");
    } catch {}
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem("agritwin_token");
      localStorage.removeItem("agritwin_user");
      sessionStorage.removeItem("agritwin_token");
      sessionStorage.removeItem("agritwin_user");
    } catch {}
    setCurrentUser(null);
  };

  // Load fields and overview on mount
  const refreshAllData = useCallback(async () => {
    try {
      const fieldList = await fetchFields();
      if (fieldList && fieldList.length > 0) {
        setFields(fieldList);
        setSelectedFieldId((prev) => (fieldList.some((f) => f.id === prev) ? prev : fieldList[0].id));
      }

      const ov = await fetchDashboardOverview();
      setOverview(ov);

      const alertList = await fetchAlerts();
      setAlerts(alertList);

      setBackendOnline(true);
    } catch {
      setBackendOnline(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    const run = async () => {
      try {
        const fieldList = await fetchFields();
        if (!active) return;
        if (fieldList && fieldList.length > 0) {
          setFields(fieldList);
          setSelectedFieldId((prev) => (fieldList.some((f) => f.id === prev) ? prev : fieldList[0].id));
        }
        const ov = await fetchDashboardOverview();
        if (!active) return;
        setOverview(ov);

        const alertList = await fetchAlerts();
        if (!active) return;
        setAlerts(alertList);
        setBackendOnline(true);
      } catch {
        if (active) setBackendOnline(false);
      }
    };
    run();
    return () => {
      active = false;
    };
  }, []);

  // Sync 3D twin data and dashboard overview whenever selected field changes
  useEffect(() => {
    if (selectedFieldId) {
      fetchTwin3DData(selectedFieldId)
        .then((data) => {
          setTwinData(data);
          // Set active crop according to field
          if (data && data.crop_type) {
            const normalized = data.crop_type.toLowerCase();
            if (normalized.includes("sugarcane")) setSelectedCrop("Sugarcane");
            else if (normalized.includes("paddy") || normalized.includes("rice")) setSelectedCrop("Rice / Paddy");
            else if (normalized.includes("wheat")) setSelectedCrop("Wheat");
            else if (normalized.includes("maize") || normalized.includes("corn")) setSelectedCrop("Maize");
            else if (normalized.includes("cotton")) setSelectedCrop("Cotton");
            else if (normalized.includes("groundnut") || normalized.includes("peanut")) setSelectedCrop("Groundnut");
            else if (normalized.includes("banana")) setSelectedCrop("Banana");
            else if (normalized.includes("carrot")) setSelectedCrop("Carrot");
            else if (normalized.includes("beetroot")) setSelectedCrop("Beetroot");
            else if (normalized.includes("potato")) setSelectedCrop("Potato");
            else setSelectedCrop("Tomato");
          }
        })
        .catch(() => {});

      fetchDashboardOverview(selectedFieldId)
        .then((ov) => setOverview(ov))
        .catch(() => {});
    }
  }, [selectedFieldId]);

  const handleCropChange = (cropName: string) => {
    setSelectedCrop(cropName as SupportedCrop);
    setFields((prev) =>
      prev.map((f) =>
        f.id === selectedFieldId ? { ...f, crop_type: cropName } : f
      )
    );
    if (selectedFieldId) {
      updateField(selectedFieldId, { crop_type: cropName })
        .then(() => {
          fetchDashboardOverview(selectedFieldId).then(setOverview).catch(() => {});
        })
        .catch(() => {});
    }
  };

  const selectedField = fields.find((f) => f.id === selectedFieldId) || fields[0] || FALLBACK_FIELD;
  const unreadAlertCount = alerts.filter((a) => !a.is_read).length;

  // 1. First, the Login Page appears
  if (!currentUser) {
    return (
      <AuthPortal
        onAuthenticated={(auth) => {
          setCurrentUser(auth);
          refreshAllData();
        }}
      />
    );
  }

  // 2. Then, the Main Display appears
  return (
    <div className="flex h-screen w-full bg-[#F8F4EB] text-[#20352A] overflow-hidden font-sans animate-in fade-in duration-300">
      {/* Sidebar Navigation (13 Modules) */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        alertCount={unreadAlertCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Real-time Telemetry & Guided Demo Ribbon */}
        <LiveDemoBanner
          fieldId={selectedFieldId}
          onNavigateStep={(tab) => setActiveTab(tab as NavTab)}
        />

        {/* Top Navbar */}
        <header className="h-16 shrink-0 border-b border-[#E5E1D6] bg-[#FFFEFA]/95 backdrop-blur-md px-6 flex items-center justify-between gap-4 select-none">
          {/* Left: Breadcrumbs & Field Selector */}
          <div className="flex items-center gap-3">
            {/* Breadcrumbs */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#68756A] font-medium">
              <span className="font-bold text-[#173D2B]">AgriTwin AI</span>
              <span>/</span>
              <span>{getTabCategory(activeTab)}</span>
              <span>/</span>
              <span className="font-bold text-[#173D2B]">{getTabTitle(activeTab)}</span>
            </div>

            {/* Mobile Brand */}
            <div className="flex items-center gap-2 sm:hidden">
              <div className="size-8 rounded-xl bg-[#173D2B] text-[#A3E635] flex items-center justify-center">
                <Sprout className="size-4" />
              </div>
              <span className="font-black text-sm text-[#173D2B]">AgriTwin AI</span>
            </div>

            {/* Field Selector */}
            <div className="flex items-center gap-2 rounded-2xl border border-[#E5E1D6] bg-[#F8F4EB] px-3 py-1.5 shadow-2xs">
              <MapPin className="size-3.5 text-[#173D2B]" />
              <select
                value={selectedFieldId}
                onChange={(e) => setSelectedFieldId(e.target.value)}
                className="bg-transparent text-xs font-bold text-[#173D2B] focus:outline-none cursor-pointer"
              >
                {fields.map((f) => (
                  <option key={f.id} value={f.id} className="bg-[#FFFEFA] text-[#20352A]">
                    {f.name} ({translateCrop(f.crop_type, language)})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Center Telemetry Status Chips */}
          <div className="hidden xl:flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 rounded-full border border-[#E5E1D6] bg-[#F8F4EB] px-3 py-1 text-xs">
              <span className={`size-2 rounded-full ${backendOnline ? "bg-[#173D2B] animate-pulse" : "bg-amber-500"}`} />
              <span className="text-[0.7rem] font-bold text-[#173D2B]">
                {backendOnline ? "Telemetry Live" : "Sensor Offline"}
              </span>
            </div>

            <div className="flex items-center gap-1.5 rounded-full border border-[#E5E1D6] bg-[#F8F4EB] px-3 py-1 text-xs text-[#20352A] font-semibold">
              <Thermometer className="size-3.5 text-[#C9A65B]" />
              <span className="text-[0.7rem]">{overview?.ambient_temperature || 28}°C Partly Cloudy</span>
            </div>

            <div className="flex items-center gap-1.5 rounded-full border border-[#E5E1D6] bg-[#F8F4EB] px-3 py-1 text-xs text-[#20352A] font-semibold">
              <Droplets className="size-3.5 text-[#2E7D32]" />
              <span className="text-[0.7rem]">Soil: {overview?.soil_moisture_root_zone || 68}% Optimal</span>
            </div>
          </div>

          {/* Right actions: Notifications, Language, User profile, Logout */}
          <div className="flex items-center gap-2.5">
            {/* Notification Bell */}
            <button
              onClick={() => setActiveTab("alerts")}
              title="View Alerts & Notifications"
              className="relative p-2 rounded-2xl border border-[#E5E1D6] bg-[#F8F4EB] hover:bg-[#E4EBDD] text-[#173D2B] transition-colors cursor-pointer shadow-2xs"
            >
              <Bell className="size-4" />
              {unreadAlertCount > 0 && (
                <span className="absolute -top-1 -right-1 size-4 rounded-full bg-[#173D2B] text-white text-[0.6rem] font-black flex items-center justify-center">
                  {unreadAlertCount}
                </span>
              )}
            </button>

            {/* Language Selector */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-2xl border border-[#E5E1D6] bg-[#F8F4EB] text-xs font-bold text-[#173D2B] shadow-2xs">
              <Globe className="size-3.5 text-[#173D2B] shrink-0" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="bg-transparent text-xs font-bold text-[#173D2B] focus:outline-none cursor-pointer"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code} className="bg-[#FFFEFA] text-[#20352A]">
                    {lang.nativeName} ({lang.name})
                  </option>
                ))}
              </select>
            </div>

            {/* User Profile Pill */}
            {currentUser && (
              <div className="flex items-center gap-2 rounded-2xl border border-[#E5E1D6] bg-[#F8F4EB] px-3 py-1.5 text-xs">
                <div className="size-6 rounded-full bg-[#173D2B] text-white flex items-center justify-center text-[0.7rem] font-bold">
                  {(currentUser.full_name || "R")[0]}
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-black text-[#173D2B] text-[0.72rem] leading-tight">
                    {currentUser.full_name || "Ramesh Gowda"}
                  </span>
                  <span className="text-[0.6rem] font-semibold text-[#68756A] uppercase">
                    {currentUser.role || "Farmer"}
                  </span>
                </div>
              </div>
            )}

            {/* Sign Out Button */}
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-2 rounded-2xl border border-[#E5E1D6] bg-[#F8F4EB] hover:bg-rose-50 text-[#68756A] hover:text-rose-600 transition-colors cursor-pointer shadow-2xs"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </header>

        {/* Tab Viewport */}
        <main className="flex-1 overflow-y-auto p-6 bg-[#F8F4EB]">
          <div className="max-w-6xl mx-auto pb-10">
            {activeTab === "overview" && (
              <OverviewTab
                overview={overview}
                selectedField={selectedField}
                onNavigateTab={setActiveTab}
                selectedCrop={selectedCrop}
                onSelectCrop={handleCropChange}
              />
            )}

            {activeTab === "voice-agronomist" && (
              <div className="animate-in fade-in-50">
                <VoiceAgronomistTab
                  selectedField={selectedField}
                  selectedCrop={selectedCrop}
                />
              </div>
            )}

            {activeTab === "fields" && (
              <FieldsTab
                fields={fields}
                selectedFieldId={selectedFieldId}
                onSelectField={setSelectedFieldId}
                onRefreshFields={refreshAllData}
              />
            )}

            {activeTab === "cropPlanner" && (
              <CropPlannerTab
                selectedField={selectedField}
              />
            )}

            {activeTab === "twin3d" && (
              twinData ? (
                <div className="space-y-4 animate-in fade-in-50">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="text-base font-bold text-foreground">
                        {t("twin.title")}
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        {t("twin.controls.orbitHint")}
                      </p>
                    </div>
                  </div>

                  <Interactive3DTwin
                    twinData={twinData}
                    activeLayer={active3DLayer}
                    onLayerChange={setActive3DLayer}
                    selectedZone={selected3DZone}
                    onSelectZone={setSelected3DZone}
                    selectedCrop={selectedCrop}
                    onCropChange={handleCropChange}
                    fieldLocation={{
                      state: "Karnataka",
                      district: selectedField.location.split(",")[0] || "Hassan",
                      village: selectedField.name,
                      lat: selectedField.lat || 12.524,
                      lng: selectedField.lng || 76.896,
                      elevation_m: 670,
                    }}
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-16 space-y-3 bg-[#FFFEFA] rounded-2xl border border-[#E5E1D6] shadow-sm">
                  <Sprout className="size-8 text-[#173D2B] animate-spin" />
                  <p className="text-sm font-bold text-[#173D2B]">Loading Real 3D Digital Twin...</p>
                </div>
              )
            )}

            {activeTab === "climate" && (
              <ClimateTab
                selectedField={selectedField}
              />
            )}

            {activeTab === "health" && (
              <CropHealthTab
                selectedField={selectedField}
                selectedCrop={selectedCrop}
                onCropChange={handleCropChange}
              />
            )}

            {activeTab === "irrigation" && (
              <IrrigationTab
                selectedField={selectedField}
                onRefreshData={refreshAllData}
              />
            )}

            {activeTab === "alerts" && (
              <AlertsTab />
            )}

            {activeTab === "security" && (
              <SecurityTab />
            )}

            {activeTab === "soil" && (
              <SoilTab
                selectedField={selectedField}
              />
            )}

            {activeTab === "soilNutrition" && (
              <SoilNutritionTab
                selectedField={selectedField}
              />
            )}

            {activeTab === "market" && (
              <MarketTab
                selectedField={selectedField}
                selectedCrop={selectedCrop}
                onCropChange={handleCropChange}
              />
            )}

            {activeTab === "yield" && (
              <EconomicsTab
                selectedField={selectedField}
              />
            )}

            {activeTab === "advisor" && (
              <div className="space-y-4 animate-in fade-in-50">
                <h2 className="text-base font-bold text-foreground">
                  {t("nav.advisor")}
                </h2>
                <CopilotChat selectedPlotId={selectedFieldId} />
              </div>
            )}

            {activeTab === "research" && (
              <ResearchTab
                selectedField={selectedField}
              />
            )}

            {activeTab === "settings" && (
              <SettingsTab
                selectedField={selectedField}
              />
            )}
          </div>
        </main>
      </div>

      {/* Floating Voice Assistant Dock across all application pages */}
      <FloatingVoiceAssistant activeTab={activeTab} onNavigateToTab={setActiveTab} />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(auth) => setCurrentUser(auth)}
      />
    </div>
  );
}
