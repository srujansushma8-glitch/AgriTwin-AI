// AgriTwin AI V2 API Client
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface FieldItem {
  id: string;
  name: string;
  farmer_name: string;
  location: string;
  area_hectares: number;
  soil_type: string;
  soil_ph: number;
  nitrogen_ppm: number;
  phosphorus_ppm: number;
  potassium_ppm: number;
  organic_carbon_pct: number;
  water_availability: string;
  irrigation_method: string;
  crop_type: string;
  crop_variety: string;
  sowing_date: string;
  expected_harvest_date: string;
  growth_stage: string;
  days_after_sowing: number;
  lat: number;
  lng: number;
  elevation_m?: number;
  resilience_score: number;
  risk_level: "Low" | "Moderate" | "High" | "Critical";
}

// Backwards compatibility alias
export type FieldPlot = FieldItem & {
  irrigation_system?: string;
  crop: {
    crop_name: string;
    variety: string;
    growth_stage: string;
    days_after_sowing: number;
    growing_degree_days_accumulated: number;
    gdd_stage_target: number;
    leaf_area_index: number;
    canopy_ndvi: number;
    chlorophyll_spad: number;
    canopy_temperature_c: number;
    crop_water_stress_index: number;
    health_status: string;
  };
  soil: {
    ph: number;
    nitrogen_ppm: number;
    phosphorus_ppm: number;
    potassium_ppm: number;
    organic_matter_percent: number;
    water_potential_kpa: number;
    layers: Array<{
      depth_cm: number;
      moisture_percentage: number;
      temperature_celsius: number;
      ec_ds_m: number;
    }>;
  };
  microclimate: {
    ambient_temp_c: number;
    relative_humidity_percent: number;
    vapor_pressure_deficit_kpa: number;
    solar_radiation_wm2: number;
    wind_speed_kmh: number;
    rainfall_24h_mm: number;
    co2_ppm: number;
    heat_index_c: number;
  };
};

export interface DashboardOverview {
  farm_name: string;
  location: string;
  total_fields: number;
  active_digital_twins: number;
  overall_resilience_score: number;
  active_alerts_count: number;
  active_field_id: string;
  active_field_name: string;
  crop_type: string;
  growth_stage: string;
  soil_moisture_root_zone: number;
  soil_temperature: number;
  ambient_temperature: number;
  humidity: number;
  vpd_kpa: number;
  rainfall_mm: number;
  water_availability: string;
  climate_risk_score: number;
  data_source_labels: Record<string, string>;
}

export interface SoilStrata3D {
  depth_cm: number;
  label: string;
  moisture_pct: number;
  color: string;
  temp_c: number;
}

export interface FieldZone3D {
  zone_id: string;
  name: string;
  moisture_pct: number;
  status: string;
  color: string;
}

export interface Twin3DData {
  field_id: string;
  field_name: string;
  crop_type: string;
  soil_type: string;
  growth_stage: string;
  grid_dimensions: { width: number; length: number; rows: number; columns: number };
  soil_strata: SoilStrata3D[];
  crop_health_3d: {
    health_state: string;
    foliage_color: string;
    canopy_height: number;
    density: number;
  };
  irrigation_network: {
    system_type: string;
    nozzles_count: number;
    flow_active: boolean;
    emitter_rate_lph: number;
  };
  field_zones: FieldZone3D[];
}

export interface MLPrediction {
  crop_type: string;
  health_score: number;
  health_status: string;
  water_stress_index: number;
  heat_stress_index: number;
  drought_risk_pct: number;
  excess_rain_risk_pct: number;
  confidence_score: number;
  model_version: string;
  feature_attribution: Array<{ feature: string; weight_pct: number }>;
  validation_metrics: {
    mae: number;
    rmse: number;
    r2: number;
    f1_score: number;
    training_samples_validated: number;
    features_used: string[];
  };
  calculated_at: string;
}

export interface ClimateScenarioResult {
  field_id: string;
  field_name: string;
  crop_type: string;
  preset_scenario: string;
  baseline_yield_t_ha: number;
  projected_yield_t_ha: number;
  yield_change_percentage: number;
  financial_impact_inr: number;
  water_stress_level: string;
  pollination_risk_pct: number;
  trajectory_14d: Array<{
    day: number;
    soil_moisture_pct: number;
    crop_stress_index: number;
    biomass_accumulation_kg: number;
  }>;
  recommended_interventions: string[];
  resilience_rating_post_scenario: number;
}

export type ClimateSimulationResponse = {
  plot_id: string;
  crop_name: string;
  baseline_yield_t_ha: number;
  projected_yield_t_ha: number;
  yield_change_percentage: number;
  water_stress_classification: string;
  pollination_failure_probability: number;
  economic_impact_estimate_usd: number;
  trajectory: Array<{
    day: number;
    projected_temp_c: number;
    projected_soil_moisture: number;
    crop_stress_index: number;
    biomass_accumulation_kg_ha: number;
    evapotranspiration_mm: number;
  }>;
  mitigation_strategies: string[];
  resilience_rating_post_stress: number;
};

export interface IrrigationDecision {
  field_id: string;
  field_name: string;
  current_root_moisture: number;
  optimal_threshold: number;
  deficit_status: string;
  decision_options: Array<{
    option_id: string;
    title: string;
    water_liters_per_ha: number;
    projected_moisture: number;
    yield_impact: string;
    cost_inr: number;
    recommended: boolean;
  }>;
}

export interface AlertItem {
  id: number;
  field_id: string;
  timestamp: string;
  severity: "Low" | "Moderate" | "High" | "Critical";
  title: string;
  condition: string;
  potential_impact: string;
  preventive_action: string;
  is_read: boolean;
}

export interface SoilHealthAnalysis {
  field_id: string;
  field_name: string;
  soil_type: string;
  ph: number;
  ph_rating: string;
  nitrogen_ppm: number;
  phosphorus_ppm: number;
  potassium_ppm: number;
  organic_carbon_pct: number;
  crop_suitability: Array<{ crop: string; suitability: string; notes: string }>;
  recommendations: string[];
}

export interface CropGrowthCalendar {
  field_id: string;
  crop_type: string;
  variety: string;
  days_after_sowing: number;
  expected_harvest_date: string;
  stages: Array<{ stage: string; days: string; status: string }>;
}

export interface EconomicsData {
  field_id: string;
  crop_type: string;
  area_hectares: number;
  currency: string;
  price_per_ton_inr: number;
  baseline_yield_t_ha: number;
  expected_production_tons: number;
  expected_gross_revenue_inr: number;
  estimated_input_costs_inr: number;
  estimated_net_profit_inr: number;
  savings_from_preventive_twin_irrigation_inr: number;
}

export interface ResearchExperiment {
  id: string;
  title: string;
  field_id: string;
  crop: string;
  scenario_name: string;
  model_used: string;
  mae: number;
  rmse: number;
  r2: number;
  f1_score: number;
  simulation_output: string;
  notes: string;
  created_at: string;
}

