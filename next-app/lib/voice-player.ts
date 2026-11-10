"use client";

import { synthesizeVoiceSpeech } from "./api";

export type VoicePlayerStatus = "idle" | "loading" | "playing" | "paused" | "error";

export interface VoicePlayerState {
  status: VoicePlayerStatus;
  currentMessageId: string | null;
  speed: number;
  progress: number;
  error: string | null;
}

type StateListener = (state: VoicePlayerState) => void;

class VoicePlayerManager {
  private audio: HTMLAudioElement | null = null;
  private currentMessageId: string | null = null;
  private currentText: string | null = null;
  private currentLang: string = "kn";
  private speed: number = 1.0;
  private status: VoicePlayerStatus = "idle";
  private progress: number = 0;
  private error: string | null = null;
  private listeners: Set<StateListener> = new Set();
  private progressInterval: any = null;

  constructor() {
    if (typeof window !== "undefined") {
      this.initAudio();
    }
  }

  private initAudio() {
    if (this.audio) {
      this.audio.pause();
      this.audio.src = "";
    }
    this.audio = new Audio();
    this.audio.preload = "auto";

    this.audio.addEventListener("playing", () => {
      this.status = "playing";
      this.notify();
      this.startProgress();
    });

    this.audio.addEventListener("pause", () => {
      if (this.status !== "idle" && this.status !== "error") {
        this.status = "paused";
        this.notify();
        this.stopProgress();
      }
    });

    this.audio.addEventListener("ended", () => {
      this.status = "idle";
      this.currentMessageId = null;
      this.progress = 100;
      this.stopProgress();
      this.notify();
    });

    this.audio.addEventListener("error", () => {
      // If HTML5 audio stream fails, fallback gracefully to browser SpeechSynthesis
      if (this.currentText) {
        this.fallbackSpeechSynthesis(this.currentText, this.currentLang);
      } else {
        this.status = "error";
        this.error = "Audio playback failed";
        this.stopProgress();
        this.notify();
      }
    });
  }

  private startProgress() {
    this.stopProgress();
    this.progressInterval = setInterval(() => {
      if (this.audio && this.audio.duration > 0) {
        this.progress = (this.audio.currentTime / this.audio.duration) * 100;
        this.notify();
      }
    }, 100);
  }

  private stopProgress() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
  }

  public subscribe(listener: StateListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => this.listeners.delete(listener);
  }

  public getState(): VoicePlayerState {
    return {
      status: this.status,
      currentMessageId: this.currentMessageId,
      speed: this.speed,
      progress: this.progress,
      error: this.error,
    };
  }

  private notify() {
    const s = this.getState();
    this.listeners.forEach((fn) => fn(s));
  }

  public async speakMessage(
    messageId: string,
    text: string,
    lang: string = "kn",
    speed: number = 1.0
  ) {
    // 1. Stop any currently playing audio before starting new response
    this.stop();

    this.currentMessageId = messageId;
    this.currentText = text;
    this.currentLang = lang;
    this.speed = speed;
    this.status = "loading";
    this.error = null;
    this.progress = 0;
    this.notify();

    try {
      // 2. Fetch natural neural speech audio from backend
      const res = await synthesizeVoiceSpeech({
        text,
        language: lang,
        speed,
      });

      if (!this.audio) this.initAudio();

      if (this.audio && res.audio_base64) {
        this.audio.src = `data:${res.content_type || "audio/mpeg"};base64,${res.audio_base64}`;
        this.audio.playbackRate = speed;
        await this.audio.play();
      } else {
        // Fallback to Web Speech API if backend audio missing
        this.fallbackSpeechSynthesis(text, lang);
      }
    } catch (err: any) {
      // Fallback to Web Speech API immediately
      this.fallbackSpeechSynthesis(text, lang);
    }
  }

  private fallbackSpeechSynthesis(text: string, lang: string) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      this.status = "error";
      this.error = "Speech synthesis not supported on this device";
      this.notify();
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);

    const bcpMap: Record<string, string> = {
      kn: "kn-IN",
      hi: "hi-IN",
      en: "en-IN",
      ta: "ta-IN",
      te: "te-IN",
      ml: "ml-IN",
      mr: "mr-IN",
      bn: "bn-IN",
      pa: "pa-IN",
    };
    utterance.lang = bcpMap[lang] || "kn-IN";
    utterance.rate = this.speed;

    utterance.onstart = () => {
      this.status = "playing";
      this.notify();
    };

    utterance.onend = () => {
      this.status = "idle";
      this.currentMessageId = null;
      this.notify();
    };

    utterance.onerror = () => {
      this.status = "error";
      this.error = "Browser speech synthesis error";
      this.notify();
    };

    window.speechSynthesis.speak(utterance);
  }

  public pause() {
    if (this.audio && this.status === "playing") {
      this.audio.pause();
    } else if (typeof window !== "undefined" && window.speechSynthesis?.speaking) {
      window.speechSynthesis.pause();
      this.status = "paused";
      this.notify();
    }
  }

  public resume() {
    if (this.audio && this.status === "paused") {
      this.audio.play().catch(() => {});
    } else if (typeof window !== "undefined" && window.speechSynthesis?.paused) {
      window.speechSynthesis.resume();
      this.status = "playing";
      this.notify();
    }
  }

  public stop() {
    this.stopProgress();
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    this.status = "idle";
    this.currentMessageId = null;
    this.progress = 0;
    this.notify();
  }

  public replay() {
    if (this.currentMessageId && this.currentText) {
      this.speakMessage(
        this.currentMessageId,
        this.currentText,
        this.currentLang,
        this.speed
      );
    }
  }

  public setSpeed(speed: number) {
    this.speed = speed;
    if (this.audio) {
      this.audio.playbackRate = speed;
    }
    this.notify();
  }
}

export const voicePlayer = new VoicePlayerManager();

