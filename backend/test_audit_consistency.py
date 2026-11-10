# -*- coding: utf-8 -*-
"""
AgriTwin AI 3.0 — Comprehensive Application Audit, Functional Testing & Data Consistency Verification Suite
Tests all 11 core modules, mathematical integrity, Single Source of Truth, and Phase 4 scenarios.
"""
import sys
import os
from datetime import datetime, timezone, timedelta

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi.testclient import TestClient
from app.main import app
from app.database import SessionLocal, DBField, DBSoilTelemetry, DBMicroclimate

client = TestClient(app)

def test_1_field_crud_and_mathematical_das():
    print("\n--- TEST 1: Field CRUD & Mathematical DAS Calculation ---")
    sowing_date = (datetime.now(timezone.utc) - timedelta(days=45)).strftime("%Y-%m-%d")
    expected_harvest = (datetime.now(timezone.utc) + timedelta(days=45)).strftime("%Y-%m-%d")
    
    payload = {
        "name": "Audit Test Plot A",
        "farmer_name": "Ramesh Gowda",
        "location": "Hassan District, Karnataka",
        "area_hectares": 3.6,
        "soil_type": "Red sandy loam",
        "soil_ph": 6.4,
        "nitrogen_ppm": 38.0,
        "phosphorus_ppm": 24.0,
        "potassium_ppm": 190.0,
        "organic_carbon_pct": 0.88,
        "water_availability": "Borewell + Drip",
        "irrigation_method": "Precision Drip",
        "crop_type": "Potato",
        "crop_variety": "Kufri Jyoti",
        "sowing_date": sowing_date,
        "expected_harvest_date": expected_harvest,
    }
    
    # 1. Create field
    create_res = client.post("/api/fields", json=payload)
    assert create_res.status_code == 200, f"Create field failed: {create_res.text}"
    created_field = create_res.json()
    field_id = created_field["id"]
    
    # Mathematical validation: DAS should be 45
    assert created_field["days_after_sowing"] == 45, f"Expected DAS=45, got {created_field['days_after_sowing']}"
    assert created_field["crop_type"] == "Potato"
    assert created_field["area_hectares"] == 3.6
    print(f"  ✓ Field created: id={field_id}, DAS={created_field['days_after_sowing']} (Mathematically exact)")

    # 2. Update field
    update_res = client.put(f"/api/fields/{field_id}", json={"crop_type": "Tomato", "area_hectares": 4.2})
    assert update_res.status_code == 200, f"Update field failed: {update_res.text}"
    updated_field = update_res.json()
    assert updated_field["crop_type"] == "Tomato"
    assert updated_field["area_hectares"] == 4.2
    print("  ✓ Field updated & persisted: crop=Tomato, area=4.2 ha")

    # 3. Clean up test field
    del_res = client.delete(f"/api/fields/{field_id}")
    assert del_res.status_code == 200
    print("  ✓ Field deleted cleanly")


def test_2_phase4_scenario_potato_hassan_single_source_of_truth():
    print("\n--- TEST 2: Phase 4 Hassan Potato Scenario (Single Source of Truth) ---")
    # Verify field-potato-01 exists in database
    db = SessionLocal()
    potato_field = db.query(DBField).filter(DBField.id == "field-potato-01").first()
    assert potato_field is not None, "field-potato-01 must exist in seeded database"
    assert "Hassan" in potato_field.location, f"Expected Hassan in location, got {potato_field.location}"
    assert potato_field.crop_type == "Potato", f"Expected Potato, got {potato_field.crop_type}"
    assert "Kufri Jyoti" in potato_field.crop_variety, f"Expected Kufri Jyoti, got {potato_field.crop_variety}"
    assert potato_field.area_hectares == 3.6, f"Expected 3.6 ha, got {potato_field.area_hectares}"
    db.close()
    print("  ✓ Database record verified: field-potato-01, Ramesh Gowda, Hassan, Potato Kufri Jyoti, 3.6 ha")

    # Query Dashboard Overview for field-potato-01
    res = client.get("/api/dashboard/overview?field_id=field-potato-01")
    assert res.status_code == 200, f"Overview request failed: {res.text}"
    ov = res.json()
    assert ov["active_field_id"] == "field-potato-01", f"Expected active_field_id=field-potato-01, got {ov['active_field_id']}"
    assert ov["crop_type"] == "Potato", f"Expected crop_type=Potato, got {ov['crop_type']}"
    assert "Hassan" in ov["location"], f"Expected Hassan in location, got {ov['location']}"
    assert ov["soil_moisture_root_zone"] > 0, "Soil moisture must be valid numeric"
    print(f"  ✓ Dashboard Overview synchronized: Crop={ov['crop_type']}, Location={ov['location']}, Moisture={ov['soil_moisture_root_zone']}%")


