"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Square,
  Sparkles,
  Send,
  Globe,
  Bot,
  User,
  AlertTriangle,
  Droplets,
  Sprout,
  Sun,
  Shield,
  Activity,
  Layers,
  CheckCircle2,
  Sliders,
  HelpCircle,
  Radio,
  TrendingUp,
} from "lucide-react";
import {
  sendVoiceAgronomistMessage,
  fetchVoiceLanguages,
  fetchSpokenAlerts,
  VoiceLanguage,
  VoiceAgronomistResponse,
} from "@/lib/api";
import { voicePlayer, VoicePlayerState } from "@/lib/voice-player";
import { VoiceRecognitionManager, RecordingState } from "@/lib/voice-recorder";
import { useTranslation, Language, translateCrop } from "@/lib/i18n";

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  spokenSummary?: string;
  language: string;
  timestamp: string;
  suggestedActions?: string[];
  alert?: string | null;
  fieldSnapshot?: Record<string, any>;
  dataSource?: string;
}

const NATIVE_LANGUAGE_PROMPTS: Record<string, {
  qWater: string;
  qYellow: string;
  qFert: string;
  qDisease: string;
  qYield: string;
  qPotato?: string;
  qCarrot?: string;
  qBeetroot?: string;
  qMarket?: string;
  qCropSuitability?: string;
  qSchemes?: string;
  qAI?: string;
  qOrganic?: string;
  qLivestock?: string;
}> = {
  kn: {
    qWater: "ನನ್ನ ಬೆಳೆಗೆ ಎಷ್ಟು ನೀರು ಬೇಕು?",
    qYellow: "ರಾಗಿ ಎಲೆಗಳು ಹಳದಿಯಾಗಲು ಕಾರಣವೇನು?",
    qFert: "ಈ ಹಂತದಲ್ಲಿ ಯಾವ ಗೊಬ್ಬರ ಎಷ್ಟು ಹಾಕಬೇಕು?",
    qDisease: "ಹೊಲದಲ್ಲಿ ಬೆಂಕಿ ರೋಗ ಅಥವಾ ಕೀಟ ಬಾಧೆ ಇದೆಯೇ?",
    qYield: "ಪ್ರಸ್ತುತ ಬೆಳೆಯ ಆರೋಗ್ಯ ಮತ್ತು ಇಳುವರಿ ಅಂದಾಜು ಎಷ್ಟು?",
    qPotato: "ಆಲೂಗಡ್ಡೆ ಎಲೆಗಳು ಹಳದಿಯಾಗುತ್ತಿವೆ, ಏನು ಮಾಡಬೇಕು?",
    qCarrot: "ಕ್ಯಾರೆಟ್ ಬೆಳೆಗೆ ದಿನಕ್ಕೆ ಎಷ್ಟು ನೀರು ಬೇಕು?",
    qBeetroot: "ಬೀಟ್‌ರೂಟ್ ಕೊಯ್ಲು ಯಾವಾಗ ಮಾಡಬೇಕು?",
    qMarket: "ಇಂದಿನ ಮಾರುಕಟ್ಟೆ ಬೆಲೆ ಎಷ್ಟು ಮತ್ತು ಈಗಲೇ ಮಾರಾಟ ಮಾಡಬೇಕೆ ಅಥವಾ ಕಾಯಬೇಕೆ?",
    qCropSuitability: "ನನ್ನ ಹೊಲಕ್ಕೆ ಯಾವ ಬೆಳೆ ಸೂಕ್ತ?",
    qSchemes: "ಪಿಎಂ ಕಿಸಾನ್ ಮತ್ತು ಬೆಳೆ ವಿಮೆ ಯೋಜನೆ ವಿವರ ತಿಳಿಸಿ",
    qAI: "ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆ (AI) ಎಂದರೇನು?",
    qOrganic: "ನೈಸರ್ಗಿಕ ಜೀವಾಮೃತ ತಯಾರಿಸುವುದು ಹೇಗೆ?",
    qLivestock: "ಹಸುವಿನ ಹಾಲಿನ ಇಳುವರಿ ಹೆಚ್ಚಿಸುವುದು ಹೇಗೆ?",
  },
  en: {
    qWater: "How much water does my crop need?",
    qYellow: "Why are my crop leaves turning yellow?",
    qFert: "How much fertilizer should I apply now?",
    qDisease: "Is there any blast disease or pest risk?",
    qYield: "What is my current crop health and expected yield?",
    qPotato: "My potato leaves are turning yellow, what should I do?",
    qCarrot: "How much water does my carrot crop require?",
    qBeetroot: "When is the right time to harvest beetroot?",
    qMarket: "What is today's APMC price and should I sell now or hold?",
    qCropSuitability: "Which crop is suitable for my field?",
    qSchemes: "Explain PM-Kisan and PMFBY crop insurance schemes",
    qAI: "What is Artificial Intelligence and how does it help farmers?",
    qOrganic: "How to prepare natural Jeevamrutha?",
    qLivestock: "How to increase milk yield in dairy cows?",
  },
  hi: {
    qWater: "मेरी फसल को कितने पानी की आवश्यकता है?",
    qYellow: "फसल की पत्तियां पीली क्यों पड़ रही हैं?",
    qFert: "इस अवस्था में कितना खाद डालना चाहिए?",
    qDisease: "क्या खेत में किसी बीमारी या कीट का खतरा है?",
    qYield: "वर्तमान फसल स्वास्थ्य और अपेक्षित पैदावार क्या है?",
    qPotato: "आलू के पत्ते पीले पड़ रहे हैं, मुझे क्या करना चाहिए?",
    qCarrot: "गाजर की फसल को कितना पानी चाहिए?",
    qBeetroot: "चुकंदर की कटाई कब करनी चाहिए?",
    qMarket: "आज का मंडी भाव क्या है और क्या मुझे अभी बेचना चाहिए?",
    qCropSuitability: "मेरे खेत के लिए कौन सी फसल सबसे उपयुक्त है?",
    qSchemes: "पीएम किसान और फसल बीमा योजना की जानकारी दें",
    qAI: "आर्टिफिशियल इंटेलिजेंस (AI) क्या है?",
    qOrganic: "जीवामृत कैसे तैयार करें?",
    qLivestock: "दूध का उत्पादन कैसे बढ़ाएं?",
  },
  ta: {
    qWater: "என் பயிருக்கு எவ்வளவு தண்ணீர் தேவை?",
    qYellow: "இலைகள் மஞ்சள் நிறமாக மாறுவது ஏன்?",
    qFert: "இப்போது எவ்வளவு உரம் இட வேண்டும்?",
    qDisease: "பயிரில் பூச்சி அல்லது நோய் தாக்குதல் உள்ளதா?",
    qYield: "பயிர் ஆரோக்கியம் மற்றும் மகசூல் எவ்வளவு?",
    qPotato: "உருளைக்கிழங்கு இலைகள் மஞ்சள் நிறமாகிறது, என்ன செய்ய வேண்டும்?",
    qCarrot: "கேரட் பயிருக்கு நாள் ஒன்றுக்கு எவ்வளவு தண்ணீர் தேவை?",
    qBeetroot: "பீட்ரூட் அறுவடை எப்போது செய்ய வேண்டும்?",
    qMarket: "இன்றைய சந்தை விலை என்ன மற்றும் இப்போது விற்க வேண்டுமா?",
  },
  te: {
    qWater: "నా పంటకు ఎంత నీరు అవసరం?",
    qYellow: "ఆకులు పసుపు రంగులోకి ఎందుకు మారుతున్నాయి?",
    qFert: "ఇప్పుడు ఎంత ఎరువు వేయాలి?",
    qDisease: "పంటకు తెగుళ్లు లేదా కీటకాల ముప్పు ఉందా?",
    qYield: "ప్రస్తుత పంట ఆరోగ్యం మరియు దిగుబడి అంచనా ఎంత?",
    qPotato: "బంగాళాదుంప ఆకులు పసుపు రంగులోకి మారుతున్నాయి, ఏమి చేయాలి?",
    qCarrot: "క్యారెట్ పంటకు రోజుకు ఎంత నీరు కావాలి?",
    qBeetroot: "బీట్‌రూట్ కోత ఎప్పుడు చేయాలి?",
    qMarket: "ఈ రోజు మార్కెట్ ధర ఎంత మరియు ఇప్పుడే అమ్మాలా లేక ఆగాలా?",
  },
  ml: {
    qWater: "എന്റെ വിളയ്ക്ക് എത്ര വെള്ളം ആവശ്യമാണ്?",
    qYellow: "ഇലകൾ മഞ്ഞനിറമാകുന്നത് എന്തുകൊണ്ട്?",
    qFert: "ഇപ്പോൾ എത്ര വളം പ്രയോഗിക്കണം?",
    qDisease: "വിളയ്ക്ക് രോഗബാധയോ കീടശല്യമോ ഉണ്ടോ?",
    qYield: "വിളവിന്റെ ആരോഗ്യവും പ്രതീക്ഷിക്കുന്ന വിളവും എത്ര?",
    qPotato: "ഉരുളക്കിഴങ്ങ് ഇലകൾ മഞ്ഞനിറമാകുന്നു, എന്തുചെയ്യണം?",
    qCarrot: "കാരറ്റ് വിളയ്ക്ക് എത്ര വെള്ളം വേണം?",
    qBeetroot: "ബീറ്റ്‌റൂട്ട് എപ്പോഴാണ് വിളവെടുക്കേണ്ടത്?",
    qMarket: "ഇന്നത്തെ വിപണി വില എത്രയാണ്?",
  },
  mr: {
    qWater: "माझ्या पिकाला किती पाण्याची गरज आहे?",
    qYellow: "पिकाची पाने पिवळी का पडत आहेत?",
    qFert: "या अवस्थेत किती खत द्यावे?",
    qDisease: "पिकावर रोग किंवा किडीचा धोका आहे का?",
    qYield: "सध्याचे पीक आरोग्य आणि अपेक्षित उत्पादन किती?",
    qPotato: "बटाट्याची पाने पिवळी पडत आहेत, काय करावे?",
    qCarrot: "गाजर पिकाला दररोज किती पाणी लागते?",
    qBeetroot: "बीटची काढणी कधी करावी?",
    qMarket: "आजचा बाजार भाव काय आहे आणि आता विकावे की थांबावे?",
  },
  bn: {
    qWater: "আমার ফসলে কতটা জলের প্রয়োজন?",
    qYellow: "গাছের পাতা হলুদ হয়ে যাচ্ছে কেন?",
    qFert: "এখন কতটা সার প্রয়োগ করা উচিত?",
    qDisease: "ফসলে কি কোনো রোগ বা পোকার আক্রমণ আছে?",
    qYield: "বর্তমান ফসলের স্বাস্থ্য ও ফলন কেমন?",
    qPotato: "আলু গাছের পাতা হলুদ হয়ে যাচ্ছে, কী করব?",
    qCarrot: "গাজর ফসলে কতটা জল দিতে হবে?",
    qBeetroot: "বিট কখন তুলতে হবে?",
    qMarket: "আজকের বাজার দর কত এবং এখনই বিক্রি করব কি?",
  },
  pa: {
    qWater: "ਮੇਰੀ ਫਸਲ ਨੂੰ ਕਿੰਨੇ ਪਾਣੀ ਦੀ ਲੋੜ ਹੈ?",
    qYellow: "ਪੱਤੇ ਪੀਲੇ ਕਿਉਂ ਪੈ ਰਹੇ ਹਨ?",
    qFert: "ਇਸ ਵੇਲੇ ਕਿੰਨੀ ਖਾਦ ਪਾਉਣੀ ਚਾਹੀਦੀ ਹੈ?",
    qDisease: "ਕੀ ਫਸਲ 'ਤੇ ਕਿਸੇ ਬਿਮਾਰੀ ਦਾ ਖਤਰਾ ਹੈ?",
    qYield: "ਮੇਰੀ ਫਸਲ ਦੀ ਸਿਹਤ ਅਤੇ ਅਨੁਮਾਨਿਤ ਝਾੜ ਕਿੰਨਾ ਹੈ?",
    qPotato: "ਆਲੂ ਦੇ ਪੱਤੇ ਪੀਲੇ ਪੈ ਰਹੇ ਹਨ, ਕੀ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ?",
    qCarrot: "ਗਾਜਰ ਦੀ ਫਸਲ ਨੂੰ ਕਿੰਨਾ ਪਾਣੀ ਚਾਹੀਦਾ ਹੈ?",
    qBeetroot: "ਚੁਕੰਦਰ ਦੀ ਪੁਟਾਈ ਕਦੋਂ ਕਰਨੀ ਚਾਹੀਦੀ ਹੈ?",
    qMarket: "ਅੱਜ ਦਾ ਮੰਡੀ ਭਾਅ ਕੀ ਹੈ ਅਤੇ ਕੀ ਹੁਣੇ ਵੇਚਣਾ ਚਾਹੀਦਾ ਹੈ?",
  },
};

