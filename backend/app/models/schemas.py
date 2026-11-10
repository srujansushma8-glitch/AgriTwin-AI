from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any
from datetime import datetime

class SoilDepthTelemetry(BaseModel):
    depth_cm: int
    moisture_percentage: float
    temperature_celsius: float
    ec_ds_m: float # Electrical conductivity in dS/m (salinity indicator)

class SoilTelemetry(BaseModel):
    ph: float
    nitrogen_ppm: float
    phosphorus_ppm: float
    potassium_ppm: float
    organic_matter_percent: float
    layers: List[SoilDepthTelemetry]
    soil_type: str
    water_potential_kpa: float

class MicroclimateTelemetry(BaseModel):
    ambient_temp_c: float
    relative_humidity_percent: float
    vapor_pressure_deficit_kpa: float
    solar_radiation_wm2: float
    wind_speed_kmh: float
    rainfall_24h_mm: float
    co2_ppm: float
    heat_index_c: float

class CropTwinStatus(BaseModel):
    crop_name: str
    variety: str
    planting_date: str
    growth_stage: str # e.g., 'Silking', 'Vegetative', 'Grain-filling'
    days_after_sowing: int
    growing_degree_days_accumulated: float
    gdd_stage_target: float
    leaf_area_index: float
    canopy_ndvi: float
    chlorophyll_spad: float
    canopy_temperature_c: float
    crop_water_stress_index: float # 0.0 (no stress) to 1.0 (severe stress)
    health_status: str # 'Optimal', 'Mild Heat Stress', 'Water Deficit Alert', etc.

class FieldPlot(BaseModel):
    id: str
    name: str
    area_hectares: float
    irrigation_system: str # 'Precision Drip', 'Center Pivot', 'Subsurface Drip', 'Smart Sprinkler'
    crop: CropTwinStatus
    soil: SoilTelemetry
    microclimate: MicroclimateTelemetry
    resilience_score: int # 0 to 100
    risk_level: str # 'Low', 'Moderate', 'High', 'Critical'
    coordinates: Dict[str, float]

class ClimateSimulationRequest(BaseModel):
    plot_id: str
    temperature_delta_c: float = Field(0.0, description="Temperature shift from baseline (-5 to +10 C)")
    rainfall_delta_percent: float = Field(0.0, description="Precipitation change (-100% to +200%)")
    consecutive_dry_days: int = Field(0, description="Duration of drought spell in days (0 to 30)")
    heatwave_intensity_days: int = Field(0, description="Days with Tmax > 38C (0 to 14)")
    co2_elevation_ppm: float = Field(0.0, description="Elevated atmospheric CO2 (0 to 400 ppm above 420)")

class SimulationTrajectoryPoint(BaseModel):
    day: int
    projected_temp_c: float
    projected_soil_moisture: float
    crop_stress_index: float
    biomass_accumulation_kg_ha: float
    evapotranspiration_mm: float

class ClimateSimulationResponse(BaseModel):
    plot_id: str
    crop_name: str
    baseline_yield_t_ha: float
    projected_yield_t_ha: float
    yield_change_percentage: float
    water_stress_classification: str
    pollination_failure_probability: float
    economic_impact_estimate_usd: float
    trajectory: List[SimulationTrajectoryPoint]
    mitigation_strategies: List[str]
    resilience_rating_post_stress: int

class PrescriptionAction(BaseModel):
    action_type: str # 'Irrigation', 'Fertigation', 'Biostimulant', 'Canopy Protection'
    title: str
    urgency: str # 'Immediate', 'Within 24 Hours', 'Scheduled', 'Advisory'
    details: str
    water_volume_liters_per_ha: Optional[float] = None
    npk_ratio: Optional[str] = None
    efficiency_gain: str

class PrescriptionPlan(BaseModel):
    plot_id: str
    plot_name: str
    crop_name: str
    current_moisture_root_zone: float
    target_moisture_root_zone: float
    generated_at: str
    actions: List[PrescriptionAction]
    water_savings_estimated_percent: float
    carbon_offset_kg: float

class CopilotChatRequest(BaseModel):
    message: str
    plot_id: Optional[str] = None
    context_data: Optional[Dict[str, Any]] = None

class CopilotChatResponse(BaseModel):
    reply: str
    suggested_actions: List[str]
    alert_detected: Optional[str] = None
    timestamp: str

class ResilienceAuditReport(BaseModel):
    farm_name: str
    overall_resilience_index: int
    assessment_date: str
    high_risk_zones_count: int
    water_stress_vulnerability: str
    heatwave_readiness: str
    soil_carbon_retention: str
    key_recommendations: List[str]
    zone_summaries: List[Dict[str, Any]]

