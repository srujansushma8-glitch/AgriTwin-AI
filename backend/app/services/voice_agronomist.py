# -*- coding: utf-8 -*-
"""
AgriTwin AI 3.0 — Multilingual AI Voice Agronomist Service
Provides grounded, crop-specific agricultural guidance in 9 Indian languages:
Kannada, English, Hindi, Tamil, Telugu, Malayalam, Marathi, Bengali, Punjabi.
"""

import os
import io
import base64
import hashlib
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone

try:
    from gtts import gTTS
    GTTS_AVAILABLE = True
except ImportError:
    GTTS_AVAILABLE = False

try:
    from google import genai
    from google.genai import types
    GENAI_AVAILABLE = True
except ImportError:
    GENAI_AVAILABLE = False

from app.services.twin_engine import twin_engine

SUPPORTED_LANGUAGES: Dict[str, Dict[str, str]] = {
    "kn": {"name": "Kannada", "native": "ಕನ್ನಡ", "bcp47": "kn-IN", "voice_code": "kn"},
    "en": {"name": "English", "native": "English", "bcp47": "en-IN", "voice_code": "en"},
    "hi": {"name": "Hindi", "native": "हिन्दी", "bcp47": "hi-IN", "voice_code": "hi"},
    "ta": {"name": "Tamil", "native": "தமிழ்", "bcp47": "ta-IN", "voice_code": "ta"},
    "te": {"name": "Telugu", "native": "తెలుగు", "bcp47": "te-IN", "voice_code": "te"},
    "ml": {"name": "Malayalam", "native": "മലയാളം", "bcp47": "ml-IN", "voice_code": "ml"},
    "mr": {"name": "Marathi", "native": "मराठी", "bcp47": "mr-IN", "voice_code": "mr"},
    "bn": {"name": "Bengali", "native": "বাংলা", "bcp47": "bn-IN", "voice_code": "bn"},
    "pa": {"name": "Punjabi", "native": "ਪੰਜਾਬੀ", "bcp47": "pa-IN", "voice_code": "pa"},
}

_TTS_CACHE: Dict[str, str] = {}

