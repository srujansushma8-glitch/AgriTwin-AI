"use client";

import React, { useState } from "react";
import {
  Sprout,
  Shield,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  Phone,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Leaf,
  Layers,
  Cpu,
} from "lucide-react";
import {
  loginUser,
  registerUser,
  forgotPassword,
  AuthLoginResponse,
} from "@/lib/api";
import { LeafDecor } from "./nature/leaf-decor";

interface AuthPortalProps {
  onAuthenticated: (auth: AuthLoginResponse) => void;
}

type AuthMode = "signin" | "register" | "forgot";

export function AuthPortal({ onAuthenticated }: AuthPortalProps) {
  const [mode, setMode] = useState<AuthMode>("signin");

  // Sign In State
  const [loginEmail, setLoginEmail] = useState<string>("farmer@agritwin.ai");
  const [loginPassword, setLoginPassword] = useState<string>("AgriTwin@2026");
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Register State
  const [regFullName, setRegFullName] = useState<string>("");
  const [regEmail, setRegEmail] = useState<string>("");
  const [regMobile, setRegMobile] = useState<string>("");
  const [regRole, setRegRole] = useState<string>("Farmer");
  const [regPassword, setRegPassword] = useState<string>("");
  const [regConfirmPassword, setRegConfirmPassword] = useState<string>("");
  const [regAgreeTerms, setRegAgreeTerms] = useState<boolean>(false);
  const [showRegPassword, setShowRegPassword] = useState<boolean>(false);

  // Forgot Password State
  const [forgotEmail, setForgotEmail] = useState<string>("");
  const [forgotNewPassword, setForgotNewPassword] = useState<string>("");
  const [forgotVerified, setForgotVerified] = useState<boolean>(false);
  const [forgotSuccessMessage, setForgotSuccessMessage] = useState<string | null>(null);

  // UI status
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // 1-Click Role Presets for Hackathon Judges
  const fillRoleCredentials = (role: "farmer" | "agronomist" | "admin") => {
    setErrorMessage(null);
    if (role === "farmer") {
      setLoginEmail("farmer@agritwin.ai");
      setLoginPassword("AgriTwin@2026");
    } else if (role === "agronomist") {
      setLoginEmail("agronomist@agritwin.ai");
      setLoginPassword("AgriTwin@2026");
    } else {
      setLoginEmail("admin@agritwin.ai");
      setLoginPassword("AgriTwin@2026");
    }
  };

  // Handle Login
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const res = await loginUser(loginEmail.trim(), loginPassword);
      if (rememberMe) {
        localStorage.setItem("agritwin_token", res.access_token);
        localStorage.setItem("agritwin_user", JSON.stringify(res));
      } else {
        sessionStorage.setItem("agritwin_token", res.access_token);
        sessionStorage.setItem("agritwin_user", JSON.stringify(res));
      }
      onAuthenticated(res);
    } catch (err: any) {
      setErrorMessage(err.message || "Invalid email or password. Please verify your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Register
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!regFullName.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }
    if (!regEmail.trim()) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    if (regPassword.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMessage("Password confirmation does not match.");
      return;
    }
    if (!regAgreeTerms) {
      setErrorMessage("You must accept the terms of service and scientific data agreement.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await registerUser({
        full_name: regFullName.trim(),
        email: regEmail.trim(),
        mobile: regMobile.trim() || "+91 98450 00000",
        role: regRole,
        password: regPassword,
      });

      localStorage.setItem("agritwin_token", res.access_token);
      localStorage.setItem("agritwin_user", JSON.stringify(res));
      onAuthenticated(res);
    } catch (err: any) {
      setErrorMessage(err.message || "Registration failed. An account with this email may already exist.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Forgot Password
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessNotice(null);

    if (!forgotEmail.trim()) {
      setErrorMessage("Please enter your registered email address.");
      return;
    }

    setIsLoading(true);
    try {
      if (!forgotVerified) {
        const res = await forgotPassword(forgotEmail.trim());
        setForgotVerified(true);
        setSuccessNotice(res.message);
      } else {
        if (!forgotNewPassword || forgotNewPassword.length < 8) {
          setErrorMessage("New password must be at least 8 characters.");
          setIsLoading(false);
          return;
        }
        const res = await forgotPassword(forgotEmail.trim(), forgotNewPassword);
        setForgotSuccessMessage(res.message);
        setTimeout(() => {
          setMode("signin");
          setLoginEmail(forgotEmail);
          setLoginPassword(forgotNewPassword);
          setForgotVerified(false);
          setForgotSuccessMessage(null);
          setSuccessNotice(null);
        }, 1800);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to process password recovery.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#F8F4EB] text-[#20352A] font-sans antialiased overflow-hidden selection:bg-[#E4EBDD] selection:text-[#173D2B]">
      {/* ========================================================================= */}
      {/* LEFT SIDE: Scenic Agricultural Landscape & Brand Hero (Desktop)           */}
      {/* ========================================================================= */}
      <div className="relative hidden lg:flex lg:w-1/2 xl:w-7/12 flex-col justify-between p-12 overflow-hidden select-none">
        {/* Full-height agricultural landscape photograph */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="/images/landing/hero-farm-landscape.jpg"
            alt="Lush agricultural farmland terraces in golden morning light"
            className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000"
          />
          {/* Nature lighting gradient for high-contrast text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#102F22]/95 via-[#173D2B]/60 to-[#102F22]/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#F8F4EB]/30" />
        </div>

        {/* Botanical leaf flourishes */}
        <div className="absolute top-10 right-12 z-10 animate-leaf-1 pointer-events-none opacity-80">
          <LeafDecor variant="branch" className="w-20 text-[#A9B99B]" />
        </div>
        <div className="absolute bottom-20 left-10 z-10 animate-leaf-2 pointer-events-none opacity-70">
          <LeafDecor variant="pair" className="w-12 text-[#E4EBDD]" />
        </div>

        {/* Top Brand Header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="size-11 rounded-2xl bg-[#E4EBDD] text-[#173D2B] flex items-center justify-center shadow-lg ring-1 ring-white/30">
            <Sprout className="size-6 text-[#173D2B]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-white tracking-tight">AgriTwin AI</span>
              <span className="size-2 rounded-full bg-[#A3E635] animate-pulse" />
            </div>
            <p className="text-xs font-semibold text-[#E4EBDD] tracking-wide">
              Autonomous Agricultural Intelligence
            </p>
          </div>
        </div>

        {/* Center Editorial Headlines matching reference */}
        <div className="relative z-10 max-w-xl space-y-4 my-auto py-12">
          <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 text-[#E4EBDD] backdrop-blur-md border border-white/20">
            Smart Farming, Powered by AI
          </span>
          <h2 className="text-4xl xl:text-5xl font-black text-white tracking-tight leading-[1.15]">
            Grow Smarter. <br />
            Farm Better.
          </h2>
          <p className="text-base text-white/90 font-medium leading-relaxed max-w-lg">
            Intelligent agricultural insights for a sustainable tomorrow. Monitor real-time rootzone telemetry, Sentinel-2 canopy reflectances, and autonomous curative agronomy.
          </p>

          {/* 3 Quick Value Badges */}
          <div className="grid grid-cols-3 gap-3 pt-4">
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-white space-y-1">
              <Layers className="size-4 text-[#A3E635]" />
              <div className="text-sm font-black">3D Land Twin</div>
              <p className="text-[0.68rem] text-white/80">Sentinel-2B NDVI & Soil</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-white space-y-1">
              <Sparkles className="size-4 text-[#A3E635]" />
              <div className="text-sm font-black">Crop Pathology</div>
              <p className="text-[0.68rem] text-white/80">Gemini 3.8 Flash Vision</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-white space-y-1">
              <Cpu className="size-4 text-[#A3E635]" />
              <div className="text-sm font-black">Voice AI</div>
              <p className="text-[0.68rem] text-white/80">Kisan Mitra in 8 Languages</p>
            </div>
          </div>
        </div>

        {/* Bottom Provenance Credential */}
        <div className="relative z-10 flex items-center justify-between text-xs text-[#E4EBDD]/80 border-t border-white/15 pt-4">
          <div className="flex items-center gap-2">
            <Shield className="size-4 text-[#A3E635]" />
            <span>ICAR & UAS Bangalore Calibrated</span>
          </div>
          <span>v3.0 Production Platform</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* RIGHT SIDE: Elegant Cream/White Authentication Form                       */}
      {/* ========================================================================= */}
      <div className="w-full lg:w-1/2 xl:w-5/12 flex items-center justify-center p-6 sm:p-10 md:p-12 overflow-y-auto">
        <div className="w-full max-w-md bg-[#FFFEFA] border border-[#E5E1D6] rounded-3xl p-7 sm:p-9 shadow-[0_12px_40px_rgba(23,61,43,0.06)] space-y-6">
          {/* Form Brand Header */}
          <div className="space-y-1 text-center sm:text-left">
            <div className="inline-flex size-11 items-center justify-center rounded-2xl bg-[#E4EBDD] text-[#173D2B] mb-2 sm:mb-3">
              <Sprout className="size-6 text-[#173D2B]" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#173D2B] tracking-tight">
              {mode === "signin"
                ? "Welcome Back"
                : mode === "register"
                ? "Create Account"
                : "Reset Password"}
            </h1>
            <p className="text-xs text-[#68756A] font-medium">
              {mode === "signin"
                ? "Sign in to access your farm's digital twin and autonomous intelligence."
                : mode === "register"
                ? "Register your farm plot to start receiving AI-driven insights."
                : "Enter your registered email address to recover your password."}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 rounded-2xl bg-[#F2EDE2] border border-[#E5E1D6] text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setMode("signin");
                setErrorMessage(null);
              }}
              className={`py-2 rounded-xl transition-all cursor-pointer ${
                mode === "signin"
                  ? "bg-[#173D2B] text-white shadow-sm"
                  : "text-[#68756A] hover:text-[#173D2B]"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("register");
                setErrorMessage(null);
              }}
              className={`py-2 rounded-xl transition-all cursor-pointer ${
                mode === "register"
                  ? "bg-[#173D2B] text-white shadow-sm"
                  : "text-[#68756A] hover:text-[#173D2B]"
              }`}
            >
              Register
            </button>
          </div>

          {/* Global Error Banner */}
          {errorMessage && (
            <div className="rounded-2xl border border-rose-300 bg-rose-50 p-3.5 flex items-start gap-2.5 text-xs text-rose-800 animate-in fade-in-50">
              <AlertCircle className="size-4 shrink-0 mt-0.5 text-rose-600" />
              <span className="leading-relaxed font-medium">{errorMessage}</span>
            </div>
          )}

          {/* Global Success Banner */}
          {successNotice && (
            <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-3.5 flex items-start gap-2.5 text-xs text-emerald-800 animate-in fade-in-50">
              <CheckCircle2 className="size-4 shrink-0 mt-0.5 text-emerald-600" />
              <span className="leading-relaxed font-medium">{successNotice}</span>
            </div>
          )}

          {/* ===================================================================== */}
          {/* 1. SIGN IN FORM                                                       */}
          {/* ===================================================================== */}
          {mode === "signin" && (
            <form onSubmit={handleSignIn} className="space-y-4">
              {/* Quick-Select Demo Roles */}
              <div className="p-3 rounded-2xl bg-[#F8F4EB] border border-[#E5E1D6] space-y-1.5">
                <span className="text-[0.65rem] text-[#68756A] uppercase font-bold tracking-wider block">
                  Quick-Select Demo Role:
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => fillRoleCredentials("farmer")}
                    className={`px-2 py-1.5 rounded-xl border text-[0.7rem] font-bold transition-all cursor-pointer truncate ${
                      loginEmail === "farmer@agritwin.ai"
                        ? "border-[#173D2B] bg-[#E4EBDD] text-[#173D2B]"
                        : "border-[#E5E1D6] bg-white text-[#68756A] hover:bg-[#F2EDE2]"
                    }`}
                  >
                    Farmer (Ramesh)
                  </button>
                  <button
                    type="button"
                    onClick={() => fillRoleCredentials("agronomist")}
                    className={`px-2 py-1.5 rounded-xl border text-[0.7rem] font-bold transition-all cursor-pointer truncate ${
                      loginEmail === "agronomist@agritwin.ai"
                        ? "border-[#173D2B] bg-[#E4EBDD] text-[#173D2B]"
                        : "border-[#E5E1D6] bg-white text-[#68756A] hover:bg-[#F2EDE2]"
                    }`}
                  >
                    Agronomist (Dr. Rao)
                  </button>
                  <button
                    type="button"
                    onClick={() => fillRoleCredentials("admin")}
                    className={`px-2 py-1.5 rounded-xl border text-[0.7rem] font-bold transition-all cursor-pointer truncate ${
                      loginEmail === "admin@agritwin.ai"
                        ? "border-[#173D2B] bg-[#E4EBDD] text-[#173D2B]"
                        : "border-[#E5E1D6] bg-white text-[#68756A] hover:bg-[#F2EDE2]"
                    }`}
                  >
                    Admin (Suresh)
                  </button>
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#20352A] block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 size-4 text-[#68756A] pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="farmer@agritwin.ai"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl border border-[#E5E1D6] bg-white text-xs text-[#20352A] placeholder:text-[#A9B99B] focus:outline-none focus:ring-2 focus:ring-[#173D2B] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#20352A]">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setMode("forgot");
                      setForgotEmail(loginEmail);
                      setErrorMessage(null);
                    }}
                    className="text-[0.7rem] font-bold text-[#173D2B] hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 size-4 text-[#68756A] pointer-events-none" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-2xl border border-[#E5E1D6] bg-white text-xs text-[#20352A] placeholder:text-[#A9B99B] focus:outline-none focus:ring-2 focus:ring-[#173D2B] focus:border-transparent font-mono transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-[#68756A] hover:text-[#173D2B] cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between text-xs text-[#68756A] pt-1">
                <label className="flex items-center gap-2 cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-[#E5E1D6] text-[#173D2B] focus:ring-[#173D2B] size-3.5"
                  />
                  <span>Remember me for 24 hours</span>
                </label>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-full bg-[#173D2B] hover:bg-[#102F22] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                {isLoading ? (
                  <>
                    <Sparkles className="size-4 animate-spin text-[#A3E635]" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="size-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* ===================================================================== */}
          {/* 2. REGISTER FORM                                                      */}
          {/* ===================================================================== */}
          {mode === "register" && (
            <form onSubmit={handleRegister} className="space-y-3.5">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#20352A] block">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 size-4 text-[#68756A] pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    placeholder="e.g. Ramesh Gowda"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl border border-[#E5E1D6] bg-white text-xs text-[#20352A] placeholder:text-[#A9B99B] focus:outline-none focus:ring-2 focus:ring-[#173D2B]"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#20352A] block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 size-4 text-[#68756A] pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="name@farm.in"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl border border-[#E5E1D6] bg-white text-xs text-[#20352A] placeholder:text-[#A9B99B] focus:outline-none focus:ring-2 focus:ring-[#173D2B]"
                  />
                </div>
              </div>

              {/* Mobile & Role Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#20352A] block">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3 size-3.5 text-[#68756A] pointer-events-none" />
                    <input
                      type="text"
                      value={regMobile}
                      onChange={(e) => setRegMobile(e.target.value)}
                      placeholder="+91 98451 23456"
                      className="w-full pl-9 pr-2.5 py-2.5 rounded-2xl border border-[#E5E1D6] bg-white text-xs text-[#20352A] placeholder:text-[#A9B99B] focus:outline-none focus:ring-2 focus:ring-[#173D2B] font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#20352A] block">
                    Role Type
                  </label>
                  <select
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-2xl border border-[#E5E1D6] bg-white text-xs font-medium text-[#20352A] focus:outline-none focus:ring-2 focus:ring-[#173D2B] cursor-pointer"
                  >
                    <option value="Farmer">Farmer</option>
                    <option value="Agronomist">Agronomist</option>
                    <option value="Farm Administrator">Administrator</option>
                  </select>
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#20352A] block">
                  Password (Min 8 Characters)
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 size-4 text-[#68756A] pointer-events-none" />
                  <input
                    type={showRegPassword ? "text" : "password"}
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-2xl border border-[#E5E1D6] bg-white text-xs text-[#20352A] placeholder:text-[#A9B99B] focus:outline-none focus:ring-2 focus:ring-[#173D2B] font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute right-3.5 top-3 text-[#68756A] hover:text-[#173D2B] cursor-pointer"
                  >
                    {showRegPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#20352A] block">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 size-4 text-[#68756A] pointer-events-none" />
                  <input
                    type="password"
                    required
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl border border-[#E5E1D6] bg-white text-xs text-[#20352A] placeholder:text-[#A9B99B] focus:outline-none focus:ring-2 focus:ring-[#173D2B] font-mono"
                  />
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="text-[0.7rem] text-[#68756A] pt-1">
                <label className="flex items-start gap-2 cursor-pointer leading-tight">
                  <input
                    type="checkbox"
                    required
                    checked={regAgreeTerms}
                    onChange={(e) => setRegAgreeTerms(e.target.checked)}
                    className="mt-0.5 rounded border-[#E5E1D6] text-[#173D2B] focus:ring-[#173D2B] size-3.5"
                  />
                  <span>
                    I agree to the Digital Twin telemetry terms, UAS Bangalore benchmark usage guidelines, and privacy policy.
                  </span>
                </label>
              </div>

              {/* Submit Registration */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-full bg-[#173D2B] hover:bg-[#102F22] text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 transition-all hover:scale-[1.01]"
              >
                {isLoading ? (
                  <>
                    <Sparkles className="size-4 animate-spin text-[#A3E635]" />
                    <span>Registering...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account & Enter Platform</span>
                    <ArrowRight className="size-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* ===================================================================== */}
          {/* 3. FORGOT PASSWORD FORM                                               */}
          {/* ===================================================================== */}
          {mode === "forgot" && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[#173D2B] pb-2 border-b border-[#E5E1D6]">
                <KeyRound className="size-4 text-[#173D2B]" />
                <span>Account Password Recovery</span>
              </div>

              {forgotSuccessMessage ? (
                <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-5 text-center space-y-2">
                  <CheckCircle2 className="size-8 text-emerald-600 mx-auto" />
                  <h3 className="text-sm font-bold text-[#173D2B]">Password Updated Successfully</h3>
                  <p className="text-xs text-[#68756A]">{forgotSuccessMessage}</p>
                  <span className="text-[0.7rem] font-bold text-emerald-700 block">Redirecting to Sign In...</span>
                </div>
              ) : (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#20352A] block">
                      Registered Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3 size-4 text-[#68756A] pointer-events-none" />
                      <input
                        type="email"
                        required
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="farmer@agritwin.ai"
                        disabled={forgotVerified}
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl border border-[#E5E1D6] bg-white text-xs text-[#20352A] placeholder:text-[#A9B99B] focus:outline-none focus:ring-2 focus:ring-[#173D2B] disabled:opacity-60"
                      />
                    </div>
                  </div>

                  {forgotVerified && (
                    <div className="space-y-1 animate-in fade-in-50">
                      <label className="text-xs font-bold text-[#20352A] block">
                        Enter New Secure Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-3 size-4 text-[#68756A] pointer-events-none" />
                        <input
                          type="password"
                          required
                          value={forgotNewPassword}
                          onChange={(e) => setForgotNewPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl border border-[#E5E1D6] bg-white text-xs text-[#20352A] placeholder:text-[#A9B99B] focus:outline-none focus:ring-2 focus:ring-[#173D2B] font-mono"
                        />
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-full bg-[#173D2B] hover:bg-[#102F22] text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 transition-all"
                  >
                    {isLoading ? (
                      <>
                        <Sparkles className="size-4 animate-spin text-[#A3E635]" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <span>{forgotVerified ? "Save New Password" : "Verify Account"}</span>
                    )}
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setMode("signin");
                        setForgotVerified(false);
                        setErrorMessage(null);
                      }}
                      className="text-xs font-bold text-[#68756A] hover:text-[#173D2B] cursor-pointer"
                    >
                      &larr; Back to Sign In
                    </button>
                  </div>
                </>
              )}
            </form>
          )}

          {/* Security & Provenance Badge */}
          <div className="pt-3 border-t border-[#E5E1D6] flex items-center justify-between text-[0.68rem] text-[#68756A]">
            <div className="flex items-center gap-1.5 font-medium">
              <Shield className="size-3.5 text-[#173D2B]" />
              <span>PBKDF2 & JWT Encrypted</span>
            </div>
            <span className="font-semibold text-[#173D2B]">ICAR Validated</span>
          </div>
        </div>
      </div>
    </div>
  );
}
