from datetime import datetime, timezone
from typing import Optional, Dict, Any, List
from app.models.schemas import CopilotChatRequest, CopilotChatResponse
from app.services.twin_engine import twin_engine

class AgronomistAIService:
    def process_query(self, req: CopilotChatRequest) -> CopilotChatResponse:
        message_lower = req.message.lower()
        now_str = datetime.now(timezone.utc).strftime("%H:%M:%S UTC")
        
        plot = None
        if req.plot_id:
            plot = twin_engine.get_plot(req.plot_id)
        if not plot:
            plot = list(twin_engine.plots.values())[0]

        reply = ""
        actions: List[str] = []
        alert: Optional[str] = None

        if any(w in message_lower for w in ["heat", "temperature", "heatwave", "hot", "thermal"]):
            reply = (
                f"Agronomic Twin Analysis for {plot.name} ({plot.crop.crop_name}):\n\n"
                f"Current ambient temperature is {plot.microclimate.ambient_temp_c}°C with a canopy temperature of {plot.crop.canopy_temperature_c}°C. "
                f"The Crop Water Stress Index (CWSI) is currently {plot.crop.crop_water_stress_index:.2f}.\n\n"
                f"Recommended Climate-Resilience Intervention:\n"
                f"1. Pre-dawn thermal buffering: Run a 35-minute pulsed drip cycle at 04:30 to maximize root-zone turgidity before peak solar radiation.\n"
                f"2. Canopy cooling: If Vapor Pressure Deficit exceeds 2.4 kPa (currently {plot.microclimate.vapor_pressure_deficit_kpa} kPa), activate overhead micro-misting.\n"
                f"3. Osmoprotection: Spray foliar Potassium Silicate (1.5 kg/ha) to reinforce leaf cuticle resilience."
            )
            actions = [
                "Schedule Pre-Dawn Thermal Irrigation",
                "Enable VPD Misting Threshold Alert",
                "Simulate +4°C Heatwave Scenario"
            ]
            if plot.crop.crop_water_stress_index > 0.45:
                alert = f"Elevated Thermal Stress Detected on {plot.name}: Canopy temp is {plot.crop.canopy_temperature_c}°C."

        elif any(w in message_lower for w in ["water", "irrigation", "moisture", "drought", "dry"]):
            root_layer = plot.soil.layers[1]
            reply = (
                f"Soil Moisture Telemetry for {plot.name}:\n\n"
                f"- Topsoil (10cm): {plot.soil.layers[0].moisture_percentage}% (Evaporative boundary)\n"
                f"- Active Root Zone (30cm): {root_layer.moisture_percentage}% (Field Capacity target: 33-35%)\n"
                f"- Deep Reserve (60cm): {plot.soil.layers[2].moisture_percentage}%\n\n"
                f"Soil water potential stands at {plot.soil.water_potential_kpa} kPa. "
                + ("The root zone has dropped below the optimal 28% threshold. Immediate pulsed irrigation is advised." if root_layer.moisture_percentage < 28.0 else "Root zone moisture is currently healthy. Avoid over-irrigation to prevent anaerobic root conditions.")
            )
            actions = [
                "Generate Variable-Rate Irrigation Prescription",
                "Run 14-Day Drought Depletion Model",
                "Inspect Soil Layer Moisture Gradient"
            ]
            if root_layer.moisture_percentage < 22.0:
                alert = f"Root Zone Water Deficit Alert: Moisture at {root_layer.moisture_percentage}% in {plot.name}."

        elif any(w in message_lower for w in ["yield", "harvest", "production", "loss", "gdd"]):
            reply = (
                f"Crop Phenology & Yield Forecast for {plot.crop.crop_name} ({plot.crop.variety}):\n\n"
                f"- Growth Stage: {plot.crop.growth_stage} ({plot.crop.days_after_sowing} days after sowing)\n"
                f"- Accumulated GDD: {plot.crop.growing_degree_days_accumulated:.0f} / {plot.crop.gdd_stage_target:.0f} thermal units\n"
                f"- Canopy NDVI: {plot.crop.canopy_ndvi} | Leaf Area Index (LAI): {plot.crop.leaf_area_index}\n\n"
                f"Under present microclimate conditions, the plot is tracking at 94% of optimum physiological biomass accumulation. "
                f"The digital twin forecasts maturity within 24-28 calendar days assuming normal seasonal temperatures."
            )
            actions = [
                "Run What-If Climate Yield Simulation",
                "View Biomass Trajectory Curve",
                "Export Harvest Readiness Audit"
            ]

        elif any(w in message_lower for w in ["fertilizer", "fertigation", "nutrient", "npk", "nitrogen", "soil"]):
            reply = (
                f"Soil Chemistry & Nutrient Twin State for {plot.name}:\n\n"
                f"- Soil pH: {plot.soil.ph} ({'Slightly Acidic' if plot.soil.ph < 6.5 else 'Neutral / Optimal'})\n"
                f"- Nitrogen (N): {plot.soil.nitrogen_ppm} ppm\n"
                f"- Phosphorus (P): {plot.soil.phosphorus_ppm} ppm\n"
                f"- Potassium (K): {plot.soil.potassium_ppm} ppm\n"
                f"- Soil Organic Matter: {plot.soil.organic_matter_percent}%\n\n"
                f"Recommendation: With current vegetative demand, apply a 2:1:3 N-P-K fertigation pulse next Monday. The elevated organic matter provides high cation exchange buffering."
            )
            actions = [
                "Generate Precision Fertigation Schedule",
                "Calibrate Soil EC Salinity Sensor",
                "View Multi-Depth Soil Profile"
            ]

        else:
            reply = (
                f"Hello! I am your AgriTwin Autonomous Agronomist. I continuously monitor the digital twin state of {plot.name} ({plot.crop.crop_name}).\n\n"
                f"Telemetry Snapshot:\n"
                f"- Ambient: {plot.microclimate.ambient_temp_c}°C | RH: {plot.microclimate.relative_humidity_percent}% | VPD: {plot.microclimate.vapor_pressure_deficit_kpa} kPa\n"
                f"- Root-zone Moisture: {plot.soil.layers[1].moisture_percentage}% | Soil Temp: {plot.soil.layers[1].temperature_celsius}°C\n"
                f"- Overall Climate Resilience Score: {plot.resilience_score}/100 ({plot.risk_level} Risk)\n\n"
                f"Ask me about climate stress simulations, variable-rate irrigation, heatwave mitigation protocols, or nutrient balancing!"
            )
            actions = [
                "Simulate Flash Drought Shock",
                "Check Irrigation Prescriptions",
                "Run Farm-Wide Resilience Audit"
            ]

        return CopilotChatResponse(
            reply=reply,
            suggested_actions=actions,
            alert_detected=alert,
            timestamp=now_str
        )

agronomist_ai = AgronomistAIService()