export interface PrescriptionPlan {
  plot_id: string;
  plot_name: string;
  crop_name: string;
  current_moisture_root_zone: number;
  target_moisture_root_zone: number;
  generated_at: string;
  actions: Array<{
    action_type: string;
    title: string;
    urgency: string;
    details: string;
    water_volume_liters_per_ha?: number;
    npk_ratio?: string;
    efficiency_gain: string;
  }>;
  water_savings_estimated_percent: number;
  carbon_offset_kg: number;
}

export interface ResilienceAuditReport {
  farm_name: string;
  overall_resilience_index: number;
  assessment_date: string;
  high_risk_zones_count: number;
  water_stress_vulnerability: string;
  heatwave_readiness: string;
  soil_carbon_retention: string;
  key_recommendations: string[];
  zone_summaries: Array<{
    plot_id: string;
    name: string;
    crop: string;
    resilience_score: number;
    risk_level: string;
    cwsi: number;
    topsoil_moisture: number;
    root_moisture: number;
  }>;
}

export interface TimelinePoint {
  date: string;
  phase: string;
  temp_c: number;
  soil_moisture_pct: number;
  rain_mm: number;
  vpd_kpa: number;
  stress_index: number;
}

// Fallback field in case backend is offline
export const FALLBACK_FIELD: FieldItem = {
  id: "field-ragi-01",
  name: "Mandya North Terraces — Ragi Field",
  farmer_name: "Ramesh Gowda",
  location: "Mandya, Karnataka",
  area_hectares: 6.5,
  soil_type: "Red soil",
  soil_ph: 6.6,
  nitrogen_ppm: 36.0,
  phosphorus_ppm: 24.0,
  potassium_ppm: 210.0,
  organic_carbon_pct: 0.82,
  water_availability: "Borewell + Farm Pond",
  irrigation_method: "Micro-Sprinkler",
  crop_type: "Ragi (Finger Millet)",
  crop_variety: "ML-365 Drought-Tolerant",
  sowing_date: "2026-06-10",
  expected_harvest_date: "2026-10-15",
  growth_stage: "Flowering & Grain Formation",
  days_after_sowing: 58,
  lat: 12.524,
  lng: 76.896,
  resilience_score: 88,
  risk_level: "Low",
};

export const FALLBACK_FIELDS: FieldItem[] = [
  FALLBACK_FIELD,
  {
    id: "field-carrot-01",
    name: "Bengaluru Rural Basin — Carrot Raised Beds",
    farmer_name: "Ramesh Gowda",
    location: "Bengaluru Rural, Karnataka",
    area_hectares: 2.4,
    soil_type: "Sandy loam",
    soil_ph: 6.4,
    nitrogen_ppm: 38.0,
    phosphorus_ppm: 28.0,
    potassium_ppm: 190.0,
    organic_carbon_pct: 0.85,
    water_availability: "Borewell + Inline Drip",
    irrigation_method: "Precision Drip Irrigation",
    crop_type: "Carrot",
    crop_variety: "Super Kuroda / Pusa Rudhira",
    sowing_date: "2026-06-05",
    expected_harvest_date: "2026-09-10",
    growth_stage: "Root Swelling & Carotene Synthesis",
    days_after_sowing: 52,
    lat: 13.295,
    lng: 77.535,
    resilience_score: 92,
    risk_level: "Low",
  },
  {
    id: "field-beetroot-01",
    name: "Mysuru Horticultural Sector — Beetroot Field",
    farmer_name: "Ramesh Gowda",
    location: "Mysuru District, Karnataka",
    area_hectares: 1.8,
    soil_type: "Loamy soil",
    soil_ph: 6.8,
    nitrogen_ppm: 35.0,
    phosphorus_ppm: 24.0,
    potassium_ppm: 180.0,
    organic_carbon_pct: 0.78,
    water_availability: "River Canal + Drip",
    irrigation_method: "Inline Drip System",
    crop_type: "Beetroot",
    crop_variety: "Detroit Dark Red",
    sowing_date: "2026-06-15",
    expected_harvest_date: "2026-08-30",
    growth_stage: "Hypocotyl Bulbing Stage",
    days_after_sowing: 42,
    lat: 12.122,
    lng: 76.685,
    resilience_score: 89,
    risk_level: "Low",
  },
  {
    id: "field-potato-01",
    name: "Hassan Plateau — Potato Ridge & Furrow",
    farmer_name: "Ramesh Gowda",
    location: "Hassan District, Karnataka",
    area_hectares: 3.6,
    soil_type: "Loamy soil",
    soil_ph: 5.8,
    nitrogen_ppm: 42.0,
    phosphorus_ppm: 36.0,
    potassium_ppm: 230.0,
    organic_carbon_pct: 0.92,
    water_availability: "Borewell + Ridge Furrow Drip",
    irrigation_method: "Ridge-and-Furrow Drip",
    crop_type: "Potato",
    crop_variety: "Kufri Jyoti / Kufri Surya",
    sowing_date: "2026-05-20",
    expected_harvest_date: "2026-09-05",
    growth_stage: "Tuber Bulking & Starch Fill",
    days_after_sowing: 68,
    lat: 12.912,
    lng: 76.398,
    resilience_score: 94,
    risk_level: "Low",
  },
  {
    id: "field-tomato-01",
    name: "Kolar Intensive Tunnel — Hybrid Tomato",
    farmer_name: "Ramesh Gowda",
    location: "Kolar District, Karnataka",
    area_hectares: 3.5,
    soil_type: "Loamy soil",
    soil_ph: 6.4,
    nitrogen_ppm: 38.0,
    phosphorus_ppm: 32.0,
    potassium_ppm: 240.0,
    organic_carbon_pct: 0.88,
    water_availability: "Borewell + Micro-Drip",
    irrigation_method: "Precision Drip Fertigation",
    crop_type: "Tomato",
    crop_variety: "Arka Rakshak (F1 Hybrid)",
    sowing_date: "2026-06-01",
    expected_harvest_date: "2026-09-30",
    growth_stage: "Fruiting & Ripening",
    days_after_sowing: 62,
    lat: 13.136,
    lng: 78.134,
    resilience_score: 91,
    risk_level: "Low",
  },
];

// ==================== API FETCHERS ====================

export async function fetchDashboardOverview(fieldId?: string): Promise<DashboardOverview> {
  const url = fieldId
    ? `${API_BASE_URL}/api/dashboard/overview?field_id=${encodeURIComponent(fieldId)}`
    : `${API_BASE_URL}/api/dashboard/overview`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Dashboard overview error");
  return await res.json();
}

export async function fetchFields(): Promise<FieldItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/fields`, { cache: "no-store" });
    if (!res.ok) throw new Error("Fields fetch error");
    return await res.json();
  } catch {
    return FALLBACK_FIELDS;
  }
}

export async function createField(data: Partial<FieldItem>): Promise<FieldItem> {
  const res = await fetch(`${API_BASE_URL}/api/fields`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create field");
  return await res.json();
}

export async function updateField(id: string, data: Partial<FieldItem>): Promise<FieldItem> {
  const res = await fetch(`${API_BASE_URL}/api/fields/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update field");
  return await res.json();
}

export async function deleteField(id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/fields/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete field");
}