const INITIAL_MESSAGES: Record<string, string> = {
  kn: "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಅಗ್ರಿಟ್ವಿನ್ ಕೃಷಿ ಮಿತ್ರ (Kisan Mitra). ನಿಮ್ಮ ಮಂಡ್ಯ ರಾಗಿ ಮತ್ತು ಟೊಮೆಟೊ ಹೊಲದ ಮಣ್ಣಿನ ತೇವಾಂಶ 24.5% ಇದೆ. ನೀರಾವರಿ, ರೋಗ ನಿಯಂತ್ರಣ ಅಥವಾ ಗೊಬ್ಬರದ ಬಗ್ಗೆ ಮೈಕ್ರೋಫೋನ್ ಒತ್ತಿ ಮಾತನಾಡಿ.",
  en: "Greetings! I am your AgriTwin Voice Agronomist. Current soil moisture in your Mandya field is 24.5%. Press the microphone to ask about irrigation, disease control, or fertilizer schedules.",
  hi: "नमस्ते! मैं आपका एग्रीट्विन किसान मित्र हूँ। आपके खेत में मिट्टी की नमी 24.5% है। सिंचाई, रोग नियंत्रण या खाद के बारे में माइक दबाकर पूछें।",
  ta: "வணக்கம்! நான் உங்கள் அக்ரிட்வின் விவசாய உதவியாளர். உங்கள் பயிரில் மண் ஈரப்பதம் 24.5% ஆக உள்ளது. பேச மைக்ரோஃபோனை அழுத்தவும்.",
  te: "నమస్కారం! నేను మీ అగ్రిట్విన్ వ్యవసాయ మిత్రుడిని. మీ పొలంలో నేల తేమ 24.5% గా ఉంది. మాట్లాడటానికి మైక్ నొక్కండి.",
  ml: "നമസ്കാരം! ഞാൻ നിങ്ങളുടെ അഗ്രിട്വിൻ കൃഷി സഹായിയാണ്. നിങ്ങളുടെ തോട്ടത്തിലെ മണ്ണിലെ ഈർപ്പം 24.5% ആണ്. ചോദിക്കാൻ മൈക്ക് അമർത്തുക.",
  mr: "नमस्कार! मी तुमचा अ‍ॅग्रीट्विन कृषी मित्र आहे. तुमच्या शेतातील मातीचा ओलावा 24.5% आहे. बोलण्यासाठी माइक दाबा.",
  bn: "নমস্কার! আমি আপনার এগ্রিটুইন কৃষি মিত্র। আপনার জমিতে মাটির আর্দ্রতা ২৪.৫%। কথা বলতে মাইক্রোফোনে চাপ দিন।",
  pa: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ ਐਗਰੀਟਵਿਨ ਕਿਸਾਨ ਮਿੱਤਰ ਹਾਂ। ਤੁਹਾਡੇ ਖੇਤ ਵਿੱਚ ਮਿੱਟੀ ਦੀ ਨਮੀ 24.5% ਹੈ। ਬੋਲਣ ਲਈ ਮਾਈਕ ਦਬਾਓ।",
};

