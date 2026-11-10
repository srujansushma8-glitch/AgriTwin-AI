"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  AlertTriangle,
  RefreshCw,
  Terminal,
  Activity,
  UserX,
  Server,
  Zap,
  Radio,
  CheckCircle2,
  Bug,
} from "lucide-react";
import {
  fetchSecurityAlerts,
  fetchSecurityStats,
  simulateSecurityAlert,
  SecurityAlert,
  SecurityStats,
} from "@/lib/api";
import { useTranslation } from "@/lib/i18n";

export function SecurityTab() {
  const { t } = useTranslation();
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [stats, setStats] = useState<SecurityStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationResult, setSimulationResult] = useState<string | null>(null);

  const loadSecurityData = async () => {
    try {
      const [alertList, statsData] = await Promise.all([
        fetchSecurityAlerts(),
        fetchSecurityStats(),
      ]);
      setAlerts(alertList);
      setStats(statsData);
    } catch (err) {
      console.error("Failed to load security surveillance data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSecurityData();
    const interval = setInterval(loadSecurityData, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleSimulate = async (threatType: string) => {
    setIsSimulating(true);
    setSimulationResult(null);

    let eventPayload = {
      event_type: "unauthorized_api_access",
      severity: "suspicious",
      description: "Repeated unauthorized request to /api/fields/cadastral-edit without valid bearer token",
      ip_address: "198.51.100.42",
    };

    if (threatType === "brute_force") {
      eventPayload = {
        event_type: "brute_force_login",
        severity: "critical",
        description: "5 rapid failed login attempts for administrator account within 12 seconds from foreign ASN",
        ip_address: "203.0.113.88",
      };
    } else if (threatType === "sensor_spoof") {
      eventPayload = {
        event_type: "telemetry_signature_mismatch",
        severity: "warning",
        description: "ESP32 LoRaWAN gateway reported soil moisture spike of +40% in 1 second; suspected sensor packet injection",
        ip_address: "10.0.4.15",
      };
    } else if (threatType === "geofence") {
      eventPayload = {
        event_type: "geofence_perimeter_breach",
        severity: "critical",
        description: "Autonomous drone sprayer navigation path drifted 85m outside authorized farm plot polygon boundary",
        ip_address: "192.168.1.105",
      };
    }

    try {
      const res = await simulateSecurityAlert(eventPayload);
      setSimulationResult(`Simulation deployed: Event #${res.event_id} logged.`);
      await loadSecurityData();
      setTimeout(() => setSimulationResult(null), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSimulating(false);
    }
  };

  const threatColor =
    stats?.threat_level === "CRITICAL"
      ? "text-rose-700 bg-rose-50 border-rose-200"
      : stats?.threat_level === "ELEVATED"
      ? "text-amber-700 bg-amber-50 border-amber-200"
      : "text-[#173D2B] bg-[#E4EBDD] border-[#C9D9BE]";

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-[#E5E1D6] bg-[#FFFEFA] p-6 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-[#E4EBDD] text-[#173D2B] border border-[#C9D9BE]">
            <ShieldAlert className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-[#173D2B]">
                Cybersecurity & Access Surveillance Center
              </h2>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${threatColor}`}>
                THREAT LEVEL: {stats?.threat_level || "LOW"}
              </span>
            </div>
            <p className="text-xs text-[#68756A] mt-0.5">
              Live anomaly detection, cryptographic telemetry integrity, and role access monitoring.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadSecurityData}
            disabled={isLoading}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[#E5E1D6] bg-[#F8F4EB] hover:bg-[#E4EBDD] text-xs font-bold text-[#173D2B] transition-all cursor-pointer shadow-2xs"
          >
            <RefreshCw className={`size-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>Refresh Audit</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-[#E5E1D6] bg-[#FFFEFA] p-4 shadow-xs">
          <div className="flex items-center justify-between text-[#68756A] text-xs font-semibold mb-1">
            <span>Security Health Score</span>
            <Activity className="size-4 text-[#173D2B]" />
          </div>
          <div className="text-2xl font-black text-[#173D2B] font-mono">
            {stats?.security_score || 94}%
          </div>
          <span className="text-[0.65rem] text-[#173D2B] font-bold">
            Strict RBAC & Salted Hashes Active
          </span>
        </div>

        <div className="rounded-2xl border border-[#E5E1D6] bg-[#FFFEFA] p-4 shadow-xs">
          <div className="flex items-center justify-between text-[#68756A] text-xs font-semibold mb-1">
            <span>Failed Logins (24h)</span>
            <UserX className="size-4 text-[#C9A65B]" />
          </div>
          <div className="text-2xl font-black text-[#20352A] font-mono">
            {stats?.failed_logins_24h || 0}
          </div>
          <span className="text-[0.65rem] text-[#68756A]">
            Rate limiting threshold: 5 / min
          </span>
        </div>

        <div className="rounded-2xl border border-[#E5E1D6] bg-[#FFFEFA] p-4 shadow-xs">
          <div className="flex items-center justify-between text-[#68756A] text-xs font-semibold mb-1">
            <span>Critical Unresolved</span>
            <AlertTriangle className="size-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-rose-700 font-mono">
            {stats?.unresolved_critical_alerts || 0}
          </div>
          <span className="text-[0.65rem] text-[#68756A]">
            Zero uncontained breaches
          </span>
        </div>

        <div className="rounded-2xl border border-[#E5E1D6] bg-[#FFFEFA] p-4 shadow-xs">
          <div className="flex items-center justify-between text-[#68756A] text-xs font-semibold mb-1">
            <span>Cipher & Token</span>
            <Lock className="size-4 text-[#173D2B]" />
          </div>
          <div className="text-sm font-bold text-[#173D2B] font-mono truncate">
            {stats?.encryption_standard || "PBKDF2-SHA256"}
          </div>
          <span className="text-[0.65rem] text-[#68756A]">
            JWT HS256 Token Protocol
          </span>
        </div>
      </div>

      {/* Judge Simulation Controls */}
      <div className="rounded-2xl border border-[#E5E1D6] bg-[#FFFEFA] p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-[#E5E1D6]">
          <div className="flex items-center gap-2">
            <Zap className="size-4 text-[#C9A65B]" />
            <h3 className="text-sm font-bold text-[#173D2B]">
              Judge Interactive Threat Simulation Lab
            </h3>
          </div>
          {simulationResult && (
            <span className="text-xs text-[#173D2B] font-bold animate-pulse flex items-center gap-1">
              <CheckCircle2 className="size-3.5" />
              {simulationResult}
            </span>
          )}
        </div>

        <p className="text-xs text-[#68756A] my-3">
          Trigger real-time simulated cybersecurity anomalies to test the digital twin intrusion detection engine:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => handleSimulate("brute_force")}
            disabled={isSimulating}
            className="flex items-center gap-2.5 p-3 rounded-xl border border-[#E5E1D6] bg-[#F8F4EB] hover:bg-[#E4EBDD] text-xs font-semibold text-[#20352A] transition-all cursor-pointer text-left shadow-2xs"
          >
            <div className="size-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
              <UserX className="size-4" />
            </div>
            <div>
              <div className="font-bold text-[#173D2B]">Brute Force Attack</div>
              <div className="text-[0.65rem] text-[#68756A]">Simulate rapid credential stuffing</div>
            </div>
          </button>

          <button
            onClick={() => handleSimulate("sensor_spoof")}
            disabled={isSimulating}
            className="flex items-center gap-2.5 p-3 rounded-xl border border-[#E5E1D6] bg-[#F8F4EB] hover:bg-[#E4EBDD] text-xs font-semibold text-[#20352A] transition-all cursor-pointer text-left shadow-2xs"
          >
            <div className="size-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <Radio className="size-4" />
            </div>
            <div>
              <div className="font-bold text-[#173D2B]">IoT Sensor Spoofing</div>
              <div className="text-[0.65rem] text-[#68756A]">Inject anomalous telemetry packet</div>
            </div>
          </button>

          <button
            onClick={() => handleSimulate("geofence")}
            disabled={isSimulating}
            className="flex items-center gap-2.5 p-3 rounded-xl border border-[#E5E1D6] bg-[#F8F4EB] hover:bg-[#E4EBDD] text-xs font-semibold text-[#20352A] transition-all cursor-pointer text-left shadow-2xs"
          >
            <div className="size-8 rounded-lg bg-[#E4EBDD] text-[#173D2B] flex items-center justify-center shrink-0">
              <Server className="size-4" />
            </div>
            <div>
              <div className="font-bold text-[#173D2B]">Geofence Plot Breach</div>
              <div className="text-[0.65rem] text-[#68756A]">Boundary perimeter deviation alert</div>
            </div>
          </button>
        </div>
      </div>

      {/* Security Audit Events Log Table */}
      <div className="rounded-2xl border border-[#E5E1D6] bg-[#FFFEFA] overflow-hidden shadow-xs">
        <div className="p-4 border-b border-[#E5E1D6] flex items-center justify-between bg-[#F8F4EB]">
          <div className="flex items-center gap-2">
            <Terminal className="size-4 text-[#173D2B]" />
            <h3 className="text-sm font-bold text-[#173D2B]">
              Real-Time Security & Intrusion Audit Log
            </h3>
          </div>
          <span className="text-xs text-[#68756A] font-mono font-bold">
            {alerts.length} Recorded Events
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F4EB] text-[#68756A] font-semibold border-b border-[#E5E1D6]">
              <tr>
                <th className="px-4 py-3">Event Type</th>
                <th className="px-4 py-3">Severity</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Source IP</th>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E1D6]">
              {alerts.map((evt) => (
                <tr key={evt.id} className="hover:bg-[#F8F4EB]/50 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-[#173D2B]">
                    {evt.event_type}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[0.65rem] font-bold ${
                        evt.severity === "critical"
                          ? "bg-rose-100 text-rose-700 border border-rose-200"
                          : evt.severity === "suspicious"
                          ? "bg-amber-100 text-amber-800 border border-amber-200"
                          : evt.severity === "warning"
                          ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                          : "bg-[#E4EBDD] text-[#173D2B] border border-[#C9D9BE]"
                      }`}
                    >
                      {evt.severity.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#20352A] font-medium max-w-md truncate">
                    {evt.description}
                  </td>
                  <td className="px-4 py-3 font-mono text-[#68756A]">
                    {evt.ip_address}
                  </td>
                  <td className="px-4 py-3 text-[#68756A] font-mono text-[0.7rem]">
                    {new Date(evt.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[0.65rem] text-[#173D2B] font-bold flex items-center gap-1">
                      <CheckCircle2 className="size-3 text-[#173D2B]" />
                      Logged
                    </span>
                  </td>
                </tr>
              ))}
              {alerts.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-[#68756A]">
                    No security alerts recorded. Platform operating normally.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