# Crop Agronomic Database for Multilingual Voice Assistance
CROP_AGRO_SPECS: Dict[str, Dict[str, Any]] = {
    "Onion": {
        "names": {
            "kn": "ಈರುಳ್ಳಿ (Onion)", "en": "Onion", "hi": "प्याज (Onion)",
            "ta": "வெங்காயம் (Onion)", "te": "ఉల్లిపాయ (Onion)", "ml": "സവാള (Onion)",
            "mr": "कांदा (Onion)", "bn": "পেঁয়াজ (Onion)", "pa": "ਪਿਆਜ਼ (Onion)"
        },
        "variety": "Bhima Super / Bellary Red",
        "duration_days": 125,
        "water_req_daily": "4.0 mm / day",
        "target_moisture": 30.0,
        "yield_t_ha": "24.0 t/ha",
        "mandi": "Yeshwanthpur / Hubballi APMC",
        "price_qtl": "₹2,200 - ₹2,800",
        "primary_disease": "Purple Blotch (Alternaria porri)",
        "curative": "Spray Tebuconazole 25.9 EC @ 1.25 mL/L or Mancozeb 75 WP @ 2.5 g/L with sticker.",
        "yellow_cause": "Thrips feeding damage or nitrogen deficit during bulking.",
        "fertilizer": "NPK 125:60:100 kg/ha with 25 kg/ha Sulphur for pungent bulb scales."
    },
    "Potato": {
        "names": {
            "kn": "ಆಲೂಗಡ್ಡೆ (Potato)", "en": "Potato", "hi": "आलू (Potato)",
            "ta": "உருளைக்கிழங்கு (Potato)", "te": "బంగాళాదుంప (Potato)", "ml": "ഉരുളക്കിഴങ്ങ് (Potato)",
            "mr": "बटाटा (Potato)", "bn": "আলু (Potato)", "pa": "ਆਲੂ (Potato)"
        },
        "variety": "Kufri Jyoti / Kufri Surya",
        "duration_days": 105,
        "water_req_daily": "4.8 mm / day",
        "target_moisture": 32.0,
        "yield_t_ha": "30.0 t/ha",
        "mandi": "Hassan APMC (Channarayapatna)",
        "price_qtl": "₹1,900 - ₹2,500",
        "primary_disease": "Late Blight (Phytophthora infestans)",
        "curative": "Spray Cymoxanil 8% + Mancozeb 64% WP @ 2.5 g/L or Dimethomorph @ 1 g/L.",
        "yellow_cause": "Lower leaves: Mobile nitrogen deficit. Entire plant: Furrow waterlogging or blight.",
        "fertilizer": "NPK 150:100:120 kg/ha. Apply 50% N + 100% P + 50% K as basal, remaining N at earthing-up."
    },
    "Carrot": {
        "names": {
            "kn": "ಕ್ಯಾರೆಟ್ (Carrot)", "en": "Carrot", "hi": "गाजर (Carrot)",
            "ta": "கேரட் (Carrot)", "te": "క్యారెట్ (Carrot)", "ml": "കാരറ്റ് (Carrot)",
            "mr": "गाजर (Carrot)", "bn": "গাজর (Carrot)", "pa": "ਗਾਜਰ (Carrot)"
        },
        "variety": "Super Kuroda",
        "duration_days": 95,
        "water_req_daily": "3.8 mm / day",
        "target_moisture": 28.0,
        "yield_t_ha": "25.0 t/ha",
        "mandi": "Bengaluru / Ooty APMC",
        "price_qtl": "₹2,400 - ₹3,600",
        "primary_disease": "Alternaria Leaf Blight (Alternaria dauci)",
        "curative": "Foliar spray of Chlorothalonil 75 WP @ 2 g/L or Azoxystrobin @ 1 mL/L.",
        "yellow_cause": "Over-watering root rot or potassium deficit causing leaf margin chlorosis.",
        "fertilizer": "NPK 100:50:50 kg/ha. Ensure loose soil tilth and micronutrient boron @ 10 kg/ha."
    },
    "Beetroot": {
        "names": {
            "kn": "ಬೀಟ್‌ರೂಟ್ (Beetroot)", "en": "Beetroot", "hi": "चुकंदर (Beetroot)",
            "ta": "பீட்ரூட் (Beetroot)", "te": "బీట్‌రూట్ (Beetroot)", "ml": "ബീറ്റ്‌റൂട്ട് (Beetroot)",
            "mr": "बीट (Beetroot)", "bn": "বিট (Beetroot)", "pa": "ਚੁਕੰਦਰ (Beetroot)"
        },
        "variety": "Detroit Dark Red",
        "duration_days": 75,
        "water_req_daily": "3.5 mm / day",
        "target_moisture": 29.0,
        "yield_t_ha": "28.0 t/ha",
        "mandi": "Mysuru Bandipalya / Kolar APMC",
        "price_qtl": "₹2,000 - ₹3,200",
        "primary_disease": "Cercospora Leaf Spot (Cercospora beticola)",
        "curative": "Spray Carbendazim 50 WP @ 1 g/L or Copper Oxychloride @ 2.5 g/L.",
        "yellow_cause": "Boron deficiency (Heart Rot) or moisture stress causing ring zonation.",
        "fertilizer": "NPK 70:50:70 kg/ha + 10 kg/ha Borax at land preparation."
    },
    "Tomato": {
        "names": {
            "kn": "ಟೊಮೆಟೊ (Tomato)", "en": "Tomato", "hi": "टमाटर (Tomato)",
            "ta": "தக்காளி (Tomato)", "te": "టమోటా (Tomato)", "ml": "തക്കാളി (Tomato)",
            "mr": "टोमॅटो (Tomato)", "bn": "টমেটো (Tomato)", "pa": "ਟਮਾਟਰ (Tomato)"
        },
        "variety": "Arka Rakshak F1 Hybrid",
        "duration_days": 120,
        "water_req_daily": "4.8 mm / day",
        "target_moisture": 33.0,
        "yield_t_ha": "36.0 t/ha",
        "mandi": "Kolar APMC (Asia's 2nd Largest)",
        "price_qtl": "₹2,100 - ₹2,900",
        "primary_disease": "Early Blight & Tomato Leaf Curl Virus (ToLCV)",
        "curative": "Spray Mancozeb @ 2.5 g/L for blight; manage whiteflies using Acetamiprid 20 SP @ 0.5 g/L.",
        "yellow_cause": "Begomovirus leaf curling or nitrogen shortage during heavy fruit loading.",
        "fertilizer": "NPK 120:80:100 kg/ha with calcium nitrate foliar spray @ 5 g/L to prevent blossom end rot."
    },
    "Ragi": {
        "names": {
            "kn": "ರಾಗಿ (Finger Millet)", "en": "Ragi / Finger Millet", "hi": "रागी / मडुआ (Ragi)",
            "ta": "கேழ்வரகு / ராகி (Ragi)", "te": "రాగులు (Ragi)", "ml": "കൂവരക് (Ragi)",
            "mr": "नाचणी (Ragi)", "bn": "রাগি (Ragi)", "pa": "ਰਾਗੀ (Ragi)"
        },
        "variety": "ML-365 / GPU-28",
        "duration_days": 110,
        "water_req_daily": "3.2 mm / day",
        "target_moisture": 24.5,
        "yield_t_ha": "3.8 t/ha",
        "mandi": "Mandya APMC",
        "price_qtl": "₹3,700 - ₹4,200",
        "primary_disease": "Finger Millet Blast (Pyricularia grisea)",
        "curative": "Foliar spray of Tricyclazole 75 WP @ 0.6 g/L or Kitazin 48 EC @ 1 mL/L.",
        "yellow_cause": "Moisture deficit or lack of tillering top-dress nitrogen.",
        "fertilizer": "NPK 50:40:25 kg/ha. Apply 50% N as basal and 50% N at 25-30 DAS tillering."
    },
    "Rice": {
        "names": {
            "kn": "ಭತ್ತ / ಅಕ್ಕಿ (Paddy)", "en": "Rice / Paddy", "hi": "धान / चावल (Paddy)",
            "ta": "நெல் / அரிசி (Paddy)", "te": "వరి / ధాన్యం (Paddy)", "ml": "നെല്ല് (Paddy)",
            "mr": "भात (Paddy)", "bn": "ধান / চাল (Paddy)", "pa": "ਝੋਨਾ (Paddy)"
        },
        "variety": "Sona Masoori (BPT-5204)",
        "duration_days": 135,
        "water_req_daily": "7.0 mm / day",
        "target_moisture": 45.0,
        "yield_t_ha": "5.5 t/ha",
        "mandi": "Raichur / Davangere APMC",
        "price_qtl": "₹2,300 - ₹3,100",
        "primary_disease": "Rice Blast & Bacterial Leaf Blight",
        "curative": "Spray Isoprothiolane 40 EC @ 1.5 mL/L or Streptocycline 100 ppm + Copper Oxychloride @ 2 g/L.",
        "yellow_cause": "Zinc deficiency (Khaira disease) or iron chlorosis in alkaline soils.",
        "fertilizer": "NPK 120:50:50 kg/ha + 25 kg/ha Zinc Sulphate basal."
    },
    "Wheat": {
        "names": {
            "kn": "ಗೋಧಿ (Wheat)", "en": "Wheat", "hi": "गेहूं (Wheat)",
            "ta": "கோதுமை (Wheat)", "te": "గోధుమలు (Wheat)", "ml": "ഗോതമ്പ് (Wheat)",
            "mr": "गहू (Wheat)", "bn": "গম (Wheat)", "pa": "ਕਣਕ (Wheat)"
        },
        "variety": "GW-322 / HD-2967",
        "duration_days": 115,
        "water_req_daily": "3.5 mm / day",
        "target_moisture": 28.0,
        "yield_t_ha": "4.5 t/ha",
        "mandi": "Dharwad / Belagavi APMC",
        "price_qtl": "₹2,400 - ₹2,900",
        "primary_disease": "Stripe / Yellow Rust (Puccinia striiformis)",
        "curative": "Single spray of Propiconazole 25 EC @ 1 mL/L at first flag leaf appearance.",
        "yellow_cause": "Nitrogen leaching in cold sandy loam or stripe rust pustules.",
        "fertilizer": "NPK 120:60:40 kg/ha split in 3 irrigation crown root initiation stages."
    },
    "Maize": {
        "names": {
            "kn": "ಮೆಕ್ಕೆಜೋಳ (Maize)", "en": "Maize / Corn", "hi": "मक्का (Maize)",
            "ta": "மக்காச்சோளம் (Maize)", "te": "మొక్కజొన్న (Maize)", "ml": "മക്കച്ചോളം (Maize)",
            "mr": "मका (Maize)", "bn": "ভুট্টা (Maize)", "pa": "ਮੱਕੀ (Maize)"
        },
        "variety": "DKC-9108 / Pinnacle",
        "duration_days": 110,
        "water_req_daily": "5.2 mm / day",
        "target_moisture": 32.0,
        "yield_t_ha": "7.5 t/ha",
        "mandi": "Davangere / Ranebennur APMC",
        "price_qtl": "₹2,050 - ₹2,550",
        "primary_disease": "Fall Armyworm (Spodoptera frugiperda)",
        "curative": "Whorl application of Emamectin Benzoate 5 SG @ 0.4 g/L or Chlorantraniliprole 18.5 SC @ 0.4 mL/L.",
        "yellow_cause": "Waterlogging or severe nitrogen hunger causing V-shaped leaf chlorosis.",
        "fertilizer": "NPK 150:75:50 kg/ha in 3 splits (basal, knee-high, and tasseling)."
    },
    "Groundnut": {
        "names": {
            "kn": "ಕಡಲೆಕಾಯಿ (Groundnut)", "en": "Groundnut / Peanut", "hi": "मूंगफली (Groundnut)",
            "ta": "நிலக்கடலை (Groundnut)", "te": "వేరుశనగ (Groundnut)", "ml": "നിലക്കടല (Groundnut)",
            "mr": "भुईमूग (Groundnut)", "bn": "চীনাবাদাম (Groundnut)", "pa": "ਮੂੰਗਫਲੀ (Groundnut)"
        },
        "variety": "TMV-2 / KDG-128",
        "duration_days": 105,
        "water_req_daily": "3.4 mm / day",
        "target_moisture": 26.0,
        "yield_t_ha": "2.8 t/ha",
        "mandi": "Tumakuru / Challakere APMC",
        "price_qtl": "₹6,200 - ₹7,100",
        "primary_disease": "Tikka Leaf Spot (Cercospora personata)",
        "curative": "Spray Tebuconazole 25.9 EC @ 1 mL/L or Mancozeb @ 2 g/L.",
        "yellow_cause": "Iron chlorosis (yellowing between leaf veins in calcareous soils) or Tikka halos.",
        "fertilizer": "NPK 25:50:40 kg/ha + 250 kg/ha Gypsum at 40 DAS pegging."
    },
    "Sugarcane": {
        "names": {
            "kn": "ಕಬ್ಬು (Sugarcane)", "en": "Sugarcane", "hi": "गन्ना (Sugarcane)",
            "ta": "கரும்பு (Sugarcane)", "te": "చెరకు (Sugarcane)", "ml": "കരിമ്പ് (Sugarcane)",
            "mr": "ऊस (Sugarcane)", "bn": "আখ (Sugarcane)", "pa": "ਗੰਨਾ (Sugarcane)"
        },
        "variety": "Co 86032 / VSI 434",
        "duration_days": 360,
        "water_req_daily": "7.5 mm / day",
        "target_moisture": 42.0,
        "yield_t_ha": "95.0 t/ha",
        "mandi": "Mandya Sugar Factory / FRP Benchmark",
        "price_qtl": "₹3,400 - ₹3,800 / Tonne",
        "primary_disease": "Red Rot & Early Shoot Borer",
        "curative": "Soil drench Carbendazim 50 WP @ 1 g/L; release Trichogramma chilonis egg parasitoids.",
        "yellow_cause": "Iron chlorosis or Pokkah Boeng fungal infection during monsoon.",
        "fertilizer": "NPK 250:100:125 kg/ha applied across formative and grand growth stages."
    },
    "Cotton": {
        "names": {
            "kn": "ಹತ್ತಿ (Cotton)", "en": "Cotton", "hi": "कपास (Cotton)",
            "ta": "பருத்தி (Cotton)", "te": "పత్తి (Cotton)", "ml": "പരുത്തി (Cotton)",
            "mr": "कापूस (Cotton)", "bn": "তুলা (Cotton)", "pa": "ਕਪਾਹ (Cotton)"
        },
        "variety": "Bt RCH-2 Hybrid",
        "duration_days": 160,
        "water_req_daily": "4.5 mm / day",
        "target_moisture": 30.0,
        "yield_t_ha": "2.4 t/ha",
        "mandi": "Haveri / Hubballi APMC",
        "price_qtl": "₹6,800 - ₹7,600",
        "primary_disease": "Bacterial Blight & Pink Bollworm",
        "curative": "Foliar spray of Streptocycline @ 1 g / 10 L + Copper Oxychloride @ 25 g; install pheromone traps.",
        "yellow_cause": "Sucking pests (Jassids / Whiteflies) or magnesium deficiency (reddening / yellowing).",
        "fertilizer": "NPK 120:60:60 kg/ha with 2 sprays of 1% Magnesium Sulphate + 1% Urea."
    },
    "Banana": {
        "names": {
            "kn": "ಬಾಳೆ (Banana)", "en": "Banana", "hi": "केला (Banana)",
            "ta": "வாழை (Banana)", "te": "అరటి (Banana)", "ml": "വാഴ (Banana)",
            "mr": "केळी (Banana)", "bn": "কলা (Banana)", "pa": "ਕੇਲਾ (Banana)"
        },
        "variety": "Grand Naine (G9)",
        "duration_days": 330,
        "water_req_daily": "6.8 mm / day",
        "target_moisture": 38.0,
        "yield_t_ha": "65.0 t/ha",
        "mandi": "Ramanagara / Mysuru APMC",
        "price_qtl": "₹1,800 - ₹2,700",
        "primary_disease": "Sigatoka Leaf Spot & Panama Wilt",
        "curative": "Mineral oil spray (1%) + Propiconazole @ 1 mL/L for Sigatoka; Drench Pseudomonas fluorescens.",
        "yellow_cause": "Potassium deficiency (marginal leaf yellowing and scorching) or poor drainage.",
        "fertilizer": "NPK 200:50:300 g/plant. Banana is a heavy potassium feeder."
    }
}

