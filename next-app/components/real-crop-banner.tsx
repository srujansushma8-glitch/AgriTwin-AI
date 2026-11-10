"use client";

import React, { useState } from "react";
import { getCropGallery, CropPhotoGallery } from "@/lib/crop-photos";
import { useTranslation, translateCrop } from "@/lib/i18n";
import {
  Sparkles,
  Camera,
  MapPin,
  Sprout,
  ArrowUpRight,
  Maximize2,
  CheckCircle2,
  Layers,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

interface RealCropBannerProps {
  cropName: string;
  fieldName?: string;
  location?: string;
  onOpen3DTwin?: () => void;
  onOpenHealth?: () => void;
  className?: string;
}

export function RealCropBanner({
  cropName,
  fieldName = "Mandya Central Terraces",
  location = "Mandya, Karnataka",
  onOpen3DTwin,
  onOpenHealth,
  className = "",
}: RealCropBannerProps) {
  const { t, language } = useTranslation();
  const gallery: CropPhotoGallery = getCropGallery(cropName);
  const [photoIndex, setPhotoIndex] = useState<number>(0);
  const [imgError, setImgError] = useState<boolean>(false);

  const activePhoto = gallery.photos[photoIndex] || gallery.photos[0];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPhotoIndex((prev) => (prev > 0 ? prev - 1 : gallery.photos.length - 1));
    setImgError(false);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPhotoIndex((prev) => (prev < gallery.photos.length - 1 ? prev + 1 : 0));
    setImgError(false);
  };

  return (
    <div
      className={`relative rounded-3xl overflow-hidden border border-[#E5E1D6] bg-[#FFFEFA] shadow-xl flex flex-col justify-between group transition-all duration-300 min-h-[580px] lg:min-h-[720px] ${className}`}
      style={{
        boxShadow: "0 20px 40px -15px rgba(23, 61, 43, 0.15)",
      }}
    >
      {/* Background Real Agricultural Crop Photograph */}
      <div className="absolute inset-0 z-0">
        <img
          src={imgError ? activePhoto.fallbackUrl || gallery.heroFallback : activePhoto.url}
          alt={`${gallery.cropName} real agricultural photograph`}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        {/* Soft natural gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#173D2B] via-[#173D2B]/40 to-black/20" />
      </div>

      {/* Top Header Floating Glass Pill */}
      <div className="relative z-10 p-4 sm:p-5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFFEFA]/90 backdrop-blur-md border border-[#E5E1D6] text-[#173D2B] text-xs font-bold shadow-md">
            <span className="size-2 rounded-full bg-[#173D2B] animate-pulse" />
            <span>{t("Real Farm Plot Photography")}</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handlePrev}
              title="Previous photograph"
              className="size-7 rounded-full bg-[#FFFEFA]/90 backdrop-blur-md border border-[#E5E1D6] hover:bg-[#E4EBDD] text-[#173D2B] flex items-center justify-center transition-colors cursor-pointer shadow-xs"
            >
              <ChevronLeft className="size-3.5" />
            </button>
            <span className="text-[0.65rem] font-mono text-white px-1 font-bold">
              {photoIndex + 1}/{gallery.photos.length}
            </span>
            <button
              onClick={handleNext}
              title="Next photograph"
              className="size-7 rounded-full bg-[#FFFEFA]/90 backdrop-blur-md border border-[#E5E1D6] hover:bg-[#E4EBDD] text-[#173D2B] flex items-center justify-center transition-colors cursor-pointer shadow-xs"
            >
              <ChevronRight className="size-3.5" />
            </button>
          </div>
        </div>

        {/* Crop Metadata Badge */}
        <div className="mt-4 p-3.5 rounded-2xl bg-[#FFFEFA]/95 backdrop-blur-md border border-[#E5E1D6] shadow-lg space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[0.68rem] uppercase tracking-wider font-extrabold text-[#173D2B]">
              {t(gallery.category)}
            </span>
            <span className="px-2 py-0.5 rounded-md text-[0.65rem] font-bold bg-[#E4EBDD] text-[#173D2B] border border-[#C9D9BE] flex items-center gap-1">
              <ShieldCheck className="size-3 text-[#173D2B]" />
              {t("Verified Specimen")}
            </span>
          </div>
          <h3 className="text-xl font-black text-[#173D2B] tracking-tight">
            {translateCrop(gallery.cropName, language)}
          </h3>
          <p className="text-[0.7rem] italic text-[#68756A]">
            {gallery.scientificName}
          </p>
        </div>
      </div>

      {/* Middle Photo Stage Badge */}
      <div className="relative z-10 px-5 my-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FFFEFA]/90 backdrop-blur-md border border-[#E5E1D6] text-xs text-[#20352A] font-medium shadow-sm">
          <Camera className="size-3.5 text-[#173D2B]" />
          <span className="font-bold text-[#173D2B]">{t(activePhoto.stage)}</span>
        </div>
      </div>

      {/* Bottom Content & Navigation Links */}
      <div className="relative z-10 p-5 space-y-3 bg-[#FFFEFA]/95 backdrop-blur-md border-t border-[#E5E1D6] text-[#20352A] pt-4 rounded-b-3xl">
        <div>
          <h4 className="text-sm font-bold text-[#173D2B]">
            {t(activePhoto.title)}
          </h4>
          <p className="text-xs text-[#68756A] mt-1 line-clamp-2 leading-relaxed">
            {t(activePhoto.caption)}
          </p>
        </div>

        {/* Cultivation specs quick pill row */}
        <div className="grid grid-cols-2 gap-2 text-[0.7rem] pt-2 border-t border-[#E5E1D6]">
          <div className="p-2 rounded-xl bg-[#F8F4EB] border border-[#E5E1D6] text-[#68756A]">
            <span className="block text-[0.65rem] font-bold uppercase text-[#173D2B]">{t("Cycle")}</span>
            <strong className="text-[#173D2B] font-mono">{gallery.durationDays} {t("Days")}</strong>
          </div>
          <div className="p-2 rounded-xl bg-[#F8F4EB] border border-[#E5E1D6] text-[#68756A]">
            <span className="block text-[0.65rem] font-bold uppercase text-[#173D2B]">{t("Water")}</span>
            <strong className="text-[#173D2B] font-mono">{gallery.waterDemand.split(" ")[0]} mm/d</strong>
          </div>
        </div>

        {/* Action Buttons: 3D Twin & Crop Health */}
        <div className="pt-2 flex flex-col sm:flex-row gap-2">
          {onOpen3DTwin && (
            <button
              onClick={onOpen3DTwin}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#173D2B] hover:bg-[#102F22] text-white text-xs font-bold shadow-md transition-all cursor-pointer"
            >
              <Layers className="size-3.5" />
              <span>{t("3D Digital Twin")}</span>
              <ArrowUpRight className="size-3" />
            </button>
          )}

          {onOpenHealth && (
            <button
              onClick={onOpenHealth}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#E4EBDD] hover:bg-[#D5E2CC] text-[#173D2B] border border-[#C9D9BE] text-xs font-bold transition-all cursor-pointer"
            >
              <Sparkles className="size-3.5 text-[#173D2B]" />
              <span>{t("AI Diagnostics")}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