def test_3_crop_switching_persistence():
    print("\n--- TEST 3: Crop Switching Persistence & Field Synchronization ---")
    field_id = "field-potato-01"
    
    # 1. Switch to Tomato
    res1 = client.put(f"/api/fields/{field_id}", json={"crop_type": "Tomato"})
    assert res1.status_code == 200
    assert res1.json()["crop_type"] == "Tomato"
    
    # Verify overview matches Tomato
    ov1 = client.get(f"/api/dashboard/overview?field_id={field_id}").json()
    assert ov1["crop_type"] == "Tomato", f"Expected Tomato after switch, got {ov1['crop_type']}"
    print("  ✓ Switched crop to Tomato, overview verified")

    # 2. Switch back to Potato
    res2 = client.put(f"/api/fields/{field_id}", json={"crop_type": "Potato"})
    assert res2.status_code == 200
    assert res2.json()["crop_type"] == "Potato"
    
    ov2 = client.get(f"/api/dashboard/overview?field_id={field_id}").json()
    assert ov2["crop_type"] == "Potato", f"Expected Potato after switch back, got {ov2['crop_type']}"
    print("  ✓ Restored crop to Potato, persistence verified in SQLite")


def test_4_digital_twin_3d_endpoint():
    print("\n--- TEST 4: Digital Twin 3D Visualization Endpoint ---")
    res = client.get("/api/fields/field-potato-01/twin-3d")
    assert res.status_code == 200, f"3D Twin endpoint failed: {res.text}"
    twin = res.json()
    assert "soil_strata" in twin and len(twin["soil_strata"]) >= 3, "Must contain at least 3 soil strata"
    assert "field_zones" in twin and len(twin["field_zones"]) >= 4, "Must contain at least 4 field zones"
    assert "irrigation_network" in twin, "Must contain irrigation network"
    assert "crop_health_3d" in twin, "Must contain 3D crop health parameters"
    assert twin["crop_type"] == "Potato"
    print(f"  ✓ 3D Twin verified: {len(twin['soil_strata'])} strata layers, {len(twin['field_zones'])} zones, system={twin['irrigation_network']['system_type']}")


def test_5_ai_crop_health_image_analysis():
    print("\n--- TEST 5: AI Crop Health & Disease Diagnostic Engine ---")
    # Base64 test payload
    sample_b64 = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA="
    payload = {
        "image_data": sample_b64,
        "crop_type": "Potato",
        "variety": "Kufri Jyoti",
        "location": "Hassan, Karnataka"
    }
    res = client.post("/api/crop-health/analyze-image", json=payload)
    assert res.status_code == 200, f"Image diagnostic failed: {res.text}"
    diag = res.json()
    assert "detected_condition" in diag
    assert "confidence_score" in diag and diag["confidence_score"] > 75.0
    assert "recommended_treatment" in diag
    assert "preventive_measures" in diag
    print(f"  ✓ Diagnostic Engine verified: Diagnosis='{diag['detected_condition']}', Confidence={diag['confidence_score']:.1f}%")


def test_6_multilingual_voice_agronomist_grounding():
    print("\n--- TEST 6: Multilingual AI Voice Agronomist Grounding ---")
    # 1. Kannada Query with Hassan Potato Grounding
    payload_kn = {
        "message": "ನನ್ನ ಆಲೂಗಡ್ಡೆ ಬೆಳೆಗೆ ಎಷ್ಟು ನೀರು ಬೇಕು?",
        "language": "kn",
        "field_id": "field-potato-01",
        "crop_override": "Potato",
        "user_name": "Ramesh Gowda"
    }
    res_kn = client.post("/api/voice-agronomist/chat", json=payload_kn)
    assert res_kn.status_code == 200, f"Voice agronomist chat failed: {res_kn.text}"
    reply_kn = res_kn.json()
    assert "reply" in reply_kn
    assert "spoken_summary" in reply_kn
    assert reply_kn["language"] == "kn"
    print(f"  ✓ Kannada Voice response generated: {reply_kn['spoken_summary'][:80]}...")

    # 2. English Query
    payload_en = {
        "message": "How much water does my crop need today?",
        "language": "en",
        "field_id": "field-potato-01",
        "crop_override": "Potato",
        "user_name": "Ramesh Gowda"
    }
    res_en = client.post("/api/voice-agronomist/chat", json=payload_en)
    assert res_en.status_code == 200
    reply_en = res_en.json()
    assert "reply" in reply_en
    assert "Potato" in reply_en["reply"] or "potato" in reply_en["reply"].lower()
    print(f"  ✓ English Grounded response verified (References active Potato farm)")

    # 3. Spoken Alerts
    res_alerts = client.get("/api/voice-agronomist/spoken-alerts?language=kn&field_id=field-potato-01")
    assert res_alerts.status_code == 200
    alerts_data = res_alerts.json()
    assert "alerts" in alerts_data and len(alerts_data["alerts"]) > 0
    print(f"  ✓ Spoken Alerts generated: {len(alerts_data['alerts'])} active alerts")


