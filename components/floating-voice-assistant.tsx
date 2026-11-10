"use client";

import React, { useState } from "react";
import { Mic, X, Bot, Sparkles, Volume2, Globe, ArrowUpRight } from "lucide-react";
import { VoiceAgronomistTab } from "@/components/tabs/voice-agronomist-tab";
import { NavTab } from "@/components/sidebar";
import { useTranslation } from "@/lib/i18n";

interface FloatingVoiceAssistantProps {
  onNavigateToTab?: (tab: NavTab) => void;
  activeTab?: NavTab;
}

export function FloatingVoiceAssistant({
  onNavigateToTab,
  activeTab,
}: FloatingVoiceAssistantProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // If already on the voice agronomist tab, don't show the duplicate floating modal
  if (activeTab === "voice-agronomist") return null;

  return (
    <>
      {/* Floating Trigger Pill */}
      <aside aria-label="Voice Agronomist Quick Access" className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open AI Voice Agronomist assistant"
          title="Open AI Voice Agronomist (ಕಿಸಾನ್ ಮಿತ್ರ)"
          className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#173D2B] hover:bg-[#102F22] text-[#FFFEFA] shadow-xl border border-[#D0DEC4] cursor-pointer transition-all hover:scale-105 active:scale-95"
        >
          <div className="relative flex size-6 items-center justify-center">
            <Mic className="size-5 text-[#FFFEFA]" />
            <span className="absolute -top-1 -right-1 size-2 rounded-full bg-[#C9A65B] ring-2 ring-[#173D2B] animate-ping" />
          </div>
          <span className="text-xs font-extrabold tracking-wide hidden sm:inline">
            {t("Voice Agronomist")}
          </span>
          <span className="text-[0.68rem] px-2 py-0.5 rounded-full bg-[#FFFEFA]/20 font-mono font-bold text-[#FFFEFA]">
            ಕನ್ನಡ / 9 Langs
          </span>
        </button>
      </aside>

      {/* Floating Drawer / Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl border border-[#E5E1D6] bg-[#FFFEFA] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 px-6 border-b border-[#E5E1D6] bg-[#F8F4EB]">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-xl bg-[#E4EBDD] text-[#173D2B] flex items-center justify-center border border-[#D0DEC4]">
                  <Bot className="size-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-[#173D2B]">
                    {t("Voice Agronomist")}
                  </h3>
                  <p className="text-[0.68rem] text-[#68756A]">
                    Indian Language Agricultural Spoken Assistant
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {onNavigateToTab && (
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      onNavigateToTab("voice-agronomist");
                    }}
                    title="Open Fullscreen Page"
                    className="flex items-center gap-1 px-2.5 py-1 rounded-xl border border-[#E5E1D6] bg-[#FFFEFA] text-[#173D2B] hover:bg-[#E4EBDD] text-xs font-semibold cursor-pointer transition-colors"
                  >
                    <span>{t("Full Tab")}</span>
                    <ArrowUpRight className="size-3.5" />
                  </button>
                )}

                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-xl border border-[#E5E1D6] text-[#68756A] hover:text-[#173D2B] hover:bg-[#E4EBDD] cursor-pointer transition-colors"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>

            {/* Modal Body with Voice Agronomist Interface */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#F8F4EB]">
              <VoiceAgronomistTab />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