def resolve_crop_spec(crop_name: str) -> Dict[str, Any]:
    s = crop_name.lower().strip()
    if "onion" in s or "ಈರುಳ್ಳಿ" in s or "प्याज" in s or "வெங்காயம்" in s:
        return CROP_AGRO_SPECS["Onion"]
    if "potato" in s or "ಆಲೂಗಡ್ಡೆ" in s or "आलू" in s or "உருளை" in s or "బంగాళా" in s:
        return CROP_AGRO_SPECS["Potato"]
    if "carrot" in s or "ಕ್ಯಾರೆಟ್" in s or "गाजर" in s or "கேரட்" in s:
        return CROP_AGRO_SPECS["Carrot"]
    if "beetroot" in s or "ಬೀಟ್‌ರೂಟ್" in s or "चुकंदर" in s or "பீட்ரூட்" in s:
        return CROP_AGRO_SPECS["Beetroot"]
    if "tomato" in s or "ಟೊಮೆಟೊ" in s or "टमाटर" in s or "தக்காளி" in s:
        return CROP_AGRO_SPECS["Tomato"]
    if "ragi" in s or "finger millet" in s or "ರಾಗಿ" in s or "मडुआ" in s:
        return CROP_AGRO_SPECS["Ragi"]
    if "rice" in s or "paddy" in s or "ಭತ್ತ" in s or "धान" in s or "நெல்" in s or "వరి" in s:
        return CROP_AGRO_SPECS["Rice"]
    if "wheat" in s or "ಗೋಧಿ" in s or "गेहूं" in s or "கோதுமை" in s:
        return CROP_AGRO_SPECS["Wheat"]
    if "maize" in s or "corn" in s or "ಮೆಕ್ಕೆಜೋಳ" in s or "मक्का" in s:
        return CROP_AGRO_SPECS["Maize"]
    if "groundnut" in s or "peanut" in s or "ಕಡಲೆಕಾಯಿ" in s or "मूंगफली" in s:
        return CROP_AGRO_SPECS["Groundnut"]
    if "sugarcane" in s or "cane" in s or "ಕಬ್ಬು" in s or "गन्ना" in s:
        return CROP_AGRO_SPECS["Sugarcane"]
    if "cotton" in s or "ಹತ್ತಿ" in s or "कपास" in s or "பருத்தி" in s:
        return CROP_AGRO_SPECS["Cotton"]
    if "banana" in s or "ಬಾಳೆ" in s or "केला" in s or "வாழை" in s:
        return CROP_AGRO_SPECS["Banana"]
    return CROP_AGRO_SPECS["Onion"]


