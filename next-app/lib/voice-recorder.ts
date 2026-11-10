"use client";

export type RecordingState = "ready" | "listening" | "processing" | "speaking" | "error";

export interface VoiceRecorderCallbacks {
  onStateChange: (state: RecordingState) => void;
  onInterimResult: (transcript: string) => void;
  onFinalResult: (transcript: string) => void;
  onError: (errorMsg: string) => void;
  onAudioLevel?: (level: number) => void; // 0.0 to 1.0 for visual waveform
}

export class VoiceRecognitionManager {
  private recognition: any = null;
  private mediaStream: MediaStream | null = null;
  private audioCtx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private animFrameId: number | null = null;
  private state: RecordingState = "ready";
  private currentLanguage: string = "kn";

  private bcp47Map: Record<string, string> = {
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

  constructor(private callbacks: VoiceRecorderCallbacks) {}

  public isSupported(): boolean {
    if (typeof window === "undefined") return false;
    return !!(
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition
    );
  }

  public setLanguage(lang: string) {
    this.currentLanguage = lang;
    if (this.recognition) {
      this.recognition.lang = this.bcp47Map[lang] || "kn-IN";
    }
  }

  public async startListening(lang?: string) {
    if (lang) this.currentLanguage = lang;

    // Check browser support
    const SpeechRec =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRec) {
      this.callbacks.onError(
        "Voice recognition not directly supported by this browser. Please type or use quick questions."
      );
      return;
    }

    try {
      // 1. Request microphone permission
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.initAudioAnalyser(this.mediaStream);

      // 2. Initialize SpeechRecognition
      this.recognition = new SpeechRec();
      this.recognition.lang = this.bcp47Map[this.currentLanguage] || "kn-IN";
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 1;

      this.recognition.onstart = () => {
        this.state = "listening";
        this.callbacks.onStateChange("listening");
      };

      this.recognition.onresult = (event: any) => {
        let interim = "";
        let final = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        if (interim) {
          this.callbacks.onInterimResult(interim);
        }
        if (final) {
          this.callbacks.onFinalResult(final);
          this.stopListening();
        }
      };

      this.recognition.onerror = (event: any) => {
        this.stopAudioAnalyser();
        this.state = "error";
        this.callbacks.onStateChange("error");
        if (event.error !== "no-speech") {
          this.callbacks.onError(`Voice recognition error: ${event.error}`);
        } else {
          this.state = "ready";
          this.callbacks.onStateChange("ready");
        }
      };

      this.recognition.onend = () => {
        this.stopAudioAnalyser();
        if (this.state === "listening") {
          this.state = "processing";
          this.callbacks.onStateChange("processing");
        }
      };

      this.recognition.start();
    } catch (err: any) {
      this.state = "error";
      this.callbacks.onStateChange("error");
      this.callbacks.onError(
        "Microphone access was denied. Please allow microphone permissions in your browser."
      );
    }
  }

  public stopListening() {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {}
      this.recognition = null;
    }
    this.stopAudioAnalyser();
  }

  private initAudioAnalyser(stream: MediaStream) {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new AudioCtx();
      const source = this.audioCtx.createMediaStreamSource(stream);
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 64;
      source.connect(this.analyser);

      const bufferLength = this.analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const checkVolume = () => {
        if (!this.analyser) return;
        this.analyser.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const avg = sum / bufferLength / 255.0; // 0.0 to 1.0

        if (this.callbacks.onAudioLevel) {
          this.callbacks.onAudioLevel(avg);
        }

        this.animFrameId = requestAnimationFrame(checkVolume);
      };

      checkVolume();
    } catch {}
  }

  private stopAudioAnalyser() {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((t) => t.stop());
      this.mediaStream = null;
    }
    if (this.audioCtx) {
      this.audioCtx.close().catch(() => {});
      this.audioCtx = null;
    }
    this.analyser = null;
    if (this.callbacks.onAudioLevel) {
      this.callbacks.onAudioLevel(0);
    }
  }
}

