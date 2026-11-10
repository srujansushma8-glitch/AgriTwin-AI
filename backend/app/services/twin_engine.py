import math
from datetime import datetime, timezone
from typing import List, Dict, Optional, Any
from app.models.schemas import (
    FieldPlot, CropTwinStatus, SoilTelemetry, SoilDepthTelemetry,
    MicroclimateTelemetry, ClimateSimulationRequest, ClimateSimulationResponse,
    SimulationTrajectoryPoint, PrescriptionPlan, PrescriptionAction, ResilienceAuditReport
)

# Reference Crop Parameters (Kc, Base Temp, Optimal Temp, Yield Potential t/ha, Drought Sensitivity)
CROP_FACTORS = {
    "Maize (Corn)": {
        "variety": "Pioneer ClimateShield P1197",
        "t_base": 10.0,
        "t_opt": 28.0,
        "t_max_critical": 35.0,
        "kc_mid": 1.20,
        "baseline_yield": 9.8,
        "price_per_ton": 210.0,
        "drought_sensitivity": 0.85,
    },
    "Winter Wheat": {
        "variety": "TAM 114 Drought-Tolerant",
        "t_base": 4.0,
        "t_opt": 22.0,
        "t_max_critical": 31.0,
        "kc_mid": 1.15,
        "baseline_yield": 5.4,
        "price_per_ton": 275.0,
        "drought_sensitivity": 0.75,
    },
    "Lowland Rice": {
        "variety": "IR64 Sub1 Flash-Flood Resilient",
        "t_base": 12.0,
        "t_opt": 30.0,
        "t_max_critical": 36.0,
        "kc_mid": 1.25,
        "baseline_yield": 6.8,
        "price_per_ton": 320.0,
        "drought_sensitivity": 0.95,
    },
    "Organic Tomato": {
        "variety": "Roma VF Thermal Resilient",
        "t_base": 10.0,
        "t_opt": 25.0,
        "t_max_critical": 33.0,
        "kc_mid": 1.15,
        "baseline_yield": 48.0,
        "price_per_ton": 450.0,
        "drought_sensitivity": 0.80,
    },
    "Cotton": {
        "variety": "Bollgard 3 XtendFlex",
        "t_base": 15.0,
        "t_opt": 32.0,
        "t_max_critical": 39.0,
        "kc_mid": 1.15,
        "baseline_yield": 3.2,
        "price_per_ton": 1400.0,
        "drought_sensitivity": 0.65,
    },
    "Soybean": {
        "variety": "Enlist E3 Deep-Root",
        "t_base": 10.0,
        "t_opt": 27.0,
        "t_max_critical": 35.0,
        "kc_mid": 1.15,
        "baseline_yield": 3.9,
        "price_per_ton": 430.0,
        "drought_sensitivity": 0.70,
    }
}