function buildWelcomeMessage(lang: string, field?: any, crop?: string): string {
  const cropName = crop || field?.crop_type || "Potato";
  const loc = field?.location || "Hassan, Karnataka";
  const moisture = field?.soil_moisture_percentage || 28.5;
  switch (lang) {
    case "en":
      return `Greetings! I am your AgriTwin Voice Agronomist. Current soil moisture in your ${cropName} field (${loc}) is ${moisture}%. Press the microphone or ask about irrigation, disease control, or market prices.`;
    case "hi":
      return `नमस्ते! मैं आपका एग्रीट्विन किसान मित्र हूँ। आपके ${loc} के ${cropName} खेत में मिट्टी की नमी ${moisture}% है। सिंचाई, रोग नियंत्रण या खाद के बारे में माइक दबाकर पूछें।`;
    case "ta":
      return `வணக்கம்! நான் உங்கள் அக்ரிட்வின் விவசாய உதவியாளர். உங்கள் ${loc} ${cropName} பயிரில் மண் ஈரப்பதம் ${moisture}% ஆக உள்ளது. பேச மைக்ரோஃபோனை அழுத்தவும்.`;
    case "te":
      return `నమస్కారం! నేను మీ అగ్రిట్విన్ వ్యవసాయ మిత్రుడిని. మీ ${loc} ${cropName} పొలంలో నేల తేమ ${moisture}% గా ఉంది. మాట్లాడటానికి మైక్ నొక్కండి.`;
    case "ml":
      return `നമസ്കാരം! ഞാൻ നിങ്ങളുടെ അഗ്രിട്വിൻ കൃഷി സഹായിയാണ്. നിങ്ങളുടെ ${loc} ${cropName} തോട്ടത്തിലെ മണ്ണിലെ ഈർപ്പം ${moisture}% ആണ്. ചോദിക്കാൻ മൈക്ക് അമർത്തുക.`;
    case "mr":
      return `नमस्कार! मी तुमचा अ‍ॅग्रीट्विन कृषी मित्र आहे. तुमच्या ${loc} येथील ${cropName} शेतातील मातीचा ओलावा ${moisture}% आहे. बोलण्यासाठी माइक दाबा.`;
    case "bn":
      return `নমস্কার! আমি আপনার এগ্রিটুইন কৃষি মিত্র। আপনার ${loc} ${cropName} জমিতে মাটির আর্দ্রতা ${moisture}%। কথা বলতে মাইক্রোফোনে চাপ দিন।`;
    case "pa":
      return `ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ ਐਗਰੀਟਵਿਨ ਕਿਸਾਨ ਮਿੱਤਰ ਹਾਂ। ਤੁਹਾਡੇ ${loc} ਦੇ ${cropName} ਖੇਤ ਵਿੱਚ ਮਿੱਟੀ ਦੀ ਨਮੀ ${moisture}% ਹੈ। ਬੋਲਣ ਲਈ ਮਾਈਕ ਦਬਾਓ।`;
    case "kn":
    default:
      return `ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಅಗ್ರಿಟ್ವಿನ್ ಕೃಷಿ ಮಿತ್ರ (Kisan Mitra). ನಿಮ್ಮ ${loc} ${cropName} ಹೊಲದ ಮಣ್ಣಿನ ತೇವಾಂಶ ${moisture}% ಇದೆ. ನೀರಾವರಿ, ರೋಗ ನಿಯಂತ್ರಣ ಅಥವಾ ಗೊಬ್ಬರದ ಬಗ್ಗೆ ಮೈಕ್ರೋಫೋನ್ ಒತ್ತಿ ಮಾತನಾಡಿ.`;
  }
}

