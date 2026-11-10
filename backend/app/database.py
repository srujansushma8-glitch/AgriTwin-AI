import os
import hashlib
from datetime import datetime, timezone
from sqlalchemy import (
    create_engine, Column, Integer, Float, String, Boolean, DateTime, Text, ForeignKey
)
from sqlalchemy.orm import declarative_base, sessionmaker, relationship

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "agritwin.db")
DATABASE_URL = f"sqlite:///{DB_PATH}"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def quick_hash(password: str, salt: str = "agritwin_salt_static") -> str:
    """Deterministic hash for seeding demo users."""
    h = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), 100000).hex()
    return f"{salt}${h}"

class DBUser(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    name = Column(String)
    email = Column(String, unique=True, index=True, nullable=True)
    password_hash = Column(String, nullable=True)
    mobile = Column(String, nullable=True)
    role = Column(String, default="Farmer") # Farmer, Agronomist, Farm Administrator, Platform Administrator
    is_active = Column(Boolean, default=True)
    last_login = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class DBSecurityLog(Base):
    __tablename__ = "security_logs"
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String, nullable=True)
    event_type = Column(String, nullable=False) # LOGIN_SUCCESS, FAILED_LOGIN, UNAUTHORIZED_ACCESS, RATE_LIMIT, SUSPICIOUS_IP
    severity = Column(String, default="INFO") # INFO, WARNING, CRITICAL
    ip_address = Column(String, default="127.0.0.1")
    user_agent = Column(String, default="Web Client")
    details = Column(String, nullable=True)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class DBFarm(Base):
    __tablename__ = "farms"
    id = Column(String, primary_key=True, index=True)
    name = Column(String)
    location = Column(String) # e.g., 'Mandya, Karnataka', 'Dharwad, Karnataka'
    total_area_hectares = Column(Float, default=45.0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    fields = relationship("DBField", back_populates="farm", cascade="all, delete-orphan")

class DBField(Base):
    __tablename__ = "fields"
    id = Column(String, primary_key=True, index=True)
    farm_id = Column(String, ForeignKey("farms.id"), nullable=False)
    name = Column(String, nullable=False)
    farmer_name = Column(String, default="Ramesh Gowda")
    location = Column(String, default="Mandya District, Karnataka")
    state = Column(String, default="Karnataka")
    district = Column(String, default="Mandya")
    village = Column(String, default="Srirangapatna")
    boundary_geojson = Column(Text, nullable=True)
    elevation_m = Column(Float, default=670.0)
    area_hectares = Column(Float, default=5.0)
    soil_type = Column(String, default="Red soil") # Red soil, Black soil, Sandy soil, Clay soil, Loamy soil
    soil_ph = Column(Float, default=6.8)
    nitrogen_ppm = Column(Float, default=32.0)
    phosphorus_ppm = Column(Float, default=22.0)
    potassium_ppm = Column(Float, default=180.0)
    organic_carbon_pct = Column(Float, default=0.75) # Common in Karnataka soils
    water_availability = Column(String, default="Borewell + Canal") # Canal, Borewell, Rainfed, Farm Pond
    irrigation_method = Column(String, default="Drip Irrigation") # Drip, Sprinkler, Furrow, AWD, Micro-jet
    crop_type = Column(String, default="Tomato") # Tomato, Sugarcane, Paddy, Wheat, Maize, Cotton, Groundnut, Banana
    crop_variety = Column(String, default="Arka Rakshak F1")
    sowing_date = Column(String, default="2026-06-15")
    expected_harvest_date = Column(String, default="2026-10-15")
    growth_stage = Column(String, default="Flowering & Fruit Setting")
    days_after_sowing = Column(Integer, default=52)
    lat = Column(Float, default=12.5218)
    lng = Column(Float, default=76.8951)
    resilience_score = Column(Integer, default=84)
    risk_level = Column(String, default="Low") # Low, Moderate, High, Critical
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    farm = relationship("DBFarm", back_populates="fields")
    soil_telemetries = relationship("DBSoilTelemetry", back_populates="field", cascade="all, delete-orphan")
    microclimates = relationship("DBMicroclimate", back_populates="field", cascade="all, delete-orphan")
    alerts = relationship("DBAlert", back_populates="field", cascade="all, delete-orphan")
    irrigations = relationship("DBIrrigationRecord", back_populates="field", cascade="all, delete-orphan")

class DBSoilTelemetry(Base):
    __tablename__ = "soil_telemetry"
    id = Column(Integer, primary_key=True, autoincrement=True)
    field_id = Column(String, ForeignKey("fields.id"), nullable=False)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    topsoil_moisture_10cm = Column(Float, default=24.5)
    rootzone_moisture_30cm = Column(Float, default=28.2)
    deep_moisture_60cm = Column(Float, default=32.0)
    temp_10cm = Column(Float, default=26.4)
    temp_30cm = Column(Float, default=23.8)
    temp_60cm = Column(Float, default=21.2)
    ec_ds_m = Column(Float, default=1.1)
    water_potential_kpa = Column(Float, default=-35.0)

    field = relationship("DBField", back_populates="soil_telemetries")

class DBMicroclimate(Base):
    __tablename__ = "microclimate"
    id = Column(Integer, primary_key=True, autoincrement=True)
    field_id = Column(String, ForeignKey("fields.id"), nullable=False)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    ambient_temp_c = Column(Float, default=29.4)
    relative_humidity_pct = Column(Float, default=58.0)
    vpd_kpa = Column(Float, default=1.65)
    solar_radiation_wm2 = Column(Float, default=720.0)
    wind_speed_kmh = Column(Float, default=11.2)
    rainfall_mm = Column(Float, default=0.0)
    co2_ppm = Column(Float, default=420.0)

    field = relationship("DBField", back_populates="microclimates")

class DBCropPrediction(Base):
    __tablename__ = "crop_predictions"
    id = Column(Integer, primary_key=True, autoincrement=True)
    field_id = Column(String, ForeignKey("fields.id"), nullable=False)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    health_score = Column(Float, default=85.0)
    health_status = Column(String, default="Healthy Vigorous Growth")
    water_stress_index = Column(Float, default=0.24)
    heat_stress_index = Column(Float, default=0.18)
    drought_risk_pct = Column(Float, default=15.0)
    excess_rain_risk_pct = Column(Float, default=5.0)
    confidence_score = Column(Float, default=0.92)
    model_version = Column(String, default="AgriTwin-XGB-v2.1")

class DBAlert(Base):
    __tablename__ = "alerts"
    id = Column(Integer, primary_key=True, autoincrement=True)
    field_id = Column(String, ForeignKey("fields.id"), nullable=False)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    severity = Column(String, default="Moderate") # Low, Moderate, High, Critical
    title = Column(String, nullable=False)
    condition = Column(String, nullable=False)
    potential_impact = Column(String, nullable=False)
    preventive_action = Column(String, nullable=False)
    is_read = Column(Boolean, default=False)

    field = relationship("DBField", back_populates="alerts")

class DBIrrigationRecord(Base):
    __tablename__ = "irrigation_records"
    id = Column(Integer, primary_key=True, autoincrement=True)
    field_id = Column(String, ForeignKey("fields.id"), nullable=False)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    action_type = Column(String, default="Precision Drip Pulse")
    volume_liters_per_ha = Column(Float, default=12000.0)
    target_zone = Column(String, default="Zone A - Root Layer 30cm")
    is_simulated = Column(Boolean, default=False)
    efficiency_gain = Column(String, default="+28% water saved vs flood")

    field = relationship("DBField", back_populates="irrigations")

class DBResearchExperiment(Base):
    __tablename__ = "research_experiments"
    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    field_id = Column(String, nullable=False)
    crop = Column(String, nullable=False)
    scenario_name = Column(String, nullable=False)
    model_used = Column(String, default="AgriTwin Multi-Layer Biophysical Neural Predictor")
    mae = Column(Float, default=0.38)
    rmse = Column(Float, default=0.52)
    r2 = Column(Float, default=0.93)
    f1_score = Column(Float, default=0.91)
    simulation_output = Column(Text) # JSON serialized
    notes = Column(Text)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    Base.metadata.create_all(bind=engine)
    seed_demo_data()

def seed_demo_data():
    db = SessionLocal()
    try:
        # Check if users already seeded with passwords
        test_user = db.query(DBUser).filter(DBUser.email == "farmer@agritwin.ai").first()
        if not test_user:
            default_pass = quick_hash("AgriTwin@2026")
            users = [
                DBUser(id="usr-farmer-01", username="farmer_ramesh", name="Ramesh Gowda", email="farmer@agritwin.ai", password_hash=default_pass, mobile="+91 98451 23456", role="Farmer"),
                DBUser(id="usr-agronomist-01", username="dr_swaminathan", name="Dr. Ananya Rao", email="agronomist@agritwin.ai", password_hash=default_pass, mobile="+91 94481 67890", role="Agronomist"),
                DBUser(id="usr-admin-01", username="farm_admin", name="Suresh Patil", email="admin@agritwin.ai", password_hash=default_pass, mobile="+91 98800 11223", role="Farm Administrator"),
                DBUser(id="usr-platform-01", username="platform_admin", name="Enterprise Admin", email="platform@agritwin.ai", password_hash=default_pass, mobile="+91 99000 88776", role="Platform Administrator"),
            ]
            for u in users:
                existing = db.query(DBUser).filter((DBUser.id == u.id) | (DBUser.username == u.username)).first()
                if not existing:
                    db.add(u)
            db.commit()

        # Seed Security Logs if empty
        if not db.query(DBSecurityLog).first():
            logs = [
                DBSecurityLog(event_type="LOGIN_SUCCESS", severity="INFO", user_id="usr-farmer-01", ip_address="192.168.1.104", details="Successful MFA-verified login for Ramesh Gowda"),
                DBSecurityLog(event_type="LOGIN_SUCCESS", severity="INFO", user_id="usr-agronomist-01", ip_address="192.168.1.112", details="Agronomist session established from Mysore Regional Center"),
                DBSecurityLog(event_type="FAILED_LOGIN", severity="WARNING", ip_address="203.0.113.45", details="Multiple invalid credential attempts detected on /api/auth/login"),
                DBSecurityLog(event_type="SECURITY_AUDIT", severity="INFO", ip_address="127.0.0.1", details="Automated biophysical simulation sandbox health audit passed"),
            ]
            for l in logs:
                db.add(l)
            db.commit()

        # Seed 8 Complete Crop Fields if not present
        if db.query(DBField).count() < 8:
            farm = db.query(DBFarm).first()
            if not farm:
                farm = DBFarm(
                    id="farm-enterprise-01",
                    name="Kaveri Basin Agro-Twin Research Estate",
                    location="Mandya & Southern Agro-Climatic Zone, Karnataka",
                    total_area_hectares=48.5
                )
                db.add(farm)
                db.flush()

            crops_8 = [
                {
                    "id": "field-tomato-01",
                    "farm_id": farm.id,
                    "name": "Polyhouse Block 1 — Tomato",
                    "farmer_name": "Ramesh Gowda",
                    "location": "Kolar District, Karnataka",
                    "state": "Karnataka",
                    "district": "Kolar",
                    "village": "Bangarapet",
                    "elevation_m": 820.0,
                    "area_hectares": 3.5,
                    "soil_type": "Loamy soil",
                    "soil_ph": 6.4,
                    "nitrogen_ppm": 38.0,
                    "phosphorus_ppm": 32.0,
                    "potassium_ppm": 240.0,
                    "organic_carbon_pct": 0.88,
                    "water_availability": "Borewell + Micro-Drip",
                    "irrigation_method": "Precision Drip Fertigation",
                    "crop_type": "Tomato",
                    "crop_variety": "Arka Rakshak (F1 Hybrid)",
                    "sowing_date": "2026-06-01",
                    "expected_harvest_date": "2026-09-30",
                    "growth_stage": "Fruiting & Ripening",
                    "days_after_sowing": 62,
                    "lat": 13.136,
                    "lng": 78.134,
                    "resilience_score": 91,
                    "risk_level": "Low"
                },
                {
                    "id": "field-sugarcane-02",
                    "farm_id": farm.id,
                    "name": "Krishna Basin Sector — Sugarcane",
                    "farmer_name": "Suresh Patil",
                    "location": "Belagavi District, Karnataka",
                    "state": "Karnataka",
                    "district": "Belagavi",
                    "village": "Gokak",
                    "elevation_m": 580.0,
                    "area_hectares": 12.0,
                    "soil_type": "Black soil",
                    "soil_ph": 7.8,
                    "nitrogen_ppm": 45.0,
                    "phosphorus_ppm": 18.0,
                    "potassium_ppm": 280.0,
                    "organic_carbon_pct": 0.92,
                    "water_availability": "Canal Lift Irrigation",
                    "irrigation_method": "Ridge & Furrow Irrigation",
                    "crop_type": "Sugarcane",
                    "crop_variety": "Co-86032 High-Recovery",
                    "sowing_date": "2026-01-15",
                    "expected_harvest_date": "2026-12-15",
                    "growth_stage": "Grand Growth & Stalk Elongation",
                    "days_after_sowing": 140,
                    "lat": 16.168,
                    "lng": 74.823,
                    "resilience_score": 86,
                    "risk_level": "Low"
                },
                {
                    "id": "field-paddy-03",
                    "farm_id": farm.id,
                    "name": "Kaveri Lowlands — Rice / Paddy",
                    "farmer_name": "Ramesh Gowda",
                    "location": "Mandya District, Karnataka",
                    "state": "Karnataka",
                    "district": "Mandya",
                    "village": "Srirangapatna",
                    "elevation_m": 665.0,
                    "area_hectares": 8.5,
                    "soil_type": "Clay soil",
                    "soil_ph": 7.1,
                    "nitrogen_ppm": 42.0,
                    "phosphorus_ppm": 24.0,
                    "potassium_ppm": 195.0,
                    "organic_carbon_pct": 1.05,
                    "water_availability": "Canal + River Reservoir",
                    "irrigation_method": "Alternate Wetting and Drying (AWD)",
                    "crop_type": "Rice / Paddy",
                    "crop_variety": "JGL 1798 Climate-Tolerant",
                    "sowing_date": "2026-05-10",
                    "expected_harvest_date": "2026-09-25",
                    "growth_stage": "Panicle Initiation & Heading",
                    "days_after_sowing": 78,
                    "lat": 12.528,
                    "lng": 76.902,
                    "resilience_score": 84,
                    "risk_level": "Low"
                },
                {
                    "id": "field-wheat-04",
                    "farm_id": farm.id,
                    "name": "Deccan Plains — Wheat",
                    "farmer_name": "Dr. Ananya Rao",
                    "location": "Dharwad District, Karnataka",
                    "state": "Karnataka",
                    "district": "Dharwad",
                    "village": "Navalgund",
                    "elevation_m": 710.0,
                    "area_hectares": 6.0,
                    "soil_type": "Black soil",
                    "soil_ph": 7.4,
                    "nitrogen_ppm": 36.0,
                    "phosphorus_ppm": 22.0,
                    "potassium_ppm": 210.0,
                    "organic_carbon_pct": 0.78,
                    "water_availability": "Borewell Sprinkler",
                    "irrigation_method": "Center-Pivot Sprinkler",
                    "crop_type": "Wheat",
                    "crop_variety": "UAS-304 Biofortified",
                    "sowing_date": "2026-06-20",
                    "expected_harvest_date": "2026-10-20",
                    "growth_stage": "Milking & Grain Filling",
                    "days_after_sowing": 50,
                    "lat": 15.458,
                    "lng": 75.007,
                    "resilience_score": 88,
                    "risk_level": "Low"
                },
                {
                    "id": "field-maize-05",
                    "farm_id": farm.id,
                    "name": "Central Corn Belt — Maize",
                    "farmer_name": "Manjunath K",
                    "location": "Davanagere District, Karnataka",
                    "state": "Karnataka",
                    "district": "Davanagere",
                    "village": "Harihar",
                    "elevation_m": 600.0,
                    "area_hectares": 7.5,
                    "soil_type": "Red soil",
                    "soil_ph": 6.7,
                    "nitrogen_ppm": 44.0,
                    "phosphorus_ppm": 26.0,
                    "potassium_ppm": 230.0,
                    "organic_carbon_pct": 0.81,
                    "water_availability": "Borewell + Rainfed",
                    "irrigation_method": "Broad Bed & Furrow",
                    "crop_type": "Maize",
                    "crop_variety": "Deccan Super Hybrid 105",
                    "sowing_date": "2026-06-05",
                    "expected_harvest_date": "2026-10-05",
                    "growth_stage": "Tasseling & Cob Formation",
                    "days_after_sowing": 65,
                    "lat": 14.464,
                    "lng": 75.921,
                    "resilience_score": 85,
                    "risk_level": "Low"
                },
                {
                    "id": "field-cotton-06",
                    "farm_id": farm.id,
                    "name": "Tungabhadra Sector — Cotton",
                    "farmer_name": "Basavaraj Gowda",
                    "location": "Raichur District, Karnataka",
                    "state": "Karnataka",
                    "district": "Raichur",
                    "village": "Sindhanur",
                    "elevation_m": 410.0,
                    "area_hectares": 9.0,
                    "soil_type": "Black soil",
                    "soil_ph": 7.9,
                    "nitrogen_ppm": 35.0,
                    "phosphorus_ppm": 19.0,
                    "potassium_ppm": 260.0,
                    "organic_carbon_pct": 0.69,
                    "water_availability": "Canal + Borewell Drip",
                    "irrigation_method": "Sub-Surface Drip",
                    "crop_type": "Cotton",
                    "crop_variety": "Bt Bollgard II Hybrid",
                    "sowing_date": "2026-05-15",
                    "expected_harvest_date": "2026-11-15",
                    "growth_stage": "Boll Bursting & Maturation",
                    "days_after_sowing": 95,
                    "lat": 16.205,
                    "lng": 77.355,
                    "resilience_score": 79,
                    "risk_level": "Moderate"
                },
                {
                    "id": "field-groundnut-07",
                    "farm_id": farm.id,
                    "name": "Semi-Arid Basin — Groundnut",
                    "farmer_name": "Ramesh Gowda",
                    "location": "Tumakuru District, Karnataka",
                    "state": "Karnataka",
                    "district": "Tumakuru",
                    "village": "Sira",
                    "elevation_m": 680.0,
                    "area_hectares": 5.0,
                    "soil_type": "Sandy soil",
                    "soil_ph": 6.5,
                    "nitrogen_ppm": 28.0,
                    "phosphorus_ppm": 20.0,
                    "potassium_ppm": 165.0,
                    "organic_carbon_pct": 0.62,
                    "water_availability": "Rainfed + Rain Gun",
                    "irrigation_method": "Micro-Sprinkler Pulse",
                    "crop_type": "Groundnut",
                    "crop_variety": "TMV-2 Drought Hardened",
                    "sowing_date": "2026-06-25",
                    "expected_harvest_date": "2026-10-15",
                    "growth_stage": "Pod Development (Pegging)",
                    "days_after_sowing": 48,
                    "lat": 13.743,
                    "lng": 76.908,
                    "resilience_score": 83,
                    "risk_level": "Low"
                },
                {
                    "id": "field-banana-08",
                    "farm_id": farm.id,
                    "name": "Malnad Plantation — Banana",
                    "farmer_name": "Dr. Ananya Rao",
                    "location": "Shivamogga District, Karnataka",
                    "state": "Karnataka",
                    "district": "Shivamogga",
                    "village": "Thirthahalli",
                    "elevation_m": 620.0,
                    "area_hectares": 4.5,
                    "soil_type": "Loamy soil",
                    "soil_ph": 6.2,
                    "nitrogen_ppm": 48.0,
                    "phosphorus_ppm": 28.0,
                    "potassium_ppm": 320.0,
                    "organic_carbon_pct": 1.25,
                    "water_availability": "Natural Spring + Micro-Jet",
                    "irrigation_method": "Micro-Jet Under-Tree Sprinkler",
                    "crop_type": "Banana",
                    "crop_variety": "Grand Naine (Tissue Culture)",
                    "sowing_date": "2025-11-10",
                    "expected_harvest_date": "2026-11-10",
                    "growth_stage": "Shooting & Bunch Development",
                    "days_after_sowing": 230,
                    "lat": 13.694,
                    "lng": 75.244,
                    "resilience_score": 93,
                    "risk_level": "Low"
                },
                {
                    "id": "field-carrot-01",
                    "farm_id": farm.id,
                    "name": "Bengaluru Rural Basin — Carrot Raised Beds",
                    "farmer_name": "Ramesh Gowda",
                    "location": "Bengaluru Rural, Karnataka",
                    "state": "Karnataka",
                    "district": "Bengaluru Rural",
                    "village": "Doddaballapur",
                    "elevation_m": 890.0,
                    "area_hectares": 2.4,
                    "soil_type": "Sandy loam",
                    "soil_ph": 6.4,
                    "nitrogen_ppm": 38.0,
                    "phosphorus_ppm": 28.0,
                    "potassium_ppm": 190.0,
                    "organic_carbon_pct": 0.85,
                    "water_availability": "Borewell + Inline Drip",
                    "irrigation_method": "Precision Drip Irrigation",
                    "crop_type": "Carrot",
                    "crop_variety": "Super Kuroda / Pusa Rudhira",
                    "sowing_date": "2026-06-05",
                    "expected_harvest_date": "2026-09-10",
                    "growth_stage": "Root Swelling & Carotene Synthesis",
                    "days_after_sowing": 52,
                    "lat": 13.295,
                    "lng": 77.535,
                    "resilience_score": 92,
                    "risk_level": "Low"
                },
                {
                    "id": "field-beetroot-01",
                    "farm_id": farm.id,
                    "name": "Mysuru Horticultural Sector — Beetroot Field",
                    "farmer_name": "Ramesh Gowda",
                    "location": "Mysuru District, Karnataka",
                    "state": "Karnataka",
                    "district": "Mysuru",
                    "village": "Nanjangud",
                    "elevation_m": 710.0,
                    "area_hectares": 1.8,
                    "soil_type": "Loamy soil",
                    "soil_ph": 6.8,
                    "nitrogen_ppm": 35.0,
                    "phosphorus_ppm": 24.0,
                    "potassium_ppm": 180.0,
                    "organic_carbon_pct": 0.78,
                    "water_availability": "River Canal + Drip",
                    "irrigation_method": "Inline Drip System",
                    "crop_type": "Beetroot",
                    "crop_variety": "Detroit Dark Red",
                    "sowing_date": "2026-06-15",
                    "expected_harvest_date": "2026-08-30",
                    "growth_stage": "Hypocotyl Bulbing Stage",
                    "days_after_sowing": 42,
                    "lat": 12.122,
                    "lng": 76.685,
                    "resilience_score": 89,
                    "risk_level": "Low"
                },
                {
                    "id": "field-potato-01",
                    "farm_id": farm.id,
                    "name": "Hassan Plateau — Potato Ridge & Furrow",
                    "farmer_name": "Ramesh Gowda",
                    "location": "Hassan District, Karnataka",
                    "state": "Karnataka",
                    "district": "Hassan",
                    "village": "Channarayapatna",
                    "elevation_m": 940.0,
                    "area_hectares": 3.6,
                    "soil_type": "Loamy soil",
                    "soil_ph": 5.8,
                    "nitrogen_ppm": 42.0,
                    "phosphorus_ppm": 36.0,
                    "potassium_ppm": 230.0,
                    "organic_carbon_pct": 0.92,
                    "water_availability": "Borewell + Ridge Furrow Drip",
                    "irrigation_method": "Ridge-and-Furrow Drip",
                    "crop_type": "Potato",
                    "crop_variety": "Kufri Jyoti / Kufri Surya",
                    "sowing_date": "2026-05-20",
                    "expected_harvest_date": "2026-09-05",
                    "growth_stage": "Tuber Bulking & Starch Fill",
                    "days_after_sowing": 68,
                    "lat": 12.912,
                    "lng": 76.398,
                    "resilience_score": 94,
                    "risk_level": "Low"
                }
            ]

            for fd in crops_8:
                existing_f = db.query(DBField).filter(DBField.id == fd["id"]).first()
                if not existing_f:
                    f_obj = DBField(**fd)
                    db.add(f_obj)
                    db.flush()

                    # Add soil telemetry
                    db.add(DBSoilTelemetry(
                        field_id=f_obj.id,
                        topsoil_moisture_10cm=25.0,
                        rootzone_moisture_30cm=31.5,
                        deep_moisture_60cm=35.0,
                        temp_10cm=26.0,
                        temp_30cm=23.5,
                        temp_60cm=21.0,
                        ec_ds_m=1.2,
                        water_potential_kpa=-38.0
                    ))
                    # Add microclimate
                    db.add(DBMicroclimate(
                        field_id=f_obj.id,
                        ambient_temp_c=28.5,
                        relative_humidity_pct=60.0,
                        vpd_kpa=1.52,
                        solar_radiation_wm2=740.0,
                        wind_speed_kmh=10.5,
                        rainfall_mm=0.0,
                        co2_ppm=422.0
                    ))
                    # Add irrigation
                    db.add(DBIrrigationRecord(
                        field_id=f_obj.id,
                        action_type=f_obj.irrigation_method,
                        volume_liters_per_ha=12500.0,
                        target_zone="Active Root Zone",
                        is_simulated=False,
                        efficiency_gain="+30% precision saving"
                    ))
            db.commit()
    except Exception as e:
        db.rollback()
        print("Database seed error:", e)
    finally:
        db.close()


# ==================== ENTERPRISE 3.0 NEW INTELLIGENCE TABLES ====================

class DBMarketPrice(Base):
    __tablename__ = "market_prices"
    id = Column(Integer, primary_key=True, autoincrement=True)
    commodity = Column(String, nullable=False, index=True)
    variety = Column(String, default="Standard Commercial")
    state = Column(String, default="Karnataka", index=True)
    district = Column(String, default="Mandya", index=True)
    mandi_name = Column(String, nullable=False)
    date = Column(String, nullable=False, index=True)
    min_price_per_qtl = Column(Float, nullable=False)
    max_price_per_qtl = Column(Float, nullable=False)
    modal_price_per_qtl = Column(Float, nullable=False)
    arrivals_tonnes = Column(Float, default=15.0)
    traded_tonnes = Column(Float, default=12.5)
    provenance_status = Column(String, default="HISTORICAL DATA") # LIVE DATA, HISTORICAL DATA, DEMO DATA
    source_attribution = Column(String, default="AGMARKNET / Directorate of Marketing & Inspection (DMI)")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class DBCropCalendarRecord(Base):
    __tablename__ = "crop_calendars"
    id = Column(Integer, primary_key=True, autoincrement=True)
    field_id = Column(String, nullable=False, index=True)
    crop_name = Column(String, nullable=False)
    variety = Column(String, nullable=False)
    sowing_date = Column(String, nullable=False)
    germination_window = Column(String, default="Day 5 - 10")
    vegetative_window = Column(String, default="Day 15 - 45")
    flowering_window = Column(String, default="Day 46 - 70")
    fruiting_window = Column(String, default="Day 71 - 95")
    estimated_harvest_window = Column(String, default="Day 96 - 110")
    gdd_accumulated = Column(Float, default=850.0)
    gdd_target = Column(Float, default=1650.0)
    reminders_json = Column(Text, default="[]")
    last_updated = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class DBNutritionProfile(Base):
    __tablename__ = "nutrition_profiles"
    id = Column(Integer, primary_key=True, autoincrement=True)
    crop_name = Column(String, nullable=False, unique=True, index=True)
    scientific_name = Column(String, default="")
    protein_g = Column(Float, default=7.3)
    carbs_g = Column(Float, default=72.0)
    dietary_fiber_g = Column(Float, default=11.5)
    fat_g = Column(Float, default=1.3)
    iron_mg = Column(Float, default=3.9)
    calcium_mg = Column(Float, default=344.0)
    potassium_mg = Column(Float, default=408.0)
    vitamin_c_mg = Column(Float, default=0.0)
    glycemic_index = Column(Float, default=54.0)
    reference_authority = Column(String, default="ICMR-NIN Indian Food Composition Tables (IFCT 2024)")
    measurement_type = Column(String, default="Reference Standard Food Matrix") # Reference Standard Food Matrix, Estimated Agronomic Modifier, Lab Tested
    soil_modifier_notes = Column(Text, default="Soil micronutrient availability enhances grain protein fraction within ±6% genotypic limit.")
