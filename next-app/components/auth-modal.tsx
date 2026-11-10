"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Lock,
  Mail,
  User,
  Phone,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  X,
  KeyRound,
  Shield,
  Briefcase,
} from "lucide-react";
import { loginUser, registerUser, AuthLoginResponse } from "@/lib/api";
import { useTranslation } from "@/lib/i18n";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (authData: AuthLoginResponse) => void;
}

export function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
  const { t } = useTranslation();
  const [activeMode, setActiveMode] = useState<"login" | "register">("login");

  // Form states
  const [email, setEmail] = useState<string>("farmer@agritwin.ai");
  const [password, setPassword] = useState<string>("AgriTwin@2026");
  const [fullName, setFullName] = useState<string>("");
  const [mobile, setMobile] = useState<string>("");
  const [role, setRole] = useState<string>("Farmer");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      if (activeMode === "login") {
        const res = await loginUser(email, password);
        localStorage.setItem("agritwin_token", res.access_token);
        localStorage.setItem("agritwin_user", JSON.stringify(res));
        onLoginSuccess(res);
        onClose();
      } else {
        const res = await registerUser({
          email,
          password,
          full_name: fullName,
          mobile,
          role,
        });
        localStorage.setItem("agritwin_token", res.access_token);
        localStorage.setItem("agritwin_user", JSON.stringify(res));
        onLoginSuccess(res);
        onClose();
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Authentication failed. Please verify credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  // Demo Role Quick-Logins for Judges
  const quickLoginAs = (demoEmail: string, demoRole: string) => {
    setEmail(demoEmail);
    setPassword("AgriTwin@2026");
    setRole(demoRole);
    setActiveMode("login");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-md rounded-3xl border border-[#E5E1D6] bg-[#FFFEFA] p-6 shadow-2xl text-[#20352A]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-[#68756A] hover:bg-[#F8F4EB] hover:text-[#173D2B] transition-all cursor-pointer"
        >
          <X className="size-4" />
        </button>

        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-[#E4EBDD] text-[#173D2B] border border-[#C9D9BE]">
            <ShieldCheck className="size-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-[#173D2B]">
              {activeMode === "login" ? "AgriTwin AI Access Portal" : "Create Operator Account"}
            </h3>
            <p className="text-xs text-[#68756A]">
              PBKDF2-HMAC-SHA256 & Cryptographic JWT Token Protocol
            </p>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="flex rounded-xl bg-[#F8F4EB] p-1 mb-5 border border-[#E5E1D6]">
          <button
            onClick={() => {
              setActiveMode("login");
              setErrorMessage(null);
            }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeMode === "login"
                ? "bg-[#173D2B] text-white shadow-xs"
                : "text-[#68756A] hover:text-[#173D2B]"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setActiveMode("register");
              setErrorMessage(null);
            }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeMode === "register"
                ? "bg-[#173D2B] text-white shadow-xs"
                : "text-[#68756A] hover:text-[#173D2B]"
            }`}
          >
            Register Account
          </button>
        </div>

        {errorMessage && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-xs text-rose-700 border border-rose-200">
            <AlertCircle className="size-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {activeMode === "register" && (
            <>
              <div>
                <label className="font-semibold text-[#68756A] block mb-1">Full Name</label>
                <div className="relative">
                  <User className="size-4 text-[#68756A] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ramesh Patel"
                    className="w-full rounded-xl border border-[#E5E1D6] bg-[#F8F4EB] pl-9 pr-3 py-2 text-[#20352A] font-medium outline-none focus:ring-1 focus:ring-[#173D2B]"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#68756A] block mb-1">Mobile Contact</label>
                <div className="relative">
                  <Phone className="size-4 text-[#68756A] absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    required
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full rounded-xl border border-[#E5E1D6] bg-[#F8F4EB] pl-9 pr-3 py-2 text-[#20352A] font-medium outline-none focus:ring-1 focus:ring-[#173D2B]"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#68756A] block mb-1">Operational Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full rounded-xl border border-[#E5E1D6] bg-[#F8F4EB] px-3 py-2 text-[#20352A] font-medium outline-none focus:ring-1 focus:ring-[#173D2B]"
                >
                  <option value="Farmer">Farmer (Field Operations)</option>
                  <option value="Agronomist">Agronomist (Crop Health Specialist)</option>
                  <option value="Farm Admin">Farm Administrator (Enterprise Ops)</option>
                  <option value="Platform Admin">Platform Administrator (Global Control)</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="font-semibold text-[#68756A] block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="size-4 text-[#68756A] absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@agritwin.ai"
                className="w-full rounded-xl border border-[#E5E1D6] bg-[#F8F4EB] pl-9 pr-3 py-2 text-[#20352A] font-medium outline-none focus:ring-1 focus:ring-[#173D2B]"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-[#68756A] block mb-1">Password</label>
            <div className="relative">
              <Lock className="size-4 text-[#68756A] absolute left-3 top-2.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-xl border border-[#E5E1D6] bg-[#F8F4EB] pl-9 pr-3 py-2 text-[#20352A] font-medium outline-none focus:ring-1 focus:ring-[#173D2B]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-2.5 px-4 bg-[#173D2B] hover:bg-[#102F22] text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>{isLoading ? "Authenticating..." : activeMode === "login" ? "Secure Sign In" : "Register & Authenticate"}</span>
            <ArrowRight className="size-4" />
          </button>
        </form>

        {/* Judge Demo Quick Logins */}
        <div className="mt-5 pt-4 border-t border-[#E5E1D6]">
          <div className="flex items-center gap-1 text-[0.65rem] font-bold text-[#173D2B] uppercase mb-2">
            <KeyRound className="size-3 text-[#173D2B]" />
            <span>Judge 1-Click Role Login</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => quickLoginAs("farmer@agritwin.ai", "Farmer")}
              className="px-2.5 py-1.5 rounded-xl bg-[#F8F4EB] hover:bg-[#E4EBDD] text-[0.7rem] font-semibold text-left transition-all border border-[#E5E1D6] hover:border-[#173D2B] cursor-pointer"
            >
              <span className="font-bold block text-[#173D2B]">Farmer</span>
              <span className="text-[0.6rem] text-[#68756A] font-mono">farmer@agritwin.ai</span>
            </button>
            <button
              onClick={() => quickLoginAs("agronomist@agritwin.ai", "Agronomist")}
              className="px-2.5 py-1.5 rounded-xl bg-[#F8F4EB] hover:bg-[#E4EBDD] text-[0.7rem] font-semibold text-left transition-all border border-[#E5E1D6] hover:border-[#173D2B] cursor-pointer"
            >
              <span className="font-bold block text-[#173D2B]">Agronomist</span>
              <span className="text-[0.6rem] text-[#68756A] font-mono">agronomist@agritwin.ai</span>
            </button>
            <button
              onClick={() => quickLoginAs("admin@agritwin.ai", "Farm Admin")}
              className="px-2.5 py-1.5 rounded-xl bg-[#F8F4EB] hover:bg-[#E4EBDD] text-[0.7rem] font-semibold text-left transition-all border border-[#E5E1D6] hover:border-[#173D2B] cursor-pointer"
            >
              <span className="font-bold block text-[#173D2B]">Farm Admin</span>
              <span className="text-[0.6rem] text-[#68756A] font-mono">admin@agritwin.ai</span>
            </button>
            <button
              onClick={() => quickLoginAs("platform@agritwin.ai", "Platform Admin")}
              className="px-2.5 py-1.5 rounded-xl bg-[#F8F4EB] hover:bg-[#E4EBDD] text-[0.7rem] font-semibold text-left transition-all border border-[#E5E1D6] hover:border-[#173D2B] cursor-pointer"
            >
              <span className="font-bold block text-[#173D2B]">Platform Admin</span>
              <span className="text-[0.6rem] text-[#68756A] font-mono">platform@agritwin.ai</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

