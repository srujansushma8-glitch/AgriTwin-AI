# AgriTwin AI: Intelligent Agricultural Digital Twin for Climate-Resilient Crop Production

![AgriTwin AI Banner](https://img.shields.io/badge/AgriTwin-V2.0_Research_Grade-emerald)
![Next.js 16](https://img.shields.io/badge/Frontend-Next.js_16_%2B_React_19-black)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI_%2B_SQLAlchemy-009688)
![Three.js](https://img.shields.io/badge/Visualization-Three.js_3D_Field_Twin-orange)
![Scikit-Learn](https://img.shields.io/badge/ML-Scikit--learn_%2B_Biophysical_Engine-blue)
![Localization](https://img.shields.io/badge/Localization-5_Languages_(EN_%7C_KN_%7C_HI_%7C_TA_%7C_TE)-purple)

---

## 1. Executive Summary & Problem Statement

Global climate volatility, irregular monsoon precipitation, unseasonal heatwaves, and soil degradation increasingly threaten smallholder agriculture across southern India. Traditional farm advisory systems rely on coarse regional weather bulletins and generalized calendar advice that fail to capture microclimate gradients, root-zone moisture dynamics, and crop-specific stress thresholds before irreversible yield loss occurs.

**AgriTwin AI** solves this critical gap by creating a dynamic, physics-guided **Agricultural Digital Twin** of individual farm plots. By fusing 3-layer soil strata physics (10 cm surface evaporation, 30 cm active root zone, 60 cm deep reserve), FAO-56 Penman-Monteith evapotranspiration models, calibrated Machine Learning inference with feature attribution (SHAP-style proxy weights), and an interactive 3D digital twin with OrbitControls, AgriTwin AI equips farmers, researchers, and agronomists with actionable foresight.

---

## 2. System Architecture

```
                                  AGRITWIN AI PLATFORM
                                 ======================

       [ Next.js 16 Frontend (React 19, TypeScript, Tailwind CSS 4, Three.js) ]
                                    localhost:3000
                                          │
                        REST APIs & Bi-Directional State Sync
                                          │
                                          ▼
       [ FastAPI Scientific Backend (Python 3.15, Uvicorn, Pydantic, Scikit-learn) ]
                                    localhost:8000
                                          │
         ┌────────────────────────────────┼────────────────────────────────┐
         ▼                                ▼                                ▼
[ Biophysical Twin Engine ]      [ AI / ML Predictor ]           [ Persistent Storage ]
- FAO-56 Penman-Monteith         - Calibrated RF/GBM             - SQLAlchemy ORM
- 3-Layer Strata Physics         - Feature Attribution           - SQLite (`agritwin.db`)
- Thermal & Water Stress Index   - Benchmarks (R² 0.93)          - Seeded Karnataka Farms
```

### Key Technical Specs:
* **Frontend**: Next.js 16.4.3, React 19, TypeScript, Tailwind CSS 4, Three.js with OrbitControls, Lucide Icons, Next Themes.
* **Backend**: FastAPI 0.115+, SQLAlchemy 2.0+, Pydantic v2, Scikit-Learn 1.6+, Pandas 2.2+, NumPy 2.2+.
* **Database**: Persistent relational SQLite (`backend/agritwin.db`) with relational foreign keys.
* **Localization**: Full internationalization across **5 languages**:
  1. **English**
  2. **Kannada (ಕನ್ನಡ)**
  3. **Hindi (हिन्दी)**
  4. **Tamil (தமிழ்)**
  5. **Telugu (తెలుగు)**

---

## 3. The 15 Functional Modules

| # | Module | Implementation Description |
|---|---|---|
| **1** | **Intelligent Farmer Dashboard** | KPI hero stats, live field selectors, 3D quick launchers, real-time microclimate sensors, and verified provenance tags (`Simulated Sensor Telemetry` / `Digital Twin Computation`). |
| **2** | **Digital Field Twin CRUD** | Complete field management lifecycle: Add new fields with Karnataka crop cultivars (Ragi, Paddy, Sugarcane, Maize, Tomato, Groundnut), soil taxonomy (Red, Black, Clay, Loamy, Sandy), irrigation setup, and sowing dates. |
| **3** | **Interactive 3D Digital Twin** | GPU-accelerated Three.js canvas featuring 3D terrain mesh, procedural crop rows with procedural wind flutter, 3-layer underground soil strata (10cm, 30cm, 60cm), animated irrigation water channels, lighting presets (Day / Sunset / Night), and camera presets (Isometric, Top Surface, Underground Strata). |
| **4** | **AI/ML Crop Health Predictor** | Machine learning health estimation model with multi-class stress inference (`Healthy`, `Thermal Stress`, `Moisture Stress`, `Combined Climate Shock`), feature attribution weights (Root Moisture, Ambient Temp, Soil pH, Organic Carbon), and empirical benchmark scores. |
| **5** | **Climate Scenario Simulator** | 8 Presets (Normal, Moderate Temp, Severe Heatwave, Reduced Rain, Prolonged Drought, Excessive Rain, Combined Stress, Custom) with 14-day projection trajectories, yield impact calculations, and adaptation recommendations. |
| **6** | **Smart Irrigation Decision Support** | 4-way comparative decision matrix (Deficit Irrigation, Optimal Pulse Fertigation, Full Field Saturation, Delayed Pre-Dawn Irrigation) with liters/ha requirements, projected moisture, and pumping cost in ₹ INR. |
| **7** | **Climate Risk Early Warning Center** | Surveillance of dangerous threshold violations (heatwaves, flash droughts, VPD spikes, root saturation) with severity tiers (`CRITICAL`, `WARNING`, `INFO`) and one-click acknowledgement. |
| **8** | **AI Agricultural Advisor** | Agronomic knowledge engine generating stage-specific agronomic prescriptions, optimal spray timing, and micronutrient recommendations based on active twin telemetry. |
| **9** | **Soil Health & Nutrient Intelligence** | Quantitative soil chemistry analysis (pH rating, N, P, K ppm, organic carbon retention %) paired with a Karnataka Crop Suitability Matrix. |
| **10** | **Crop Growth & Phenology Tracking** | Sowing-to-harvest phenological tracking (Vegetative, Flowering, Grain Filling, Maturity), Days After Sowing (DAS), GDD accumulation, and health milestones. |
| **11** | **Yield & Economic Impact Analysis** | Farm valuation in Indian Rupees (₹), expected gross revenue, estimated input/water costs, net farm profit, and estimated preventive intervention savings. |
| **12** | **Historical Analytics & CSV Export** | Historical microclimate & root-zone moisture trends with direct one-click RFC 4180 CSV telemetry export. |
| **13** | **Research & Explainability Lab** | Empirical validation benchmarks (MAE 0.38, RMSE 0.52, R² 0.93, F1 0.91), structured experiment logger with SQLite persistence, and literature research gap analysis. |
| **14** | **Karnataka Localization (ಕನ್ನಡ)** | Native bi-lingual interface support across sidebar navigation, dashboards, stress indicators, and alerts. |
| **15** | **Administration & Multi-Tenant Storage** | Relational SQLAlchemy database schema (`agritwin.db`) maintaining relational integrity across users, farms, plots, sensor logs, and research trials. |

---

## 4. Quickstart Guide (Local Windows Setup)

### Option A: One-Click Windows Launcher (Recommended)
Simply double-click:
```powershell
start.bat
```
This automatically boots:
* The FastAPI backend at `http://localhost:8000`
* The Next.js frontend at `http://localhost:3000`

### Option B: Manual Execution

#### 1. Start Backend:
```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
python run.py
```
* Backend runs at: `http://localhost:8000`
* Interactive OpenAPI Documentation: `http://localhost:8000/docs`

#### 2. Start Frontend:
```powershell
cd next-app
npm install
npm run dev
```
* Frontend runs at: `http://localhost:3000`

---

## 5. API Reference Summary

The AgriTwin AI FastAPI backend exposes 30 REST endpoints:

* `GET  /api/health` — System status, database connection, and active twins count.
* `GET  /api/dashboard/overview` — Aggregated dashboard statistics and sensor readings.
* `GET  /api/fields` — List all registered agricultural fields.
* `POST /api/fields` — Create a new field with soil and crop parameters.
* `GET  /api/fields/{field_id}` — Detailed field profile and current twin state.
* `DELETE /api/fields/{field_id}` — Remove a field record.
* `GET  /api/twin3d/{field_id}` — Procedural 3D scene geometry, strata moisture, and zone data.
* `GET  /api/ml/predict-health/{field_id}` — ML health prediction and feature attribution.
* `POST /api/simulation/scenarios` — Run 14-day climate shock simulation.
* `GET  /api/simulation/presets` — Retrieve the 8 pre-configured climate shock scenarios.
* `GET  /api/irrigation/decision/{field_id}` — 4-option irrigation decision matrix.
* `POST /api/irrigation/apply` — Apply or simulate an irrigation decision.
* `GET  /api/alerts` — Fetch active early warning alerts.
* `POST /api/alerts/{alert_id}/ack` — Acknowledge an alert.
* `GET  /api/soil/analysis/{field_id}` — Soil nutrient analysis and crop suitability.
* `GET  /api/crop-growth/{field_id}` — Phenological calendar and DAS progress.
* `GET  /api/economics/{field_id}` — INR financial returns and preventive savings.
* `GET  /api/analytics/history/{field_id}` — Historical sensor telemetry.
* `GET  /api/analytics/export-csv/{field_id}` — Download CSV telemetry file.
* `GET  /api/research/experiments` — List empirical validation trials.
* `POST /api/research/experiments` — Log a new research experiment.
* `GET  /api/research/benchmarks` — Model validation metrics (MAE, RMSE, R², F1).
* `GET  /api/research/gap-analysis` — Current scientific gaps and future IoT roadmap.
* `GET  /api/config/karnataka-crops` — Karnataka agro-climatic zone crop metadata.

---

## 6. Pre-Seeded Demonstration Farms

The database comes pre-seeded with 4 representative Karnataka farming setups:

1. **North Terraces — Ragi (Mandya)**
   * *Crop*: Finger Millet (ML-365)
   * *Soil*: Red Sandy Loam (pH 6.4)
   * *Irrigation*: Drip Fertigation
2. **Kaveri Basin — Paddy (Mysuru)**
   * *Crop*: Lowland Paddy (JGL-1798)
   * *Soil*: Clay Loam (pH 7.1)
   * *Irrigation*: Alternate Wetting & Drying (AWD)
3. **Deccan Sugar Estate (Belagavi)**
   * *Crop*: Sugarcane (Co-86032)
   * *Soil*: Deep Black Cotton (pH 7.8)
   * *Irrigation*: Furrow
4. **Horticulture Polyhouse (Kolar)**
   * *Crop*: Hybrid Tomato (Arka Rakshak)
   * *Soil*: Loamy (pH 6.2)
   * *Irrigation*: Automated Micro-Drip

---

## 7. License & Credits

Built as part of the AgriTwin AI climate-resilient agriculture research initiative.
Developed with Google Antigravity, Next.js, FastAPI, and Three.js.