export async function fetchTwin3DData(fieldId: string): Promise<Twin3DData> {
  const res = await fetch(`${API_BASE_URL}/api/fields/${fieldId}/twin-3d`, { cache: "no-store" });
  if (!res.ok) throw new Error("3D Twin fetch error");
  return await res.json();
}

export async function fetchMLHealth(fieldId: string): Promise<MLPrediction> {
  const res = await fetch(`${API_BASE_URL}/api/ml/predict-health/${fieldId}`, { cache: "no-store" });
  if (!res.ok) throw new Error("ML prediction error");
  return await res.json();
}

export async function runScenarioSimulation(data: {
  field_id: string;
  preset_name: string;
  temperature_delta_c: number;
  rainfall_delta_percent: number;
  consecutive_dry_days: number;
  heatwave_days: number;
  co2_elevation_ppm: number;
}): Promise<ClimateScenarioResult> {
  const res = await fetch(`${API_BASE_URL}/api/simulation/scenarios`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Scenario simulation error");
  return await res.json();
}

export async function runSimulation(data: {
  plot_id: string;
  temperature_delta_c: number;
  rainfall_delta_percent: number;
  consecutive_dry_days: number;
  heatwave_intensity_days: number;
  co2_elevation_ppm: number;
  [key: string]: unknown;
}): Promise<ClimateSimulationResponse> {
  const res = await runScenarioSimulation({
    field_id: data.plot_id,
    preset_name: "Custom",
    temperature_delta_c: data.temperature_delta_c,
    rainfall_delta_percent: data.rainfall_delta_percent,
    consecutive_dry_days: data.consecutive_dry_days,
    heatwave_days: data.heatwave_intensity_days,
    co2_elevation_ppm: data.co2_elevation_ppm,
  });

  return {
    plot_id: res.field_id,
    crop_name: res.crop_type,
    baseline_yield_t_ha: res.baseline_yield_t_ha,
    projected_yield_t_ha: res.projected_yield_t_ha,
    yield_change_percentage: res.yield_change_percentage,
    water_stress_classification: res.water_stress_level,
    pollination_failure_probability: res.pollination_risk_pct / 100.0,
    economic_impact_estimate_usd: Math.round(res.financial_impact_inr / 83.0),
    trajectory: res.trajectory_14d.map((t) => ({
      day: t.day,
      projected_temp_c: 30 + data.temperature_delta_c,
      projected_soil_moisture: t.soil_moisture_pct,
      crop_stress_index: t.crop_stress_index,
      biomass_accumulation_kg_ha: t.biomass_accumulation_kg,
      evapotranspiration_mm: 4.8,
    })),
    mitigation_strategies: res.recommended_interventions,
    resilience_rating_post_stress: res.resilience_rating_post_scenario,
  };
}

export async function fetchIrrigationDecision(fieldId: string): Promise<IrrigationDecision> {
  const res = await fetch(`${API_BASE_URL}/api/irrigation/decision/${fieldId}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Irrigation decision error");
  return await res.json();
}

export async function applyIrrigation(fieldId: string, choice: string): Promise<{ status: string; message: string; new_root_moisture_pct: number }> {
  const res = await fetch(`${API_BASE_URL}/api/irrigation/apply`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ field_id: fieldId, action_choice: choice }),
  });
  if (!res.ok) throw new Error("Apply irrigation error");
  return await res.json();
}

export async function fetchAlerts(): Promise<AlertItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/alerts`, { cache: "no-store" });
    if (!res.ok) throw new Error("Alerts error");
    return await res.json();
  } catch {
    return [];
  }
}

export async function acknowledgeAlert(alertId: number): Promise<void> {
  await fetch(`${API_BASE_URL}/api/alerts/${alertId}/acknowledge`, { method: "POST" });
}

