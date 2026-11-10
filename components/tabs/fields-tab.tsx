"use client";

import React, { useState } from "react";
import { Plus, Trash2, MapPin, CheckCircle, Sprout, Edit2, X } from "lucide-react";
import { FieldItem, createField, updateField, deleteField } from "@/lib/api";
import { LocationTwinPicker } from "@/components/location-twin-picker";
import { useTranslation, translateCrop, translateSoil } from "@/lib/i18n";
import { getCropImage } from "@/lib/crop-images";

interface FieldsTabProps {
  fields: FieldItem[];
  selectedFieldId: string;
  onSelectField: (id: string) => void;
  onRefreshFields: () => void;
}

export function FieldsTab({
  fields,
  selectedFieldId,
  onSelectField,
  onRefreshFields,
}: FieldsTabProps) {
  const { t, language } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [editingField, setEditingField] = useState<FieldItem | null>(null);
  const [editFormData, setEditFormData] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    farmer_name: "Ramesh Gowda",
    location: "Mandya District, Karnataka",
    area_hectares: 5.0,
    soil_type: "Red soil",
    soil_ph: 6.8,
    nitrogen_ppm: 34.0,
    phosphorus_ppm: 22.0,
    potassium_ppm: 185.0,
    organic_carbon_pct: 0.85,
    water_availability: "Borewell + Canal",
    irrigation_method: "Drip Irrigation",
    crop_type: "Ragi (Finger Millet)",
    crop_variety: "ML-365 Drought-Tolerant",
    sowing_date: "2026-06-15",
    expected_harvest_date: "2026-10-15",
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    setSaving(true);
    try {
      await createField(formData);
      setShowModal(false);
      onRefreshFields();
      setFormData({
        name: "",
        farmer_name: "Ramesh Gowda",
        location: "Mandya District, Karnataka",
        area_hectares: 5.0,
        soil_type: "Red soil",
        soil_ph: 6.8,
        nitrogen_ppm: 34.0,
        phosphorus_ppm: 22.0,
        potassium_ppm: 185.0,
        organic_carbon_pct: 0.85,
        water_availability: "Borewell + Canal",
        irrigation_method: "Drip Irrigation",
        crop_type: "Ragi (Finger Millet)",
        crop_variety: "ML-365 Drought-Tolerant",
        sowing_date: "2026-06-15",
        expected_harvest_date: "2026-10-15",
      });
    } catch {
      alert("Error saving field. Please check your inputs.");
    } finally {
      setSaving(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingField || !editFormData) return;
    setSaving(true);
    try {
      await updateField(editingField.id, editFormData);
      setEditingField(null);
      setEditFormData(null);
      onRefreshFields();
    } catch {
      alert("Failed to update field. Please check your inputs.");
    } finally {
      setSaving(false);
    }
  };

  const startEditing = (f: FieldItem) => {
    setEditingField(f);
    setEditFormData({
      name: f.name,
      farmer_name: f.farmer_name,
      location: f.location,
      area_hectares: f.area_hectares,
      soil_type: f.soil_type,
      soil_ph: f.soil_ph,
      nitrogen_ppm: f.nitrogen_ppm,
      phosphorus_ppm: f.phosphorus_ppm,
      potassium_ppm: f.potassium_ppm,
      organic_carbon_pct: f.organic_carbon_pct,
      water_availability: f.water_availability,
      irrigation_method: f.irrigation_method,
      crop_type: f.crop_type,
      crop_variety: f.crop_variety,
      sowing_date: f.sowing_date,
      expected_harvest_date: f.expected_harvest_date,
    });
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete field "${name}"?`)) {
      try {
        await deleteField(id);
        onRefreshFields();
      } catch {
        alert("Failed to delete field");
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in-50">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h2 className="text-base font-bold text-foreground">
            {t("fields.title")}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t("fields.subtitle")}
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 rounded-xl bg-[#173D2B] hover:bg-[#102F22] text-[#FFFEFA] px-3.5 py-2 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="size-4" />
          <span>{t("fields.addNew")}</span>
        </button>
      </div>

      {/* Fields Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {fields.map((f) => {
          const isSelected = f.id === selectedFieldId;
          return (
            <div
              key={f.id}
              className={`rounded-2xl border p-5 transition-all ${isSelected
                ? "border-[#173D2B] bg-[#E4EBDD]/25 ring-1 ring-[#173D2B]/30 shadow-sm"
                : "border-border bg-card hover:border-[#173D2B]/40"
                }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="relative size-12 rounded-xl overflow-hidden border border-[#D0DEC4] bg-[#F8F4EB] shrink-0 shadow-xs">
                    <img
                      src={getCropImage(f.crop_type, "thumb")}
                      alt={f.crop_type}
                      className="size-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = getCropImage(f.crop_type, "main");
                      }}
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">{f.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {translateCrop(f.crop_type, language)} • {f.crop_variety}
                    </p>
                  </div>
                </div>

                <span
                  className={`rounded-full px-2 py-0.5 text-[0.65rem] font-bold ${f.risk_level === "Low"
                    ? "bg-[#E4EBDD] text-[#173D2B]"
                    : f.risk_level === "Moderate"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-rose-100 text-rose-800"
                    }`}
                >
                  {f.risk_level}
                </span>
              </div>

              {/* Field details */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-4 text-xs">
                <div className="rounded-xl border border-border/60 bg-muted/20 p-2">
                  <span className="text-[0.65rem] text-muted-foreground block">{t("twin.telemetry.cultivationArea", "Area")}</span>
                  <span className="font-semibold text-foreground">{f.area_hectares} ha</span>
                </div>
                <div className="rounded-xl border border-border/60 bg-muted/20 p-2">
                  <span className="text-[0.65rem] text-muted-foreground block">{t("twin.telemetry.soilType", "Soil Type")}</span>
                  <span className="font-semibold text-foreground">{translateSoil(f.soil_type, language)}</span>
                </div>
                <div className="rounded-xl border border-border/60 bg-muted/20 p-2">
                  <span className="text-[0.65rem] text-muted-foreground block">Soil pH</span>
                  <span className="font-semibold text-foreground">{f.soil_ph}</span>
                </div>
                <div className="rounded-xl border border-border/60 bg-muted/20 p-2">
                  <span className="text-[0.65rem] text-muted-foreground block">N-P-K</span>
                  <span className="font-semibold text-foreground">{f.nitrogen_ppm}-{f.phosphorus_ppm}-{f.potassium_ppm}</span>
                </div>
                <div className="rounded-xl border border-border/60 bg-muted/20 p-2">
                  <span className="text-[0.65rem] text-muted-foreground block">Organic Carbon</span>
                  <span className="font-semibold text-foreground">{f.organic_carbon_pct}%</span>
                </div>
                <div className="rounded-xl border border-border/60 bg-muted/20 p-2">
                  <span className="text-[0.65rem] text-muted-foreground block">{t("nav.irrigation", "Irrigation")}</span>
                  <span className="font-semibold text-foreground">{f.irrigation_method.split(" ")[0]}</span>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="size-3" /> {f.location}
                </span>

                <div className="flex items-center gap-2">
                  {!isSelected ? (
                    <button
                      onClick={() => onSelectField(f.id)}
                      className="px-3 py-1 rounded-lg border border-border hover:bg-muted text-xs font-semibold text-foreground transition-colors cursor-pointer"
                    >
                      {t("fields.card.select", "Set Active Twin")}
                    </button>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-bold text-[#173D2B]">
                      <CheckCircle className="size-3.5 text-[#173D2B]" /> {t("fields.card.active", "Active Twin")}
                    </span>
                  )}

                  <button
                    onClick={() => startEditing(f)}
                    className="p-1 rounded-lg text-muted-foreground hover:text-emerald-500 hover:bg-emerald-500/10 transition-colors cursor-pointer"
                    title="Edit Field Parameters"
                  >
                    <Edit2 className="size-3.5" />
                  </button>

                  {fields.length > 1 && (
                    <button
                      onClick={() => handleDelete(f.id, f.name)}
                      className="p-1 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cadastral Boundary & Geospatial Calibrator for Active Field */}
      <LocationTwinPicker
        fieldId={selectedFieldId}
        onLocationUpdated={() => onRefreshFields()}
      />

      {/* Create Field Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl">
            <h3 className="text-base font-bold text-foreground mb-1">Add New Agricultural Field Twin</h3>
            <p className="text-xs text-muted-foreground mb-4">
              Enter field dimensions, crop calendar, and soil characteristics to initialize digital twin telemetry.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-foreground block mb-1">Field Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. South Terrace Ragi Plot"
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-foreground block mb-1">Location / District *</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-foreground block mb-1">Crop Type *</label>
                  <select
                    value={formData.crop_type}
                    onChange={(e) => setFormData({ ...formData, crop_type: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                  >
                    <optgroup label="Horticultural Vegetables">
                      <option value="Carrot">🥕 Carrot (Super Kuroda)</option>
                      <option value="Beetroot">🍠 Beetroot (Detroit Dark Red)</option>
                      <option value="Potato">🥔 Potato (Kufri Jyoti)</option>
                      <option value="Tomato">🍅 Tomato (Arka Rakshak F1)</option>
                    </optgroup>
                    <optgroup label="Grains & Pulses">
                      <option value="Ragi (Finger Millet)">🌾 Ragi / Finger Millet (ML-365)</option>
                      <option value="Rice / Paddy">🍚 Rice / Paddy (Sona Masoori)</option>
                      <option value="Wheat">🌾 Wheat (GW-322)</option>
                      <option value="Maize">🌽 Maize (DKC-9108)</option>
                      <option value="Groundnut">🥜 Groundnut (TMV-2)</option>
                    </optgroup>
                    <optgroup label="Cash & Commercial Crops">
                      <option value="Sugarcane">🎋 Sugarcane (Co 86032)</option>
                      <option value="Cotton">🌱 Cotton (Bt RCH-2)</option>
                      <option value="Banana">🍌 Banana (Grand Naine)</option>
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-foreground block mb-1">Crop Variety</label>
                  <input
                    type="text"
                    value={formData.crop_variety}
                    onChange={(e) => setFormData({ ...formData, crop_variety: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-foreground block mb-1">Soil Type *</label>
                  <select
                    value={formData.soil_type}
                    onChange={(e) => setFormData({ ...formData, soil_type: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="Red soil">Red soil (Common Karnataka Loam)</option>
                    <option value="Black soil">Black soil (Regur Clay)</option>
                    <option value="Sandy soil">Sandy soil</option>
                    <option value="Clay soil">Clay soil</option>
                    <option value="Loamy soil">Loamy soil</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-foreground block mb-1">Field Area (Hectares) *</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formData.area_hectares}
                    onChange={(e) => setFormData({ ...formData, area_hectares: parseFloat(e.target.value) || 1.0 })}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-foreground block mb-1">Soil pH</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.soil_ph}
                    onChange={(e) => setFormData({ ...formData, soil_ph: parseFloat(e.target.value) || 6.5 })}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-foreground block mb-1">Organic Carbon (%)</label>
                  <input
                    type="number"
                    step="0.05"
                    value={formData.organic_carbon_pct}
                    onChange={(e) => setFormData({ ...formData, organic_carbon_pct: parseFloat(e.target.value) || 0.75 })}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-foreground block mb-1">Sowing Date</label>
                  <input
                    type="date"
                    value={formData.sowing_date}
                    onChange={(e) => setFormData({ ...formData, sowing_date: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-foreground block mb-1">Expected Harvest Date</label>
                  <input
                    type="date"
                    value={formData.expected_harvest_date}
                    onChange={(e) => setFormData({ ...formData, expected_harvest_date: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-border flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border border-border text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-xl bg-[#173D2B] hover:bg-[#102F22] text-[#FFFEFA] font-semibold cursor-pointer disabled:opacity-50"
                >
                  {saving ? "Initializing Digital Twin..." : "Save & Generate Twin"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Field Modal */}
      {editingField && editFormData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
              <div>
                <h3 className="text-base font-bold text-foreground">
                  Edit Agricultural Field Record
                </h3>
                <p className="text-xs text-muted-foreground">
                  Modify farm crop, cultivated area, location, or soil parameters for {editingField.name}.
                </p>
              </div>
              <button
                onClick={() => { setEditingField(null); setEditFormData(null); }}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-foreground block mb-1">Field Name *</label>
                  <input
                    type="text"
                    required
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-foreground block mb-1">Farmer Name *</label>
                  <input
                    type="text"
                    required
                    value={editFormData.farmer_name}
                    onChange={(e) => setEditFormData({ ...editFormData, farmer_name: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-foreground block mb-1">Location / District *</label>
                  <input
                    type="text"
                    required
                    value={editFormData.location}
                    onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-foreground block mb-1">Crop Type *</label>
                  <select
                    value={editFormData.crop_type}
                    onChange={(e) => setEditFormData({ ...editFormData, crop_type: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                  >
                    <optgroup label="Horticultural Vegetables">
                      <option value="Potato">🥔 Potato</option>
                      <option value="Tomato">🍅 Tomato</option>
                      <option value="Carrot">🥕 Carrot</option>
                      <option value="Beetroot">🍠 Beetroot</option>
                      <option value="Onion">🧅 Onion</option>
                    </optgroup>
                    <optgroup label="Grains & Pulses">
                      <option value="Ragi (Finger Millet)">🌾 Ragi / Finger Millet</option>
                      <option value="Rice / Paddy">🍚 Rice / Paddy</option>
                      <option value="Wheat">🌾 Wheat</option>
                      <option value="Maize">🌽 Maize</option>
                      <option value="Groundnut">🥜 Groundnut</option>
                    </optgroup>
                    <optgroup label="Cash Crops">
                      <option value="Sugarcane">🎋 Sugarcane</option>
                      <option value="Cotton">🌱 Cotton</option>
                      <option value="Banana">🍌 Banana</option>
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-foreground block mb-1">Crop Variety</label>
                  <input
                    type="text"
                    value={editFormData.crop_variety}
                    onChange={(e) => setEditFormData({ ...editFormData, crop_variety: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-foreground block mb-1">Cultivated Area (Hectares) *</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    value={editFormData.area_hectares}
                    onChange={(e) => setEditFormData({ ...editFormData, area_hectares: parseFloat(e.target.value) || 1.0 })}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-foreground block mb-1">Soil Type</label>
                  <select
                    value={editFormData.soil_type}
                    onChange={(e) => setEditFormData({ ...editFormData, soil_type: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                  >
                    <option value="Red soil">Red soil</option>
                    <option value="Black soil">Black soil</option>
                    <option value="Sandy soil">Sandy soil</option>
                    <option value="Clay soil">Clay soil</option>
                    <option value="Loamy soil">Loamy soil</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-foreground block mb-1">Soil pH</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editFormData.soil_ph}
                    onChange={(e) => setEditFormData({ ...editFormData, soil_ph: parseFloat(e.target.value) || 6.5 })}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-foreground block mb-1">Sowing Date</label>
                  <input
                    type="date"
                    value={editFormData.sowing_date}
                    onChange={(e) => setEditFormData({ ...editFormData, sowing_date: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-foreground block mb-1">Expected Harvest Date</label>
                  <input
                    type="date"
                    value={editFormData.expected_harvest_date}
                    onChange={(e) => setEditFormData({ ...editFormData, expected_harvest_date: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-border flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => { setEditingField(null); setEditFormData(null); }}
                  className="px-4 py-2 rounded-xl border border-border text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-xl bg-[#173D2B] hover:bg-[#102F22] text-[#FFFEFA] font-semibold cursor-pointer disabled:opacity-50"
                >
                  {saving ? "Saving Changes..." : "Save Field Updates"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