class TwinEngineService:
    def __init__(self):
        self._initialize_plots()

    def _initialize_plots(self):
        self.plots: Dict[str, FieldPlot] = {
            "plot-north-alpha": FieldPlot(
                id="plot-north-alpha",
                name="North Plot A - Precision Maize",
                area_hectares=14.5,
                irrigation_system="Variable-Rate Drip & Micro-Sprinkler",
                resilience_score=84,
                risk_level="Low",
                coordinates={"lat": 40.7128, "lng": -74.0060},
                crop=CropTwinStatus(
                    crop_name="Maize (Corn)",
                    variety="Pioneer ClimateShield P1197",
                    planting_date="2026-04-15",
                    growth_stage="Tasseling / Silking (VT)",
                    days_after_sowing=68,
                    growing_degree_days_accumulated=1140.0,
                    gdd_stage_target=1250.0,
                    leaf_area_index=4.2,
                    canopy_ndvi=0.82,
                    chlorophyll_spad=46.5,
                    canopy_temperature_c=27.2,
                    crop_water_stress_index=0.22,
                    health_status="Vigorous Canopy Growth"
                ),
                soil=SoilTelemetry(
                    ph=6.7,
                    nitrogen_ppm=34.0,
                    phosphorus_ppm=22.0,
                    potassium_ppm=185.0,
                    organic_matter_percent=3.4,
                    soil_type="Silt Loam with High Organic Retention",
                    water_potential_kpa=-32.5,
                    layers=[
                        SoilDepthTelemetry(depth_cm=10, moisture_percentage=28.4, temperature_celsius=24.1, ec_ds_m=1.1),
                        SoilDepthTelemetry(depth_cm=30, moisture_percentage=33.2, temperature_celsius=21.8, ec_ds_m=1.2),
                        SoilDepthTelemetry(depth_cm=60, moisture_percentage=36.0, temperature_celsius=19.4, ec_ds_m=1.3)
                    ]
                ),
                microclimate=MicroclimateTelemetry(
                    ambient_temp_c=28.5,
                    relative_humidity_percent=58.0,
                    vapor_pressure_deficit_kpa=1.52,
                    solar_radiation_wm2=740.0,
                    wind_speed_kmh=12.5,
                    rainfall_24h_mm=0.0,
                    co2_ppm=425.0,
                    heat_index_c=29.8
                )
            ),
            "plot-south-beta": FieldPlot(
                id="plot-south-beta",
                name="South Terraces B - Winter Wheat",
                area_hectares=22.0,
                irrigation_system="Solar Precision Center Pivot",
                resilience_score=68,
                risk_level="Moderate",
                coordinates={"lat": 40.7180, "lng": -73.9990},
                crop=CropTwinStatus(
                    crop_name="Winter Wheat",
                    variety="TAM 114 Drought-Tolerant",
                    planting_date="2026-03-01",
                    growth_stage="Grain Milk Stage (Zadoks 73)",
                    days_after_sowing=112,
                    growing_degree_days_accumulated=1420.0,
                    gdd_stage_target=1600.0,
                    leaf_area_index=3.6,
                    canopy_ndvi=0.74,
                    chlorophyll_spad=41.0,
                    canopy_temperature_c=29.4,
                    crop_water_stress_index=0.48,
                    health_status="Mild Thermal Exposure at Grain Fill"
                ),
                soil=SoilTelemetry(
                    ph=7.2,
                    nitrogen_ppm=26.0,
                    phosphorus_ppm=18.5,
                    potassium_ppm=160.0,
                    organic_matter_percent=2.8,
                    soil_type="Clay Loam with High Water Retention",
                    water_potential_kpa=-68.0,
                    layers=[
                        SoilDepthTelemetry(depth_cm=10, moisture_percentage=19.5, temperature_celsius=26.5, ec_ds_m=1.6),
                        SoilDepthTelemetry(depth_cm=30, moisture_percentage=23.8, temperature_celsius=23.2, ec_ds_m=1.5),
                        SoilDepthTelemetry(depth_cm=60, moisture_percentage=29.0, temperature_celsius=20.5, ec_ds_m=1.4)
                    ]
                ),
                microclimate=MicroclimateTelemetry(
                    ambient_temp_c=31.2,
                    relative_humidity_percent=42.0,
                    vapor_pressure_deficit_kpa=2.25,
                    solar_radiation_wm2=810.0,
                    wind_speed_kmh=18.0,
                    rainfall_24h_mm=0.0,
                    co2_ppm=422.0,
                    heat_index_c=33.1
                )
            ),
            "plot-east-gamma": FieldPlot(
                id="plot-east-gamma",
                name="East Basin C - Climate-Smart Rice",
                area_hectares=18.2,
                irrigation_system="Controlled AWD (Alternate Wetting and Drying)",
                resilience_score=91,
                risk_level="Low",
                coordinates={"lat": 40.7145, "lng": -73.9850},
                crop=CropTwinStatus(
                    crop_name="Lowland Rice",
                    variety="IR64 Sub1 Flash-Flood Resilient",
                    planting_date="2026-05-10",
                    growth_stage="Active Tillering / Panicle Initiation",
                    days_after_sowing=42,
                    growing_degree_days_accumulated=790.0,
                    gdd_stage_target=1450.0,
                    leaf_area_index=4.8,
                    canopy_ndvi=0.86,
                    chlorophyll_spad=49.2,
                    canopy_temperature_c=26.0,
                    crop_water_stress_index=0.12,
                    health_status="Optimal Tillering Biomass"
                ),
                soil=SoilTelemetry(
                    ph=6.4,
                    nitrogen_ppm=38.0,
                    phosphorus_ppm=25.0,
                    potassium_ppm=210.0,
                    organic_matter_percent=3.8,
                    soil_type="Heavy Alluvial Clay",
                    water_potential_kpa=-12.0,
                    layers=[
                        SoilDepthTelemetry(depth_cm=10, moisture_percentage=44.0, temperature_celsius=23.0, ec_ds_m=0.9),
                        SoilDepthTelemetry(depth_cm=30, moisture_percentage=46.5, temperature_celsius=21.5, ec_ds_m=0.9),
                        SoilDepthTelemetry(depth_cm=60, moisture_percentage=49.0, temperature_celsius=19.8, ec_ds_m=1.0)
                    ]
                ),
                microclimate=MicroclimateTelemetry(
                    ambient_temp_c=27.0,
                    relative_humidity_percent=72.0,
                    vapor_pressure_deficit_kpa=1.02,
                    solar_radiation_wm2=680.0,
                    wind_speed_kmh=8.4,
                    rainfall_24h_mm=4.5,
                    co2_ppm=428.0,
                    heat_index_c=28.3
                )
            ),
            "plot-west-delta": FieldPlot(
                id="plot-west-delta",
                name="West High-Tunnel D - Organic Tomatoes",
                area_hectares=6.5,
                irrigation_system="Pulse Fertigation Drip + Misting",
                resilience_score=62,
                risk_level="High",
                coordinates={"lat": 40.7090, "lng": -74.0150},
                crop=CropTwinStatus(
                    crop_name="Organic Tomato",
                    variety="Roma VF Thermal Resilient",
                    planting_date="2026-04-01",
                    growth_stage="Flowering & Fruit Set",
                    days_after_sowing=55,
                    growing_degree_days_accumulated=920.0,
                    gdd_stage_target=1100.0,
                    leaf_area_index=3.2,
                    canopy_ndvi=0.69,
                    chlorophyll_spad=38.4,
                    canopy_temperature_c=31.8,
                    crop_water_stress_index=0.55,
                    health_status="Elevated VPD & Flower Abscission Risk"
                ),
                soil=SoilTelemetry(
                    ph=6.2,
                    nitrogen_ppm=42.0,
                    phosphorus_ppm=32.0,
                    potassium_ppm=280.0,
                    organic_matter_percent=4.5,
                    soil_type="Compost-Enriched Sandy Loam",
                    water_potential_kpa=-85.0,
                    layers=[
                        SoilDepthTelemetry(depth_cm=10, moisture_percentage=16.8, temperature_celsius=27.9, ec_ds_m=2.1),
                        SoilDepthTelemetry(depth_cm=30, moisture_percentage=21.2, temperature_celsius=24.5, ec_ds_m=1.9),
                        SoilDepthTelemetry(depth_cm=60, moisture_percentage=26.4, temperature_celsius=22.0, ec_ds_m=1.7)
                    ]
                ),
                microclimate=MicroclimateTelemetry(
                    ambient_temp_c=33.5,
                    relative_humidity_percent=38.0,
                    vapor_pressure_deficit_kpa=2.85,
                    solar_radiation_wm2=860.0,
                    wind_speed_kmh=10.0,
                    rainfall_24h_mm=0.0,
                    co2_ppm=435.0,
                    heat_index_c=36.2
                )
            )
        }

    def list_plots(self) -> List[FieldPlot]:
        return list(self.plots.values())

    def get_plot(self, plot_id: str) -> Optional[FieldPlot]:
        return self.plots.get(plot_id)

    def calculate_vpd(self, temp_c: float, rh_percent: float) -> float:
        # Tetens formula for saturation vapor pressure (es) in kPa
        es = 0.61078 * math.exp((17.27 * temp_c) / (temp_c + 237.3))
        ea = es * (rh_percent / 100.0)
        return round(max(0.0, es - ea), 2)

    def run_climate_simulation(self, req: ClimateSimulationRequest) -> ClimateSimulationResponse:
        plot = self.get_plot(req.plot_id)
        if not plot:
            # Fallback to first plot if id not found
            plot = list(self.plots.values())[0]

        crop_data = CROP_FACTORS.get(plot.crop.crop_name, CROP_FACTORS["Maize (Corn)"])
        base_yield = crop_data["baseline_yield"]
        sensitivity = crop_data["drought_sensitivity"]

        # Heat and drought penalty calculation
        temp_shift = req.temperature_delta_c
        dry_days = req.consecutive_dry_days
        heat_days = req.heatwave_intensity_days
        rain_delta = req.rainfall_delta_percent

        # Thermal stress factor
        heat_penalty = max(0.0, (temp_shift * 2.2) + (heat_days * 3.5))
        # Moisture deficit penalty
        moisture_penalty = max(0.0, (dry_days * 1.8) - (rain_delta * 0.15))
        # CO2 fertilization bonus (up to +6% yield buffer for C3 crops, +2% for C4)
        co2_bonus = (req.co2_elevation_ppm / 400.0) * (3.5 if "Wheat" in plot.crop.crop_name or "Rice" in plot.crop.crop_name else 1.5)

        total_yield_penalty_pct = max(-65.0, min(15.0, -(heat_penalty + moisture_penalty) * sensitivity + co2_bonus))
        projected_yield = max(0.8, round(base_yield * (1.0 + (total_yield_penalty_pct / 100.0)), 2))

        # Pollination failure probability (very sensitive to heat at silking/flowering)
        pollination_risk = min(0.98, max(0.02, 0.05 + (heat_days * 0.08) + (temp_shift * 0.04)))
        if "Flowering" in plot.crop.growth_stage or "Silking" in plot.crop.growth_stage:
            pollination_risk = min(0.99, pollination_risk * 1.45)

        # Economic impact
        lost_tonnage = max(0.0, (base_yield - projected_yield) * plot.area_hectares)
        economic_loss_usd = round(lost_tonnage * crop_data["price_per_ton"], 2)

        # Trajectory over 14 simulation days
        trajectory: List[SimulationTrajectoryPoint] = []
        curr_moisture = plot.soil.layers[1].moisture_percentage
        curr_temp = plot.microclimate.ambient_temp_c + temp_shift
        biomass = 3200.0

        for day in range(1, 15):
            # Moisture depletion rate
            et = round(max(2.0, 4.5 + (temp_shift * 0.3) - (rain_delta * 0.02)), 2)
            curr_moisture = max(8.0, round(curr_moisture - (et * 0.45) + (0.5 if dry_days == 0 else 0.0), 1))
            
            # Stress index
            daily_stress = min(1.0, max(0.05, 0.2 + ((35.0 - curr_moisture) / 35.0) * 0.6 + (heat_days * 0.02)))
            daily_biomass_growth = max(15.0, 140.0 * (1.0 - daily_stress) + (co2_bonus * 2.0))
            biomass += daily_biomass_growth

            trajectory.append(SimulationTrajectoryPoint(
                day=day,
                projected_temp_c=round(curr_temp + (math.sin(day * 0.5) * 2.0), 1),
                projected_soil_moisture=curr_moisture,
                crop_stress_index=round(daily_stress, 2),
                biomass_accumulation_kg_ha=round(biomass, 1),
                evapotranspiration_mm=et
            ))

        # Mitigation strategies tailored to shock profile
        mitigations = []
        if heat_days > 2 or temp_shift >= 3.0:
            mitigations.append("Deploy Kaolin particle film or silica-based reflective anti-transpirant to reduce canopy leaf temperature by 2.5-3.5°C.")
            mitigations.append("Transition irrigation cycles to pre-dawn thermal buffering (03:00 - 06:00) to dampen peak midday root-zone heat spikes.")
        if dry_days > 5 or rain_delta < -25.0:
            mitigations.append("Activate Variable-Rate Pulse Fertigation with Potassium Silicate to reinforce cellular turgor and reduce stomatal transpiration.")
            mitigations.append("Apply organic bio-mulch / hydrogel soil retainers to reduce topsoil evaporation losses by up to 38%.")
        if pollination_risk > 0.45:
            mitigations.append("Emergency micro-misting canopy pulse at 13:00 to reduce VPD below 2.2 kPa and safeguard pollen viability.")

        if not mitigations:
            mitigations.append("Current climate profile is within the crop's physiological resilience window. Maintain standard precision scheduling.")

        # Updated post-stress resilience rating
        post_rating = max(15, min(95, int(plot.resilience_score + total_yield_penalty_pct * 0.7)))

        classification = "Normal / Sustainable"
        if total_yield_penalty_pct < -25.0:
            classification = "Severe Water & Thermal Crisis"
        elif total_yield_penalty_pct < -10.0:
            classification = "Moderate Moisture Deficit Alert"
        elif total_yield_penalty_pct > 3.0:
            classification = "Positive Climate Adaptation Window"

        return ClimateSimulationResponse(
            plot_id=plot.id,
            crop_name=plot.crop.crop_name,
            baseline_yield_t_ha=base_yield,
            projected_yield_t_ha=projected_yield,
            yield_change_percentage=round(total_yield_penalty_pct, 1),
            water_stress_classification=classification,
            pollination_failure_probability=round(pollination_risk, 2),
            economic_impact_estimate_usd=economic_loss_usd,
            trajectory=trajectory,
            mitigation_strategies=mitigations,
            resilience_rating_post_stress=post_rating
        )

    def generate_prescriptions(self, plot_id: Optional[str] = None) -> List[PrescriptionPlan]:
        plots_to_process = [self.get_plot(plot_id)] if plot_id and self.get_plot(plot_id) else list(self.plots.values())
        plans: List[PrescriptionPlan] = []

        now_str = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")

        for p in plots_to_process:
            root_moisture = p.soil.layers[1].moisture_percentage
            target_moisture = 34.0
            actions = []

            # Water prescription
            if root_moisture < 25.0:
                deficit_pct = target_moisture - root_moisture
                liters_ha = round(deficit_pct * 12000.0, 0)
                actions.append(PrescriptionAction(
                    action_type="Irrigation",
                    title="Deep Root-Zone Drip Cycle (Pulse Mode)",
                    urgency="Immediate" if root_moisture < 20.0 else "Within 24 Hours",
                    details=f"Apply {liters_ha:,.0f} L/ha split across 3 evening pulses to avoid percolation loss beyond the 45cm root boundary.",
                    water_volume_liters_per_ha=liters_ha,
                    efficiency_gain="+26% retention vs single deluge"
                ))
            else:
                actions.append(PrescriptionAction(
                    action_type="Irrigation",
                    title="Maintenance Moisture Buffer",
                    urgency="Scheduled",
                    details="Topsoil moisture is adequate. Execute scheduled 20-minute deficit maintenance cycle tomorrow at 05:00.",
                    water_volume_liters_per_ha=8500.0,
                    efficiency_gain="Optimizes root elongation"
                ))

            # Nutrition & Protection prescription
            if p.soil.nitrogen_ppm < 30.0:
                actions.append(PrescriptionAction(
                    action_type="Fertigation",
                    title="Targeted Nitrogen-Potassium Split Dosing",
                    urgency="Within 24 Hours",
                    details="Inject 18 kg/ha N (Urea-Ammonium Nitrate) + 12 kg/ha Soluble K2O through the drip manifold to bolster osmotic regulation.",
                    npk_ratio="18-0-12",
                    efficiency_gain="Prevents luxury consumption & leaching"
                ))
            elif p.crop.crop_water_stress_index > 0.40:
                actions.append(PrescriptionAction(
                    action_type="Biostimulant",
                    title="Foliar Seaweed Extract & Glycine Betaine Spray",
                    urgency="Immediate",
                    details="Apply osmoprotectant foliar spray before 10:00 to mitigate heat-induced cellular damage during midday solar peak.",
                    efficiency_gain="Reduces canopy heat damage by ~2.8°C"
                ))

            actions.append(PrescriptionAction(
                action_type="Canopy Protection",
                title="Micro-sensor Drift Calibration",
                urgency="Advisory",
                details="Calibrate infrared leaf temp radiometer in Section B3 to maintain +/-0.2°C CWSI accuracy.",
                efficiency_gain="Sensor anomaly prevention"
            ))

            plans.append(PrescriptionPlan(
                plot_id=p.id,
                plot_name=p.name,
                crop_name=p.crop.crop_name,
                current_moisture_root_zone=root_moisture,
                target_moisture_root_zone=target_moisture,
                generated_at=now_str,
                actions=actions,
                water_savings_estimated_percent=32.5,
                carbon_offset_kg=round(p.area_hectares * 14.2, 1)
            ))

        return plans

    def generate_resilience_audit(self) -> ResilienceAuditReport:
        plots = list(self.plots.values())
        avg_score = int(sum(p.resilience_score for p in plots) / len(plots))
        high_risk_count = sum(1 for p in plots if p.risk_level in ["High", "Critical"])

        return ResilienceAuditReport(
            farm_name="AgriTwin GreenVanguard Agro-Ecosystem",
            overall_resilience_index=avg_score,
            assessment_date=datetime.now(timezone.utc).strftime("%Y-%m-%d"),
            high_risk_zones_count=high_risk_count,
            water_stress_vulnerability="Elevated in Zone West Delta (High-Tunnel Tomatoes under high VPD)",
            heatwave_readiness="Substantial for Maize & Rice; Requires pulse cooling protocol for Wheat during grain-fill",
            soil_carbon_retention="Strong (Average 3.6% Organic Matter across silt-clay profiles)",
            key_recommendations=[
                "Deploy automatic high-pressure misting in West High-Tunnel to suppress VPD spikes above 2.2 kPa.",
                "Advance deficit irrigation scheduling in South Terraces B Wheat by 36 hours ahead of next week's anticipated heat ridge.",
                "Maintain Alternate Wetting and Drying (AWD) cycle in Rice Basin to reduce methane emissions by 30% while securing root oxygenation.",
                "Introduce cover-crop residue mulch on North Plot A to insulate root-zone temperatures during midsummer heat waves."
            ],
            zone_summaries=[
                {
                    "plot_id": p.id,
                    "name": p.name,
                    "crop": p.crop.crop_name,
                    "resilience_score": p.resilience_score,
                    "risk_level": p.risk_level,
                    "cwsi": p.crop.crop_water_stress_index,
                    "topsoil_moisture": p.soil.layers[0].moisture_percentage,
                    "root_moisture": p.soil.layers[1].moisture_percentage
                } for p in plots
            ]
        )

twin_engine = TwinEngineService()