export async function sendAdvisorMessage(
  message: string,
  fieldId?: string,
  language: string = "en",
  conversationHistory?: Array<{ role: string; content: string }>,
  sessionId?: string
): Promise<{ reply: string; suggested_actions: string[]; timestamp: string }> {
  const res = await fetch(`${API_BASE_URL}/api/advisor/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      field_id: fieldId,
      language,
      conversation_history: conversationHistory,
      session_id: sessionId,
    }),
  });
  if (!res.ok) throw new Error("Advisor response error");
  return await res.json();
}

export async function sendCopilotChat(
  message: string,
  plotId?: string,
  conversationHistory?: Array<{ role: string; content: string }>
): Promise<{ reply: string; suggested_actions: string[]; alert_detected?: string; timestamp: string }> {
  const res = await sendAdvisorMessage(message, plotId, "en", conversationHistory);
  return {
    reply: res.reply,
    suggested_actions: res.suggested_actions,
    timestamp: res.timestamp,
  };
}

export async function fetchSoilAnalysis(fieldId: string): Promise<SoilHealthAnalysis> {
  const res = await fetch(`${API_BASE_URL}/api/soil/analysis/${fieldId}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Soil analysis error");
  return await res.json();
}

export async function fetchCropGrowth(fieldId: string): Promise<CropGrowthCalendar> {
  const res = await fetch(`${API_BASE_URL}/api/crop-growth/${fieldId}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Crop growth error");
  return await res.json();
}

export async function fetchEconomics(fieldId: string): Promise<EconomicsData> {
  const res = await fetch(`${API_BASE_URL}/api/economics/${fieldId}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Economics error");
  return await res.json();
}

export async function fetchHistory(fieldId: string): Promise<Array<{ date: string; ambient_temp_c: number; root_moisture_pct: number; rainfall_mm: number; vpd_kpa: number; stress_index: number }>> {
  const res = await fetch(`${API_BASE_URL}/api/analytics/history/${fieldId}`, { cache: "no-store" });
  if (!res.ok) throw new Error("History error");
  const data = await res.json();
  return data.history;
}

export function getExportCSVUrl(fieldId: string): string {
  return `${API_BASE_URL}/api/analytics/export-csv/${fieldId}`;
}

export async function fetchExperiments(): Promise<ResearchExperiment[]> {
  const res = await fetch(`${API_BASE_URL}/api/research/experiments`, { cache: "no-store" });
  if (!res.ok) throw new Error("Experiments error");
  return await res.json();
}

export async function logExperiment(data: { title: string; field_id: string; crop: string; scenario_name: string; notes: string }): Promise<ResearchExperiment> {
  const res = await fetch(`${API_BASE_URL}/api/research/experiments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Log experiment error");
  return await res.json();
}

export async function fetchGapAnalysis(): Promise<{ title: string; existing_limitations: string[]; proposed_contributions: string[]; future_iot_roadmap: string[] }> {
  const res = await fetch(`${API_BASE_URL}/api/research/gap-analysis`, { cache: "no-store" });
  if (!res.ok) throw new Error("Gap analysis error");
  return await res.json();
}

export async function fetchKarnatakaCrops(): Promise<{
  region: string;
  supported_crops: Array<{ name: string; varieties: string[]; soil_match: string[]; season: string }>;
  soil_types: string[];
}> {
  const res = await fetch(`${API_BASE_URL}/api/config/karnataka-crops`, { cache: "no-store" });
  if (!res.ok) throw new Error("Karnataka crops error");
  return await res.json();
}

export async function fetchPrescriptions(fieldId?: string): Promise<PrescriptionPlan[]> {
  return [
    {
      plot_id: fieldId || "field-ragi-01",
      plot_name: "North Terraces — Ragi",
      crop_name: "Ragi (Finger Millet)",
      current_moisture_root_zone: 28.2,
      target_moisture_root_zone: 32.0,
      generated_at: "Live Twin Sync",
      actions: [
        {
          action_type: "Irrigation",
          title: "Micro-Sprinkler Precision Dosing",
          urgency: "Immediate",
          details: "Deliver 14,000 L/ha pulse between 04:30 and 06:30 pre-dawn to buffer root turgor.",
          water_volume_liters_per_ha: 14000,
          efficiency_gain: "+28% retention",
        },
      ],
      water_savings_estimated_percent: 32.0,
      carbon_offset_kg: 185.0,
    },
  ];
}

export async function fetchResilienceAudit(): Promise<ResilienceAuditReport | null> {
  return {
    farm_name: "Kaveri Basin Eco-Agro Farm",
    overall_resilience_index: 84,
    assessment_date: "2026-11-05",
    high_risk_zones_count: 1,
    water_stress_vulnerability: "Elevated in Horticultural Tunnel Tomatoes under high daytime VPD",
    heatwave_readiness: "High buffering capacity for Ragi ML-365 and Lowland Paddy",
    soil_carbon_retention: "Strong organic carbon retention (0.85% average across red loam profiles)",
    key_recommendations: [
      "Deploy Kaolin clay or potassium silicate foliar spray prior to expected heatwaves.",
      "Maintain AWD alternate wetting and drying in paddy fields to save 25% water.",
      "Incorporate sugarcane residue mulch to conserve 35% soil moisture."
    ],
    zone_summaries: [
      {
        plot_id: "field-ragi-01",
        name: "North Terraces — Ragi",
        crop: "Ragi (Finger Millet)",
        resilience_score: 88,
        risk_level: "Low",
        cwsi: 0.18,
        topsoil_moisture: 24.5,
        root_moisture: 28.2,
      },
    ],
  };
}

export async function fetchTimeline(fieldId?: string): Promise<{ plot_id: string; plot_name: string; timeline: TimelinePoint[] }> {
  return {
    plot_id: fieldId || "field-ragi-01",
    plot_name: "North Terraces",
    timeline: [
      { date: "Oct 31", phase: "Historical", temp_c: 28.2, soil_moisture_pct: 32.0, rain_mm: 0, vpd_kpa: 1.4, stress_index: 0.15 },
      { date: "Nov 01", phase: "Historical", temp_c: 28.5, soil_moisture_pct: 31.0, rain_mm: 4.2, vpd_kpa: 1.3, stress_index: 0.14 },
      { date: "Nov 02", phase: "Historical", temp_c: 29.0, soil_moisture_pct: 29.5, rain_mm: 0, vpd_kpa: 1.5, stress_index: 0.18 },
      { date: "Nov 03", phase: "Historical", temp_c: 29.8, soil_moisture_pct: 28.8, rain_mm: 0, vpd_kpa: 1.6, stress_index: 0.20 },
      { date: "Nov 04", phase: "Historical", temp_c: 30.2, soil_moisture_pct: 28.2, rain_mm: 0, vpd_kpa: 1.65, stress_index: 0.22 },
      { date: "Nov 05 (Today)", phase: "Live Twin", temp_c: 29.8, soil_moisture_pct: 28.2, rain_mm: 0, vpd_kpa: 1.65, stress_index: 0.22 },
      { date: "Nov 06", phase: "Forecast", temp_c: 31.0, soil_moisture_pct: 26.5, rain_mm: 0, vpd_kpa: 1.8, stress_index: 0.28 },
      { date: "Nov 07", phase: "Forecast", temp_c: 32.5, soil_moisture_pct: 24.8, rain_mm: 0, vpd_kpa: 2.1, stress_index: 0.35 },
      { date: "Nov 08", phase: "Forecast", temp_c: 33.0, soil_moisture_pct: 23.0, rain_mm: 0, vpd_kpa: 2.3, stress_index: 0.42 },
      { date: "Nov 09", phase: "Forecast", temp_c: 32.0, soil_moisture_pct: 22.0, rain_mm: 8.5, vpd_kpa: 1.7, stress_index: 0.30 },
      { date: "Nov 10", phase: "Forecast", temp_c: 30.5, soil_moisture_pct: 26.0, rain_mm: 0, vpd_kpa: 1.5, stress_index: 0.22 },
      { date: "Nov 11", phase: "Forecast", temp_c: 30.0, soil_moisture_pct: 25.2, rain_mm: 0, vpd_kpa: 1.55, stress_index: 0.24 },
      { date: "Nov 12", phase: "Forecast", temp_c: 30.8, soil_moisture_pct: 24.4, rain_mm: 0, vpd_kpa: 1.62, stress_index: 0.26 },
    ],
  };
}


// ==================== ENTERPRISE AUTH & SECURITY TYPES & APIS ====================

export interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  mobile?: string;
  role: "Farmer" | "Agronomist" | "Farm Admin" | "Platform Admin";
  is_active: boolean;
}

export interface AuthLoginResponse {
  access_token: string;
  token_type: string;
  role: "Farmer" | "Agronomist" | "Farm Admin" | "Platform Admin";
  user_id: string;
  full_name: string;
  mobile: string;
  email?: string;
}

export interface SecurityAlert {
  id: number;
  event_type: string;
  severity: "info" | "warning" | "suspicious" | "critical";
  description: string;
  ip_address: string;
  is_resolved: boolean;
  timestamp: string;
}

export interface SecurityStats {
  threat_level: "LOW" | "ELEVATED" | "CRITICAL";
  security_score: number;
  failed_logins_24h: number;
  total_events: number;
  unresolved_critical_alerts: number;
  encryption_standard: string;
  firewall_status: string;
  active_sessions: number;
}

export interface LiveTelemetryResponse {
  field_id: string;
  crop_type: string;
  growth_stage: string;
  live_timestamp: string;
  live_telemetry: {
    ambient_temp_c: number;
    humidity_pct: number;
    vpd_kpa: number;
    solar_radiation_wm2: number;
    wind_speed_kmh: number;
    rainfall_last_hr_mm: number;
    soil_moisture_10cm: number;
    soil_moisture_30cm_root: number;
    soil_moisture_60cm_reserve: number;
    et0_penman_monteith_mm_day: number;
  };
  irrigation_status: {
    valve_state: string;
    flow_rate_l_min: number;
    system_pressure_bar: number;
  };
  crop_health_live: {
    health_index: number;
    status: string;
    transpiration_mmol_m2s: number;
  };
  provenance_metadata: {
    data_mode: string;
    model: string;
    update_interval_sec: number;
    iot_gateway_simulation: string;
  };
}

export interface DistrictInfo {
  name: string;
  lat: number;
  lng: number;
  elevation_m: number;
  primary_crops: string[];
}

export interface StateDistricts {
  name: string;
  districts: DistrictInfo[];
}

export async function loginUser(email: string, password: string): Promise<AuthLoginResponse> {
  const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: "Login failed" }));
    throw new Error(errorData.detail || "Authentication error");
  }
  const data = await res.json();
  return {
    access_token: data.access_token,
    token_type: data.token_type || "bearer",
    role: (data.user?.role || data.role || "Farmer") as any,
    user_id: data.user?.id || data.user_id || "usr-01",
    full_name: data.user?.name || data.user?.full_name || data.full_name || "Farm User",
    mobile: data.user?.mobile || data.mobile || "+91 98451 23456",
    email: data.user?.email || data.email || email,
  };
}

export async function registerUser(data: {
  email: string;
  password: string;
  full_name: string;
  mobile: string;
  role: string;
}): Promise<AuthLoginResponse> {
  const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: "Registration failed" }));
    throw new Error(errorData.detail || "Registration error");
  }
  const resData = await res.json();
  return {
    access_token: resData.access_token,
    token_type: resData.token_type || "bearer",
    role: (resData.user?.role || resData.role || data.role || "Farmer") as any,
    user_id: resData.user?.id || resData.user_id || "usr-new",
    full_name: resData.user?.name || resData.user?.full_name || data.full_name,
    mobile: resData.user?.mobile || data.mobile,
    email: resData.user?.email || data.email,
  };
}

export async function forgotPassword(
  email: string,
  newPassword?: string
): Promise<{ status: string; message: string; account_verified?: boolean }> {
  const res = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, new_password: newPassword }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: "Password reset failed" }));
    throw new Error(errorData.detail || "Password reset error");
  }
  return await res.json();
}

export async function fetchCurrentUser(token: string): Promise<AuthUser> {
  const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Invalid session token");
  return await res.json();
}

export async function fetchSecurityAlerts(token?: string): Promise<SecurityAlert[]> {
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE_URL}/api/security/alerts`, { headers, cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch security alerts");
  return await res.json();
}

export async function fetchSecurityStats(token?: string): Promise<SecurityStats> {
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE_URL}/api/security/stats`, { headers, cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch security stats");
  return await res.json();
}

export async function simulateSecurityAlert(
  data: { event_type: string; severity: string; description: string; ip_address?: string },
  token?: string
): Promise<{ status: string; event_id: number }> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE_URL}/api/security/simulate-event`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to simulate security event");
  return await res.json();
}

export async function updateFieldGeospatialLocation(
  fieldId: string,
  data: {
    lat?: number;
    lng?: number;
    state?: string;
    district?: string;
    village?: string;
    elevation_m?: number;
    boundary_geojson?: any;
  }
): Promise<{ message: string; field_id: string; location: string; lat: number; lng: number }> {
  const res = await fetch(`${API_BASE_URL}/api/fields/${fieldId}/location`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update field geospatial coordinates");
  return await res.json();
}

export async function fetchGeospatialDistricts(): Promise<{ states: StateDistricts[] }> {
  const res = await fetch(`${API_BASE_URL}/api/geospatial/districts`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch districts");
  return await res.json();
}

export async function fetchLiveTelemetry(fieldId: string): Promise<LiveTelemetryResponse> {
  const res = await fetch(`${API_BASE_URL}/api/demo/live-stream/${fieldId}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch live telemetry stream");
  return await res.json();
}


// ==================== ENTERPRISE 3.0 API CLIENT METHODS ====================

export interface CropRecommendation {
  crop_name: string;
  scientific_name: string;
  suitability_score: number;
  soil_compatibility: string;
  water_requirement: string;
  ideal_temperature: string;
  cultivation_duration_days: number;
  estimated_harvest_window: string;
  seed_requirement_per_ha: string;
  fertilizer_schedule_npk: string;
  expected_yield_t_ha: number;
  expected_yield_total_t: number;
  estimated_cost_inr: number;
  expected_revenue_inr: number;
  estimated_net_profit_inr: number;
  main_risks: string[];
  recommendation_reasons: string[];
  nutrition_highlights: {
    protein_g: number;
    dietary_fiber_g: number;
    calcium_mg: number;
    glycemic_index: number;
  };
}

export interface DiseaseDiagnosisResult {
  crop_type: string;
  diagnosis_timestamp: string;
  primary_detected_disease: string;
  causal_pathogen: string;
  diagnostic_confidence_pct: number;
  affected_leaf_area_pct: number;
  severity_grade: "Low" | "Moderate" | "High" | "Critical";
  symptoms_identified: string;
  curative_protocol: string;
  preventive_measures: string;
  secondary_vulnerabilities: string[];
  provenance: {
    authority: string;
    diagnostic_model: string;
    validation_status: string;
  };
}

export interface MarketCommodityItem {
  commodity: string;
  benchmark_mandi: string;
  modal_price_qtl: number;
  historical_range_qtl: [number, number];
  daily_arrivals_tonnes: number;
  seasonality: string;
  festivals: string[];
  provenance: string;
}

export interface MarketForecastResponse {
  commodity: string;
  benchmark_mandi: string;
  current_modal_price_qtl: number;
  last_updated: string;
  data_provenance: string;
  historical_observations: Array<{
    date: string;
    modal_price: number;
    min_price: number;
    max_price: number;
    arrivals_tonnes: number;
    status: string;
  }>;
  price_forecasts: Array<{
    horizon_days: number;
    target_date: string;
    predicted_modal_price: number;
    range_low: number;
    range_high: number;
    price_change_pct: number;
    expected_movement: string;
    confidence_score: number;
    status: string;
  }>;
  market_drivers: Array<{
    category: string;
    impact: string;
    detail: string;
  }>;
  model_metadata: {
    algorithm: string;
    mae: number;
    rmse: number;
    directional_accuracy_pct: number;
    validation_strategy: string;
  };
}

export interface SellAdvisorResponse {
  commodity: string;
  quantity_quintals: number;
  holding_period_days: number;
  spot_price_per_qtl: number;
  forecasted_future_price_per_qtl: number;
  recommended_action: string;
  action_code: "SELL_NOW" | "HOLD" | "PARTIAL_SALE";
  rationale: string;
  financial_breakdown: {
    sell_now: {
      gross_revenue_inr: number;
      apmc_cess_inr: number;
      transport_inr: number;
      net_realization_inr: number;
    };
    hold_and_sell_later: {
      usable_quantity_after_spoilage_qtl: number;
      gross_revenue_inr: number;
      storage_cost_inr: number;
      spoilage_loss_pct: number;
      transport_inr: number;
      net_realization_inr: number;
    };
    net_gain_loss_inr: number;
    gain_loss_pct: number;
  };
  disclaimer: string;
}

export interface MultiCropPortfolioItem {
  commodity: string;
  display_name: string;
  benchmark_mandi: string;
  current_modal_price_qtl: number;
  price_per_kg: number;
  historical_range_qtl: [number, number];
  daily_arrivals_tonnes: number;
  delta_24h_inr: number;
  delta_24h_pct: number;
  delta_trend: "UP" | "DOWN" | "STABLE";
  custom_holding_days: number;
  forecasted_price_qtl: number;
  expected_price_range: [number, number];
  break_even_price_qtl: number;
  storage_cost_inr: number;
  spoilage_loss_pct: number;
  usable_quantity_qtl: number;
  net_gain_loss_inr: number;
  gain_loss_pct: number;
  is_profit: boolean;
  verdict: string;
  recommended_action: string;
  rationale: string;
  sell_now_net_inr: number;
  hold_later_net_inr: number;
  quality_grade: string;
  storage_suitability: string;
}

export interface MultiCropPortfolioResponse {
  status: string;
  as_of_date: string;
  holding_period_days: number;
  quantity_per_crop_qtl: number;
  storage_type: string;
  total_crops_monitored: number;
  crops: MultiCropPortfolioItem[];
  portfolio_summary: {
    total_spot_net_inr: number;
    total_future_net_inr: number;
    total_storage_cost_inr: number;
    net_gain_loss_inr: number;
    gain_loss_pct: number;
    is_profit: boolean;
    overall_verdict: string;
    crops_to_hold: string[];
    crops_to_sell_now: string[];
  };
}

export interface NearbyMandiItem {
  mandi_name: string;
  distance_km: number;
  modal_price_per_qtl: number;
  estimated_freight_per_qtl: number;
  mandi_cess_pct: number;
  daily_arrivals_tonnes: number;
  net_realization_per_qtl: number;
  is_recommended: boolean;
}

export interface NutritionProfileResponse {
  crop_name: string;
  scientific_name: string;
  nutritional_composition_per_100g: {
    protein_g: number;
    carbohydrates_g: number;
    dietary_fiber_g: number;
    fat_g: number;
    iron_mg: number;
    calcium_mg: number;
    potassium_mg: number;
    vitamin_c_mg: number;
    glycemic_index: number;
  };
  soil_nutrient_correlation: {
    nitrogen_soil_impact: string;
    phosphorus_soil_impact: string;
    potassium_soil_impact: string;
    calcium_enrichment: string;
  };
  scientific_integrity_disclaimer: string;
  provenance_label: string;
}

export interface EconomicsCalculationResponse {
  crop_name: string;
  area_hectares: number;
  area_acres: number;
  yield_parameters: {
    expected_yield_t_ha: number;
    total_yield_tonnes: number;
    total_yield_quintals: number;
  };
  price_parameters: {
    selling_price_per_ton_inr: number;
    selling_price_per_qtl_inr: number;
  };
  itemized_expenses_inr: {
    seed_planting_material: number;
    fertilizer_nutrients: number;
    plant_protection_pesticides: number;
    field_labour: number;
    irrigation_and_power: number;
    machinery_and_tractor: number;
    harvesting_expenses: number;
    packaging_and_gunny_bags: number;
    storage_charges: number;
    freight_transport: number;
    mandi_cess_and_commission: number;
  };
  summary: {
    total_cultivation_cost_inr: number;
    gross_revenue_inr: number;
    net_profit_inr: number;
    profit_per_hectare_inr: number;
    profit_per_acre_inr: number;
    cost_per_hectare_inr: number;
    breakeven_price_per_qtl_inr: number;
    breakeven_price_per_ton_inr: number;
    return_on_investment_pct: number;
  };
  scenarios: {
    optimistic: { label: string; gross_revenue_inr: number; net_profit_inr: number; profit_per_acre_inr: number };
    expected: { label: string; gross_revenue_inr: number; net_profit_inr: number; profit_per_acre_inr: number };
    pessimistic: { label: string; gross_revenue_inr: number; net_profit_inr: number; profit_per_acre_inr: number };
  };
  traceable_formula: string;
}

export async function fetchCropRecommendations(params: {
  soil_type?: string;
  soil_ph?: number;
  nitrogen_ppm?: number;
  phosphorus_ppm?: number;
  potassium_ppm?: number;
  organic_carbon_pct?: number;
  water_availability?: string;
  area_hectares?: number;
  budget_inr?: number;
  preferred_duration_days?: number;
}): Promise<{ recommendations: CropRecommendation[]; methodology: string; provenance_status: string }> {
  const res = await fetch(`${API_BASE_URL}/api/crops/recommend`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error("Failed to fetch crop recommendations");
  return await res.json();
}

export async function fetchDiseaseDiagnosis(
  cropType: string,
  symptom?: string
): Promise<DiseaseDiagnosisResult> {
  const url = new URL(`${API_BASE_URL}/api/crops/disease-diagnosis/${encodeURIComponent(cropType)}`);
  if (symptom) url.searchParams.set("symptom", symptom);
  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to diagnose crop health symptoms");
  return await res.json();
}

export interface ImageAnalysisResult {
  status: string;
  analysis_id: string;
  timestamp: string;
  crop_type: string;
  filename: string;
  detected_condition: string;
  causal_pathogen: string;
  confidence_score: number;
  severity: "Mild" | "Moderate" | "High" | "Critical" | string;
  affected_leaf_area_pct: number;
  visual_features_identified: string[];
  explanation: string;
  recommended_treatment: string;
  preventive_measures: string;
  ai_vision_model: string;
  laboratory_disclaimer: string;
}

export async function analyzeCropImageFile(
  cropType: string,
  filename: string,
  imageBase64?: string,
  notes?: string
): Promise<ImageAnalysisResult> {
  const res = await fetch(`${API_BASE_URL}/api/crop-health/analyze-image`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      crop_type: cropType,
      filename,
      image_base64: imageBase64,
      notes,
    }),
  });
  if (!res.ok) throw new Error("Failed to analyze crop image");
  return await res.json();
}

export async function fetchMarketOverview(): Promise<{ commodities: MarketCommodityItem[]; data_status: string }> {
  const res = await fetch(`${API_BASE_URL}/api/market/overview`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch market overview");
  return await res.json();
}

export async function fetchMarketForecast(commodity: string): Promise<MarketForecastResponse> {
  const res = await fetch(`${API_BASE_URL}/api/market/forecast/${encodeURIComponent(commodity)}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch market forecast");
  return await res.json();
}

export async function fetchSellAdvisor(params: {
  commodity: string;
  quantity_qtl: number;
  holding_period_days: number;
  storage_type?: string;
  transport_distance_km?: number;
}): Promise<SellAdvisorResponse> {
  const res = await fetch(`${API_BASE_URL}/api/market/sell-advisor`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error("Failed to evaluate sell vs wait strategy");
  return await res.json();
}

export async function fetchNearbyMandis(
  commodity: string,
  district: string = "Mandya"
): Promise<{ markets: NearbyMandiItem[]; net_realization_formula: string }> {
  const url = new URL(`${API_BASE_URL}/api/market/compare-mandis`);
  url.searchParams.set("commodity", commodity);
  url.searchParams.set("district", district);
  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to compare nearby mandis");
  return await res.json();
}

export async function fetchMultiCropPortfolio(params?: {
  holding_days?: number;
  quantity_qtl?: number;
  storage_type?: string;
  crops?: string[];
}): Promise<MultiCropPortfolioResponse> {
  const url = new URL(`${API_BASE_URL}/api/market/multi-crop-portfolio`);
  if (params?.holding_days) url.searchParams.set("holding_days", params.holding_days.toString());
  if (params?.quantity_qtl) url.searchParams.set("quantity_qtl", params.quantity_qtl.toString());
  if (params?.storage_type) url.searchParams.set("storage_type", params.storage_type);
  if (params?.crops && params.crops.length > 0) url.searchParams.set("crops", params.crops.join(","));
  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch multi-crop portfolio");
  return await res.json();
}

export async function fetchSoilNutritionProfile(cropName: string): Promise<NutritionProfileResponse> {
  const res = await fetch(`${API_BASE_URL}/api/nutrition/profile/${encodeURIComponent(cropName)}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch nutrition profile");
  return await res.json();
}

export async function calculateEconomics(params: any): Promise<EconomicsCalculationResponse> {
  const res = await fetch(`${API_BASE_URL}/api/economics/calculate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error("Failed to calculate economics");
  return await res.json();
}

// ==================== MULTILINGUAL AI VOICE AGRONOMIST API ====================

export interface VoiceLanguage {
  code: string;
  name: string;
  native: string;
  bcp47: string;
  voice_code: string;
}

export interface VoiceAgronomistRequest {
  message: string;
  language: string;
  plot_id?: string;
  field_id?: string;
  user_name?: string;
  crop_override?: string;
  conversation_history?: Array<{ role: string; content: string }>;
  session_id?: string;
}

export interface VoiceAgronomistResponse {
  query: string;
  language: string;
  language_name: string;
  reply: string;
  spoken_summary: string;
  suggested_actions: string[];
  alert?: string | null;
  data_source: string;
  field_snapshot: Record<string, any>;
  timestamp: string;
}

export interface VoiceTTSRequest {
  text: string;
  language: string;
  speed?: number;
}

export interface VoiceTTSResponse {
  audio_base64: string;
  content_type: string;
  language: string;
  cached?: boolean;
}

export interface SpokenAlertsResponse {
  language: string;
  alerts: string[];
  spoken_script: string;
  count: number;
}

export async function fetchVoiceLanguages(): Promise<{ languages: VoiceLanguage[] }> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/voice-agronomist/languages`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch voice languages");
    return await res.json();
  } catch {
    return {
      languages: [
        { code: "kn", name: "Kannada", native: "ಕನ್ನಡ", bcp47: "kn-IN", voice_code: "kn" },
        { code: "en", name: "English", native: "English", bcp47: "en-IN", voice_code: "en" },
        { code: "hi", name: "Hindi", native: "हिन्दी", bcp47: "hi-IN", voice_code: "hi" },
        { code: "ta", name: "Tamil", native: "தமிழ்", bcp47: "ta-IN", voice_code: "ta" },
        { code: "te", name: "Telugu", native: "తెలుగు", bcp47: "te-IN", voice_code: "te" },
        { code: "ml", name: "Malayalam", native: "മലയാളം", bcp47: "ml-IN", voice_code: "ml" },
        { code: "mr", name: "Marathi", native: "मराठी", bcp47: "mr-IN", voice_code: "mr" },
        { code: "bn", name: "Bengali", native: "বাংলা", bcp47: "bn-IN", voice_code: "bn" },
        { code: "pa", name: "Punjabi", native: "ਪੰਜਾਬੀ", bcp47: "pa-IN", voice_code: "pa" },
      ],
    };
  }
}

export async function sendVoiceAgronomistMessage(
  req: VoiceAgronomistRequest
): Promise<VoiceAgronomistResponse> {
  const res = await fetch(`${API_BASE_URL}/api/voice-agronomist/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
  if (!res.ok) throw new Error("Voice Agronomist query failed");
  return await res.json();
}

export async function synthesizeVoiceSpeech(
  req: VoiceTTSRequest
): Promise<VoiceTTSResponse> {
  const res = await fetch(`${API_BASE_URL}/api/voice-agronomist/tts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
  if (!res.ok) throw new Error("Voice speech synthesis failed");
  return await res.json();
}

export async function fetchSpokenAlerts(lang: string = "kn", fieldId?: string): Promise<SpokenAlertsResponse> {
  const url = new URL(`${API_BASE_URL}/api/voice-agronomist/spoken-alerts`);
  url.searchParams.set("language", lang);
  if (fieldId) {
    url.searchParams.set("field_id", fieldId);
  }
  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch spoken alerts");
  return await res.json();
}

// ==================== VEGETABLE INTELLIGENCE & HORTICULTURE API ====================

export interface VegetableGrowthStage {
  stage: number;
  name: string;
  days: string;
  desc: string;
}

export interface VegetableDetail {
  name: string;
  scientific_name: string;
  family: string;
  growth_duration_days: number;
  suitable_soil: string;
  ideal_temp_c: [number, number];
  ideal_ph: [number, number];
  water_req_mm: number;
  drought_tolerance: string;
  suitable_climate: string;
  nutrient_requirements_npk: [number, number, number];
  fertilizer_recommendations: string;
  irrigation_recommendations: string;
  common_diseases: string[];
  growth_stages: VegetableGrowthStage[];
  harvesting_info: string;
  market_price_info: string;
  current_modal_price_qtl: number;
  benchmark_mandi: string;
  storage_recommendations: string;
  image_url: string;
  avg_yield_t_ha: number;
  nutrition: {
    protein_g: number;
    dietary_fiber_g: number;
    carbs_g: number;
    fat_g: number;
    iron_mg: number;
    calcium_mg: number;
    potassium_mg: number;
    vitamin_c_mg: number;
    beta_carotene_ug?: number;
    betalains_mg?: number;
    glycemic_index: number;
  };
}

export async function fetchVegetables(): Promise<{ count: number; vegetables: VegetableDetail[] }> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/vegetables`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch vegetables list");
    return await res.json();
  } catch (err) {
    console.error("fetchVegetables error, falling back:", err);
    return {
      count: 3,
      vegetables: [
        {
          name: "Carrot",
          scientific_name: "Daucus carota subsp. sativus",
          family: "Apiaceae",
          growth_duration_days: 95,
          suitable_soil: "Sandy loam, Deep friable silt loam",
          ideal_temp_c: [16, 24],
          ideal_ph: [6.0, 6.8],
          water_req_mm: 450,
          drought_tolerance: "Low to Moderate",
          suitable_climate: "Cool temperate to subtropical with low humidity",
          nutrient_requirements_npk: [80, 60, 100],
          fertilizer_recommendations: "Basal 50% N + 100% P2O5 + 50% K2O. Split remaining N and K at 30 & 45 DAS. Foliar Borax 0.2% at 35 DAS.",
          irrigation_recommendations: "Light sprinkler at emergence. Inline drip (3.5-4.0 mm/day). Maintain uniform moisture to prevent root splitting.",
          common_diseases: ["Cavity Spot", "Carrot Rust Fly", "Powdery Mildew", "Root Forking & Splitting"],
          growth_stages: [
            { stage: 1, name: "Germination & Emergence", days: "0-10 DAS", desc: "Fine feathery cotyledon leaves emerge" },
            { stage: 2, name: "True Leaf Rosette", days: "11-25 DAS", desc: "3-5 bipinnate leaves expand" },
            { stage: 3, name: "Taproot Elongation", days: "26-45 DAS", desc: "Slender taproot penetrates to full depth" },
            { stage: 4, name: "Root Swelling & Pigmentation", days: "46-75 DAS", desc: "Rapid root thickening and carotene synthesis" },
            { stage: 5, name: "Maturity & Harvest", days: "76-95 DAS", desc: "Shoulder reaches 3.5-4.5 cm with rounded tip" },
          ],
          harvesting_info: "Harvest when root shoulder reaches 3-4 cm diameter. Irrigate lightly 24h prior, pull gently by crown.",
          market_price_info: "APMC Bengaluru modal price ₹2,800/qtl (₹28/kg). Range ₹24-36/kg.",
          current_modal_price_qtl: 2800,
          benchmark_mandi: "Bengaluru APMC (Yeshwanthpur)",
          storage_recommendations: "Hydro-cool to 4°C. Store at 0-1°C with 95-98% RH. Shelf life 4-5 months.",
          image_url: "/images/vegetables/carrot.svg",
          avg_yield_t_ha: 25.0,
          nutrition: {
            protein_g: 0.9,
            dietary_fiber_g: 2.8,
            carbs_g: 9.6,
            fat_g: 0.2,
            iron_mg: 0.3,
            calcium_mg: 33.0,
            potassium_mg: 320.0,
            vitamin_c_mg: 5.9,
            beta_carotene_ug: 8285.0,
            glycemic_index: 39.0,
          },
        },
        {
          name: "Beetroot",
          scientific_name: "Beta vulgaris subsp. vulgaris",
          family: "Amaranthaceae",
          growth_duration_days: 75,
          suitable_soil: "Well-drained loam, Sandy clay loam",
          ideal_temp_c: [18, 25],
          ideal_ph: [6.5, 7.5],
          water_req_mm: 380,
          drought_tolerance: "Moderate",
          suitable_climate: "Cool winter crop; performs well in mild tropical winters",
          nutrient_requirements_npk: [70, 50, 70],
          fertilizer_recommendations: "20 t/ha FYM basal. Apply 10 kg/ha Borax at land prep to avoid internal black spot. Top dress N at 30 DAS.",
          irrigation_recommendations: "Irrigate every 4-6 days. Avoid water stress during bulb enlargement (35-60 DAS) to prevent zoning rings.",
          common_diseases: ["Cercospora Leaf Spot", "Heart Rot / Internal Black Spot", "Root Knot Nematode"],
          growth_stages: [
            { stage: 1, name: "Sprouting", days: "0-8 DAS", desc: "Multi-germ seed clusters sprout" },
            { stage: 2, name: "Vegetative Foliage", days: "9-25 DAS", desc: "Red-veined dark green leaves develop" },
            { stage: 3, name: "Hypocotyl Bulbing", days: "26-50 DAS", desc: "Bulb enlarges, betalain pigments synthesize" },
            { stage: 4, name: "Bulb Maturation", days: "51-68 DAS", desc: "Bulb attains 5-7 cm diameter, crown rises above soil" },
            { stage: 5, name: "Harvest", days: "69-75 DAS", desc: "Prime sweetness and tenderness reached" },
          ],
          harvesting_info: "Pull when bulb reaches 5-7 cm diameter and protrudes 2 cm above soil line. Twist off leaves leaving 2 cm petiole.",
          market_price_info: "Mysuru / Mandya APMC modal price ₹2,200/qtl (₹22/kg). Strong urban salad demand.",
          current_modal_price_qtl: 2200,
          benchmark_mandi: "Mysuru APMC (Bandipalya)",
          storage_recommendations: "Store at 0-2°C with 95% RH. Shelf life 2-3 months with intact skins.",
          image_url: "/images/vegetables/beetroot.svg",
          avg_yield_t_ha: 22.0,
          nutrition: {
            protein_g: 1.6,
            dietary_fiber_g: 2.8,
            carbs_g: 9.6,
            fat_g: 0.2,
            iron_mg: 0.8,
            calcium_mg: 16.0,
            potassium_mg: 325.0,
            vitamin_c_mg: 4.9,
            betalains_mg: 120.0,
            glycemic_index: 64.0,
          },
        },
        {
          name: "Potato",
          scientific_name: "Solanum tuberosum",
          family: "Solanaceae",
          growth_duration_days: 105,
          suitable_soil: "Well-aerated sandy loam, Rich alluvial loam",
          ideal_temp_c: [15, 22],
          ideal_ph: [5.2, 6.4],
          water_req_mm: 500,
          drought_tolerance: "Low",
          suitable_climate: "Temperate to subtropical; tuberization requires cool night temperatures (15-18°C)",
          nutrient_requirements_npk: [150, 100, 150],
          fertilizer_recommendations: "Apply 30 t/ha FYM. Basal: 50% N + 100% P + 50% K. Side-dress 50% N at earthing-up (30-35 DAS).",
          irrigation_recommendations: "Ridge and furrow irrigation every 5-7 days. Critical at stolon formation and tuber bulking. Cease 10 days before haulm cutting.",
          common_diseases: ["Late Blight (Phytophthora infestans)", "Early Blight (Alternaria solani)", "Bacterial Wilt / Brown Rot", "Potato Leafroll Virus"],
          growth_stages: [
            { stage: 1, name: "Sprout Development", days: "0-15 DAS", desc: "Sprouts emerge from seed tuber eyes" },
            { stage: 2, name: "Vegetative Growth", days: "16-35 DAS", desc: "Stems, compound leaves and stolons branch out" },
            { stage: 3, name: "Tuber Initiation", days: "36-50 DAS", desc: "Stolon tips swell to form tubers; earthing-up needed" },
            { stage: 4, name: "Tuber Bulking", days: "51-85 DAS", desc: "Tubers accumulate starch rapidly; high water/K demand" },
            { stage: 5, name: "Maturity & Skin Setting", days: "86-105 DAS", desc: "Haulm cutting done; tuber skin hardens for storage" },
          ],
          harvesting_info: "Dehaulm (cut foliage) 10-12 days before harvest to harden periderm. Dig gently with potato digger to avoid cut tubers.",
          market_price_info: "Hassan / Kolar APMC modal price ₹1,850/qtl (₹18.5/kg). Table & processing grades.",
          current_modal_price_qtl: 1850,
          benchmark_mandi: "Hassan APMC (Channarayapatna)",
          storage_recommendations: "Cure at 15°C & 90% RH for 10 days to heal wounds. Cold store table potatoes at 8-10°C with CIPC sprout suppressant. Seed potatoes at 2-4°C.",
          image_url: "/images/vegetables/potato.svg",
          avg_yield_t_ha: 30.0,
          nutrition: {
            protein_g: 2.0,
            dietary_fiber_g: 2.2,
            carbs_g: 17.5,
            fat_g: 0.1,
            iron_mg: 0.8,
            calcium_mg: 12.0,
            potassium_mg: 421.0,
            vitamin_c_mg: 19.7,
            glycemic_index: 82.0,
          },
        },
      ],
    };
  }
}

export async function fetchVegetableDetail(name: string): Promise<VegetableDetail> {
  const res = await fetch(`${API_BASE_URL}/api/vegetables/${encodeURIComponent(name)}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch vegetable ${name}`);
  return await res.json();
}

