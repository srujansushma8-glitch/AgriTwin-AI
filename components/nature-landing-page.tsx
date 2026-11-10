"use client";

import React, { useState, useEffect } from "react";
import {
  Sprout,
  ArrowRight,
  Play,
  Activity,
  CloudSun,
  TrendingUp,
  Bell,
  Droplets,
  Layers,
  Thermometer,
  Brain,
  Microscope,
  Compass,
  Cpu,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Volume2,
  X,
  ExternalLink,
  Menu
} from "lucide-react";
import { FarmIllustration } from "./nature/farm-illustration";
import { LeafDecor } from "./nature/leaf-decor";
import { AgriculturalDrone } from "./nature/agricultural-drone";
import { WaveDivider } from "./nature/wave-divider";
import { AuthLoginResponse } from "@/lib/api";

interface NatureLandingPageProps {
  onOpenDashboard: (tab?: string) => void;
  onOpenAuth: () => void;
  currentUser: AuthLoginResponse | null;
}

export function NatureLandingPage({
  onOpenDashboard,
  onOpenAuth,
  currentUser,
}: NatureLandingPageProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeNav, setActiveNav] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  // Monitor scroll for compact sticky navbar and active nav state
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 50);

      // Section spy
      const sections = ["hero", "companion", "about", "features", "contact"];
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 250 && rect.bottom >= 150) {
            setActiveNav(sectionId === "hero" ? "home" : sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F3E9] text-[#173D27] font-sans antialiased overflow-x-hidden selection:bg-[#31D17C]/30 selection:text-[#173D27]">
      {/* ========================================================================= */}
      {/* 1. TOP NAVIGATION BAR                                                     */}
      {/* ========================================================================= */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 sm:px-8 py-3 sm:py-4 ${
          isScrolled
            ? "bg-[#F8F3E9]/90 backdrop-blur-md shadow-[0_10px_30px_rgba(23,61,39,0.06)] border-b border-[#173D27]/10 py-3"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo Brand */}
          <div
            onClick={() => scrollTo("hero")}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="size-10 sm:size-11 rounded-2xl bg-[#173D27] flex items-center justify-center text-[#A3E635] shadow-md group-hover:scale-105 transition-transform duration-300">
              <Sprout className="size-6 text-[#A3E635]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg sm:text-xl font-black tracking-tight text-[#173D27]">
                  AgriTwin AI
                </span>
                <span className="size-1.5 rounded-full bg-[#31D17C] animate-pulse" />
              </div>
              <p className="text-[0.68rem] font-bold text-[#4B6354] tracking-wide -mt-0.5">
                Grow Smarter. Farm Better.
              </p>
            </div>
          </div>

          {/* Center Floating Pill Menu (Desktop) */}
          <nav className="hidden md:flex items-center bg-white/80 backdrop-blur-md border border-[#173D27]/15 rounded-full p-1.5 shadow-[0_6px_20px_rgba(23,61,39,0.06)]">
            <button
              onClick={() => {
                setActiveNav("home");
                scrollTo("hero");
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeNav === "home"
                  ? "bg-[#173D27] text-white shadow-sm"
                  : "text-[#173D27] hover:text-[#173D27]/80 hover:bg-[#EAE4D5]/60"
              }`}
            >
              Home
            </button>
            <button
              onClick={() => {
                setActiveNav("features");
                scrollTo("features");
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeNav === "features"
                  ? "bg-[#173D27] text-white shadow-sm"
                  : "text-[#173D27] hover:text-[#173D27]/80 hover:bg-[#EAE4D5]/60"
              }`}
            >
              Features
            </button>
            <button
              onClick={() => onOpenDashboard()}
              className="px-4 py-1.5 rounded-full text-xs font-bold text-[#173D27] hover:bg-[#EAE4D5]/60 transition-all flex items-center gap-1 cursor-pointer"
            >
              <span>Dashboard</span>
              <span className="px-1.5 py-0.2 rounded-full text-[0.55rem] bg-[#31D17C]/20 text-[#173D27] font-extrabold uppercase">
                Twin
              </span>
            </button>
            <button
              onClick={() => {
                setActiveNav("about");
                scrollTo("about");
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeNav === "about"
                  ? "bg-[#173D27] text-white shadow-sm"
                  : "text-[#173D27] hover:text-[#173D27]/80 hover:bg-[#EAE4D5]/60"
              }`}
            >
              About
            </button>
            <button
              onClick={() => {
                setActiveNav("contact");
                scrollTo("contact");
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeNav === "contact"
                  ? "bg-[#173D27] text-white shadow-sm"
                  : "text-[#173D27] hover:text-[#173D27]/80 hover:bg-[#EAE4D5]/60"
              }`}
            >
              Contact
            </button>
          </nav>

          {/* Right Action Button */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <button
                onClick={() => onOpenDashboard()}
                className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#173D27] hover:bg-[#12311f] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
              >
                <span>Dashboard ({currentUser.full_name?.split(" ")[0] || "Farmer"})</span>
                <ArrowRight className="size-3.5" />
              </button>
            ) : (
              <button
                onClick={() => onOpenDashboard()}
                className="px-5 py-2 sm:py-2.5 rounded-full bg-[#173D27] hover:bg-[#12311f] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
              >
                <span>Get Started</span>
                <ArrowRight className="size-3.5" />
              </button>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-white/70 border border-[#173D27]/20 text-[#173D27]"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 p-4 rounded-3xl bg-white border border-[#173D27]/20 shadow-xl space-y-2 animate-in fade-in-50 slide-in-from-top-4">
            <button
              onClick={() => {
                setActiveNav("home");
                scrollTo("hero");
              }}
              className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold text-[#173D27] hover:bg-[#EAE4D5]/60"
            >
              Home
            </button>
            <button
              onClick={() => {
                setActiveNav("features");
                scrollTo("features");
              }}
              className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold text-[#173D27] hover:bg-[#EAE4D5]/60"
            >
              Features
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDashboard();
              }}
              className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold text-[#173D27] bg-[#31D17C]/15"
            >
              Farm Digital Twin Dashboard
            </button>
            <button
              onClick={() => {
                setActiveNav("about");
                scrollTo("about");
              }}
              className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold text-[#173D27] hover:bg-[#EAE4D5]/60"
            >
              About & Sustainability
            </button>
            <button
              onClick={() => {
                setActiveNav("contact");
                scrollTo("contact");
              }}
              className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold text-[#173D27] hover:bg-[#EAE4D5]/60"
            >
              Contact
            </button>
          </div>
        )}
      </header>

      {/* ========================================================================= */}
      {/* 2. HERO SECTION WITH AGRICULTURAL DRONE & LUSH TERRACES                   */}
      {/* ========================================================================= */}
      <section id="hero" className="relative w-full min-h-[92vh] flex flex-col justify-between pt-24 sm:pt-32">
        {/* Full-width landscape background with organic lighting gradient */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="/images/landing/hero-farm-landscape.jpg"
            alt="Lush green agricultural terraces and hills"
            className="w-full h-full object-cover object-center scale-105 transform motion-safe:transition-transform motion-safe:duration-1000"
          />
          {/* Nature-inspired soft lighting overlay to guarantee crisp readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#F8F3E9]/95 via-[#F8F3E9]/75 to-transparent sm:to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#F8F3E9] via-transparent to-[#F8F3E9]/40" />
        </div>

        {/* Decorative Floating Leaves in Hero */}
        <div className="absolute top-28 left-6 sm:left-12 z-10 animate-leaf-1">
          <LeafDecor variant="branch" className="w-16 sm:w-24 text-[#2E7D32]" />
        </div>
        <div className="absolute top-44 right-1/3 z-10 animate-leaf-2 hidden sm:block">
          <LeafDecor variant="single" className="w-7 text-[#34D399]" />
        </div>

        {/* Agricultural Drone Flying Over Terraces (Right Side) */}
        <div className="absolute top-20 sm:top-24 right-4 sm:right-16 md:right-24 z-20 w-52 sm:w-80 md:w-96 pointer-events-none">
          <AgriculturalDrone className="w-full" />
        </div>

        {/* Hero Content (Left Side) */}
        <div className="relative z-20 max-w-7xl mx-auto px-6 sm:px-10 w-full py-12 sm:py-16">
          <div className="max-w-xl lg:max-w-2xl space-y-5 sm:space-y-6">
            {/* Main Headline */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-[#173D27] leading-[1.05]">
              AgriTwin AI
            </h1>

            {/* Subheadline */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#173D27] tracking-tight">
              Grow Smarter. Farm Better.
            </h2>

            {/* Supporting Text */}
            <p className="text-sm sm:text-base md:text-lg text-[#3F5849] font-medium leading-relaxed max-w-lg">
              An AI-powered smart farming platform to monitor, predict and improve your crops.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                onClick={() => scrollTo("features")}
                className="px-6 sm:px-7 py-3 sm:py-3.5 rounded-full bg-[#173D27] hover:bg-[#12311f] text-white font-bold text-sm shadow-xl hover:shadow-2xl transition-all flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95 group"
              >
                <Sprout className="size-4 text-[#A3E635]" />
                <span>Explore Features</span>
                <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setIsDemoModalOpen(true)}
                className="px-5 sm:px-6 py-3 sm:py-3.5 rounded-full bg-white/85 hover:bg-white text-[#173D27] font-bold text-sm backdrop-blur-md border border-[#173D27]/25 shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
              >
                <div className="size-5 rounded-full bg-[#173D27] text-white flex items-center justify-center">
                  <Play className="size-2.5 fill-white ml-0.5" />
                </div>
                <span>Watch Demo</span>
              </button>
            </div>
          </div>
        </div>

        {/* Organic Curved Wave Divider at Bottom of Hero */}
        <div className="relative z-10 w-full mt-auto">
          <WaveDivider fillColor="#F8F3E9" position="bottom" />
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. PREMIUM FLOATING FEATURE NAVIGATION BAR                                */}
      {/* ========================================================================= */}
      <section id="quick-nav" className="relative z-30 -mt-10 sm:-mt-14 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-white/95 backdrop-blur-xl border border-[#173D27]/15 rounded-3xl p-3 sm:p-5 shadow-[0_20px_50px_rgba(23,61,39,0.08)]">
          <div className="grid grid-cols-2 md:grid-cols-4 md:divide-x md:divide-[#173D27]/10 gap-3 sm:gap-0">
            {/* 1. Crop Health */}
            <div
              onClick={() => onOpenDashboard("crop-health")}
              className="group p-3 sm:px-5 sm:py-3 hover:bg-[#EAE4D5]/40 transition-all duration-300 cursor-pointer flex flex-col items-center text-center space-y-2 hover:-translate-y-1 rounded-2xl"
            >
              <div className="size-11 sm:size-12 rounded-full bg-[#E8F0EA] group-hover:bg-[#173D27] text-[#173D27] group-hover:text-[#A3E635] flex items-center justify-center transition-colors shadow-xs">
                <Sprout className="size-6 text-[#173D27] group-hover:text-[#A3E635]" />
              </div>
              <span className="text-xs sm:text-sm font-extrabold text-[#173D27] group-hover:text-[#173D27] leading-tight">
                Crop Health Monitoring
              </span>
            </div>

            {/* 2. Weather Forecast */}
            <div
              onClick={() => onOpenDashboard("climate")}
              className="group p-3 sm:px-5 sm:py-3 hover:bg-[#EAE4D5]/40 transition-all duration-300 cursor-pointer flex flex-col items-center text-center space-y-2 hover:-translate-y-1 rounded-2xl"
            >
              <div className="size-11 sm:size-12 rounded-full bg-[#E8F0EA] group-hover:bg-[#173D27] text-[#173D27] group-hover:text-[#A3E635] flex items-center justify-center transition-colors shadow-xs">
                <CloudSun className="size-6 text-[#173D27] group-hover:text-[#A3E635]" />
              </div>
              <span className="text-xs sm:text-sm font-extrabold text-[#173D27] group-hover:text-[#173D27] leading-tight">
                Weather Forecast
              </span>
            </div>

            {/* 3. AI Yield Prediction */}
            <div
              onClick={() => onOpenDashboard("overview")}
              className="group p-3 sm:px-5 sm:py-3 hover:bg-[#EAE4D5]/40 transition-all duration-300 cursor-pointer flex flex-col items-center text-center space-y-2 hover:-translate-y-1 rounded-2xl"
            >
              <div className="size-11 sm:size-12 rounded-full bg-[#E8F0EA] group-hover:bg-[#173D27] text-[#173D27] group-hover:text-[#A3E635] flex items-center justify-center transition-colors shadow-xs">
                <TrendingUp className="size-6 text-[#173D27] group-hover:text-[#A3E635]" />
              </div>
              <span className="text-xs sm:text-sm font-extrabold text-[#173D27] group-hover:text-[#173D27] leading-tight">
                AI Yield Prediction
              </span>
            </div>

            {/* 4. Smart Alerts */}
            <div
              onClick={() => onOpenDashboard("alerts")}
              className="group p-3 sm:px-5 sm:py-3 hover:bg-[#EAE4D5]/40 transition-all duration-300 cursor-pointer flex flex-col items-center text-center space-y-2 hover:-translate-y-1 rounded-2xl"
            >
              <div className="size-11 sm:size-12 rounded-full bg-[#E8F0EA] group-hover:bg-[#173D27] text-[#173D27] group-hover:text-[#A3E635] flex items-center justify-center transition-colors shadow-xs">
                <Bell className="size-6 text-[#173D27] group-hover:text-[#A3E635]" />
              </div>
              <span className="text-xs sm:text-sm font-extrabold text-[#173D27] group-hover:text-[#173D27] leading-tight">
                Smart Alerts
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. "YOUR INTELLIGENT FARMING COMPANION" SECTION                           */}
      {/* ========================================================================= */}
      <section id="companion" className="relative py-20 sm:py-28 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Editorial Description & Farmhouse Line Art */}
          <div className="lg:col-span-5 space-y-6">
            <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#E8F0EA] text-[#173D27] border border-[#173D27]/15">
              Smart Farming, Powered by AI
            </span>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#173D27] tracking-tight leading-[1.15]">
              Your Intelligent Farming Companion
            </h2>

            <p className="text-sm sm:text-base text-[#4B6354] font-medium leading-relaxed">
              From crop monitoring to intelligent insights, AgriTwin helps farmers make better decisions, increase productivity, and build a sustainable future.
            </p>

            <div>
              <button
                onClick={() => onOpenDashboard("voice")}
                className="px-6 py-3 rounded-full bg-[#173D27] hover:bg-[#12311f] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-xl transition-all flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95 group"
              >
                <span>Learn More</span>
                <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Vintage Farmhouse & Windmill Vector Illustration */}
            <div className="pt-4">
              <FarmIllustration className="w-full max-w-xs" />
            </div>
          </div>

          {/* Right Column: Organic Pebble Container with Farmer & Floating Telemetry Badges */}
          <div className="lg:col-span-7 relative flex justify-center items-center">
            {/* Floating Leaves */}
            <div className="absolute -top-6 right-10 z-20 animate-leaf-1">
              <LeafDecor variant="single" className="w-7 text-[#2E7D32]" />
            </div>
            <div className="absolute bottom-6 -left-6 z-20 animate-leaf-2">
              <LeafDecor variant="pair" className="w-10 text-[#34D399]" />
            </div>

            {/* Main Organic Blob Image Container */}
            <div className="relative w-full max-w-lg aspect-4/3 sm:aspect-square overflow-hidden shadow-[0_25px_60px_rgba(23,61,39,0.15)] border-4 border-white organic-blob-1 bg-[#173D27]">
              <img
                src="/images/landing/farmer-digital-field.jpg"
                alt="Farmer in hat using digital tablet in lush green agricultural field"
                className="w-full h-full object-cover object-center scale-105"
              />

              {/* Holographic Agri-Grid Overlay on field */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#173D27]/60 via-transparent to-transparent pointer-events-none" />

              {/* Simulated Holographic Crop Boundary Polygon */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                <polygon
                  points="220,180 340,160 410,240 280,270"
                  fill="#31D17C"
                  fillOpacity="0.2"
                  stroke="#31D17C"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
              </svg>
            </div>

            {/* Floating Glassmorphic Badges (Matching Reference Exactly) */}
            {/* 1. Soil Moisture (Top Right) */}
            <div className="absolute -top-4 sm:top-6 right-0 sm:-right-4 z-20 bg-white/90 backdrop-blur-md border border-white/60 shadow-[0_12px_30px_rgba(23,61,39,0.12)] rounded-2xl px-3.5 py-2.5 flex items-center gap-3 animate-float-slow">
              <div className="size-8 rounded-full bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center">
                <Droplets className="size-4" />
              </div>
              <div className="text-left">
                <span className="text-[0.62rem] font-bold text-[#4B6354] uppercase tracking-wider block">
                  Soil Moisture
                </span>
                <span className="text-sm font-black text-[#173D27]">
                  68% <span className="text-[0.65rem] font-bold text-[#31D17C]">(Optimal)</span>
                </span>
              </div>
            </div>

            {/* 2. Crop Health (Right Center) */}
            <div className="absolute top-24 sm:top-28 -right-4 sm:-right-8 z-20 bg-white/90 backdrop-blur-md border border-white/60 shadow-[0_12px_30px_rgba(23,61,39,0.12)] rounded-2xl px-3.5 py-2.5 flex items-center gap-3 animate-float-slower">
              <div className="size-8 rounded-full bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center">
                <Sprout className="size-4" />
              </div>
              <div className="text-left">
                <span className="text-[0.62rem] font-bold text-[#4B6354] uppercase tracking-wider block">
                  Crop Health
                </span>
                <span className="text-sm font-black text-[#173D27]">
                  92% <span className="text-[0.65rem] font-bold text-[#31D17C]">(Healthy)</span>
                </span>
              </div>
            </div>

            {/* 3. Weather (Lower Right) */}
            <div className="absolute bottom-8 sm:bottom-14 right-2 sm:right-0 z-20 bg-white/90 backdrop-blur-md border border-white/60 shadow-[0_12px_30px_rgba(23,61,39,0.12)] rounded-2xl px-3.5 py-2.5 flex items-center gap-3 animate-float-reverse">
              <div className="size-8 rounded-full bg-[#FEF3C7] text-[#D97706] flex items-center justify-center">
                <CloudSun className="size-4" />
              </div>
              <div className="text-left">
                <span className="text-[0.62rem] font-bold text-[#4B6354] uppercase tracking-wider block">
                  Weather
                </span>
                <span className="text-sm font-black text-[#173D27]">
                  28°C <span className="text-[0.65rem] font-medium text-[#4B6354]">(Partly Cloudy)</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. ABOUT / SUSTAINABILITY SECTION ("AI FOR A GREENER TOMORROW")           */}
      {/* ========================================================================= */}
      <section id="about" className="py-20 sm:py-28 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left: Seedling in Soil with Organic Pebble Container */}
          <div className="lg:col-span-6 relative flex justify-center">
            <div className="relative w-full max-w-lg aspect-4/3 sm:aspect-square overflow-hidden shadow-[0_25px_60px_rgba(23,61,39,0.15)] border-4 border-white organic-blob-2 bg-[#173D27]">
              <img
                src="/images/landing/seedling-greener-tomorrow.jpg"
                alt="Green sprout seedling emerging from fertile soil in golden morning light"
                className="w-full h-full object-cover object-center scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Overlay Badge Matching Reference Exactly */}
              <div className="absolute bottom-6 left-6 z-20">
                <span className="text-xs font-bold tracking-wider text-[#A3E635] uppercase block">
                  AI for a
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif italic text-white font-bold leading-tight">
                  Greener Tomorrow
                </h3>
                <div className="w-6 h-1 bg-[#A3E635] rounded-full mt-1.5 opacity-80" />
              </div>
            </div>
          </div>

          {/* Right: Sustainable Agricultural Future Content & 3 Metric Cards */}
          <div className="lg:col-span-6 space-y-6">
            <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#E8F0EA] text-[#173D27] border border-[#173D27]/15">
              Our Impact
            </span>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#173D27] tracking-tight leading-[1.15]">
              Building a Sustainable Agricultural Future
            </h2>

            <p className="text-sm sm:text-base text-[#4B6354] font-medium leading-relaxed">
              Together, let's create a smarter, greener, and more productive tomorrow for every farmer.
            </p>

            {/* 3 Metric Cards in a Row */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-2">
              {/* Card 1 */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#173D27]/15 shadow-sm text-center space-y-1 hover:border-[#31D17C]/50 transition-colors">
                <div className="size-8 mx-auto rounded-full bg-[#E8F0EA] text-[#173D27] flex items-center justify-center mb-1">
                  <Sprout className="size-4" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-[#173D27]">
                  10K+
                </div>
                <span className="text-[0.65rem] sm:text-xs font-bold text-[#4B6354] block">
                  Happy Farmers
                </span>
              </div>

              {/* Card 2 */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#173D27]/15 shadow-sm text-center space-y-1 hover:border-[#31D17C]/50 transition-colors">
                <div className="size-8 mx-auto rounded-full bg-[#E8F0EA] text-[#173D27] flex items-center justify-center mb-1">
                  <Layers className="size-4" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-[#173D27]">
                  1M+
                </div>
                <span className="text-[0.65rem] sm:text-xs font-bold text-[#4B6354] block">
                  Acres Monitored
                </span>
              </div>

              {/* Card 3 */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#173D27]/15 shadow-sm text-center space-y-1 hover:border-[#31D17C]/50 transition-colors">
                <div className="size-8 mx-auto rounded-full bg-[#E8F0EA] text-[#173D27] flex items-center justify-center mb-1">
                  <TrendingUp className="size-4" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-[#173D27]">
                  40%
                </div>
                <span className="text-[0.65rem] sm:text-xs font-bold text-[#4B6354] block">
                  Higher Yield
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. AGRICULTURAL AI FEATURES (8 RICH CARDS)                                */}
      {/* ========================================================================= */}
      <section id="features" className="py-20 sm:py-28 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
          <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#E8F0EA] text-[#173D27] border border-[#173D27]/15">
            Core AI Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#173D27] tracking-tight">
            Intelligent Agricultural Solutions
          </h2>
          <p className="text-sm sm:text-base text-[#4B6354] font-medium leading-relaxed">
            Engineered with deep learning, Sentinel-2 multispectral satellite telemetry, and ICAR agronomic science.
          </p>
        </div>

        {/* 8 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: AI Disease Detection */}
          <div
            onClick={() => onOpenDashboard("crop-health")}
            className="group rounded-3xl bg-white p-6 border border-[#173D27]/15 shadow-[0_10px_30px_rgba(23,61,39,0.04)] hover:shadow-[0_20px_40px_rgba(23,61,39,0.1)] transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="size-12 rounded-2xl bg-[#E8F0EA] text-[#173D27] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#173D27] group-hover:text-[#A3E635] transition-all">
                <Microscope className="size-6" />
              </div>
              <h3 className="text-lg font-black text-[#173D27] leading-tight">
                AI Crop Disease Detection
              </h3>
              <p className="text-xs text-[#4B6354] leading-relaxed">
                Gemini 3.8 Flash multimodal vision scans leaf pathology, identifying pathogens and curative ICAR spray protocols.
              </p>
            </div>
            <div className="pt-4 border-t border-[#173D27]/10 mt-4 flex items-center justify-between text-xs font-bold text-[#173D27] group-hover:text-[#31D17C]">
              <span>Diagnose Leaf</span>
              <ChevronRight className="size-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Smart Irrigation */}
          <div
            onClick={() => onOpenDashboard("irrigation")}
            className="group rounded-3xl bg-white p-6 border border-[#173D27]/15 shadow-[0_10px_30px_rgba(23,61,39,0.04)] hover:shadow-[0_20px_40px_rgba(23,61,39,0.1)] transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="size-12 rounded-2xl bg-[#E8F0EA] text-[#173D27] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#173D27] group-hover:text-[#A3E635] transition-all">
                <Droplets className="size-6" />
              </div>
              <h3 className="text-lg font-black text-[#173D27] leading-tight">
                Smart Irrigation Scheduling
              </h3>
              <p className="text-xs text-[#4B6354] leading-relaxed">
                Variable-rate rootzone moisture replenishment calculated from transpiration flux, conserving up to 32% water.
              </p>
            </div>
            <div className="pt-4 border-t border-[#173D27]/10 mt-4 flex items-center justify-between text-xs font-bold text-[#173D27] group-hover:text-[#31D17C]">
              <span>Optimize Water</span>
              <ChevronRight className="size-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Soil Health Analysis */}
          <div
            onClick={() => onOpenDashboard("soil")}
            className="group rounded-3xl bg-white p-6 border border-[#173D27]/15 shadow-[0_10px_30px_rgba(23,61,39,0.04)] hover:shadow-[0_20px_40px_rgba(23,61,39,0.1)] transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="size-12 rounded-2xl bg-[#E8F0EA] text-[#173D27] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#173D27] group-hover:text-[#A3E635] transition-all">
                <Layers className="size-6" />
              </div>
              <h3 className="text-lg font-black text-[#173D27] leading-tight">
                Soil Health & Stoichiometry
              </h3>
              <p className="text-xs text-[#4B6354] leading-relaxed">
                Real-time NPK nutrient balance, electrical conductivity, soil organic carbon, and pH monitoring across zones.
              </p>
            </div>
            <div className="pt-4 border-t border-[#173D27]/10 mt-4 flex items-center justify-between text-xs font-bold text-[#173D27] group-hover:text-[#31D17C]">
              <span>View Soil Metrics</span>
              <ChevronRight className="size-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Weather Intelligence */}
          <div
            onClick={() => onOpenDashboard("climate")}
            className="group rounded-3xl bg-white p-6 border border-[#173D27]/15 shadow-[0_10px_30px_rgba(23,61,39,0.04)] hover:shadow-[0_20px_40px_rgba(23,61,39,0.1)] transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="size-12 rounded-2xl bg-[#E8F0EA] text-[#173D27] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#173D27] group-hover:text-[#A3E635] transition-all">
                <CloudSun className="size-6" />
              </div>
              <h3 className="text-lg font-black text-[#173D27] leading-tight">
                Weather Intelligence
              </h3>
              <p className="text-xs text-[#4B6354] leading-relaxed">
                Hyper-local agrometeorological forecasting, humidity alerts, frost prediction, and optimal pesticide spray windows.
              </p>
            </div>
            <div className="pt-4 border-t border-[#173D27]/10 mt-4 flex items-center justify-between text-xs font-bold text-[#173D27] group-hover:text-[#31D17C]">
              <span>Check Forecast</span>
              <ChevronRight className="size-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 5: Crop Yield Prediction */}
          <div
            onClick={() => onOpenDashboard("crop-planner")}
            className="group rounded-3xl bg-white p-6 border border-[#173D27]/15 shadow-[0_10px_30px_rgba(23,61,39,0.04)] hover:shadow-[0_20px_40px_rgba(23,61,39,0.1)] transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="size-12 rounded-2xl bg-[#E8F0EA] text-[#173D27] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#173D27] group-hover:text-[#A3E635] transition-all">
                <TrendingUp className="size-6" />
              </div>
              <h3 className="text-lg font-black text-[#173D27] leading-tight">
                Crop Yield Prediction
              </h3>
              <p className="text-xs text-[#4B6354] leading-relaxed">
                ML biomass assimilation curves predict harvest date, potential yield in tons/ha, and commercial grade distribution.
              </p>
            </div>
            <div className="pt-4 border-t border-[#173D27]/10 mt-4 flex items-center justify-between text-xs font-bold text-[#173D27] group-hover:text-[#31D17C]">
              <span>Forecast Yield</span>
              <ChevronRight className="size-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 6: AI Farmer Assistant (Kisan Mitra) */}
          <div
            onClick={() => onOpenDashboard("voice")}
            className="group rounded-3xl bg-white p-6 border border-[#173D27]/15 shadow-[0_10px_30px_rgba(23,61,39,0.04)] hover:shadow-[0_20px_40px_rgba(23,61,39,0.1)] transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="size-12 rounded-2xl bg-[#E8F0EA] text-[#173D27] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#173D27] group-hover:text-[#A3E635] transition-all">
                <Brain className="size-6" />
              </div>
              <h3 className="text-lg font-black text-[#173D27] leading-tight">
                Kisan Mitra AI Assistant
              </h3>
              <p className="text-xs text-[#4B6354] leading-relaxed">
                Conversational voice companion in 8 Indian languages, answering farming protocols and general knowledge questions.
              </p>
            </div>
            <div className="pt-4 border-t border-[#173D27]/10 mt-4 flex items-center justify-between text-xs font-bold text-[#173D27] group-hover:text-[#31D17C]">
              <span>Talk to Assistant</span>
              <ChevronRight className="size-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 7: Farm Digital Twin */}
          <div
            onClick={() => onOpenDashboard("overview")}
            className="group rounded-3xl bg-white p-6 border border-[#173D27]/15 shadow-[0_10px_30px_rgba(23,61,39,0.04)] hover:shadow-[0_20px_40px_rgba(23,61,39,0.1)] transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="size-12 rounded-2xl bg-[#E8F0EA] text-[#173D27] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#173D27] group-hover:text-[#A3E635] transition-all">
                <Cpu className="size-6" />
              </div>
              <h3 className="text-lg font-black text-[#173D27] leading-tight">
                Spatial 3D Digital Twin
              </h3>
              <p className="text-xs text-[#4B6354] leading-relaxed">
                Interactive Three.js field twin pairing Sentinel-2B NDVI spatial heatmaps with rootzone IoT sensor telemetry.
              </p>
            </div>
            <div className="pt-4 border-t border-[#173D27]/10 mt-4 flex items-center justify-between text-xs font-bold text-[#173D27] group-hover:text-[#31D17C]">
              <span>Explore 3D Twin</span>
              <ChevronRight className="size-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 8: Market Insights */}
          <div
            onClick={() => onOpenDashboard("market")}
            className="group rounded-3xl bg-white p-6 border border-[#173D27]/15 shadow-[0_10px_30px_rgba(23,61,39,0.04)] hover:shadow-[0_20px_40px_rgba(23,61,39,0.1)] transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="size-12 rounded-2xl bg-[#E8F0EA] text-[#173D27] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#173D27] group-hover:text-[#A3E635] transition-all">
                <Compass className="size-6" />
              </div>
              <h3 className="text-lg font-black text-[#173D27] leading-tight">
                APMC Mandi Intelligence
              </h3>
              <p className="text-xs text-[#4B6354] leading-relaxed">
                Live mandi pricing, 15-day price projections, and harvest monetization recommendations to maximize profit margins.
              </p>
            </div>
            <div className="pt-4 border-t border-[#173D27]/10 mt-4 flex items-center justify-between text-xs font-bold text-[#173D27] group-hover:text-[#31D17C]">
              <span>View Mandi Prices</span>
              <ChevronRight className="size-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. FINAL CALL-TO-ACTION SECTION WITH SUNSET TRACTOR & MOUNTAINS           */}
      {/* ========================================================================= */}
      <section id="contact" className="relative w-full pt-16 sm:pt-24 pb-20 overflow-hidden">
        {/* Top Organic Wave Transition into the Landscape */}
        <div className="absolute top-0 left-0 right-0 z-10 w-full overflow-hidden leading-none pointer-events-none">
          <svg
            viewBox="0 0 1440 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            className="w-full h-16 sm:h-20 block"
          >
            <path
              d="M0,0 C320,60 720,100 1100,50 C1280,25 1380,10 1440,0 L1440,0 L0,0 Z"
              fill="#F8F3E9"
            />
          </svg>
        </div>

        {/* Full-width Sunset Agricultural Landscape Background */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="/images/landing/tractor-sunset-field.jpg"
            alt="Agricultural farm field at sunset with distant tractor and mountains"
            className="w-full h-full object-cover object-bottom"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-[#F8F3E9]/90" />
        </div>

        {/* Birds in the sky SVG */}
        <div className="absolute top-16 right-1/4 z-10 pointer-events-none opacity-60">
          <svg width="120" height="40" viewBox="0 0 120 40" fill="none">
            <path d="M10 20 Q15 12 20 20 Q25 12 30 20" stroke="#173D27" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M45 15 Q49 8 53 15 Q57 8 61 15" stroke="#173D27" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M75 25 Q79 18 83 25 Q87 18 91 25" stroke="#173D27" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </div>

        {/* Center Content */}
        <div className="relative z-20 max-w-4xl mx-auto px-6 text-center space-y-6 pt-12 sm:pt-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight drop-shadow-md">
            Ready to Revolutionize Your Farming?
          </h2>

          <p className="text-base sm:text-lg text-white/90 font-medium max-w-xl mx-auto leading-relaxed drop-shadow-xs">
            Join thousands of farmers who trust AgriTwin AI.
          </p>

          <div className="pt-3">
            <button
              onClick={() => onOpenDashboard()}
              className="px-8 sm:px-9 py-3.5 sm:py-4 rounded-full bg-[#173D27] hover:bg-[#12311f] text-white font-extrabold text-sm sm:text-base shadow-2xl hover:shadow-[#31D17C]/20 transition-all flex items-center gap-2.5 mx-auto cursor-pointer hover:scale-105 active:scale-95 group border border-[#31D17C]/40"
            >
              <Sprout className="size-5 text-[#A3E635]" />
              <span>Get Started Free</span>
              <ArrowRight className="size-4 group-hover:translate-x-1.5 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. FOOTER                                                                 */}
      {/* ========================================================================= */}
      <footer className="bg-[#102B1B] text-[#9AB5A7] py-12 px-6 sm:px-12 border-t border-[#173D27]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-[#24483A]">
          {/* Col 1: Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-xl bg-[#173D27] flex items-center justify-center text-[#A3E635]">
                <Sprout className="size-4.5" />
              </div>
              <span className="text-lg font-black text-white tracking-tight">AgriTwin AI</span>
            </div>
            <p className="text-xs text-[#9AB5A7] leading-relaxed">
              Empowering farmers with satellite telemetry, digital twins, and agronomic generative AI.
            </p>
          </div>

          {/* Col 2: Features */}
          <div className="space-y-2 text-xs">
            <strong className="text-white block font-bold mb-2">AI Capabilities</strong>
            <button onClick={() => onOpenDashboard("crop-health")} className="block text-[#9AB5A7] hover:text-[#31D17C] cursor-pointer">
              Crop Disease Vision
            </button>
            <button onClick={() => onOpenDashboard("irrigation")} className="block text-[#9AB5A7] hover:text-[#31D17C] cursor-pointer">
              Smart Irrigation Pulses
            </button>
            <button onClick={() => onOpenDashboard("climate")} className="block text-[#9AB5A7] hover:text-[#31D17C] cursor-pointer">
              Weather Intelligence
            </button>
            <button onClick={() => onOpenDashboard("voice")} className="block text-[#9AB5A7] hover:text-[#31D17C] cursor-pointer">
              Kisan Mitra Voice AI
            </button>
          </div>

          {/* Col 3: Operational Modules */}
          <div className="space-y-2 text-xs">
            <strong className="text-white block font-bold mb-2">Farm Twin</strong>
            <button onClick={() => onOpenDashboard("overview")} className="block text-[#9AB5A7] hover:text-[#31D17C] cursor-pointer">
              3D Spatial Canopy Twin
            </button>
            <button onClick={() => onOpenDashboard("soil")} className="block text-[#9AB5A7] hover:text-[#31D17C] cursor-pointer">
              Soil Stoichiometry
            </button>
            <button onClick={() => onOpenDashboard("market")} className="block text-[#9AB5A7] hover:text-[#31D17C] cursor-pointer">
              APMC Mandi Intelligence
            </button>
            <button onClick={() => onOpenDashboard("alerts")} className="block text-[#9AB5A7] hover:text-[#31D17C] cursor-pointer">
              Multi-Hazard Sentinel Alerts
            </button>
          </div>

          {/* Col 4: Scientific Provenance */}
          <div className="space-y-2 text-xs">
            <strong className="text-white block font-bold mb-2">Scientific Provenance</strong>
            <p className="text-[0.68rem] text-[#9AB5A7] leading-relaxed">
              Calibrated with Indian Council of Agricultural Research (ICAR) benchmarks and UAS Bangalore field trials.
            </p>
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[0.62rem] font-bold bg-[#173D27] text-[#31D17C] border border-[#24483A]">
              ICAR Validated 2026
            </span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between text-[0.7rem] text-[#9AB5A7]/70 gap-2">
          <span>&copy; 2026 AgriTwin AI. All rights reserved. Built for Smart Agricultural Excellence.</span>
          <div className="flex items-center gap-4">
            <button onClick={() => scrollTo("hero")} className="hover:text-white cursor-pointer">
              Back to Top &uarr;
            </button>
          </div>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* 9. INTERACTIVE DEMO MODAL                                                 */}
      {/* ========================================================================= */}
      {isDemoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative max-w-2xl w-full rounded-3xl bg-[#10352B] border border-[#24483A] p-6 text-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#24483A]">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-xl bg-[#31D17C]/20 text-[#31D17C] flex items-center justify-center">
                  <Play className="size-4 fill-[#31D17C]" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">AgriTwin AI Platform Overview</h3>
                  <p className="text-xs text-[#9AB5A7]">Autonomous Farm Digital Twin & Generative Agronomy</p>
                </div>
              </div>
              <button
                onClick={() => setIsDemoModalOpen(false)}
                className="size-8 rounded-full bg-[#09251F] border border-[#24483A] text-white/70 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-[#9AB5A7]">
              <div className="p-4 rounded-2xl bg-[#09251F] border border-[#24483A] space-y-2">
                <strong className="text-[#31D17C] block text-sm font-bold">1. Sentinel-2B 3D Multispectral Digital Twin</strong>
                <p>
                  High-resolution canopy reflectances map chlorophyll (NDVI), vegetative vigor, and evapotranspirative flux in real time.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#09251F] border border-[#24483A] space-y-2">
                <strong className="text-[#A3E635] block text-sm font-bold">2. Gemini 3.8 Flash Vision Crop Diagnostics</strong>
                <p>
                  Instant foliar disease identification from farmer smartphone uploads, delivering ICAR curative protocols with zero generic hallucination.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#09251F] border border-[#24483A] space-y-2">
                <strong className="text-[#38BDF8] block text-sm font-bold">3. Kisan Mitra Multilingual Voice Agronomist</strong>
                <p>
                  Natural two-way voice companion in Kannada, Hindi, Tamil, Telugu, and English providing situational agronomy and general assistance.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                onClick={() => setIsDemoModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#164536] text-white text-xs font-bold hover:bg-[#1d5946] cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setIsDemoModalOpen(false);
                  onOpenDashboard();
                }}
                className="px-5 py-2 rounded-xl bg-[#31D17C] text-[#061B17] text-xs font-black hover:bg-[#28b86d] shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <span>Launch Interactive Twin</span>
                <ArrowRight className="size-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
