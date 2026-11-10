"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, AlertTriangle } from "lucide-react";
import { sendCopilotChat } from "@/lib/api";
import { useTranslation } from "@/lib/i18n";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  time: string;
  suggestedActions?: string[];
  alert?: string;
}

interface CopilotChatProps {
  selectedPlotId: string;
}

const PROMPT_CHIPS = [
  "Which crop is suitable for my soil?",
  "Recommend Nitrogen-Potassium Fertigation Schedule",
  "What is the Root Zone Moisture Deficit?",
  "Explain PM-Kisan & Fasal Bima Scheme",
  "How does AgriTwin AI predict crop diseases?",
  "Explain CWSI and VPD Relationship for Pollination",
];

export function CopilotChat({ selectedPlotId }: CopilotChatProps) {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      sender: "bot",
      text: "Welcome to AgriTwin Copilot. I continuously analyze multi-depth soil moisture, microclimate VPD, and canopy thermal vigor to help safeguard crop yields against extreme climate volatility. How can I assist your crop management today?",
      time: "Now",
      suggestedActions: [
        "Simulate Flash Drought Shock",
        "Inspect Root Deficit",
        "Generate Fertigation Schedule",
      ],
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const msgCounter = useRef(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    msgCounter.current += 1;
    const currentId = `user-${msgCounter.current}`;

    const userMsg: Message = {
      id: currentId,
      sender: "user",
      text: query,
      time: "Just now",
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setLoading(true);

    try {
      const historyToSend = messages.slice(-8).map((m) => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.text,
      }));
      const res = await sendCopilotChat(query, selectedPlotId, historyToSend);
      msgCounter.current += 1;
      const botId = `bot-${msgCounter.current}`;
      const botMsg: Message = {
        id: botId,
        sender: "bot",
        text: res.reply,
        time: res.timestamp,
        suggestedActions: res.suggested_actions,
        alert: res.alert_detected,
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      msgCounter.current += 1;
      const botId = `bot-${msgCounter.current}`;
      const errBotMsg: Message = {
        id: botId,
        sender: "bot",
        text: "Unable to receive response from Kisan Mitra AI assistant. Please verify that the backend server is running on http://localhost:8000.",
        time: "Just now",
      };
      setMessages((prev) => [...prev, errBotMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-[#E5E1D6] bg-[#FFFEFA] p-5 shadow-xs flex flex-col h-[520px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E5E1D6]">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-[#E4EBDD] text-[#173D2B] border border-[#C9D9BE]">
            <Bot className="size-4" />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-[#173D2B]">
              {t("Autonomous Agronomist Copilot", "Autonomous Agronomist Copilot")}
            </h3>
            <span className="text-[0.65rem] text-[#68756A]">
              AI Agricultural Twin Reasoning Engine
            </span>
          </div>
        </div>
        <span className="rounded-full bg-[#E4EBDD] px-2.5 py-0.5 text-[0.65rem] font-bold text-[#173D2B] border border-[#C9D9BE]">
          Ready
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-1 text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
          >
            <div className="flex items-start gap-2 max-w-[88%]">
              {msg.sender === "bot" && (
                <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-[#E4EBDD] text-[#173D2B] border border-[#C9D9BE]">
                  <Bot className="size-3" />
                </div>
              )}

              <div>
                <div
                  className={`rounded-2xl px-4 py-3 whitespace-pre-line leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-[#173D2B] text-white rounded-tr-xs shadow-xs"
                      : "bg-[#F8F4EB] border border-[#E5E1D6] text-[#20352A] rounded-tl-xs"
                  }`}
                >
                  {msg.alert && (
                    <div className="mb-2 flex items-center gap-1.5 rounded-lg bg-rose-100 px-2.5 py-1 text-xs font-bold text-rose-700 border border-rose-200">
                      <AlertTriangle className="size-3.5 shrink-0" />
                      <span>{msg.alert}</span>
                    </div>
                  )}
                  {msg.text}
                </div>

                {/* Suggested actions chips */}
                {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {msg.suggestedActions.map((action, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(action)}
                        className="rounded-lg border border-[#C9D9BE] bg-[#E4EBDD] hover:bg-[#D5E2CC] text-[#173D2B] px-2.5 py-1 text-[0.68rem] font-bold transition-colors cursor-pointer"
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                )}

                <span className="text-[0.65rem] text-[#68756A] mt-1 block px-1">
                  {msg.time}
                </span>
              </div>

              {msg.sender === "user" && (
                <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-[#E4EBDD] text-[#173D2B]">
                  <User className="size-3" />
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-xs text-[#68756A]">
            <Bot className="size-4 animate-spin text-[#173D2B]" />
            <span>Analyzing digital twin telemetry & climate models...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="pt-2 pb-2 flex gap-1.5 overflow-x-auto no-scrollbar">
        {PROMPT_CHIPS.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(chip)}
            className="shrink-0 rounded-full border border-[#E5E1D6] bg-[#F8F4EB] hover:bg-[#E4EBDD] text-[#173D2B] px-2.5 py-0.5 text-[0.65rem] font-bold transition-colors cursor-pointer"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="pt-2 border-t border-[#E5E1D6] flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("Ask AgriTwin Agronomist...")}
          className="flex-1 rounded-xl border border-[#E5E1D6] bg-[#F8F4EB] px-3 py-2 text-xs text-[#20352A] placeholder:text-[#68756A] focus:outline-none focus:ring-1 focus:ring-[#173D2B]"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="flex size-8 items-center justify-center rounded-xl bg-[#173D2B] text-white hover:bg-[#102F22] disabled:opacity-50 transition-colors cursor-pointer shadow-2xs"
        >
          <Send className="size-3.5" />
        </button>
      </form>
    </div>
  );
}