export interface VoiceAgronomistTabProps {
  selectedField?: any;
  selectedCrop?: string;
}

export function VoiceAgronomistTab({ selectedField, selectedCrop }: VoiceAgronomistTabProps = {}) {
  const { language, setLanguage, t } = useTranslation();

  // State
  const [selectedLang, setSelectedLang] = useState<string>(() => language || "kn");
  const [languages, setLanguages] = useState<VoiceLanguage[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [textInput, setTextInput] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [autoSpeak, setAutoSpeak] = useState<boolean>(false);
  const [speechSpeed, setSpeechSpeed] = useState<number>(1.0);
  const [spokenAlerts, setSpokenAlerts] = useState<string[]>([]);
  const [isAlertsLoading, setIsAlertsLoading] = useState<boolean>(false);

  // Audio & Voice Recorder state
  const [recState, setRecState] = useState<RecordingState>("ready");
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [playerState, setPlayerState] = useState<VoicePlayerState>(voicePlayer.getState());

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recorderRef = useRef<VoiceRecognitionManager | null>(null);

  // Synchronize with application-wide language change or field change
  useEffect(() => {
    if (language && language !== selectedLang) {
      setSelectedLang(language);
      recorderRef.current?.setLanguage(language);
      fetchSpokenAlerts(language, selectedField?.id).then((res) => {
        setSpokenAlerts(res.alerts);
      }).catch(() => {});
      const welcomeText = buildWelcomeMessage(language, selectedField, selectedCrop);
      setMessages((prev) => {
        if (prev.length <= 1) {
          return [
            {
              id: "msg-init",
              sender: "ai",
              text: welcomeText,
              spokenSummary: welcomeText,
              language: language,
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              suggestedActions: ["ನೀರಾವರಿ ವೇಳಾಪಟ್ಟಿ", "ಮಣ್ಣಿನ ತೇವಾಂಶ ಗ್ರಾಫ್"],
              dataSource: `Grounded Farm Telemetry (${selectedField?.location || "Hassan, Karnataka"})`,
              fieldSnapshot: {
                crop_name: selectedCrop || selectedField?.crop_type || "Potato",
                soil_moisture_pct: selectedField?.soil_moisture_percentage || 28.5,
              },
            },
          ];
        }
        return prev;
      });
    }
  }, [language, selectedField?.id, selectedCrop]);

  // Synchronize alerts when field changes
  useEffect(() => {
    fetchSpokenAlerts(selectedLang, selectedField?.id).then((res) => {
      setSpokenAlerts(res.alerts);
    }).catch(() => {});
  }, [selectedField?.id, selectedLang]);

  // Initialize Languages and Saved Preferences
  useEffect(() => {
    fetchVoiceLanguages().then((data) => {
      setLanguages(data.languages);
    });

    const savedLang = localStorage.getItem("agritwin_voice_lang");
    const langToUse = savedLang || "kn";
    setSelectedLang(langToUse);

    const initWelcome = buildWelcomeMessage(langToUse, selectedField, selectedCrop);
    // Initial Welcome Message in selected language
    setMessages([
      {
        id: "msg-init",
        sender: "ai",
        text: initWelcome,
        spokenSummary: initWelcome,
        language: langToUse,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        suggestedActions: ["ನೀರಾವರಿ ವೇಳಾಪಟ್ಟಿ", "ಮಣ್ಣಿನ ತೇವಾಂಶ ಗ್ರಾಫ್"],
        dataSource: `Grounded Farm Telemetry (${selectedField?.location || "Hassan, Karnataka"})`,
        fieldSnapshot: {
          crop_name: selectedCrop || selectedField?.crop_type || "Potato",
          soil_moisture_pct: selectedField?.soil_moisture_percentage || 28.5,
          ambient_temp_c: 24.2,
          water_req_daily: "4.5 mm / day",
        },
      },
    ]);

    // Fetch Initial Spoken Alerts
    fetchSpokenAlerts(langToUse, selectedField?.id).then((res) => {
      setSpokenAlerts(res.alerts);
    });
  }, []);

  // Subscribe to Voice Player State
  useEffect(() => {
    const unsubscribe = voicePlayer.subscribe((state) => {
      setPlayerState(state);
    });
    return () => unsubscribe();
  }, []);

  // Initialize Voice Recorder Manager
  useEffect(() => {
    recorderRef.current = new VoiceRecognitionManager({
      onStateChange: (state) => setRecState(state),
      onInterimResult: (interim) => setTextInput(interim),
      onFinalResult: (final) => {
        setTextInput(final);
        handleSendMessage(final);
      },
      onError: (err) => setErrorMessage(err),
      onAudioLevel: (lvl) => setAudioLevel(lvl),
    });

    return () => {
      recorderRef.current?.stopListening();
      voicePlayer.stop();
    };
  }, [selectedLang]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, recState]);

  // Language Change Handler
  const handleLanguageChange = (langCode: string) => {
    setSelectedLang(langCode);
    setLanguage(langCode as Language);
    localStorage.setItem("agritwin_voice_lang", langCode);
    recorderRef.current?.setLanguage(langCode);
    voicePlayer.stop();

    // Refresh spoken alerts in new language
    fetchSpokenAlerts(langCode).then((res) => {
      setSpokenAlerts(res.alerts);
    });

    // Add language switch announcement
    const langObj = languages.find((l) => l.code === langCode);
    const welcome = buildWelcomeMessage(langCode, selectedField, selectedCrop);

    const newSysMsg: ChatMessage = {
      id: `lang-switch-${Date.now()}`,
      sender: "ai",
      text: welcome,
      spokenSummary: welcome,
      language: langCode,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      dataSource: "Live Multilingual Audio Engine",
    };
    setMessages((prev) => [...prev, newSysMsg]);

    if (autoSpeak) {
      voicePlayer.speakMessage(newSysMsg.id, welcome, langCode, speechSpeed);
    }
  };

  // Toggle Microphone
  const toggleRecording = () => {
    setErrorMessage(null);
    if (recState === "listening") {
      recorderRef.current?.stopListening();
    } else {
      voicePlayer.stop(); // Stop any audio currently speaking
      recorderRef.current?.startListening(selectedLang);
    }
  };

  // Handle Query Submission
  const handleSendMessage = async (queryText?: string) => {
    const textToSend = (queryText || textInput).trim();
    if (!textToSend || isSubmitting) return;

    setTextInput("");
    setErrorMessage(null);
    setIsSubmitting(true);

    const userMsgId = `user-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      sender: "user",
      text: textToSend,
      language: selectedLang,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);

    try {
      const historyToSend = messages.slice(-6).map((m) => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.text,
      }));

      const res: VoiceAgronomistResponse = await sendVoiceAgronomistMessage({
        message: textToSend,
        language: selectedLang,
        user_name: selectedField?.farmer_name || "Ramesh Gowda",
        conversation_history: historyToSend,
        field_id: selectedField?.id,
        crop_override: selectedCrop || selectedField?.crop_type,
      });

      const aiMsgId = `ai-${Date.now()}`;
      const aiMsg: ChatMessage = {
        id: aiMsgId,
        sender: "ai",
        text: res.reply,
        spokenSummary: res.spoken_summary,
        language: res.language,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        suggestedActions: res.suggested_actions,
        alert: res.alert,
        dataSource: res.data_source,
        fieldSnapshot: res.field_snapshot,
      };

      setMessages((prev) => [...prev, aiMsg]);

      // If Auto-speak is enabled, immediately convert to speech and play
      if (autoSpeak && res.spoken_summary) {
        voicePlayer.speakMessage(aiMsgId, res.spoken_summary, res.language, speechSpeed);
      }
    } catch (err: any) {
      console.error("Voice Agronomist request failed:", err);
      const errorDetail = err?.message || "Please check network connection or verify FastAPI backend on port 8000.";
      const errorAiMsg: ChatMessage = {
        id: `ai-error-${Date.now()}`,
        sender: "ai",
        text: selectedLang === "kn"
          ? `ಕ್ಷಮಿಸಿ, ಕಿಸಾನ್ ಮಿತ್ರ AI ಸರ್ವರ್‌ನಿಂದ ಪ್ರತಿಕ್ರಿಯೆ ಪಡೆಯಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ (${errorDetail}). ದಯವಿಟ್ಟು ಸರ್ವರ್ ಸಂಪರ್ಕವನ್ನು ಪರಿಶೀಲಿಸಿ.`
          : `I was unable to receive a response from Kisan Mitra AI assistant (${errorDetail}). Please ensure the backend server is running on http://localhost:8000.`,
        spokenSummary: selectedLang === "kn"
          ? "ಸರ್ವರ್ ಸಂಪರ್ಕ ದೋಷ, ದಯವಿಟ್ಟು ಮರುಪ್ರಯತ್ನಿಸಿ."
          : "Connection error, please verify backend server.",
        language: selectedLang,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        suggestedActions: ["Retry Question", "Check Server Status"],
        alert: "Service Notice: Unable to reach AI backend.",
      };
      setMessages((prev) => [...prev, errorAiMsg]);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Play Message Audio
  const handlePlayMessage = (msg: ChatMessage) => {
    const textToSpeak = msg.spokenSummary || msg.text;
    voicePlayer.speakMessage(msg.id, textToSpeak, msg.language, speechSpeed);
  };

  // Read Aloud Spoken Alerts
  const handleReadAlertsAloud = () => {
    if (spokenAlerts.length === 0) return;
    const alertScript = spokenAlerts.join(". ");
    voicePlayer.speakMessage("alert-broadcast", alertScript, selectedLang, speechSpeed);
  };

  // Speed Adjust
  const handleCycleSpeed = () => {
    const speeds = [0.75, 1.0, 1.25];
    const nextIdx = (speeds.indexOf(speechSpeed) + 1) % speeds.length;
    const nextSpeed = speeds[nextIdx];
    setSpeechSpeed(nextSpeed);
    voicePlayer.setSpeed(nextSpeed);
  };

  const currPrompts = NATIVE_LANGUAGE_PROMPTS[selectedLang] || NATIVE_LANGUAGE_PROMPTS.kn;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16 font-sans">
      {/* ==================== 1. HEADER: BRANDING, STATUS & LANGUAGE SELECTOR ==================== */}
      <div className="relative rounded-3xl border border-[#E5E1D6] bg-[#FFFEFA] p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-[#E5E1D6]">
          <div className="flex items-center gap-3.5">
            <div className="relative flex size-14 items-center justify-center rounded-2xl bg-[#E4EBDD] text-[#173D2B] ring-1 ring-[#173D2B]/20 shadow-xs">
              <Bot className="size-7 text-[#173D2B]" />
              <span className="absolute -top-1 -right-1 flex size-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#173D2B] opacity-75" />
                <span className="relative inline-flex rounded-full size-3.5 bg-[#173D2B]" />
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-[#173D2B] tracking-tight">
                  {t("voice.title", "Multilingual AI Voice Agronomist")}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-[#E4EBDD] text-[#173D2B] font-mono text-[0.65rem] font-bold border border-[#D0DEC4]">
                  ಕಿಸಾನ್ ಮಿತ್ರ • Kisan Mitra
                </span>
              </div>
              <p className="text-xs text-[#68756A] mt-0.5">
                {t("voice.subtitle", "Spoken Agricultural Intelligence for Indian Farmers across 9 Languages")}
              </p>
            </div>
          </div>

          {/* 9-Language Selector Dropdown with Native Script */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl border border-[#E5E1D6] bg-[#F8F4EB] shadow-xs">
              <Globe className="size-4 text-[#173D2B] shrink-0" />
              <select
                value={selectedLang}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="bg-transparent text-xs font-bold text-[#173D2B] focus:outline-none cursor-pointer"
              >
                {languages.map((l) => (
                  <option key={l.code} value={l.code} className="bg-[#FFFEFA] text-[#20352A] py-1">
                    {l.native} ({l.name})
                  </option>
                ))}
              </select>
            </div>

            {/* Speaking Speed Pill */}
            <button
              onClick={handleCycleSpeed}
              title="Adjust Speaking Speed"
              className="px-2.5 py-1.5 rounded-xl border border-[#E5E1D6] bg-[#F8F4EB] hover:bg-[#E4EBDD] text-xs font-mono font-bold text-[#173D2B] transition-colors cursor-pointer"
            >
              {t("Speed")}: {speechSpeed}x
            </button>

            {/* Auto-Speak Toggle */}
            <button
              onClick={() => setAutoSpeak(!autoSpeak)}
              title="Toggle Auto-Speak on response"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                autoSpeak
                  ? "border-[#D0DEC4] bg-[#E4EBDD] text-[#173D2B]"
                  : "border-[#E5E1D6] bg-[#F8F4EB] text-[#68756A] hover:text-[#173D2B]"
              }`}
            >
              {autoSpeak ? <Volume2 className="size-3.5" /> : <VolumeX className="size-3.5" />}
              <span>{t("Auto-Speak")}: {autoSpeak ? "ON" : "OFF"}</span>
            </button>
          </div>
        </div>

        {/* Live Grounded Agricultural Telemetry Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-xs">
          <div className="rounded-xl border border-[#E5E1D6] bg-[#F8F4EB] p-2.5">
            <span className="text-[0.65rem] text-[#68756A] flex items-center gap-1">
              <Sprout className="size-3 text-[#173D2B]" /> {t("Active Crop & Field:")}
            </span>
            <span className="font-bold text-[#20352A] block mt-0.5 truncate">
              {translateCrop(selectedCrop || selectedField?.crop_type || "Potato", language as Language)} • {selectedField?.location?.split(",")[0] || "Hassan"}
            </span>
            <span className="text-[0.6rem] text-[#2E7D32] font-semibold">Live Crop Telemetry</span>
          </div>

          <div className="rounded-xl border border-[#E5E1D6] bg-[#F8F4EB] p-2.5">
            <span className="text-[0.65rem] text-[#68756A] flex items-center gap-1">
              <Droplets className="size-3 text-sky-600" /> {t("Soil Moisture:")}
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-base font-bold font-mono text-[#173D2B]">{selectedField?.soil_moisture_percentage ?? 24.5}%</span>
              <span className="text-[0.65rem] text-[#68756A]">Volumetric</span>
            </div>
            <span className="text-[0.6rem] text-[#2E7D32] font-semibold">{t("Optimal")}</span>
          </div>

          <div className="rounded-xl border border-[#E5E1D6] bg-[#F8F4EB] p-2.5">
            <span className="text-[0.65rem] text-[#68756A] flex items-center gap-1">
              <Sun className="size-3 text-amber-600" /> {t("Ambient & Soil Temp:", "Ambient & Soil Temp:")}
            </span>
            <span className="text-base font-bold font-mono text-[#173D2B] block mt-0.5">
              26.2°C / 25.4°C
            </span>
            <span className="text-[0.6rem] text-[#68756A]">RH: 68% • {t("Balanced")}</span>
          </div>

          <div className="rounded-xl border border-[#E5E1D6] bg-[#F8F4EB] p-2.5">
            <span className="text-[0.65rem] text-[#68756A] flex items-center gap-1">
              <Shield className="size-3 text-[#173D2B]" /> {t("Daily Water Need:")}
            </span>
            <span className="text-base font-bold font-mono text-[#173D2B] block mt-0.5">
              3.2 mm / day
            </span>
            <span className="text-[0.6rem] text-[#2E7D32] font-bold">Live Model Connected</span>
          </div>
        </div>
      </div>

      {/* ==================== 2. EARLY WARNING SPOKEN ALERTS BAR ==================== */}
      {spokenAlerts.length > 0 && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs text-amber-900">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="size-4.5 text-amber-600 shrink-0" />
            <div>
              <span className="font-bold text-amber-800 block">{t("Early Warning Spoken Advisory:")}</span>
              <span className="text-xs leading-relaxed text-amber-900">{spokenAlerts[0]}</span>
            </div>
          </div>
          <button
            onClick={handleReadAlertsAloud}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-xs cursor-pointer transition-colors"
          >
            <Play className="size-3.5 fill-current" />
            <span>{t("Read Aloud All Alerts")}</span>
          </button>
        </div>
      )}

      {/* ==================== 3. CONVERSATION VIEWPORT ==================== */}
      <div className="rounded-3xl border border-[#E5E1D6] bg-[#F8F4EB] p-5 shadow-inner min-h-[420px] max-h-[580px] overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === "user";
          const isCurrentlySpeaking =
            playerState.currentMessageId === msg.id &&
            (playerState.status === "playing" || playerState.status === "loading");
          const isCurrentlyPaused =
            playerState.currentMessageId === msg.id && playerState.status === "paused";

          return (
            <div
              key={msg.id}
              className={`flex gap-3 text-xs ${isUser ? "justify-end" : "justify-start"} animate-in fade-in duration-300`}
            >
              {!isUser && (
                <div className="size-9 rounded-2xl bg-[#E4EBDD] border border-[#D0DEC4] text-[#173D2B] flex items-center justify-center shrink-0 mt-1 shadow-xs">
                  <Bot className="size-5" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-3xl p-4 shadow-sm space-y-3 transition-all ${
                  isUser
                    ? "bg-[#173D2B] text-[#FFFEFA] rounded-br-xs"
                    : isCurrentlySpeaking
                    ? "bg-[#FFFEFA] border-2 border-[#173D2B] shadow-md text-[#20352A] rounded-bl-xs"
                    : "bg-[#FFFEFA] border border-[#E5E1D6] text-[#20352A] rounded-bl-xs"
                }`}
              >
                {/* Header info */}
                <div className={`flex items-center justify-between text-[0.68rem] pb-1 border-b ${isUser ? "border-white/20 text-white/80" : "border-[#E5E1D6] text-[#68756A]"}`}>
                  <span className="font-semibold">{isUser ? t("Farmer (Voice / Text)") : t("Kisan Mitra AI")}</span>
                  <span className="font-mono">{msg.timestamp}</span>
                </div>

                {/* Main message text */}
                <div className="text-sm font-medium leading-relaxed whitespace-pre-wrap">
                  {msg.text}
                </div>

                {/* AI Grounded Metadata & Audio Controls */}
                {!isUser && (
                  <div className="pt-2 border-t border-[#E5E1D6] space-y-3">
                    {/* Audio Playback Toolbar: Play, Pause, Resume, Stop, Replay */}
                    <div className="flex flex-wrap items-center justify-between gap-2 bg-[#F8F4EB] p-2 rounded-2xl border border-[#E5E1D6]">
                      <div className="flex items-center gap-1.5">
                        {!isCurrentlySpeaking && !isCurrentlyPaused ? (
                          <button
                            onClick={() => handlePlayMessage(msg)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#173D2B] hover:bg-[#102F22] text-[#FFFEFA] font-bold text-xs shadow-xs cursor-pointer transition-all"
                          >
                            <Play className="size-3.5 fill-current" />
                            <span>{t("Play Voice")}</span>
                          </button>
                        ) : isCurrentlySpeaking ? (
                          <button
                            onClick={() => voicePlayer.pause()}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-xs cursor-pointer transition-all"
                          >
                            <Pause className="size-3.5 fill-current" />
                            <span>{t("Pause")}</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => voicePlayer.resume()}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#173D2B] hover:bg-[#102F22] text-[#FFFEFA] font-bold text-xs shadow-xs cursor-pointer transition-all"
                          >
                            <Play className="size-3.5 fill-current" />
                            <span>{t("Resume")}</span>
                          </button>
                        )}

                        <button
                          onClick={() => voicePlayer.stop()}
                          title="Stop Voice Playback"
                          className="p-1.5 rounded-lg text-[#68756A] hover:text-[#173D2B] hover:bg-[#E4EBDD] cursor-pointer transition-colors"
                        >
                          <Square className="size-3.5 fill-current" />
                        </button>

                        <button
                          onClick={() => voicePlayer.replay()}
                          title="Replay from Beginning"
                          className="p-1.5 rounded-lg text-[#68756A] hover:text-[#173D2B] hover:bg-[#E4EBDD] cursor-pointer transition-colors"
                        >
                          <RotateCcw className="size-3.5" />
                        </button>
                      </div>

                      {/* Active Speaking Status Indicator & Equalizer */}
                      <div className="flex items-center gap-2 pr-1">
                        {isCurrentlySpeaking ? (
                          <div className="flex items-center gap-1">
                            <span className="size-2 rounded-full bg-[#173D2B] animate-ping" />
                            <span className="text-[0.68rem] text-[#173D2B] font-bold">
                              {t("Speaking")} ({msg.language.toUpperCase()})...
                            </span>
                            {/* Animated Audio Equalizer Bars */}
                            <div className="flex items-end gap-0.5 h-3 ml-1">
                              <span className="w-1 bg-[#173D2B] rounded-full animate-bounce h-3" />
                              <span className="w-1 bg-[#173D2B] rounded-full animate-bounce h-2 delay-100" />
                              <span className="w-1 bg-[#173D2B] rounded-full animate-bounce h-3.5 delay-150" />
                            </div>
                          </div>
                        ) : isCurrentlyPaused ? (
                          <span className="text-[0.68rem] text-amber-700 font-semibold">{t("Paused")}</span>
                        ) : (
                          <span className="text-[0.65rem] text-[#68756A] font-mono">{t("Audio Ready")}</span>
                        )}
                      </div>
                    </div>

                    {/* Suggested Action Chips */}
                    {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {msg.suggestedActions.map((action, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSendMessage(action)}
                            className="px-2.5 py-1 rounded-lg border border-[#D0DEC4] bg-[#E4EBDD]/60 hover:bg-[#E4EBDD] text-[#173D2B] text-[0.68rem] font-semibold transition-colors cursor-pointer"
                          >
                            {action}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {isUser && (
                <div className="size-9 rounded-2xl bg-[#E4EBDD] border border-[#D0DEC4] text-[#173D2B] flex items-center justify-center shrink-0 mt-1 shadow-xs">
                  <User className="size-5" />
                </div>
              )}
            </div>
          );
        })}

        {/* Processing Indicator */}
        {isSubmitting && (
          <div className="flex items-center gap-3 text-xs text-[#173D2B] p-3 rounded-2xl bg-[#FFFEFA] border border-[#E5E1D6] shadow-xs">
            <Sparkles className="size-4 animate-spin text-[#173D2B]" />
            <span>Consulting Digital Twin Engine & Translating to Selected Language...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ==================== 4. DEMONSTRATION QUICK QUESTION CHIPS ==================== */}
      <div className="space-y-2">
        <span className="text-[0.68rem] text-[#68756A] font-bold uppercase tracking-wider block">
          {t("voice.quickPrompts", "One-Click Farmer Voice Prompts")} ({languages.find((l) => l.code === selectedLang)?.native}):
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleSendMessage(currPrompts.qWater)}
            className="px-3 py-1.5 rounded-xl border border-[#E5E1D6] bg-[#FFFEFA] hover:bg-[#E4EBDD] text-[#173D2B] text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
          >
            <Droplets className="size-3.5 text-[#173D2B]" />
            <span>{currPrompts.qWater}</span>
          </button>
          <button
            onClick={() => handleSendMessage(currPrompts.qYellow)}
            className="px-3 py-1.5 rounded-xl border border-[#E5E1D6] bg-[#FFFEFA] hover:bg-[#E4EBDD] text-[#173D2B] text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
          >
            <Sun className="size-3.5 text-[#C9A65B]" />
            <span>{currPrompts.qYellow}</span>
          </button>
          <button
            onClick={() => handleSendMessage(currPrompts.qFert)}
            className="px-3 py-1.5 rounded-xl border border-[#E5E1D6] bg-[#FFFEFA] hover:bg-[#E4EBDD] text-[#173D2B] text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
          >
            <Sprout className="size-3.5 text-[#2E7D32]" />
            <span>{currPrompts.qFert}</span>
          </button>
          <button
            onClick={() => handleSendMessage(currPrompts.qDisease)}
            className="px-3 py-1.5 rounded-xl border border-[#E5E1D6] bg-[#FFFEFA] hover:bg-[#E4EBDD] text-[#173D2B] text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
          >
            <Shield className="size-3.5 text-amber-700" />
            <span>{currPrompts.qDisease}</span>
          </button>
          <button
            onClick={() => handleSendMessage(currPrompts.qYield)}
            className="px-3 py-1.5 rounded-xl border border-[#E5E1D6] bg-[#FFFEFA] hover:bg-[#E4EBDD] text-[#173D2B] text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
          >
            <Activity className="size-3.5 text-[#173D2B]" />
            <span>{currPrompts.qYield}</span>
          </button>
          {currPrompts.qPotato && (
            <button
              onClick={() => handleSendMessage(currPrompts.qPotato)}
              className="px-3 py-1.5 rounded-xl border border-[#E5E1D6] bg-[#FFFEFA] hover:bg-[#E4EBDD] text-[#173D2B] text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <Sprout className="size-3.5 text-[#C9A65B]" />
              <span>{currPrompts.qPotato}</span>
            </button>
          )}
          {currPrompts.qCarrot && (
            <button
              onClick={() => handleSendMessage(currPrompts.qCarrot)}
              className="px-3 py-1.5 rounded-xl border border-[#E5E1D6] bg-[#FFFEFA] hover:bg-[#E4EBDD] text-[#173D2B] text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <Droplets className="size-3.5 text-orange-600" />
              <span>{currPrompts.qCarrot}</span>
            </button>
          )}
          {currPrompts.qBeetroot && (
            <button
              onClick={() => handleSendMessage(currPrompts.qBeetroot)}
              className="px-3 py-1.5 rounded-xl border border-[#E5E1D6] bg-[#FFFEFA] hover:bg-[#E4EBDD] text-[#173D2B] text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <Sprout className="size-3.5 text-rose-700" />
              <span>{currPrompts.qBeetroot}</span>
            </button>
          )}
          {currPrompts.qMarket && (
            <button
              onClick={() => handleSendMessage(currPrompts.qMarket)}
              className="px-3 py-1.5 rounded-xl border border-[#E5E1D6] bg-[#FFFEFA] hover:bg-[#E4EBDD] text-[#173D2B] text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <TrendingUp className="size-3.5 text-[#2E7D32]" />
              <span>{currPrompts.qMarket}</span>
            </button>
          )}
          {currPrompts.qCropSuitability && (
            <button
              onClick={() => handleSendMessage(currPrompts.qCropSuitability)}
              className="px-3 py-1.5 rounded-xl border border-[#E5E1D6] bg-[#FFFEFA] hover:bg-[#E4EBDD] text-[#173D2B] text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <Layers className="size-3.5 text-[#173D2B]" />
              <span>{currPrompts.qCropSuitability}</span>
            </button>
          )}
          {currPrompts.qSchemes && (
            <button
              onClick={() => handleSendMessage(currPrompts.qSchemes)}
              className="px-3 py-1.5 rounded-xl border border-[#E5E1D6] bg-[#FFFEFA] hover:bg-[#E4EBDD] text-[#173D2B] text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <Shield className="size-3.5 text-[#C9A65B]" />
              <span>{currPrompts.qSchemes}</span>
            </button>
          )}
          {currPrompts.qAI && (
            <button
              onClick={() => handleSendMessage(currPrompts.qAI)}
              className="px-3 py-1.5 rounded-xl border border-[#E5E1D6] bg-[#FFFEFA] hover:bg-[#E4EBDD] text-[#173D2B] text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <Sparkles className="size-3.5 text-[#173D2B]" />
              <span>{currPrompts.qAI}</span>
            </button>
          )}
        </div>
      </div>

      {/* ==================== 5. VOICE INPUT CONTROL CONSOLE ==================== */}
      <div className="rounded-3xl border border-[#E5E1D6] bg-[#FFFEFA] p-6 shadow-sm space-y-4">
        {/* Error notification */}
        {errorMessage && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
            {errorMessage}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Large Interactive Microphone Button */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              {/* Outer Pulsing Waveform Ring when Listening */}
              {recState === "listening" && (
                <div
                  className="absolute inset-0 rounded-full bg-rose-500/20 animate-ping pointer-events-none"
                  style={{ transform: `scale(${1.0 + audioLevel * 0.8})` }}
                />
              )}

              <button
                type="button"
                onClick={toggleRecording}
                className={`relative flex size-20 items-center justify-center rounded-full shadow-md transition-all cursor-pointer ${
                  recState === "listening"
                    ? "bg-rose-600 hover:bg-rose-500 text-white ring-4 ring-rose-200 scale-105"
                    : "bg-[#173D2B] hover:bg-[#102F22] text-[#FFFEFA] ring-4 ring-[#E4EBDD] hover:scale-105"
                }`}
              >
                {recState === "listening" ? (
                  <MicOff className="size-9 animate-pulse" />
                ) : (
                  <Mic className="size-9" />
                )}
              </button>
            </div>

            {/* Clear Status State */}
            <div className="text-center">
              <span
                className={`text-xs font-extrabold uppercase tracking-wider block ${
                  recState === "listening"
                    ? "text-rose-700 animate-pulse"
                    : recState === "processing"
                    ? "text-amber-700"
                    : "text-[#173D2B]"
                }`}
              >
                {recState === "listening"
                  ? t("voice.listening", "Listening to Farmer...")
                  : recState === "processing"
                  ? t("voice.processing", "Processing Audio...")
                  : t("voice.startRecording", "Press Mic to Speak")}
              </span>
              <span className="text-[0.65rem] text-[#68756A] block mt-0.5">
                Recognizing {languages.find((l) => l.code === selectedLang)?.native || "ಕನ್ನಡ"}
              </span>
            </div>
          </div>

          {/* Animated Audio Waveform Visualizer */}
          <div className="flex-1 w-full bg-[#F8F4EB] rounded-2xl border border-[#E5E1D6] p-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#68756A] font-semibold flex items-center gap-1.5">
                <Radio className="size-3.5 text-[#173D2B]" /> Live Audio Waveform:
              </span>
              <span className="font-mono text-[0.68rem] text-[#68756A]">
                {recState === "listening" ? "Microphone Active" : "Microphone Idle"}
              </span>
            </div>

            {/* 24 Waveform Bars */}
            <div className="flex items-center justify-between gap-1 h-10 px-2 py-1 bg-[#FFFEFA] rounded-xl border border-[#E5E1D6]">
              {Array.from({ length: 24 }).map((_, i) => {
                const height =
                  recState === "listening"
                    ? Math.max(12, Math.min(100, (Math.sin(i * 0.4 + audioLevel * 10) * 0.5 + 0.5) * 100 * (audioLevel * 2 + 0.2)))
                    : 10;
                return (
                  <span
                    key={i}
                    className={`w-full rounded-full transition-all duration-75 ${
                      recState === "listening" ? "bg-rose-500" : "bg-[#D0DEC4]"
                    }`}
                    style={{ height: `${height}%` }}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Text Input Alternative for Farmers who prefer Typing */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2 pt-2 border-t border-[#E5E1D6]"
        >
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder={`Ask a question in ${languages.find((l) => l.code === selectedLang)?.name || "Kannada"} (e.g. ನನ್ನ ಬೆಳೆಗೆ ಎಷ್ಟು ನೀರು ಬೇಕು?)...`}
            className="flex-1 px-4 py-2.5 rounded-2xl border border-[#E5E1D6] bg-[#F8F4EB] text-xs text-[#20352A] placeholder:text-[#68756A]/60 focus:outline-none focus:ring-1 focus:ring-[#173D2B]"
          />
          <button
            type="submit"
            disabled={!textInput.trim() || isSubmitting}
            className="px-4 py-2.5 rounded-2xl bg-[#173D2B] hover:bg-[#102F22] disabled:opacity-40 text-[#FFFEFA] font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
          >
            <span>Send</span>
            <Send className="size-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}