def test_7_market_intelligence_and_prices():
    print("\n--- TEST 7: Market Intelligence & Price Variation ---")
    res_overview = client.get("/api/market/overview")
    assert res_overview.status_code == 200
    m_data = res_overview.json()
    assert "commodities" in m_data and len(m_data["commodities"]) >= 3
    
    crops_available = [item["commodity"] for item in m_data["commodities"]]
    assert "Potato" in crops_available, f"Potato must be present in market items: {crops_available}"
    assert "Carrot" in crops_available, f"Carrot must be present in market items: {crops_available}"
    assert "Beetroot" in crops_available, f"Beetroot must be present in market items: {crops_available}"
    
    potato_item = next(item for item in m_data["commodities"] if item["commodity"] == "Potato")
    assert potato_item["modal_price_qtl"] > 0
    assert potato_item["benchmark_mandi"] != ""
    print(f"  ✓ Market prices verified: Potato ₹{potato_item['modal_price_qtl']}/qtl ({potato_item['benchmark_mandi']}), Carrot & Beetroot active")


def test_8_climate_simulation_and_trajectories():
    print("\n--- TEST 8: Climate Resilience & Weather Simulation ---")
    payload = {
        "field_id": "field-potato-01",
        "preset_name": "Severe Heatwave",
        "temperature_delta_c": 5.0,
        "rainfall_delta_percent": -30.0,
        "consecutive_dry_days": 10,
        "heatwave_days": 5,
        "co2_elevation_ppm": 50.0
    }
    res = client.post("/api/simulation/scenarios", json=payload)
    assert res.status_code == 200
    sim = res.json()
    assert "projected_yield_t_ha" in sim
    assert "yield_change_percentage" in sim
    assert "trajectory_14d" in sim and len(sim["trajectory_14d"]) == 14
    assert "financial_impact_inr" in sim
    print(f"  ✓ Climate simulation verified: Baseline={sim['baseline_yield_t_ha']} t/ha, Projected={sim['projected_yield_t_ha']} t/ha, Financial Impact=₹{sim['financial_impact_inr']}")


def test_9_analytics_csv_export():
    print("\n--- TEST 9: Agronomic Telemetry CSV Export ---")
    res = client.get("/api/analytics/export-csv/field-potato-01")
    assert res.status_code == 200
    assert "text/csv" in res.headers.get("content-type", "")
    csv_text = res.text
    lines = csv_text.strip().split("\n")
    assert len(lines) >= 10, f"Expected at least 10 CSV rows, got {len(lines)}"
    assert "Field_ID" in lines[0] and "Crop" in lines[0]
    print(f"  ✓ CSV Export verified: {len(lines)} rows returned with valid headers")


def test_10_mathematical_economic_calculations():
    print("\n--- TEST 10: Agricultural Economics Mathematical Formula Validation ---")
    # Potato: 3.6 ha, 28 t/ha, ₹21,500/tonne
    area = 3.6
    yield_t_ha = 28.0
    price_t = 21500
    expected_production = area * yield_t_ha # 100.8 tonnes
    expected_revenue = expected_production * price_t # 2,167,200 INR
    
    payload = {
        "crop_name": "Potato",
        "area_hectares": area,
        "expected_yield_t_ha": yield_t_ha,
        "selling_price_per_ton_inr": price_t,
        "seed_cost_inr": 22000,
        "fertilizer_cost_inr": 17500,
        "pesticide_cost_inr": 6200,
        "labour_cost_inr": 24000,
        "irrigation_power_cost_inr": 5800,
        "machinery_tractor_cost_inr": 11000,
        "harvesting_cost_inr": 13500,
        "packaging_bags_cost_inr": 5200,
        "storage_cost_inr": 4500,
        "transport_cost_inr": 6000,
        "mandi_commission_pct": 1.5
    }
    res = client.post("/api/economics/calculate", json=payload)
    assert res.status_code == 200
    calc = res.json()
    yield_params = calc["yield_parameters"]
    summary = calc["summary"]
    assert abs(yield_params["total_yield_tonnes"] - expected_production) < 0.1
    assert abs(summary["gross_revenue_inr"] - expected_revenue) < 1.0
    assert summary["net_profit_inr"] > 0
    assert summary["return_on_investment_pct"] > 0
    print(f"  ✓ Economics Math verified: Production={yield_params['total_yield_tonnes']} t, Gross=₹{summary['gross_revenue_inr']:,.0f}, Net Profit=₹{summary['net_profit_inr']:,.0f}, ROI={summary['return_on_investment_pct']}%")


if __name__ == "__main__":
    print("=" * 65)
    print("AGRITWIN AI 3.0 — AUTOMATED INTEGRATION & DATA CONSISTENCY AUDIT")
    print("=" * 65)
    test_1_field_crud_and_mathematical_das()
    test_2_phase4_scenario_potato_hassan_single_source_of_truth()
    test_3_crop_switching_persistence()
    test_4_digital_twin_3d_endpoint()
    test_5_ai_crop_health_image_analysis()
    test_6_multilingual_voice_agronomist_grounding()
    test_7_market_intelligence_and_prices()
    test_8_climate_simulation_and_trajectories()
    test_9_analytics_csv_export()
    test_10_mathematical_economic_calculations()
    print("\n" + "=" * 65)
    print("ALL 10 VERIFICATION & AUDIT SUITES PASSED SUCCESSFULLY (100%)")
    print("=" * 65)