class MultilingualVoiceAgronomist:
    """
    Intelligent Multilingual Voice Agronomist supporting Indian farmers across 9 languages.
    Provides accurate, grounded agricultural guidance tailored to the farmer's active crop and telemetry.
    """

    def __init__(self):
        self.gemini_api_key = os.environ.get("GEMINI_API_KEY", "")
        self.sarvam_api_key = os.environ.get("SARVAM_API_KEY", "")

    def get_context_snapshot(self, plot_id: Optional[str] = None, field_id: Optional[str] = None) -> Dict[str, Any]:
        """Gathers real grounded soil, microclimate, and crop parameters."""
        if field_id:
            try:
                from app.database import SessionLocal, DBField
                db = SessionLocal()
                db_field = db.query(DBField).filter(DBField.id == field_id).first()
                if db_field:
                    latest_soil = db_field.soil_telemetries[-1] if db_field.soil_telemetries else None
                    latest_micro = db_field.microclimates[-1] if db_field.microclimates else None
                    soil_m = round(latest_soil.moisture_percentage, 1) if latest_soil else 28.5
                    soil_t = round(latest_soil.temperature_celsius, 1) if latest_soil else 22.4
                    amb_t = round(latest_micro.temperature_celsius, 1) if latest_micro else 24.2
                    rel_h = round(latest_micro.relative_humidity, 1) if latest_micro else 68.0

                    db.close()
                    spec = resolve_crop_spec(db_field.crop_type)
                    return {
                        "field_name": db_field.name,
                        "crop_name": db_field.crop_type,
                        "variety": db_field.crop_variety or spec["variety"],
                        "growth_stage": db_field.growth_stage,
                        "days_after_sowing": db_field.days_after_sowing,
                        "soil_moisture_pct": soil_m,
                        "soil_temp_c": soil_t,
                        "ambient_temp_c": amb_t,
                        "relative_humidity_pct": rel_h,
                        "soil_ph": round(db_field.soil_ph, 2),
                        "nitrogen_ppm": db_field.nitrogen_ppm,
                        "phosphorus_ppm": db_field.phosphorus_ppm,
                        "potassium_ppm": db_field.potassium_ppm,
                        "health_index": 94 if db_field.risk_level == "Low" else 82,
                        "resilience_score": db_field.resilience_score or 88,
                        "water_req_daily": spec["water_req_daily"],
                        "mandi": spec["mandi"],
                        "data_source": f"Grounded Farm Telemetry ({db_field.location})",
                    }
                db.close()
            except Exception:
                pass

        plot = None
        if plot_id:
            plot = twin_engine.get_plot(plot_id)
        if not plot and twin_engine.plots:
            plot = list(twin_engine.plots.values())[0]

        if plot:
            spec = resolve_crop_spec(plot.crop.crop_name)
            return {
                "field_name": plot.name,
                "crop_name": plot.crop.crop_name,
                "variety": plot.crop.variety,
                "growth_stage": plot.crop.growth_stage,
                "days_after_sowing": plot.crop.days_after_sowing,
                "soil_moisture_pct": round(plot.soil.layers[1].moisture_percentage, 1),
                "soil_temp_c": round(plot.soil.layers[1].temperature_celsius, 1),
                "ambient_temp_c": round(plot.microclimate.ambient_temp_c, 1),
                "relative_humidity_pct": round(plot.microclimate.relative_humidity_percent, 1),
                "soil_ph": round(plot.soil.ph, 2),
                "nitrogen_ppm": plot.soil.nitrogen_ppm,
                "phosphorus_ppm": plot.soil.phosphorus_ppm,
                "potassium_ppm": plot.soil.potassium_ppm,
                "health_index": int(plot.crop.canopy_ndvi * 100),
                "resilience_score": plot.resilience_score,
                "water_req_daily": spec["water_req_daily"],
                "mandi": spec["mandi"],
                "data_source": "Live Sensor Telemetry & Calibrated Soil Physics",
            }

        return {
            "field_name": "Main Agricultural Twin Plot",
            "crop_name": "Onion",
            "variety": "Bhima Super",
            "growth_stage": "Bulb Swelling Stage",
            "days_after_sowing": 55,
            "soil_moisture_pct": 29.5,
            "soil_temp_c": 22.4,
            "ambient_temp_c": 25.2,
            "relative_humidity_pct": 65.0,
            "soil_ph": 6.8,
            "nitrogen_ppm": 125,
            "phosphorus_ppm": 28,
            "potassium_ppm": 195,
            "health_index": 92,
            "resilience_score": 88,
            "water_req_daily": "4.0 mm / day",
            "mandi": "Yeshwanthpur APMC",
            "data_source": "Calibrated Agro-Twin Simulation Model",
        }

    def generate_agricultural_response(
        self,
        query: str,
        lang: str = "kn",
        plot_id: Optional[str] = None,
        field_id: Optional[str] = None,
        user_name: str = "Ramesh Gowda",
        conversation_history: Optional[List[Dict[str, str]]] = None,
        crop_override: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Processes agricultural query and returns grounded response in the farmer's language."""
        if lang not in SUPPORTED_LANGUAGES:
            lang = "kn"

        ctx = self.get_context_snapshot(plot_id, field_id)
        if crop_override:
            ctx["crop_name"] = crop_override
            spec = resolve_crop_spec(crop_override)
            ctx["variety"] = spec["variety"]
            ctx["water_req_daily"] = spec["water_req_daily"]
            ctx["mandi"] = spec["mandi"]

        query_clean = query.strip()
        query_lower = query_clean.lower()

        # Dynamic crop detection from query
        for k in CROP_AGRO_SPECS:
            if k.lower() in query_lower:
                ctx["crop_name"] = k
                spec = CROP_AGRO_SPECS[k]
                ctx["variety"] = spec["variety"]
                ctx["water_req_daily"] = spec["water_req_daily"]
                ctx["mandi"] = spec["mandi"]
                break

        # Check for Gemini if available
        if GENAI_AVAILABLE and self.gemini_api_key:
            try:
                gemini_res = self._call_gemini(query_clean, lang, ctx, user_name, conversation_history)
                if gemini_res:
                    return gemini_res
            except Exception as e:
                print(f"[VoiceAgronomist] Gemini API fallback: {e}")

        # Built-in High Precision Multilingual Agronomic Engine
        return self._generate_localized_agronomy(query_clean, query_lower, lang, ctx, user_name, conversation_history)

    def _call_gemini(
        self,
        query: str,
        lang: str,
        ctx: Dict[str, Any],
        user_name: str,
        conversation_history: Optional[List[Dict[str, str]]] = None,
    ) -> Optional[Dict[str, Any]]:
        client = genai.Client(api_key=self.gemini_api_key)
        lang_info = SUPPORTED_LANGUAGES[lang]
        
        system_instruction = (
            "You are AgriSentinel AI, an intelligent agricultural assistant designed to help farmers.\n"
            f"Active Crop: {ctx['crop_name']} (Variety: {ctx.get('variety', 'Standard')})\n"
            f"Field Soil Moisture: {ctx.get('soil_moisture_pct', 28.0)}% (Target: 28-35%)\n"
            f"Daily Water Requirement: {ctx.get('water_req_daily', '4.0 mm/day')}\n"
            f"Temperature: {ctx.get('ambient_temp_c', 26.0)}°C, Soil pH: {ctx.get('soil_ph', 6.5)}\n"
            f"Benchmark Market: {ctx.get('mandi', 'APMC')}\n\n"
            f"CRITICAL: Reply 100% in {lang_info['name']} ({lang_info['native']}).\n"
            "Answer the farmer's specific question practically with exact dosages and steps.\n"
            "Keep the spoken summary concise (under 260 characters) and natural for audio playback."
        )

        history_text = ""
        if conversation_history:
            history_text = "Previous conversation:\n"
            for turn in conversation_history[-4:]:
                sender = turn.get("sender") or turn.get("role", "Farmer")
                msg = turn.get("text") or turn.get("content", "")
                history_text += f"{sender}: {msg}\n"
            history_text += "\n"

        prompt = f"{history_text}Farmer asks: {query}"
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                temperature=0.3,
            )
        )
        
        text = response.text or ""
        return {
            "query": query,
            "language": lang,
            "language_name": lang_info["name"],
            "reply": text,
            "spoken_summary": text[:260].replace("\n", " "),
            "suggested_actions": ["ನೀರಾವರಿ ವೇಳಾಪಟ್ಟಿ", "ಪೋಷಕಾಂಶ ಪರಿಶೀಲನೆ"],
            "alert": None if ctx.get("soil_moisture_pct", 30) > 22 else f"Low Moisture Warning: {ctx.get('soil_moisture_pct')}%",
            "data_source": ctx.get("data_source", "AgriSentinel AI Core"),
            "field_snapshot": ctx,
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }

    def _generate_localized_agronomy(
        self,
        query: str,
        query_lower: str,
        lang: str,
        ctx: Dict[str, Any],
        user_name: str,
        conversation_history: Optional[List[Dict[str, str]]] = None,
    ) -> Dict[str, Any]:
        """Provides accurate agricultural guidance in all 9 Indian languages."""
        c_name = ctx["crop_name"]
        spec = resolve_crop_spec(c_name)
        crop_disp = spec["names"].get(lang, c_name)
        m_pct = ctx.get("soil_moisture_pct", 28.5)
        w_need = spec["water_req_daily"]
        stage = ctx.get("growth_stage", "Vegetative / Bulking Stage")
        mandi = spec["mandi"]
        price = spec["price_qtl"]
        disease = spec["primary_disease"]
        curative = spec["curative"]
        yellow_info = spec["yellow_cause"]
        fertilizer_info = spec["fertilizer"]
        yield_info = spec["yield_t_ha"]

        # Universal Intent Detection across languages
        is_water = any(w in query_lower for w in ["water", "irrigation", "moisture", "ನೀರು", "ನೀರಾವರಿ", "ತೇವಾಂಶ", "पानी", "सिंचाई", "नमी", "தண்ணீர்", "பாசனம்", "ஈரப்பதம்", "నీరు", "సాగునీరు", "తేమ", "വെള്ളം", "നന", "पाणी", "ओलावा", "জল", "সেচ", "ਪਾਣੀ", "ਸਿੰਚਾਈ"])
        is_yellow = any(w in query_lower for w in ["yellow", "chlorosis", "ಹಳದಿ", "ಬಣ್ಣ", "पील", "மஞ்சள்", "పసుపు", "മഞ്ഞ", "पिवळ", "হলুদ", "ਪੀਲ"])
        is_fertilizer = any(w in query_lower for w in ["fertilizer", "urea", "npk", "dosage", "ಗೊಬ್ಬರ", "ಯೂರಿಯಾ", "ಪೋಷಕಾಂಶ", "खाद", "उर्वरक", "यूरिया", "உரம்", "எరువు", "വളം", " खते", "रासायनिक खत", " खत ", "সার", "ਖਾਦ", "ਖਾਦਾਂ"])
        is_disease = any(w in query_lower for w in ["disease", "pest", "blight", "rot", "curling", "virus", "ರೋಗ", "ಕೀಟ", "ಬಾಧೆ", "ಬೆಂಕಿ", "ಕೊಳೆ", "बीमारी", "रोग", "कीट", "ब्लाइट", "நோய்", "பூச்சி", "தெగులు", "పురుగు", "రోగం", "രോഗം", "കീടം", "कीड", "পোকা", "বালাই", "ਕੀੜਾ", "ਬਿਮਾਰੀ"])
        is_yield = any(w in query_lower for w in ["yield", "harvest", "production", "tonnes", "ಇಳುವರಿ", "ಕೊಯ್ಲು", "ಬೆಳೆ", "पैदावार", "कटाई", "उत्पादन", "மகசூல்", "அறுவடை", "దిగుబడి", "కోత", "വിളവ്", "उत्पादन", "ফলন", "ਝਾੜ"])
        is_market = any(w in query_lower for w in ["price", "market", "mandi", "rate", "sell", "hold", "ಬೆಲೆ", "ಮಾರುಕಟ್ಟೆ", "ಮಾರಾಟ", "ದರ", "ಭಾವ", "भाव", "मंडी", "दाम", "बिक्री", "விலை", "சந்தை", "விற்பனை", "ధర", "మార్కెట్", "విక్రయం", "വില", "ദർ", "দর", "বাজার", "ਮੁੱਲ", "ਮੰਡੀ", "ਭਾਅ", "ਭਾ"])
        is_weather = any(w in query_lower for w in ["rain", "rainfall", "weather", "drought", "dry", "ಮಳೆ", "ಹವಾಮಾನ", "ಬರ", "ಕಾಮ", "बारिश", "मौसम", "सूखा", "மழை", "வானிலை", "வறட்சி", "వర్షం", "వాతావరణం", "മഴ", "कांदा", "বৃষ্টি", "ਮੀਂਹ"])

        alert = None
        if m_pct < 22:
            alert = f"Critical Moisture Warning: {m_pct}% in root zone."

        # Multilingual Responses
        if lang == "kn":
            if is_water:
                reply = (
                    f"ನಮಸ್ಕಾರ {user_name} ಅವರೇ. ನಿಮ್ಮ {crop_disp} ಬೆಳೆಗೆ ಪ್ರಸ್ತುತ ಮಣ್ಣಿನ ತೇವಾಂಶ ಶೇಕಡಾ {m_pct}% ರಷ್ಟಿದೆ.\n\n"
                    f"ನೀರಾವರಿ ಶಿಫಾರಸುಗಳು:\n"
                    f"1. {crop_disp} ಬೆಳೆಗೆ ದಿನಕ್ಕೆ ಸರಾಸರಿ {w_need} ನೀರು ಬೇಕಾಗುತ್ತದೆ. ಪ್ರಸ್ತುತ ತೇವಾಂಶವು {'ಉತ್ತಮ ಮಟ್ಟದಲ್ಲಿದೆ' if m_pct >= 26 else 'ಕಡಿಮೆಯಾಗಿದ್ದು ಲಘು ನೀರಾವರಿ ಅಗತ್ಯವಿದೆ'}.\n"
                    f"2. ಬೆಳಿಗ್ಗೆ ಅಥವಾ ಸಂಜೆ ವೇಳೆ ಹನಿ ನೀರಾವರಿ ನೀಡಿ, ಬೇರುಗಳ ಬಳಿ ನೀರು ನಿಲ್ಲದಂತೆ ನೋಡಿಕೊಳ್ಳಿ."
                )
                spoken = f"ನಿಮ್ಮ {crop_disp} ಬೆಳೆಗೆ ಮಣ್ಣಿನ ತೇವಾಂಶ {m_pct}% ಇದೆ. ದಿನಕ್ಕೆ {w_need} ನೀರು ಬೇಕು."
                actions = ["ಹನಿ ನೀರಾವರಿ ವೇಳಾಪಟ್ಟಿ", "ತೇವಾಂಶ ಗ್ರಾಫ್"]
            elif is_yellow:
                reply = (
                    f"ನಿಮ್ಮ {crop_disp} ಎಲೆಗಳು ಹಳದಿಯಾಗುತ್ತಿದ್ದರೆ ಕಾರಣಗಳು ಮತ್ತು ಪರಿಹಾರ:\n\n"
                    f"1. **ಮುಖ್ಯ ಕಾರಣ**: {yellow_info}\n"
                    f"2. **ತುರ್ತು ಕ್ರಮ**: 19:19:19 ನೀರಿನಲ್ಲಿ ಕರಗುವ ರಸಗೊಬ್ಬರವನ್ನು ಲೀಟರ್‌ಗೆ 10-15 ಗ್ರಾಂ ಬೆರೆಸಿ ಮುಂಜಾನೆ ಸಿಂಪಡಿಸಿ.\n"
                    f"3. ಮಡಿಯಲ್ಲಿ ನೀರು ನಿಲ್ಲದಂತೆ ಬಸಿಗಾಲುವೆಗಳನ್ನು ಸ್ವಚ್ಛಗೊಳಿಸಿ."
                )
                spoken = f"{crop_disp} ಎಲೆಗಳು ಹಳದಿಯಾಗಲು {yellow_info} 19:19:19 ಗೊಬ್ಬರ ಸಿಂಪಡಿಸಿ."
                actions = ["ಪೋಷಕಾಂಶ ಪರೀಕ್ಷೆ", "ಬಸಿಗಾಲುವೆ ಸ್ವಚ್ಛತೆ"]
            elif is_fertilizer:
                reply = (
                    f"{crop_disp} ಬೆಳೆಗೆ ಗೊಬ್ಬರ ಮತ್ತು ಪೋಷಕಾಂಶಗಳ ವೇಳಾಪಟ್ಟಿ:\n\n"
                    f"1. **ಶಿಫಾರಸು ಮಾಡಿದ ಪ್ರಮಾಣ**: {fertilizer_info}\n"
                    f"2. ಗಡ್ಡೆ/ಕಾಳು ಕಟ್ಟುವ ಹಂತದಲ್ಲಿ ಹೆಚ್ಚಿನ ಪೊಟ್ಯಾಶ್ (0:0:50) ಸಿಂಪಡಿಸುವುದರಿಂದ ಗುಣಮಟ್ಟ ಹಾಗೂ ತೂಕ ಹೆಚ್ಚುತ್ತದೆ.\n"
                    f"3. ಸಾವಯವ ಜೀವಾಮೃತವನ್ನು 15 ದಿನಕ್ಕೊಮ್ಮೆ ಹಾಯಿಸಿ."
                )
                spoken = f"{crop_disp} ಬೆಳೆಗೆ {fertilizer_info}"
                actions = ["ರಸಗೊಬ್ಬರ ಪ್ರಮಾಣ", "ಪೋಷಕಾಂಶ ಕ್ಯಾಲ್ಕುಲೇಟರ್"]
            elif is_disease:
                reply = (
                    f"{crop_disp} ಬೆಳೆಯ ರೋಗ ನಿರ್ವಹಣಾ ಮಾರ್ಗದರ್ಶಿ:\n\n"
                    f"1. **ಪ್ರಮುಖ ರೋಗ**: {disease}\n"
                    f"2. **ಪರಿಹಾರ ಔಷಧ**: {curative}\n"
                    f"3. ಶಿಲೀಂಧ್ರನಾಶಕದ ಜೊತೆಗೆ ಉತ್ತಮ ಜಿಗುಟು (Sticker) ಬೆರೆಸಿ ಸಿಂಪಡಿಸುವುದು ಕಡ್ಡಾಯ."
                )
                spoken = f"{crop_disp} ಬೆಳೆಗೆ {disease} ತಡೆಗಟ್ಟಲು {curative}"
                actions = ["ರೋಗ ನಿಯಂತ್ರಣ ಕೈಪಿಡಿ", "ಔಷಧಿ ಸಿಂಪರಣೆ"]
            elif is_yield:
                reply = (
                    f"{crop_disp} ಕೊಯ್ಲು ಮತ್ತು ಇಳುವರಿ ಮಾಹಿತಿ:\n\n"
                    f"1. **ನಿರೀಕ್ಷಿತ ಸರಾಸರಿ ಇಳುವರಿ**: ಹೆಕ್ಟೇರ್‌ಗೆ {yield_info}.\n"
                    f"2. **ಬೆಳವಣಿಗೆ ಅವಧಿ**: ಬಿತ್ತನೆಯಿಂದ ಸುಮಾರು {spec['duration_days']} ದಿನಗಳು.\n"
                    f"3. ಗಡ್ಡೆ/ತೆನೆ ಸಂಪೂರ್ಣ ಮಾಗಿದ ನಂತರ ಒಣ ವಾತಾವರಣದಲ್ಲಿ ಕೊಯ್ಲು ಮಾಡಿ."
                )
                spoken = f"{crop_disp} ಇಳುವರಿ ಹೆಕ್ಟೇರ್‌ಗೆ ಸುಮಾರು {yield_info} ನಿರೀಕ್ಷಿಸಬಹುದು."
                actions = ["ಕೊಯ್ಲು ಸಿದ್ಧತೆ", "ಇಳುವರಿ ಮುನ್ಸೂಚನೆ"]
            elif is_market:
                reply = (
                    f"{crop_disp} ಮಾರುಕಟ್ಟೆ ಬೆಲೆ ವಿಶ್ಲೇಷಣೆ:\n\n"
                    f"1. **ಪ್ರಮುಖ ಮಂಡಿ**: {mandi}.\n"
                    f"2. **ಪ್ರಸ್ತುತ ದರ ಶ್ರೇಣಿ**: ಕ್ವಿಂಟಾಲ್‌ಗೆ {price}.\n"
                    f"3. ಉತ್ತಮ ದರ್ಜೆಯ ಹಾಗೂ ತೇವಾಂಶವಿಲ್ಲದ ಒಣ ಉತ್ಪನ್ನಕ್ಕೆ ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಗರಿಷ್ಠ ದರ ದೊರೆಯುತ್ತದೆ."
                )
                spoken = f"{crop_disp} ಪ್ರಸ್ತುತ ಮಾರುಕಟ್ಟೆ ದರ ಕ್ವಿಂಟಾಲ್‌ಗೆ {price} ರಷ್ಟಿದೆ."
                actions = ["ಮಾರುಕಟ್ಟೆ ಚಾರ್ಟ್", "Sell vs Hold ಲೆಕ್ಕ"]
            else:
                reply = (
                    f"ನಮಸ್ಕಾರ {user_name}! ನಿಮ್ಮ {crop_disp} ಹೊಲದ ಆರೋಗ್ಯ ಸೂಚ್ಯಂಕ {ctx.get('health_index', 92)}% ರಷ್ಟಿದೆ.\n\n"
                    f"ಪ್ರಸ್ತುತ ಅಂಕಿ-ಅಂಶಗಳು:\n"
                    f"- ಮಣ್ಣಿನ ತೇವಾಂಶ: {m_pct}% | ತಾಪಮಾನ: {ctx.get('ambient_temp_c', 25)}°C\n"
                    f"- ದಿನದ ನೀರಿನ ಬೇಡಿಕೆ: {w_need} | ಮಾರುಕಟ್ಟೆ: {mandi}\n\n"
                    f"ನೀರಾವರಿ, ರೋಗ ನಿಯಂತ್ರಣ, ಗೊಬ್ಬರ ಅಥವಾ ಮಾರುಕಟ್ಟೆ ಬೆಲೆಯ ಬಗ್ಗೆ ಯಾವುದೇ ಪ್ರಶ್ನೆ ಕೇಳಿ."
                )
                spoken = f"ನಿಮ್ಮ {crop_disp} ಬೆಳೆಯ ಆರೋಗ್ಯ ಉತ್ತಮವಾಗಿದೆ. ಮಣ್ಣಿನ ತೇವಾಂಶ {m_pct}% ಇದೆ."
                actions = ["ಬೆಳೆ ಆರೋಗ್ಯ ಪರಿಶೀಲನೆ", "ದೈನಂದಿನ ಸಲಹೆಗಳು"]

        elif lang == "hi":
            if is_water:
                reply = (
                    f"नमस्ते {user_name} जी! आपकी {crop_disp} फसल के लिए वर्तमान में मिट्टी की नमी {m_pct}% है।\n\n"
                    f"सिंचाई दिशा-निर्देश:\n"
                    f"1. {crop_disp} को प्रतिदिन लगभग {w_need} पानी की आवश्यकता होती है। वर्तमान नमी {'संतोषजनक' if m_pct >= 26 else 'कम है, हल्की सिंचाई करें'}।\n"
                    f"2. ड्रिप सिंचाई सुबह के समय करें ताकि कंद या जड़ों में पानी न ठहरे।"
                )
                spoken = f"आपकी {crop_disp} फसल में मिट्टी की नमी {m_pct}% है। दैनिक पानी की आवश्यकता {w_need} है।"
                actions = ["ड्रिप सिंचाई सारणी", "नमी मीटर"]
            elif is_yellow:
                reply = (
                    f"आपकी {crop_disp} की पत्तियां पीली होने का मुख्य कारण और उपचार:\n\n"
                    f"1. **कारण**: {yellow_info}\n"
                    f"2. **उपचार**: 19:19:19 घुलनशील उर्वरक 10-15 ग्राम प्रति लीटर पानी में मिलाकर सुबह छिड़काव करें।\n"
                    f"3. क्यारी में जलभराव न होने दें।"
                )
                spoken = f"{crop_disp} की पत्तियां पीली पड़ने का कारण {yellow_info} 19:19:19 खाद का छिड़काव करें।"
                actions = ["पोषक तत्व जांच", "जल निकासी"]
            elif is_disease:
                reply = (
                    f"{crop_disp} में रोग नियंत्रण और उपचार:\n\n"
                    f"1. **मुख्य रोग**: {disease}\n"
                    f"2. **उपचार स्प्रे**: {curative}\n"
                    f"3. दवा के साथ स्टीकर (चिपचिपा पदार्थ) अवश्य मिलाएं।"
                )
                spoken = f"{crop_disp} में {disease} से बचाव के लिए {curative}"
                actions = ["रोग उपचार गाइड", "कीटनाशक सूची"]
            elif is_fertilizer:
                reply = (
                    f"{crop_disp} फसल के लिए संतुलित उर्वरक प्रबंधन:\n\n"
                    f"1. **अनुशंसित मात्रा**: {fertilizer_info}\n"
                    f"2. कंद/दाने बनने की अवस्था में पोटाश की मात्रा बढ़ाएं जिससे चमक और वजन अच्छा मिले।"
                )
                spoken = f"{crop_disp} के लिए खाद की सिफारिश: {fertilizer_info}"
                actions = ["खाद मात्रा कैलकुलेटर", "उर्वरक शेड्यूल"]
            elif is_yield:
                reply = (
                    f"{crop_disp} की पैदावार और कटाई जानकारी:\n\n"
                    f"1. **अपेक्षित पैदावार**: प्रति हेक्टेयर {yield_info}।\n"
                    f"2. **फसल अवधि**: बुवाई से लगभग {spec['duration_days']} दिन।\n"
                    f"3. कंद या बालियां पूरी तरह पकने पर ही कटाई करें।"
                )
                spoken = f"{crop_disp} की अपेक्षित पैदावार प्रति हेक्टेयर {yield_info} है।"
                actions = ["कटाई दिशानिर्देश", "पैदावार पूर्वानुमान"]
            elif is_market:
                reply = (
                    f"{crop_disp} का मंडी भाव विश्लेषण:\n\n"
                    f"1. **प्रमुख मंडी**: {mandi}।\n"
                    f"2. **वर्तमान भाव**: {price} प्रति क्विंटल।\n"
                    f"3. सूखी और छंटाई की गई फसल का भाव सबसे अच्छा मिलता है।"
                )
                spoken = f"{crop_disp} का वर्तमान मंडी भाव {price} प्रति क्विंटल है।"
                actions = ["मंडी भाव चार्ट", "बिक्री सलाह"]
            else:
                reply = (
                    f"नमस्ते {user_name} जी! आपकी {crop_disp} फसल का स्वास्थ्य सूचकांक {ctx.get('health_index', 92)}% है।\n\n"
                    f"- मिट्टी की नमी: {m_pct}% | तापमान: {ctx.get('ambient_temp_c', 25)}°C\n"
                    f"- दैनिक पानी: {w_need} | प्रमुख मंडी: {mandi}\n\n"
                    f"सिंचाई, खाद, रोग नियंत्रण या मंडी भाव के बारे में पूछें।"
                )
                spoken = f"आपकी {crop_disp} फसल स्वस्थ है। मिट्टी की नमी {m_pct} प्रतिशत है।"
                actions = ["फसल स्वास्थ्य जांच", "दैनिक परामर्श"]

        elif lang == "ta":
            if is_water:
                reply = (
                    f"வணக்கம் {user_name}! உங்கள் {crop_disp} பயிரில் மண் ஈரப்பதம் {m_pct}% ஆக உள்ளது.\n\n"
                    f"பாசன ஆலோசனைகள்:\n"
                    f"1. {crop_disp} பயிருக்கு நாள் ஒன்றுக்கு சுமார் {w_need} தண்ணீர் தேவைப்படுகிறது.\n"
                    f"2. காலையில் சொட்டு நீர் பாசனம் செய்யவும்; வேர்களில் நீர் தேங்காமல் பார்த்துக் கொள்ளவும்."
                )
                spoken = f"உங்கள் {crop_disp} பயிரில் மண் ஈரப்பதம் {m_pct}% ஆக உள்ளது. நாள் ஒன்றுக்கு {w_need} தண்ணீர் தேவை."
                actions = ["பாசன அட்டவணை", "ஈரப்பதம் வரைபடம்"]
            elif is_yellow:
                reply = (
                    f"{crop_disp} இலைகள் மஞ்சள் நிறமாக மாறுவதற்கான காரணம் மற்றும் தீர்வு:\n\n"
                    f"1. **காரணம்**: {yellow_info}\n"
                    f"2. **தீவிர சிகிச்சை**: 19:19:19 உரத்தை லிட்டருக்கு 10-15 கிராம் கலந்து காலை வேளையில் தெளிக்கவும்."
                )
                spoken = f"{crop_disp} இலைகள் மஞ்சள் நிறமாக மாறுவதற்கு {yellow_info} 19:19:19 உரம் தெளிக்கவும்."
                actions = ["ஊட்டச்சத்து சமநிலை", "நீர் வடிகால்"]
            elif is_disease:
                reply = f"{crop_disp} பயிர் நோய் மேலாண்மை:\n1. நோய்: {disease}\n2. மருந்து: {curative}"
                spoken = f"{crop_disp} பயிரில் {disease} நோய்க்கு {curative}"
                actions = ["நோய் கட்டுப்பாடு", "மருந்து தெளிப்பு"]
            elif is_fertilizer:
                reply = f"{crop_disp} உர மேலாண்மை: பரிந்துரைக்கப்பட்ட உரம்: {fertilizer_info}."
                spoken = f"{crop_disp} பயிருக்கு உரம்: {fertilizer_info}."
                actions = ["உர மேலாண்மை", "ஊட்டச்சத்து அட்டவணை"]
            elif is_market:
                reply = f"{crop_disp} சந்தை விலை நிலவரம்:\n1. முக்கிய சந்தை: {mandi}\n2. தற்போதைய விலை: குவிண்டாலுக்கு {price}"
                spoken = f"{crop_disp} தற்போதைய சந்தை விலை குவிண்டாலுக்கு {price} ஆகும்."
                actions = ["சந்தை விலை", "விற்பனை ஆலோசனை"]
            else:
                reply = f"வணக்கம் {user_name}! உங்கள் {crop_disp} பயிரின் ஆரோக்கியம் {ctx.get('health_index', 92)}% ஆக உள்ளது. மண் ஈரப்பதம் {m_pct}%. தண்ணீர் தேவை {w_need}."
                spoken = f"உங்கள் {crop_disp} பயிரின் ஆரோக்கியம் {ctx.get('health_index', 92)}% ஆக உள்ளது."
                actions = ["பயிர் ஆரோக்கியம்", "வானிலை"]

        elif lang == "te":
            if is_water:
                reply = (
                    f"నమస్కారం {user_name}! మీ {crop_disp} పంటలో నేల తేమ శాతం {m_pct}% గా ఉంది.\n\n"
                    f"సాగునీటి సలహాలు:\n"
                    f"1. {crop_disp} పంటకు రోజుకు సుమారు {w_need} నీరు అవసరం.\n"
                    f"2. ఉదయం వేళ బిందు సేద్యం (Drip) ద్వారా నీరు అందించండి."
                )
                spoken = f"మీ {crop_disp} పంటకు నేల తేమ {m_pct}% గా ఉంది. రోజుకు {w_need} నీరు అవసరం."
                actions = ["నీటి పారుదల షెడ్యూల్", "తేమ కొలత"]
            elif is_yellow:
                reply = (
                    f"{crop_disp} ఆకులు పసుపు రంగులోకి మారడానికి కారణం మరియు నివారణ:\n\n"
                    f"1. **కారణం**: {yellow_info}\n"
                    f"2. **పరిష్కారం**: 19:19:19 ఎరువును లీటరుకు 10-15 గ్రాములు కలిపి ఉదయం పిచికారీ చేయండి."
                )
                spoken = f"{crop_disp} ఆకులు పసుపు రంగులోకి మారడానికి {yellow_info} 19:19:19 పిచికారీ చేయండి."
                actions = ["పోషకాల తనిఖీ", "నీటి పారుదల"]
            elif is_disease:
                reply = f"{crop_disp} తెగుళ్ల నివారణ:\n1. ప్రధాన తెగులు: {disease}\n2. మందు: {curative}"
                spoken = f"{crop_disp} పంటకు {disease} నివారణకు {curative}"
                actions = ["తెగుళ్ల నివారణ", "మందుల సమాచారం"]
            elif is_fertilizer:
                reply = f"{crop_disp} ఎరువుల యాజమాన్యం: సిఫార్సు చేసిన ఎరువులు: {fertilizer_info}."
                spoken = f"{crop_disp} పంటకు ఎరువులు: {fertilizer_info}."
                actions = ["ఎరువుల షెడ్యూల్", "పోషకాల యాజమాన్యం"]
            elif is_market:
                reply = f"{crop_disp} మార్కెట్ ధర వివరాలు:\n1. ప్రధాన మార్కెట్: {mandi}\n2. ప్రస్తుత ధర: క్వింటాలుకు {price}"
                spoken = f"{crop_disp} ప్రస్తుత మార్కెట్ ధర క్వింటాలుకు {price} గా ఉంది."
                actions = ["మార్కెట్ ధరలు", "అమ్మకం సలహా"]
            else:
                reply = f"నమస్కారం {user_name}! మీ {crop_disp} పంట ఆరోగ్యం {ctx.get('health_index', 92)}% గా ఉంది. నేల తేమ {m_pct}%. రోజువారీ నీటి అవసరం {w_need}."
                spoken = f"మీ {crop_disp} పంట ఆరోగ్యం {ctx.get('health_index', 92)}% గా ఉంది."
                actions = ["పంట ఆరోగ్యం", "వాతావరణం"]

        elif lang == "ml":
            if is_water:
                reply = f"നമസ്കാരം {user_name}! നിങ്ങളുടെ {crop_disp} വിളയ്ക്ക് മണ്ണിലെ ഈർപ്പം {m_pct}% ആണ്. പ്രതിദിനം {w_need} വെള്ളം ആവശ്യമാണ്."
                spoken = f"നിങ്ങളുടെ {crop_disp} വിളയ്ക്ക് മണ്ണിലെ ഈർപ്പം {m_pct}% ആണ്. പ്രതിദിനം {w_need} വെള്ളം വേണം."
            elif is_yellow:
                reply = f"{crop_disp} ഇലകൾ മഞ്ഞനിറമാകാൻ കാരണം: {yellow_info}. 19:19:19 വളം തളിക്കുക."
                spoken = f"{crop_disp} ഇലകൾ മഞ്ഞനിറമാകാൻ കാരണം {yellow_info}."
            elif is_disease:
                reply = f"{crop_disp} രോഗനിയന്ത്രണം: പ്രധാന രോഗം: {disease}. മരുന്ന്: {curative}."
                spoken = f"{crop_disp} രോഗത്തിന് {curative}."
            elif is_fertilizer:
                reply = f"{crop_disp} വളപ്രയോഗം: ശുപാർശ ചെയ്ത വളം: {fertilizer_info}."
                spoken = f"{crop_disp} വിളയ്ക്ക് വളം: {fertilizer_info}."
            elif is_market:
                reply = f"{crop_disp} വിപണി വില: ക്വിന്റലിന് {price} ({mandi})."
                spoken = f"{crop_disp} വിപണി വില ക്വിന്റലിന് {price} ആണ്."
            else:
                reply = f"നമസ്കാരം {user_name}! നിങ്ങളുടെ {crop_disp} വിളയുടെ ആരോഗ്യം {ctx.get('health_index', 92)}% ആണ്. മണ്ണിലെ ഈർപ്പം {m_pct}%."
                spoken = f"നിങ്ങളുടെ {crop_disp} വിളയുടെ ആരോഗ്യം {ctx.get('health_index', 92)}% ആണ്."
            actions = ["വിള പരിപാലനം", "വിപണി വില"]

        elif lang == "mr":
            if is_water:
                reply = f"नमस्कार {user_name}! तुमच्या {crop_disp} पिकासाठी मातीचा ओलावा {m_pct}% आहे. दररोज {w_need} पाण्याची गरज आहे."
                spoken = f"तुमच्या {crop_disp} पिकासाठी मातीचा ओलावा {m_pct}% असून दररोज {w_need} पाणी लागते."
            elif is_yellow:
                reply = f"{crop_disp} पाने पिवळी पडण्याचे कारण: {yellow_info}. 19:19:19 विद्राव्य खताची फवारणी करा."
                spoken = f"{crop_disp} पाने पिवळी पडण्याचे कारण {yellow_info}."
            elif is_disease:
                reply = f"{crop_disp} रोग नियंत्रण: प्रमुख रोग: {disease}. उपाय: {curative}."
                spoken = f"{crop_disp} रोगासाठी {curative}."
            elif is_fertilizer:
                reply = f"{crop_disp} खत व्यवस्थापन: शिफारस केलेले खत: {fertilizer_info}."
                spoken = f"{crop_disp} पिकासाठी खत: {fertilizer_info}."
            elif is_market:
                reply = f"{crop_disp} बाजार भाव: {price} प्रति क्विंटल ({mandi})."
                spoken = f"{crop_disp} बाजार भाव {price} प्रति क्विंटल आहे."
            else:
                reply = f"नमस्कार {user_name}! तुमच्या {crop_disp} पिकाचे आरोग्य {ctx.get('health_index', 92)}% आहे. मातीचा ओलावा {m_pct}%."
                spoken = f"तुमच्या {crop_disp} पिकाचे आरोग्य {ctx.get('health_index', 92)}% आहे."
            actions = ["पीक आरोग्य", "बाजार भाव"]

        elif lang == "bn":
            if is_water:
                reply = f"নমস্কার {user_name}! আপনার {crop_disp} ফসলে মাটির আর্দ্রতা {m_pct}%। প্রতিদিন গড়ে {w_need} জলের প্রয়োজন।"
                spoken = f"আপনার {crop_disp} ফসলে মাটির আর্দ্রতা {m_pct}%। প্রতিদিন {w_need} জল প্রয়োজন।"
            elif is_yellow:
                reply = f"{crop_disp} পাতা হলুদ হওয়ার কারণ: {yellow_info}। ১৯:১৯:১৯ সার স্প্রে করুন।"
                spoken = f"{crop_disp} পাতা হলুদ হওয়ার কারণ {yellow_info}।"
            elif is_disease:
                reply = f"{crop_disp} রোগ নিয়ন্ত্রণ: রোগ: {disease}। প্রতিকার: {curative}।"
                spoken = f"{crop_disp} রোগের জন্য {curative}।"
            elif is_fertilizer:
                reply = f"{crop_disp} সার প্রয়োগ নির্দেশিকা: প্রস্তাবিত সার: {fertilizer_info}। "
                spoken = f"{crop_disp} ফসলের জন্য সার: {fertilizer_info}।"
            elif is_market:
                reply = f"{crop_disp} বাজার দর: কুইন্টাল প্রতি {price} ({mandi})।"
                spoken = f"{crop_disp} বর্তমান বাজার দর কুইন্টাল প্রতি {price}।"
            else:
                reply = f"নমস্কার {user_name}! আপনার {crop_disp} ফসলের স্বাস্থ্য {ctx.get('health_index', 92)}%। আর্দ্রতা {m_pct}%।"
                spoken = f"আপনার {crop_disp} ফসলের স্বাস্থ্য {ctx.get('health_index', 92)}%।"
            actions = ["ফসল স্বাস্থ্য", "বাজার দর"]

        elif lang == "pa":
            if is_water:
                reply = f"ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ {user_name}! ਤੁਹਾਡੀ {crop_disp} ਫਸਲ ਵਿੱਚ ਮਿੱਟੀ ਦੀ ਨਮੀ {m_pct}% ਹੈ। ਰੋਜ਼ਾਨਾ {w_need} ਪਾਣੀ ਦੀ ਲੋੜ ਹੈ।"
                spoken = f"ਤੁਹਾਡੀ {crop_disp} ਫਸਲ ਵਿੱਚ ਮਿੱਟੀ ਦੀ ਨਮੀ {m_pct}% ਹੈ ਅਤੇ ਰੋਜ਼ਾਨਾ {w_need} ਪਾਣੀ ਚਾਹੀਦਾ ਹੈ।"
            elif is_yellow:
                reply = f"{crop_disp} ਪੱਤੇ ਪੀਲੇ ਪੈਣ ਦਾ ਕਾਰਨ: {yellow_info}। 19:19:19 ਖਾਦ ਦਾ ਛਿੜਕਾਅ ਕਰੋ।"
                spoken = f"{crop_disp} ਪੱਤੇ ਪੀਲੇ ਪੈਣ ਦਾ ਕਾਰਨ {yellow_info}।"
            elif is_disease:
                reply = f"{crop_disp} ਬਿਮਾਰੀ ਰੋਕਥਾਮ: ਬਿਮਾਰੀ: {disease}। ਇਲਾਜ: {curative}।"
                spoken = f"{crop_disp} ਬਿਮਾਰੀ ਦੀ ਰੋਕਥਾਮ ਲਈ {curative}।"
            elif is_fertilizer:
                reply = f"{crop_disp} ਖਾਦ ਪ੍ਰਬੰਧਨ: ਸਿਫਾਰਸ਼ ਕੀਤੀ ਖਾਦ: {fertilizer_info}।"
                spoken = f"{crop_disp} ਫਸਲ ਲਈ ਖਾਦ: {fertilizer_info}।"
            elif is_market:
                reply = f"{crop_disp} ਮੰਡੀ ਭਾਅ: {price} ਪ੍ਰਤੀ ਕੁਇੰਟਲ ({mandi})।"
                spoken = f"{crop_disp} ਮੌਜੂਦਾ ਮੰਡੀ ਭਾਅ {price} ਪ੍ਰਤੀ ਕੁਇੰਟਲ ਹੈ।"
            else:
                reply = f"ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ {user_name}! ਤੁਹਾਡੀ {crop_disp} ਫਸਲ ਦੀ ਸਿਹਤ {ctx.get('health_index', 92)}% ਹੈ। ਮਿੱਟੀ ਦੀ ਨਮੀ {m_pct}%।"
                spoken = f"ਤੁਹਾਡੀ {crop_disp} ਫਸਲ ਦੀ ਸਿਹਤ {ctx.get('health_index', 92)}% ਹੈ।"
            actions = ["ਫਸਲ ਸਿਹਤ", "ਮੰਡੀ ਭਾਅ"]

        else: # en (English default)
            if is_water:
                reply = (
                    f"Hello {user_name}! For your {crop_disp} crop, current soil moisture is at {m_pct}%.\n\n"
                    f"Irrigation Guidance:\n"
                    f"1. Daily crop water demand is {w_need}. The current root-zone moisture is {'optimal' if m_pct >= 26 else 'low, light irrigation recommended'}.\n"
                    f"2. Irrigate early in the morning via drip system to avoid evaporative losses and fungal collar dampening."
                )
                spoken = f"Your {crop_disp} field soil moisture is {m_pct} percent. Daily water requirement is {w_need}."
                actions = ["Drip Schedule", "Moisture Map"]
            elif is_yellow:
                reply = (
                    f"Analysis of yellowing foliage in your {crop_disp} field:\n\n"
                    f"1. **Primary Etiology**: {yellow_info}\n"
                    f"2. **Corrective Protocol**: Apply foliar water-soluble 19:19:19 fertilizer @ 10-15 g/L early in the morning.\n"
                    f"3. Ensure clean furrow drainage to prevent root hypoxia and water stagnation."
                )
                spoken = f"Yellowing in {crop_disp} is caused by {yellow_info}. Apply 19:19:19 foliar spray."
                actions = ["Nutrient Test", "Drainage Check"]
            elif is_fertilizer:
                reply = (
                    f"{crop_disp} Fertilizer & Nutrient Protocol:\n\n"
                    f"1. **Recommended Schedule**: {fertilizer_info}\n"
                    f"2. Supplement with potassium during bulking/grain fill to enhance grade and specific gravity."
                )
                spoken = f"For {crop_disp}, the recommended fertilizer is {fertilizer_info}."
                actions = ["Fertilizer Schedule", "NPK Calculator"]
            elif is_disease:
                reply = (
                    f"{crop_disp} Integrated Pest & Disease Protocol:\n\n"
                    f"1. **Primary Threat**: {disease}\n"
                    f"2. **Curative Spray**: {curative}\n"
                    f"3. Always combine with a non-ionic adjuvant/sticker for uniform leaf coverage."
                )
                spoken = f"For {disease} in {crop_disp}, apply {curative}."
                actions = ["Disease Guide", "Spray Advisory"]
            elif is_yield:
                reply = (
                    f"{crop_disp} Harvest & Expected Yield:\n\n"
                    f"1. **Yield Benchmark**: Average {yield_info} under recommended agronomic practices.\n"
                    f"2. **Crop Maturity Cycle**: Approximately {spec['duration_days']} DAS.\n"
                    f"3. Harvest during dry weather when physiological maturity indicators are achieved."
                )
                spoken = f"Expected yield for {crop_disp} is {yield_info} over a {spec['duration_days']} day cycle."
                actions = ["Harvest Checklist", "Yield Forecast"]
            elif is_market:
                reply = (
                    f"{crop_disp} APMC Market Price Intelligence:\n\n"
                    f"1. **Benchmark Yard**: {mandi}.\n"
                    f"2. **Modal Price Range**: {price} per quintal.\n"
                    f"3. Check the 'Sell Now vs Hold' tool in the Market tab to optimize your net realization."
                )
                spoken = f"Market prices for {crop_disp} at {mandi} range between {price} per quintal."
                actions = ["Market Forecast", "Sell vs Hold"]
            else:
                reply = (
                    f"Hello {user_name}! Your {crop_disp} crop health index is currently {ctx.get('health_index', 92)}%.\n\n"
                    f"Live Telemetry Snapshot:\n"
                    f"- Root Moisture: {m_pct}% | Ambient Temperature: {ctx.get('ambient_temp_c', 25)}°C\n"
                    f"- Daily Water Demand: {w_need} | Benchmark Yard: {mandi}\n\n"
                    f"You can ask me about irrigation timing, fertilizer dosages, pest management, or market prices."
                )
                spoken = f"Your {crop_disp} crop health is {ctx.get('health_index', 92)} percent with {m_pct} percent soil moisture."
                actions = ["Crop Health", "Market Intelligence"]

        return {
            "query": query,
            "language": lang,
            "language_name": SUPPORTED_LANGUAGES[lang]["name"],
            "reply": reply,
            "spoken_summary": spoken,
            "suggested_actions": actions,
            "alert": alert,
            "data_source": ctx.get("data_source", "AgriSentinel AI Core"),
            "field_snapshot": ctx,
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }

    def generate_speech_audio(self, text: str, lang: str = "kn", speed: float = 1.0) -> Dict[str, Any]:
        """Synthesizes natural spoken speech in any supported Indian language."""
        if lang not in SUPPORTED_LANGUAGES:
            lang = "kn"

        cache_key = hashlib.md5(f"{text[:120]}_{lang}_{speed}".encode("utf-8")).hexdigest()
        if cache_key in _TTS_CACHE:
            return {
                "audio_base64": _TTS_CACHE[cache_key],
                "format": "mp3",
                "cached": True,
                "language": lang,
            }

        if GTTS_AVAILABLE:
            try:
                lang_code = SUPPORTED_LANGUAGES[lang]["voice_code"]
                clean_text = text.replace("**", "").replace("#", "").replace("\n", " ")[:300]
                tts = gTTS(text=clean_text, lang=lang_code, slow=(speed < 0.9))
                fp = io.BytesIO()
                tts.write_to_fp(fp)
                fp.seek(0)
                audio_b64 = base64.b64encode(fp.read()).decode("utf-8")
                _TTS_CACHE[cache_key] = audio_b64
                return {
                    "audio_base64": audio_b64,
                    "format": "mp3",
                    "cached": False,
                    "language": lang,
                }
            except Exception as e:
                print(f"[VoiceAgronomist] gTTS synthesis error: {e}")

        return {
            "error": "TTS engine not available",
            "language": lang,
            "text": text,
        }

voice_agronomist_service = MultilingualVoiceAgronomist()
