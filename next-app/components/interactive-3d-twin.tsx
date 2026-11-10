"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  Droplets,
  Sun,
  Play,
  Pause,
  RotateCcw,
  Eye,
  Crosshair,
  CheckCircle2,
  X,
  Building2,
  Wind,
  Compass,
  MapPin,
  Layers,
  Sparkles,
  Maximize2,
  Minimize2,
  Fence,
  Mountain,
  Waves,
  CloudRain,
  Flame,
  Gauge,
  Sliders,
  Scale,
  Activity,
  ArrowRight,
  TrendingUp,
  Sprout,
  User,
  Info,
  Camera,
  ZoomIn,
  ZoomOut,
  RotateCw,
} from "lucide-react";
import { Twin3DData } from "@/lib/api";
import { useTranslation, translateCrop, translateGrowthStage, translateSoil } from "@/lib/i18n";
import {
  SupportedCrop,
  CROP_CONFIGS,
  buildBotanicalCrop,
  NINE_GROWTH_STAGES,
} from "@/lib/crop-engine";
import { getCropImage } from "@/lib/crop-images";

export interface PlotSectorData {
  id: string;
  name: string;
  cropType: SupportedCrop;
  displayName: string;
  variety: string;
  areaHectares: number;
  areaAcres: number;
  soilType: string;
  soilMoisturePct: number;
  temperatureC: number;
  soilPH: number;
  nitrogenPPM: number;
  phosphorusPPM: number;
  potassiumPPM: number;
  growthStage: string;
  growthStageIndex: number;
  healthIndex: number;
  predictedYieldTonnesHa: number;
  waterRequirementsDaily: string;
  irrigationType: string;
  bounds: { minX: number; maxX: number; minZ: number; maxZ: number };
  color: number;
  soilDescription: string;
  realPhotoUrl: string;
}

/**
 * Creates high-visibility 3D billboard labels with crisp typography and glowing border.
 */
function createTextSprite(title: string, subtitle: string, badgeColor: string): THREE.Sprite {
  if (typeof document === "undefined") return new THREE.Sprite();
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 160;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.Sprite();

  // Draw background pill
  ctx.fillStyle = "rgba(10, 15, 29, 0.90)";
  ctx.strokeStyle = badgeColor;
  ctx.lineWidth = 5;
  ctx.beginPath();
  if (ctx.roundRect) {
    ctx.roundRect(10, 10, 492, 140, 24);
  } else {
    ctx.rect(10, 10, 492, 140);
  }
  ctx.fill();
  ctx.stroke();

  // Accent stripe
  ctx.fillStyle = badgeColor;
  ctx.beginPath();
  if (ctx.roundRect) {
    ctx.roundRect(24, 24, 12, 112, 6);
  } else {
    ctx.rect(24, 24, 12, 112);
  }
  ctx.fill();

  // Title text
  ctx.font = "bold 32px sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.fillText(title, 48, 68);

  // Subtitle
  ctx.font = "22px monospace";
  ctx.fillStyle = "#94a3b8";
  ctx.fillText(subtitle, 48, 112);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  const spriteMat = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: false,
  });
  const sprite = new THREE.Sprite(spriteMat);
  sprite.scale.set(3.8, 1.2, 1.0);
  return sprite;
}

export const CADASTRAL_PLOTS: PlotSectorData[] = [
  {
    id: "PLOT-NW-RAGI",
    name: "North-West Field: Mandya Ragi Plot",
    cropType: "Ragi (Finger Millet)",
    displayName: "Ragi / Finger Millet (ML-365)",
    variety: "GPU-28 / Indaf-5",
    areaHectares: 2.4,
    areaAcres: 5.9,
    soilType: "Red Sandy Loam with Quartz Gravel",
    soilMoisturePct: 24.5,
    temperatureC: 26.2,
    soilPH: 6.4,
    nitrogenPPM: 115,
    phosphorusPPM: 19,
    potassiumPPM: 165,
    growthStage: "Maturity / Grain Fill (Reddish-Brown Earheads)",
    growthStageIndex: 7,
    healthIndex: 91,
    predictedYieldTonnesHa: 3.8,
    waterRequirementsDaily: "3.2 mm / day",
    irrigationType: "Supplementary Sprinkler & Rainfed",
    bounds: { minX: -11, maxX: -0.6, minZ: -11, maxZ: -0.6 },
    color: 0x5a3e26,
    soilDescription: "Well-drained red loam with moderate moisture retention",
    realPhotoUrl: "/images/crops/ragi/field.jpg",
  },
  {
    id: "PLOT-NE-TOMATO",
    name: "North-East Field: Intensive Tomato Plot",
    cropType: "Tomato",
    displayName: "Tomato (Arka Rakshak F1 Hybrid)",
    variety: "Arka Rakshak (High Lycopene)",
    areaHectares: 1.8,
    areaAcres: 4.45,
    soilType: "Deep Red Clay Loam with Organic Matter",
    soilMoisturePct: 36.2,
    temperatureC: 24.8,
    soilPH: 6.7,
    nitrogenPPM: 148,
    phosphorusPPM: 32,
    potassiumPPM: 210,
    growthStage: "Fruiting & Ripening (Red, Orange & Green Fruits)",
    growthStageIndex: 6,
    healthIndex: 94,
    predictedYieldTonnesHa: 28.5,
    waterRequirementsDaily: "4.8 mm / day",
    irrigationType: "Precision Drip Fertigation with Bamboo Staking",
    bounds: { minX: 0.6, maxX: 11, minZ: -11, maxZ: -0.6 },
    color: 0x482f1b,
    soilDescription: "Tilled raised beds with lateral drip lines and bamboo support poles",
    realPhotoUrl: "/images/crops/tomato/field.jpg",
  },
  {
    id: "PLOT-SW-CANE",
    name: "South-West Field: Cauvery Basin Sugarcane",
    cropType: "Sugarcane",
    displayName: "Sugarcane (Co 86032 Nayana)",
    variety: "Co 86032 / VSI 434",
    areaHectares: 3.6,
    areaAcres: 8.9,
    soilType: "Deep Alluvial Loam & Heavy Clay",
    soilMoisturePct: 52.0,
    temperatureC: 24.0,
    soilPH: 7.2,
    nitrogenPPM: 215,
    phosphorusPPM: 38,
    potassiumPPM: 260,
    growthStage: "Grand Growth Stage (Dense 3.0m Stalks)",
    growthStageIndex: 4,
    healthIndex: 96,
    predictedYieldTonnesHa: 92.0,
    waterRequirementsDaily: "7.5 mm / day",
    irrigationType: "Furrow Irrigation with Bund Water Channels",
    bounds: { minX: -11, maxX: -0.6, minZ: 0.6, maxZ: 11 },
    color: 0x362315,
    soilDescription: "Saturated furrow channels between dense 3-meter cane thickets",
    realPhotoUrl: "/images/crops/sugarcane/field.jpg",
  },
  {
    id: "PLOT-SE-PEANUT",
    name: "South-East Field: Neat Row Groundnut Plot",
    cropType: "Groundnut",
    displayName: "Groundnut / Peanut (TMV-2 Spanish Bunch)",
    variety: "TMV-2 / KDG-128",
    areaHectares: 1.6,
    areaAcres: 3.95,
    soilType: "Light Red Friable Sandy Loam",
    soilMoisturePct: 29.5,
    temperatureC: 26.8,
    soilPH: 6.5,
    nitrogenPPM: 92,
    phosphorusPPM: 24,
    potassiumPPM: 180,
    growthStage: "Pegging & Pod Sizing (Neat Undulating Rows)",
    growthStageIndex: 6,
    healthIndex: 88,
    predictedYieldTonnesHa: 2.85,
    waterRequirementsDaily: "3.4 mm / day",
    irrigationType: "Micro-Jet Sprinklers & Rainfed Soil Furrows",
    bounds: { minX: 0.6, maxX: 11, minZ: 0.6, maxZ: 11 },
    color: 0x6e4a2e,
    soilDescription: "Parallel ridge-and-furrow planting with low spreading clover foliage",
    realPhotoUrl: "/images/crops/groundnut/field.jpg",
  },
];

interface Interactive3DTwinProps {
  twinData: Twin3DData;
  activeLayer?: string;
  onLayerChange?: (layer: string) => void;
  selectedZone?: string | null;
  onSelectZone?: (zoneId: string) => void;
  selectedCrop?: SupportedCrop;
  onCropChange?: (crop: SupportedCrop) => void;
  fieldLocation?: {
    state?: string;
    district?: string;
    village?: string;
    lat?: number;
    lng?: number;
    elevation_m?: number;
  };
}

export function Interactive3DTwin({
  twinData,
  onSelectZone,
  selectedCrop: externalCrop,
  onCropChange,
  fieldLocation,
}: Interactive3DTwinProps) {
  const { t, language } = useTranslation();
  const mountRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Selected Cadastral Plot State (defaults to Tomato or Ragi based on external crop)
  const [selectedPlot, setSelectedPlot] = useState<PlotSectorData>(() => {
    if (externalCrop) {
      const match = CADASTRAL_PLOTS.find((p) => p.cropType === externalCrop);
      if (match) return match;
    }
    return CADASTRAL_PLOTS[1]; // Tomato
  });

  // Camera & View States
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isFieldLevelView, setIsFieldLevelView] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [animSpeed, setAnimSpeed] = useState<number>(1.0);
  const [dayNight, setDayNight] = useState<"day" | "sunset" | "night">("day");

  // Visual Overlays
  const [activeLayer, setActiveLayer] = useState<"standard" | "ndvi" | "moisture" | "irrigation">("standard");

  // Real World Photo Inspector States
  const [showRealPhotoModal, setShowRealPhotoModal] = useState<boolean>(false);
  const [activePhotoPlot, setActivePhotoPlot] = useState<PlotSectorData>(selectedPlot);
  const [photoZoom, setPhotoZoom] = useState<number>(1.0);
  const [selectedPhotoTab, setSelectedPhotoTab] = useState<string>("selected");

  // Dynamic Environmental Simulation Parameters
  const [simSoilMoisture, setSimSoilMoisture] = useState<number>(selectedPlot.soilMoisturePct);
  const [simTemperature, setSimTemperature] = useState<number>(26);
  const [simRainfallActive, setSimRainfallActive] = useState<boolean>(false);
  const [simRainfallRate, setSimRainfallRate] = useState<number>(25);
  const [simWindSpeed, setSimWindSpeed] = useState<number>(12);
  const [simGrowthStage, setSimGrowthStage] = useState<number>(6);

  // Three.js References
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const plotSoilMeshesRef = useRef<Map<string, THREE.Mesh>>(new Map());
  const plotPlantGroupsRef = useRef<Map<string, THREE.Group>>(new Map());
  const rainParticlesRef = useRef<THREE.Points | null>(null);
  const sunLightRef = useRef<THREE.DirectionalLight | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);
  const cloudsGroupRef = useRef<THREE.Group | null>(null);
  const plotOutlineMeshRef = useRef<THREE.LineSegments | null>(null);

  // Handle Fullscreen Toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Camera Presets
  const setCameraView = (mode: "iso" | "field" | "top" | "ragi" | "tomato" | "sugarcane" | "groundnut") => {
    if (!cameraRef.current || !controlsRef.current) return;
    const cam = cameraRef.current;
    const ctrl = controlsRef.current;

    setIsFieldLevelView(mode === "field");

    if (mode === "iso") {
      cam.position.set(20, 16, 22);
      ctrl.target.set(0, 1, 0);
    } else if (mode === "field") {
      // 360° Field-Level Eye View (standing inside the central pathway looking towards the crops)
      cam.position.set(0, 1.45, 0.2);
      ctrl.target.set(0, 1.4, -4);
    } else if (mode === "top") {
      cam.position.set(0, 34, 0.01);
      ctrl.target.set(0, 0, 0);
    } else if (mode === "ragi") {
      cam.position.set(-8, 5, -3);
      ctrl.target.set(-5.8, 1, -5.8);
      handleSelectPlot(CADASTRAL_PLOTS[0]);
    } else if (mode === "tomato") {
      cam.position.set(8, 5, -3);
      ctrl.target.set(5.8, 1, -5.8);
      handleSelectPlot(CADASTRAL_PLOTS[1]);
    } else if (mode === "sugarcane") {
      cam.position.set(-8, 6, 4);
      ctrl.target.set(-5.8, 1.8, 5.8);
      handleSelectPlot(CADASTRAL_PLOTS[2]);
    } else if (mode === "groundnut") {
      cam.position.set(8, 4, 4);
      ctrl.target.set(5.8, 0.5, 5.8);
      handleSelectPlot(CADASTRAL_PLOTS[3]);
    }
    ctrl.update();
  };

  // Select a Cadastral Plot
  const handleSelectPlot = useCallback((plot: PlotSectorData) => {
    setSelectedPlot(plot);
    setSimSoilMoisture(plot.soilMoisturePct);
    setSimTemperature(plot.temperatureC);
    setSimGrowthStage(plot.growthStageIndex);
    if (onSelectZone) onSelectZone(plot.id);
    if (onCropChange) onCropChange(plot.cropType);

    // Reposition cadastral highlight border
    if (plotOutlineMeshRef.current) {
      const centerX = (plot.bounds.minX + plot.bounds.maxX) / 2;
      const centerZ = (plot.bounds.minZ + plot.bounds.maxZ) / 2;
      const width = plot.bounds.maxX - plot.bounds.minX;
      const depth = plot.bounds.maxZ - plot.bounds.minZ;

      plotOutlineMeshRef.current.position.set(centerX, 0.1, centerZ);
      plotOutlineMeshRef.current.scale.set(width / 10, 1, depth / 10);
      plotOutlineMeshRef.current.visible = true;
    }
  }, [onSelectZone, onCropChange]);

  // Sync selected plot when externalCrop prop changes from dashboard
  useEffect(() => {
    if (externalCrop) {
      const match = CADASTRAL_PLOTS.find(
        (p) => p.cropType === externalCrop || p.displayName.toLowerCase().includes(externalCrop.toLowerCase())
      );
      if (match) {
        handleSelectPlot(match);
        setActivePhotoPlot(match);
      }
    }
  }, [externalCrop, handleSelectPlot]);

  // Dynamically scale plants when Growth Stage slider is changed
  useEffect(() => {
    const stageScale = 0.35 + (simGrowthStage / 8) * 0.65;
    const targetGroup = plotPlantGroupsRef.current.get(selectedPlot.id);
    if (targetGroup) {
      targetGroup.children.forEach((p) => {
        p.scale.set(stageScale, stageScale, stageScale);
      });
    }
  }, [simGrowthStage, selectedPlot.id]);

  // Sync Environmental Parameters into Three.js Materials & Lights
  useEffect(() => {
    const moistureFrac = Math.max(0.1, Math.min(0.9, simSoilMoisture / 100));

    plotSoilMeshesRef.current.forEach((mesh, plotId) => {
      const mat = mesh.material as THREE.MeshStandardMaterial;
      if (activeLayer === "moisture") {
        mat.map = null;
        if (moistureFrac > 0.45) mat.color.setHex(0x0284c7); // Deep Blue (Saturated)
        else if (moistureFrac > 0.28) mat.color.setHex(0x10b981); // Emerald (Optimal 28-45%)
        else if (moistureFrac > 0.18) mat.color.setHex(0xf59e0b); // Amber (Mild Deficit)
        else mat.color.setHex(0xef4444); // Crimson (Critical Dry <18%)
        mat.needsUpdate = true;
      } else if (activeLayer === "ndvi") {
        // Crop Health View: 4 color stress levels
        mat.map = null;
        const plotData = CADASTRAL_PLOTS.find((p) => p.id === plotId);
        const health = plotData ? plotData.healthIndex : 88;
        if (health >= 85) mat.color.setHex(0x10b981); // Green: Healthy (NDVI > 0.75)
        else if (health >= 70) mat.color.setHex(0xeab308); // Yellow: Moderate Stress (NDVI 0.60-0.75)
        else if (health >= 50) mat.color.setHex(0xf97316); // Orange: High Stress (NDVI 0.40-0.60)
        else mat.color.setHex(0xef4444); // Red: Critical Stress (NDVI < 0.40)
        mat.needsUpdate = true;
      } else if (activeLayer === "irrigation") {
        // Crop Growth View: Stage-dependent canopy lushness
        mat.map = null;
        mat.color.setHex(0x15803d);
        mat.needsUpdate = true;
      } else {
        const plotData = CADASTRAL_PLOTS.find((p) => p.id === plotId);
        if (plotData && !mat.map) {
          const loader = new THREE.TextureLoader();
          mat.map = loader.load(plotData.realPhotoUrl);
        }
        const dryColor = new THREE.Color(0xffffff);
        const wetColor = new THREE.Color(0x999999);
        mat.color.copy(dryColor).lerp(wetColor, moistureFrac * 0.5);
        mat.roughness = 0.98 - moistureFrac * 0.45;
        mat.metalness = moistureFrac * 0.15;
        mat.needsUpdate = true;
      }
    });

    if (sunLightRef.current && ambientLightRef.current) {
      if (simTemperature > 34) {
        sunLightRef.current.color.setHex(0xffaa55);
        ambientLightRef.current.color.setHex(0x885544);
      } else if (dayNight === "sunset") {
        sunLightRef.current.color.setHex(0xff7744);
        ambientLightRef.current.color.setHex(0x553333);
      } else if (dayNight === "night") {
        sunLightRef.current.color.setHex(0x223355);
        ambientLightRef.current.color.setHex(0x0a1122);
      } else {
        sunLightRef.current.color.setHex(0xfffaed);
        ambientLightRef.current.color.setHex(0x667788);
      }
    }

    if (rainParticlesRef.current) {
      rainParticlesRef.current.visible = simRainfallActive;
    }

    if (sceneRef.current) {
      if (simRainfallActive) {
        sceneRef.current.background = new THREE.Color(0x334155);
      } else if (dayNight === "day") {
        sceneRef.current.background = new THREE.Color(0x93c5fd);
      } else if (dayNight === "sunset") {
        sceneRef.current.background = new THREE.Color(0xf97316);
      } else {
        sceneRef.current.background = new THREE.Color(0x020617);
      }
    }
  }, [simSoilMoisture, simTemperature, simRainfallActive, dayNight, activeLayer]);

  // Main Three.js Scene Setup
  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 560;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x93c5fd);
    scene.fog = new THREE.FogExp2(0x93c5fd, 0.012);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.15, 600);
    camera.position.set(20, 16, 22);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // OrbitControls for 360-degree free orbit in all directions
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.maxPolarAngle = Math.PI - 0.04; // Full 360° vertical pitch: ground to sky
    controls.minPolarAngle = 0.04;
    controls.minDistance = 1.0;
    controls.maxDistance = 140;
    controls.target.set(0, 1, 0);
    controlsRef.current = controls;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    const sunLight = new THREE.DirectionalLight(0xfffaed, 2.3);
    sunLight.position.set(38, 48, 28);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 5;
    sunLight.shadow.camera.far = 130;
    const d = 26;
    sunLight.shadow.camera.left = -d;
    sunLight.shadow.camera.right = d;
    sunLight.shadow.camera.top = d;
    sunLight.shadow.camera.bottom = -d;
    scene.add(sunLight);
    sunLightRef.current = sunLight;

    const hemiLight = new THREE.HemisphereLight(0xb1e1ff, 0x5a483a, 0.6);
    scene.add(hemiLight);

    const textureLoader = new THREE.TextureLoader();

    // ==================== SURROUNDING DECCAN/KARNATAKA RURAL TERRAIN ====================
    const landscapeGeo = new THREE.PlaneGeometry(180, 180, 64, 64);
    const posAttr = landscapeGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const y = posAttr.getY(i);
      const dist = Math.sqrt(x * x + y * y);
      if (dist > 14) {
        const hill = Math.sin(x * 0.055) * Math.cos(y * 0.055) * 4.2 + (dist - 14) * 0.038;
        posAttr.setZ(i, Math.max(-0.2, hill));
      } else {
        posAttr.setZ(i, -0.04);
      }
    }
    landscapeGeo.computeVertexNormals();

    const groundTex = textureLoader.load("/textures/farm/groundnut_real.jpg");
    groundTex.wrapS = THREE.RepeatWrapping;
    groundTex.wrapT = THREE.RepeatWrapping;
    groundTex.repeat.set(14, 14);

    const landscapeMesh = new THREE.Mesh(
      landscapeGeo,
      new THREE.MeshStandardMaterial({
        map: groundTex,
        color: 0x829452,
        roughness: 0.92,
      })
    );
    landscapeMesh.rotation.x = -Math.PI / 2;
    landscapeMesh.receiveShadow = true;
    scene.add(landscapeMesh);

    // ==================== 360° PANORAMIC RURAL HORIZON CYLINDER DOME ====================
    const horizonTex = textureLoader.load("/textures/farm/farm_composite_real.jpg");
    horizonTex.wrapS = THREE.RepeatWrapping;
    horizonTex.repeat.set(2, 1);
    const horizonGeo = new THREE.CylinderGeometry(95, 95, 48, 64, 1, true);
    const horizonMat = new THREE.MeshBasicMaterial({
      map: horizonTex,
      side: THREE.BackSide,
      fog: false,
    });
    const horizonMesh = new THREE.Mesh(horizonGeo, horizonMat);
    horizonMesh.position.y = 20;
    scene.add(horizonMesh);

    // ==================== 4 CADASTRAL PLOTS (REAL PHOTOGRAPHIC LAND & 3D CROPS) ====================
    CADASTRAL_PLOTS.forEach((plot) => {
      const w = plot.bounds.maxX - plot.bounds.minX;
      const d = plot.bounds.maxZ - plot.bounds.minZ;
      const cx = (plot.bounds.minX + plot.bounds.maxX) / 2;
      const cz = (plot.bounds.minZ + plot.bounds.maxZ) / 2;

      // Furrowed soil bed geometry with real photograph texture
      const plotGeo = new THREE.PlaneGeometry(w, d, 32, 32);
      const pPos = plotGeo.attributes.position;
      for (let i = 0; i < pPos.count; i++) {
        const x = pPos.getX(i);
        const furrow = Math.sin(x * 3.1) * 0.08;
        pPos.setZ(i, furrow);
      }
      plotGeo.computeVertexNormals();

      const pTexture = textureLoader.load(plot.realPhotoUrl);

      const plotMat = new THREE.MeshStandardMaterial({
        map: pTexture,
        roughness: 0.85,
        metalness: 0.04,
      });

      const plotMesh = new THREE.Mesh(plotGeo, plotMat);
      plotMesh.rotation.x = -Math.PI / 2;
      plotMesh.position.set(cx, 0.02, cz);
      plotMesh.receiveShadow = true;
      plotMesh.userData = { isPlot: true, plotData: plot };
      scene.add(plotMesh);
      plotSoilMeshesRef.current.set(plot.id, plotMesh);

      // Dedicated Plant Group for Each Crop
      const plantGroup = new THREE.Group();
      scene.add(plantGroup);
      plotPlantGroupsRef.current.set(plot.id, plantGroup);

      // Realistic 3D Botanical Plants
      const rows = 6;
      const cols = 6;
      const spanX = w - 1.2;
      const spanZ = d - 1.2;
      for (let r = 0; r < rows; r++) {
        const pz = plot.bounds.minZ + 0.6 + (r / (rows - 1)) * spanZ;
        for (let c = 0; c < cols; c++) {
          const px = plot.bounds.minX + 0.6 + (c / (cols - 1)) * spanX;
          const plant = buildBotanicalCrop(plot.cropType, plot.growthStageIndex);
          plant.position.set(px, 0.04, pz);
          plantGroup.add(plant);
        }
      }

      // Upright Real-World Crop Foliage Billboard Rows Standing in Furrows
      const foliageHeights: Partial<Record<SupportedCrop, number>> = {
        "Ragi (Finger Millet)": 1.25,
        "Tomato": 1.45,
        "Sugarcane": 3.1,
        "Groundnut": 0.72,
        "Carrot": 0.65,
        "Beetroot": 0.55,
        "Potato": 0.85,
      };
      const plantH = foliageHeights[plot.cropType] || 1.3;
      const numFoliageRows = 4;
      for (let fr = 0; fr < numFoliageRows; fr++) {
        const rz = plot.bounds.minZ + 1.2 + (fr / (numFoliageRows - 1)) * (d - 2.4);
        const rowGeo = new THREE.PlaneGeometry(w * 0.9, plantH);
        const rowMat = new THREE.MeshStandardMaterial({
          map: pTexture,
          transparent: true,
          alphaTest: 0.22,
          roughness: 0.8,
          side: THREE.DoubleSide,
        });
        const rowMesh = new THREE.Mesh(rowGeo, rowMat);
        rowMesh.position.set(cx, plantH / 2 + 0.03, rz);
        rowMesh.castShadow = true;
        scene.add(rowMesh);
      }

      // 3D Billboard Label Sprite Floating Above Plot Center
      const labelBadgeColors: Record<string, string> = {
        "PLOT-NW-RAGI": "#f59e0b",
        "PLOT-NE-TOMATO": "#ef4444",
        "PLOT-SW-CANE": "#10b981",
        "PLOT-SE-PEANUT": "#eab308",
      };
      const labelHeights: Record<string, number> = {
        "PLOT-NW-RAGI": 2.7,
        "PLOT-NE-TOMATO": 3.0,
        "PLOT-SW-CANE": 4.3,
        "PLOT-SE-PEANUT": 2.1,
      };
      const sprite = createTextSprite(
        translateCrop(plot.cropType, language),
        `${plot.areaHectares} Ha • ${plot.predictedYieldTonnesHa} T/Ha`,
        labelBadgeColors[plot.id] || "#10b981"
      );
      sprite.position.set(cx, labelHeights[plot.id] || 2.8, cz);
      sprite.userData = { isPlot: true, plotData: plot };
      scene.add(sprite);
    });

    // ==================== CADASTRAL BOUNDARY HIGHLIGHT OUTLINE ====================
    const boxGeo = new THREE.BoxGeometry(10, 0.18, 10);
    const edges = new THREE.EdgesGeometry(boxGeo);
    const lineMat = new THREE.LineBasicMaterial({ color: 0x10b981, linewidth: 3 });
    const outline = new THREE.LineSegments(edges, lineMat);
    outline.position.set(5.8, 0.1, -5.8);
    scene.add(outline);
    plotOutlineMeshRef.current = outline;

    // ==================== FARM PATHS & INFRASTRUCTURE ====================
    // Central cross dirt pathways
    const pathMat = new THREE.MeshStandardMaterial({ color: 0x8a7055, roughness: 0.95 });
    const pathH = new THREE.Mesh(new THREE.PlaneGeometry(24, 1.2), pathMat);
    pathH.rotation.x = -Math.PI / 2;
    pathH.position.set(0, 0.03, 0);
    scene.add(pathH);

    const pathV = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 24), pathMat);
    pathV.rotation.x = -Math.PI / 2;
    pathV.position.set(0, 0.03, 0);
    scene.add(pathV);

    // ==================== SOUTH INDIAN RURAL FARMHOUSE (AS IN PHOTO BACKGROUND) ====================
    const houseGroup = new THREE.Group();
    houseGroup.position.set(22, 0, 16);

    // White lime-washed walls
    const walls = new THREE.Mesh(
      new THREE.BoxGeometry(4.2, 2.2, 3.2),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.7 })
    );
    walls.position.y = 1.1;
    walls.castShadow = true;
    houseGroup.add(walls);

    // Terracotta Mangalore tile pitched roof
    const roof = new THREE.Mesh(
      new THREE.ConeGeometry(3.6, 1.4, 4),
      new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.85 })
    );
    roof.position.y = 2.8;
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;
    houseGroup.add(roof);

    // Front veranda door
    const door = new THREE.Mesh(
      new THREE.PlaneGeometry(0.8, 1.4),
      new THREE.MeshStandardMaterial({ color: 0x78350f })
    );
    door.position.set(-2.11, 0.7, 0);
    door.rotation.y = -Math.PI / 2;
    houseGroup.add(door);
    scene.add(houseGroup);

    // ==================== TALL COCONUT PALMS (COCOS NUCIFERA - AS IN PHOTO) ====================
    const palmGroup = new THREE.Group();
    const palmCoords = [
      [18, 12], [22, 10], [25, 14], [20, 20], [16, 18],
      [-16, 16], [-20, 14], [-18, 20]
    ];
    palmCoords.forEach(([px, pz], idx) => {
      // Slender curved trunk
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(px, 0, pz),
        new THREE.Vector3(px + (idx % 2 === 0 ? 0.4 : -0.3), 3.0, pz + 0.2),
        new THREE.Vector3(px + (idx % 2 === 0 ? 0.8 : -0.6), 6.5, pz + (idx % 3 === 0 ? 0.4 : -0.2)),
      ]);
      const trunk = new THREE.Mesh(
        new THREE.TubeGeometry(curve, 12, 0.18, 8, false),
        new THREE.MeshStandardMaterial({ color: 0x78716c, roughness: 0.9 })
      );
      trunk.castShadow = true;
      palmGroup.add(trunk);

      // Crown of arching feathery fronds
      const crownPos = curve.getPoint(1);
      const frondMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.6, side: THREE.DoubleSide });
      for (let f = 0; f < 12; f++) {
        const fAngle = (f * Math.PI * 2) / 12;
        const frondGeo = new THREE.ConeGeometry(0.35, 2.4, 3);
        const frond = new THREE.Mesh(frondGeo, frondMat);
        frond.position.set(crownPos.x + Math.cos(fAngle) * 0.4, crownPos.y, crownPos.z + Math.sin(fAngle) * 0.4);
        frond.rotation.z = Math.PI / 3;
        frond.rotation.y = fAngle;
        frond.castShadow = true;
        palmGroup.add(frond);
      }
    });
    scene.add(palmGroup);

    // ==================== 3D ANIMATED RAIN PARTICLE SYSTEM ====================
    const rainCount = 2500;
    const rainGeo = new THREE.BufferGeometry();
    const rainPositions = new Float32Array(rainCount * 3);
    for (let i = 0; i < rainCount; i++) {
      rainPositions[i * 3] = (Math.random() - 0.5) * 50;
      rainPositions[i * 3 + 1] = Math.random() * 32;
      rainPositions[i * 3 + 2] = (Math.random() - 0.5) * 50;
    }
    rainGeo.setAttribute("position", new THREE.BufferAttribute(rainPositions, 3));
    const rainMat = new THREE.PointsMaterial({
      color: 0xbae6fd,
      size: 0.12,
      transparent: true,
      opacity: 0.8,
    });
    const rainPoints = new THREE.Points(rainGeo, rainMat);
    rainPoints.visible = false;
    scene.add(rainPoints);
    rainParticlesRef.current = rainPoints;

    // Drifting 3D Cumulus Clouds
    const clouds = new THREE.Group();
    const cloudMat = new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.88, roughness: 0.9 });
    for (let c = 0; c < 8; c++) {
      const cloud = new THREE.Group();
      cloud.position.set((Math.random() - 0.5) * 120, 24 + Math.random() * 8, (Math.random() - 0.5) * 120);
      for (let p = 0; p < 4; p++) {
        const puff = new THREE.Mesh(new THREE.SphereGeometry(3.0 + Math.random() * 2.5, 8, 8), cloudMat);
        puff.position.set((p - 1.5) * 2.8, (Math.random() - 0.5) * 1.2, (Math.random() - 0.5) * 1.5);
        cloud.add(puff);
      }
      clouds.add(cloud);
    }
    scene.add(clouds);
    cloudsGroupRef.current = clouds;

    // Raycaster for Multi-Plot Selection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      for (let hit of intersects) {
        let obj: THREE.Object3D | null = hit.object;
        while (obj) {
          if (obj.userData?.isPlot && obj.userData.plotData) {
            handleSelectPlot(obj.userData.plotData);
            return;
          }
          obj = obj.parent;
        }
      }
    };
    renderer.domElement.addEventListener("pointerdown", handlePointerDown);

    const handlePointerMove = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);
      let hoveredPlot = false;
      for (let hit of intersects) {
        let obj: THREE.Object3D | null = hit.object;
        while (obj) {
          if (obj.userData?.isPlot) {
            hoveredPlot = true;
            break;
          }
          obj = obj.parent;
        }
        if (hoveredPlot) break;
      }
      renderer.domElement.style.cursor = hoveredPlot ? "pointer" : "grab";
    };
    renderer.domElement.addEventListener("pointermove", handlePointerMove);

    // ==================== ANIMATION RENDER LOOP ====================
    let clock = new THREE.Clock();
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime() * animSpeed;

      if (isPlaying) {
        // Wind sway
        const swayAngle = Math.sin(elapsed * (simWindSpeed * 0.25)) * (simWindSpeed * 0.003);
        plotPlantGroupsRef.current.forEach((group) => {
          group.children.forEach((p) => {
            p.rotation.z = swayAngle;
            p.rotation.x = swayAngle * 0.5;
          });
        });

        // Drift clouds
        if (cloudsGroupRef.current) {
          cloudsGroupRef.current.position.x = Math.sin(elapsed * 0.02) * 12;
        }

        // Falling 3D rain particles
        if (rainParticlesRef.current && rainParticlesRef.current.visible) {
          const positions = rainParticlesRef.current.geometry.attributes.position.array as Float32Array;
          const fallSpeed = 0.45 + (simRainfallRate / 60) * 0.6;
          for (let i = 0; i < rainCount; i++) {
            positions[i * 3 + 1] -= fallSpeed;
            if (positions[i * 3 + 1] < 0) {
              positions[i * 3 + 1] = 28;
            }
          }
          rainParticlesRef.current.geometry.attributes.position.needsUpdate = true;
        }
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.domElement.removeEventListener("pointerdown", handlePointerDown);
      renderer.domElement.removeEventListener("pointermove", handlePointerMove);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      renderer.dispose();
    };
  }, [handleSelectPlot, language]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full rounded-3xl border border-[#E5E1D6] bg-[#F8F4EB] overflow-hidden shadow-xl transition-all ${
        isFullscreen ? "fixed inset-0 z-50 rounded-none border-none" : "h-[740px]"
      }`}
    >
      {/* 3D WebGL Canvas Viewport */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Header: 4 Separate Agricultural Plots Selector Bar */}
      <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none z-10">
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-[#FFFEFA]/95 backdrop-blur-xl border border-[#E5E1D6] shadow-md pointer-events-auto">
          {CADASTRAL_PLOTS.map((plot) => (
            <button
              key={plot.id}
              onClick={() => handleSelectPlot(plot)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                selectedPlot.id === plot.id
                  ? "bg-[#173D2B] text-white shadow-sm font-bold"
                  : "text-[#68756A] hover:text-[#173D2B] hover:bg-[#F2EDE2]"
              }`}
            >
              <img
                src={getCropImage(plot.cropType, "thumb")}
                alt={plot.cropType}
                className="size-4 rounded-full object-cover border border-[#C9D9BE] shrink-0"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = getCropImage(plot.cropType, "main");
                }}
              />
              <span>{translateCrop(plot.cropType, language)}</span>
              <span className="text-[0.62rem] opacity-75 font-mono">({plot.areaHectares} {t("twin.telemetry.ha", "ha")})</span>
            </button>
          ))}
        </div>

        {/* Camera Views & Fullscreen Controls */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Day / Sunset / Night Toggle */}
          <div className="flex p-1 rounded-xl bg-[#FFFEFA]/95 backdrop-blur-xl border border-[#E5E1D6] shadow-md text-xs font-semibold">
            <button
              onClick={() => setDayNight("day")}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                dayNight === "day" ? "bg-[#173D2B] text-white font-bold shadow-xs" : "text-[#68756A] hover:text-[#173D2B]"
              }`}
            >
              {t("twin.time.day", "Day")}
            </button>
            <button
              onClick={() => setDayNight("sunset")}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                dayNight === "sunset" ? "bg-[#C9A65B] text-white font-bold shadow-xs" : "text-[#68756A] hover:text-[#173D2B]"
              }`}
            >
              {t("twin.time.sunset", "Sunset")}
            </button>
            <button
              onClick={() => setDayNight("night")}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                dayNight === "night" ? "bg-[#20352A] text-white font-bold shadow-xs" : "text-[#68756A] hover:text-[#173D2B]"
              }`}
            >
              {t("twin.time.night", "Night")}
            </button>
          </div>

          {/* Reset Camera */}
          <button
            onClick={() => setCameraView("iso")}
            title={t("twin.view.resetCamera", "Reset Camera")}
            className="p-2 rounded-xl bg-[#FFFEFA]/95 backdrop-blur-xl border border-[#E5E1D6] text-[#173D2B] hover:bg-[#E4EBDD] shadow-md cursor-pointer transition-colors"
          >
            <RotateCcw className="size-4" />
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? t("twin.controls.fullscreen", "Exit Fullscreen") : t("twin.controls.fullscreen", "Fullscreen")}
            className="p-2 rounded-xl bg-[#FFFEFA]/95 backdrop-blur-xl border border-[#E5E1D6] text-[#173D2B] hover:bg-[#E4EBDD] shadow-md cursor-pointer transition-colors"
          >
            {isFullscreen ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
          </button>
        </div>
      </div>

      {/* Camera View Presets (Including "Stand in Field 360°" & Individual Crop Focus) */}
      <div className="absolute top-18 left-4 flex flex-wrap gap-1.5 p-1 rounded-xl bg-[#FFFEFA]/95 backdrop-blur-xl border border-[#E5E1D6] shadow-md text-[0.7rem] font-semibold text-[#68756A] pointer-events-auto z-10">
        <button
          onClick={() => setCameraView("iso")}
          className="px-2.5 py-1 rounded-lg hover:bg-[#E4EBDD] hover:text-[#173D2B] cursor-pointer transition-colors"
        >
          {t("twin.view.overview360", "360° Overview")}
        </button>
        <button
          onClick={() => setCameraView("field")}
          className={`px-2.5 py-1 rounded-lg cursor-pointer flex items-center gap-1.5 transition-colors ${
            isFieldLevelView
              ? "bg-[#173D2B] text-white font-bold shadow-xs"
              : "hover:bg-[#E4EBDD] hover:text-[#173D2B] text-[#173D2B] font-bold"
          }`}
        >
          <User className="size-3.5" />
          <span>{t("twin.view.standInField", "Stand in Field (Eye-Level 360°)")}</span>
        </button>
        <button
          onClick={() => setCameraView("top")}
          className="px-2.5 py-1 rounded-lg hover:bg-[#E4EBDD] hover:text-[#173D2B] cursor-pointer transition-colors"
        >
          {t("twin.view.topPlan", "Top Plan")}
        </button>
        <span className="w-px h-4 bg-[#E5E1D6] self-center" />
        <button
          onClick={() => setCameraView("ragi")}
          className="px-2.5 py-1 rounded-lg hover:bg-[#F8F4EB] hover:text-[#C9A65B] cursor-pointer text-[#C9A65B] font-bold"
        >
          {t("twin.view.focusRagi", "Focus: Ragi")}
        </button>
        <button
          onClick={() => setCameraView("tomato")}
          className="px-2.5 py-1 rounded-lg hover:bg-[#F8F4EB] hover:text-rose-600 cursor-pointer text-rose-600 font-bold"
        >
          {t("twin.view.focusTomato", "Focus: Tomato")}
        </button>
        <button
          onClick={() => setCameraView("sugarcane")}
          className="px-2.5 py-1 rounded-lg hover:bg-[#F8F4EB] hover:text-[#173D2B] cursor-pointer text-[#173D2B] font-bold"
        >
          {t("twin.view.focusCane", "Focus: Cane")}
        </button>
        <button
          onClick={() => setCameraView("groundnut")}
          className="px-2.5 py-1 rounded-lg hover:bg-[#F8F4EB] hover:text-amber-700 cursor-pointer text-amber-700 font-bold"
        >
          {t("twin.view.focusPeanut", "Focus: Peanut")}
        </button>
        <span className="w-px h-4 bg-[#E5E1D6] self-center" />
        <button
          onClick={() => {
            setActivePhotoPlot(selectedPlot);
            setSelectedPhotoTab("composite");
            setPhotoZoom(1.0);
            setShowRealPhotoModal(true);
          }}
          className="px-2.5 py-1 rounded-lg bg-[#E4EBDD] text-[#173D2B] hover:bg-[#D5E2CC] border border-[#C9D9BE] flex items-center gap-1.5 cursor-pointer font-bold shadow-xs transition-colors"
        >
          <Camera className="size-3.5 text-[#173D2B]" />
          <span>{t("twin.view.realPhotos", "360° Real Land & Plant Photos")}</span>
        </button>
      </div>

      {/* Selected Crop Section Information Card (Top Right - Matching Section 4 Requirements) */}
      <div className="absolute top-18 right-4 w-84 rounded-2xl border border-[#E5E1D6] bg-[#FFFEFA]/95 backdrop-blur-2xl p-4 shadow-xl text-[#20352A] space-y-3 pointer-events-auto z-10 animate-in fade-in slide-in-from-right-4 duration-300">
        <div className="flex items-start justify-between pb-2 border-b border-[#E5E1D6]">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-[#173D2B] animate-pulse" />
              <span className="font-mono text-xs font-bold text-[#173D2B]">
                {selectedPlot.id}
              </span>
            </div>
            <h3 className="text-sm font-extrabold text-[#173D2B] mt-0.5">{translateCrop(selectedPlot.name, language)}</h3>
            <p className="text-[0.68rem] text-[#68756A]">
              {translateCrop(selectedPlot.displayName, language)} • {selectedPlot.variety}
            </p>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-[#E4EBDD] text-[#173D2B] font-mono text-[0.65rem] font-bold border border-[#C9D9BE]">
            {selectedPlot.areaHectares} {t("twin.telemetry.ha", "Ha")} ({selectedPlot.areaAcres} {t("twin.telemetry.ac", "Ac")})
          </span>
        </div>

        {/* 6 Key Telemetry Values */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          {/* Crop Name */}
          <div className="rounded-xl border border-[#E5E1D6] bg-[#F8F4EB] p-2.5">
            <span className="text-[0.65rem] text-[#68756A] block">{t("twin.telemetry.cropName", "1. Crop Name")}</span>
            <span className="text-xs font-bold text-[#173D2B] mt-0.5 block truncate">
              {translateCrop(selectedPlot.cropType, language)}
            </span>
            <span className="text-[0.6rem] text-[#173D2B] block font-semibold">{t("twin.telemetry.botanicalSpecimen", "Botanical specimen")}</span>
          </div>

          {/* Cultivation Area */}
          <div className="rounded-xl border border-[#E5E1D6] bg-[#F8F4EB] p-2.5">
            <span className="text-[0.65rem] text-[#68756A] block">{t("twin.telemetry.cultivationArea", "2. Cultivation Area")}</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-base font-bold font-mono text-[#173D2B]">
                {selectedPlot.areaHectares}
              </span>
              <span className="text-[0.65rem] text-[#68756A]">{t("twin.telemetry.hectares", "Hectares")}</span>
            </div>
            <span className="text-[0.6rem] text-[#68756A] font-mono">≈ {selectedPlot.areaAcres} {t("twin.telemetry.acres", "Acres")}</span>
          </div>

          {/* Soil Moisture */}
          <div className="rounded-xl border border-[#E5E1D6] bg-[#F8F4EB] p-2.5">
            <span className="text-[0.65rem] text-[#68756A] block">{t("twin.telemetry.soilMoisture", "3. Soil Moisture")}</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-base font-bold font-mono text-[#173D2B]">
                {simSoilMoisture}%
              </span>
              <span className="text-[0.6rem] text-[#68756A]">{t("twin.telemetry.volumetric", "volumetric")}</span>
            </div>
            <span className="text-[0.6rem] text-[#68756A] block truncate">
              {simSoilMoisture < 25 ? t("twin.sim.dryLoam", "Dry / Wilting") : simSoilMoisture > 55 ? t("twin.sim.saturatedLoam", "Saturated") : t("twin.sim.optimalLoam", "Optimal Available")}
            </span>
          </div>

          {/* Water Requirements */}
          <div className="rounded-xl border border-[#E5E1D6] bg-[#F8F4EB] p-2.5">
            <span className="text-[0.65rem] text-[#68756A] block">{t("twin.telemetry.waterRequirements", "4. Water Requirements")}</span>
            <span className="text-xs font-mono font-bold text-[#173D2B] mt-0.5 block">
              {selectedPlot.waterRequirementsDaily}
            </span>
            <span className="text-[0.6rem] text-[#68756A] block truncate">
              {selectedPlot.irrigationType}
            </span>
          </div>

          {/* Current Growth Stage */}
          <div className="rounded-xl border border-[#E5E1D6] bg-[#F8F4EB] p-2.5">
            <span className="text-[0.65rem] text-[#68756A] block">{t("twin.telemetry.growthStage", "5. Current Growth Stage")}</span>
            <span className="text-xs font-semibold text-[#173D2B] mt-0.5 block truncate">
              {translateGrowthStage(NINE_GROWTH_STAGES[simGrowthStage]?.stageName || selectedPlot.growthStage, language)}
            </span>
            <span className="text-[0.6rem] text-[#68756A] block">{t("twin.telemetry.stageOf", "Stage")} {simGrowthStage + 1} / 9</span>
          </div>

          {/* Estimated Yield */}
          <div className="rounded-xl border border-[#E5E1D6] bg-[#F8F4EB] p-2.5">
            <span className="text-[0.65rem] text-[#68756A] block">{t("twin.telemetry.estimatedYield", "6. Estimated Yield")}</span>
            <span className="text-xs font-mono font-bold text-[#173D2B] mt-0.5 block">
              {selectedPlot.predictedYieldTonnesHa} {t("twin.telemetry.tonnesHa", "tonnes/ha")}
            </span>
            <span className="text-[0.6rem] text-[#68756A] block">
              {t("twin.telemetry.totalTonnes", "Total:")} {(selectedPlot.predictedYieldTonnesHa * selectedPlot.areaHectares).toFixed(1)} T
            </span>
          </div>
        </div>

        {/* Soil Type & N-P-K Telemetry */}
        <div className="pt-2 border-t border-[#E5E1D6] text-[0.7rem] text-[#68756A] space-y-1">
          <div className="flex justify-between">
            <span>{t("twin.telemetry.soilType", "Soil Type:")}</span>
            <span className="font-semibold text-[#173D2B]">{translateSoil(selectedPlot.soilType, language)}</span>
          </div>
          <div className="flex justify-between">
            <span>{t("twin.telemetry.availableNPK", "Available N-P-K:")}</span>
            <span className="font-mono font-bold text-[#173D2B]">
              {selectedPlot.nitrogenPPM} - {selectedPlot.phosphorusPPM} - {selectedPlot.potassiumPPM} ppm
            </span>
          </div>
          <div className="flex justify-between">
            <span>{t("twin.telemetry.healthIndex", "Health Index:")}</span>
            <span className="font-mono font-bold text-[#173D2B]">{selectedPlot.healthIndex} / 100</span>
          </div>
        </div>

        {/* Real World Crop Photo & 360° Telemetry Button */}
        <button
          onClick={() => {
            setActivePhotoPlot(selectedPlot);
            setSelectedPhotoTab(selectedPlot.id);
            setPhotoZoom(1.0);
            setShowRealPhotoModal(true);
          }}
          className="w-full py-2.5 px-3 rounded-xl bg-[#173D2B] hover:bg-[#102F22] text-white font-bold text-xs shadow-md border border-[#173D2B] transition-all flex items-center justify-center gap-2 cursor-pointer group"
        >
          <Camera className="size-4 text-[#E4EBDD] group-hover:scale-110 transition-transform" />
          <span>{t("twin.realModal.viewPhotoBtn", "Inspect Real 360° Land & Crop Photo")}</span>
        </button>
      </div>

      {/* Bottom Dynamic Environmental Simulation Control Console */}
      <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-[#E5E1D6] bg-[#FFFEFA]/95 backdrop-blur-2xl p-4 shadow-xl text-[#20352A] pointer-events-auto z-10">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E5E1D6]">
          <div className="flex items-center gap-2">
            <Sliders className="size-4 text-[#173D2B]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#173D2B]">
              {t("twin.sim.title", "Dynamic Environmental Simulation & 3D Visual Response")}
            </span>
            <span className="text-[0.62rem] px-2 py-0.5 rounded-full bg-[#E4EBDD] text-[#173D2B] font-bold border border-[#C9D9BE]">
              {t("twin.sim.liveShaders", "Live Shaders Connected")}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-[0.68rem] text-[#68756A] font-semibold">{t("twin.sim.overlay", "Overlay:")}</span>
            <div className="flex p-0.5 rounded-xl bg-[#F8F4EB] border border-[#E5E1D6] text-[0.68rem] font-semibold">
              <button
                onClick={() => setActiveLayer("standard")}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  activeLayer === "standard" ? "bg-[#173D2B] text-white font-bold shadow-xs" : "text-[#68756A] hover:text-[#173D2B]"
                }`}
              >
                Normal Farm View
              </button>
              <button
                onClick={() => setActiveLayer("ndvi")}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  activeLayer === "ndvi" ? "bg-[#173D2B] text-white font-bold shadow-xs" : "text-[#68756A] hover:text-[#173D2B]"
                }`}
              >
                Crop Health View
              </button>
              <button
                onClick={() => setActiveLayer("moisture")}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  activeLayer === "moisture" ? "bg-[#173D2B] text-white font-bold shadow-xs" : "text-[#68756A] hover:text-[#173D2B]"
                }`}
              >
                Soil Moisture View
              </button>
              <button
                onClick={() => setActiveLayer("irrigation")}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  activeLayer === "irrigation" ? "bg-[#173D2B] text-white font-bold shadow-xs" : "text-[#68756A] hover:text-[#173D2B]"
                }`}
              >
                Crop Growth View
              </button>
            </div>
          </div>
        </div>

        {/* Simulation Parameter Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-3">
          {/* Soil Moisture Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-[#68756A] flex items-center gap-1 font-medium">
                <Droplets className="size-3.5 text-[#173D2B]" /> {t("twin.sim.soilMoisture", "Soil Moisture:")}
              </span>
              <span className="font-mono font-bold text-[#173D2B]">{simSoilMoisture}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="90"
              value={simSoilMoisture}
              onChange={(e) => setSimSoilMoisture(Number(e.target.value))}
              className="w-full accent-[#173D2B] cursor-pointer"
            />
            <span className="text-[0.62rem] text-[#68756A] block">
              {simSoilMoisture < 25 ? t("twin.sim.dryLoam", "Dry / Cracked Pale Loam") : simSoilMoisture > 55 ? t("twin.sim.saturatedLoam", "Saturated Deep Red-Brown") : t("twin.sim.optimalLoam", "Optimal Capillary Soil")}
            </span>
          </div>

          {/* Temperature Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-[#68756A] flex items-center gap-1 font-medium">
                <Flame className="size-3.5 text-[#C9A65B]" /> {t("twin.sim.temperature", "Temperature:")}
              </span>
              <span className="font-mono font-bold text-[#173D2B]">{simTemperature}°C</span>
            </div>
            <input
              type="range"
              min="15"
              max="45"
              value={simTemperature}
              onChange={(e) => setSimTemperature(Number(e.target.value))}
              className="w-full accent-[#C9A65B] cursor-pointer"
            />
            <span className="text-[0.62rem] text-[#68756A] block">
              {simTemperature > 34 ? t("twin.sim.heatStress", "Heat Stress Sunlight Tint") : t("twin.sim.optimalThermal", "Optimal Vegetative Thermal Range")}
            </span>
          </div>

          {/* 3D Rainfall Toggle & Rate Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-[#68756A] flex items-center gap-1 font-medium">
                <CloudRain className="size-3.5 text-teal-600" /> {t("twin.sim.rain", "3D Falling Rain:")}
              </span>
              <button
                onClick={() => setSimRainfallActive(!simRainfallActive)}
                className={`px-2 py-0.5 rounded text-[0.65rem] font-bold cursor-pointer transition-colors ${
                  simRainfallActive ? "bg-[#173D2B] text-white" : "bg-[#E5E1D6] text-[#68756A]"
                }`}
              >
                {simRainfallActive ? t("twin.sim.active", "ACTIVE") : t("twin.sim.off", "OFF")}
              </button>
            </div>
            <input
              type="range"
              min="5"
              max="60"
              disabled={!simRainfallActive}
              value={simRainfallRate}
              onChange={(e) => setSimRainfallRate(Number(e.target.value))}
              className="w-full accent-teal-600 cursor-pointer disabled:opacity-40"
            />
            <span className="text-[0.62rem] text-[#68756A] block">
              {simRainfallActive ? `${simRainfallRate} ${t("twin.sim.rainActiveDesc", "mm/h 3D Particle Rain")}` : t("twin.sim.rainInactiveDesc", "Precipitation Inactive")}
            </span>
          </div>

          {/* Wind Speed Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-[#68756A] flex items-center gap-1 font-medium">
                <Wind className="size-3.5 text-[#173D2B]" /> {t("twin.sim.windSway", "Wind Sway:")}
              </span>
              <span className="font-mono font-bold text-[#173D2B]">{simWindSpeed} km/h</span>
            </div>
            <input
              type="range"
              min="0"
              max="45"
              value={simWindSpeed}
              onChange={(e) => setSimWindSpeed(Number(e.target.value))}
              className="w-full accent-[#173D2B] cursor-pointer"
            />
            <span className="text-[0.62rem] text-[#68756A] block">
              {t("twin.sim.windDesc", "Plant Sway Sine Oscillation")}
            </span>
          </div>

          {/* Crop Growth Stage Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-[#68756A] flex items-center gap-1 font-medium">
                <Sprout className="size-3.5 text-[#173D2B]" /> {t("twin.sim.growthStage", "Growth Stage:")}
              </span>
              <span className="font-mono font-bold text-[#173D2B]">{simGrowthStage + 1} / 9</span>
            </div>
            <input
              type="range"
              min="0"
              max="8"
              value={simGrowthStage}
              onChange={(e) => setSimGrowthStage(Number(e.target.value))}
              className="w-full accent-[#173D2B] cursor-pointer"
            />
            <span className="text-[0.62rem] text-[#68756A] block truncate">
              {translateGrowthStage(NINE_GROWTH_STAGES[simGrowthStage]?.stageName || "Morphology", language)}
            </span>
          </div>
        </div>
      </div>

      {/* 360° Real-World Crop & Land Inspector Modal */}
      {showRealPhotoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-3xl bg-[#FFFEFA] border border-[#E5E1D6] shadow-2xl overflow-hidden text-[#20352A]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E1D6] bg-[#F8F4EB]">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#E4EBDD] text-[#173D2B] border border-[#C9D9BE]">
                  <Camera className="size-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#173D2B] flex items-center gap-2">
                    {t("twin.realModal.title", "Real-World Agricultural Land & Plant Inspection")}
                    <span className="text-[0.65rem] px-2 py-0.5 rounded-full bg-[#E4EBDD] text-[#173D2B] border border-[#C9D9BE] font-mono font-bold">
                      360° GROUND TRUTH
                    </span>
                  </h3>
                  <p className="text-xs text-[#68756A]">
                    {t("twin.realModal.subtitle", "High-resolution photographic digital twin with calibrated live IoT field telemetry")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowRealPhotoModal(false)}
                  className="p-2 rounded-xl bg-[#FFFEFA] hover:bg-[#E4EBDD] text-[#68756A] hover:text-[#173D2B] border border-[#E5E1D6] transition-colors cursor-pointer shadow-xs"
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>

            {/* Photo Selector Tabs */}
            <div className="flex items-center gap-2 px-6 py-2.5 bg-[#F8F4EB]/60 border-b border-[#E5E1D6] overflow-x-auto">
              <button
                onClick={() => {
                  setSelectedPhotoTab("composite");
                  setPhotoZoom(1.0);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedPhotoTab === "composite"
                    ? "bg-[#173D2B] text-white shadow-xs font-bold"
                    : "text-[#68756A] hover:text-[#173D2B] hover:bg-[#E4EBDD]"
                }`}
              >
                {t("twin.realModal.allPlots", "Full Farm (All 4 Plots)")}
              </button>
              {CADASTRAL_PLOTS.map((plot) => (
                <button
                  key={plot.id}
                  onClick={() => {
                    setSelectedPhotoTab(plot.id);
                    setActivePhotoPlot(plot);
                    setPhotoZoom(1.0);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedPhotoTab === plot.id
                      ? "bg-[#173D2B] text-white shadow-xs font-bold"
                      : "text-[#68756A] hover:text-[#173D2B] hover:bg-[#E4EBDD]"
                  }`}
                >
                  <span className="size-2 rounded-full bg-[#173D2B]" />
                  <span>{translateCrop(plot.cropType, language)}</span>
                </button>
              ))}
            </div>

            {/* Main Interactive Photographic Viewport */}
            <div className="relative flex-1 min-h-[380px] max-h-[56vh] bg-[#1a2e22] flex items-center justify-center overflow-hidden">
              <div
                className="relative transition-transform duration-200 ease-out flex items-center justify-center max-w-full max-h-full"
                style={{ transform: `scale(${photoZoom})` }}
              >
                {/* Real-world photo */}
                <img
                  src={
                    selectedPhotoTab === "composite"
                      ? "/textures/farm/farm_composite_real.jpg"
                      : getCropImage(activePhotoPlot.cropType, "field")
                  }
                  alt={activePhotoPlot.displayName || "Real Agricultural Land and Crop"}
                  className="max-h-[52vh] max-w-full object-contain rounded-xl shadow-2xl select-none"
                  draggable={false}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = activePhotoPlot.realPhotoUrl;
                  }}
                />

                {/* Overlaid IoT Telemetry Pins on Real Photo */}
                {selectedPhotoTab !== "composite" && (
                  <>
                    {/* Top-Left: Soil Moisture & Temperature Pin */}
                    <div className="absolute top-4 left-6 p-2 rounded-xl bg-[#FFFEFA]/95 backdrop-blur-md border border-[#E5E1D6] shadow-lg text-[#20352A] text-[0.7rem] space-y-0.5 animate-in fade-in duration-300">
                      <div className="flex items-center gap-1.5 font-bold text-[#173D2B]">
                        <Droplets className="size-3.5" />
                        <span>{t("twin.telemetry.soilMoisture", "Soil Moisture")}: {activePhotoPlot.soilMoisturePct}%</span>
                      </div>
                      <div className="text-[0.65rem] text-[#68756A] font-mono">
                        {t("twin.telemetry.temp", "Temp")}: {activePhotoPlot.temperatureC}°C • pH: {activePhotoPlot.soilPH}
                      </div>
                    </div>

                    {/* Top-Right: Growth Stage & Yield Pin */}
                    <div className="absolute top-4 right-6 p-2 rounded-xl bg-[#FFFEFA]/95 backdrop-blur-md border border-[#E5E1D6] shadow-lg text-[#20352A] text-[0.7rem] space-y-0.5 animate-in fade-in duration-300">
                      <div className="flex items-center gap-1.5 font-bold text-[#173D2B]">
                        <Sprout className="size-3.5" />
                        <span>{translateGrowthStage(activePhotoPlot.growthStage, language)}</span>
                      </div>
                      <div className="text-[0.65rem] text-[#68756A] font-mono">
                        {t("twin.telemetry.estYield", "Yield")}: {activePhotoPlot.predictedYieldTonnesHa} T/Ha • {activePhotoPlot.areaHectares} Ha
                      </div>
                    </div>

                    {/* Center-Bottom: Soil Bed & Water Channel Pin */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-xl bg-[#FFFEFA]/95 backdrop-blur-md border border-[#E5E1D6] shadow-lg text-[#20352A] text-[0.7rem] flex items-center gap-2 animate-in fade-in duration-300">
                      <Waves className="size-3.5 text-[#C9A65B]" />
                      <span className="text-[#173D2B] font-bold">{translateSoil(activePhotoPlot.soilType, language)}</span>
                      <span className="text-[#68756A] font-mono">|</span>
                      <span className="text-[#173D2B] font-mono">{activePhotoPlot.waterRequirementsDaily}</span>
                    </div>
                  </>
                )}

                {/* Composite Farm Quadrant Overlay Labels */}
                {selectedPhotoTab === "composite" && (
                  <div className="absolute inset-0 pointer-events-none grid grid-cols-2 grid-rows-2 p-4">
                    <div className="flex items-start justify-start p-2">
                      <span className="px-2.5 py-1 rounded-lg bg-[#FFFEFA]/90 backdrop-blur-md text-[#173D2B] border border-[#E5E1D6] text-xs font-bold shadow-md">
                        North-West: Mandya Ragi
                      </span>
                    </div>
                    <div className="flex items-start justify-end p-2">
                      <span className="px-2.5 py-1 rounded-lg bg-[#FFFEFA]/90 backdrop-blur-md text-rose-700 border border-[#E5E1D6] text-xs font-bold shadow-md">
                        North-East: Intensive Tomato
                      </span>
                    </div>
                    <div className="flex items-end justify-start p-2">
                      <span className="px-2.5 py-1 rounded-lg bg-[#FFFEFA]/90 backdrop-blur-md text-[#173D2B] border border-[#E5E1D6] text-xs font-bold shadow-md">
                        South-West: Cauvery Sugarcane
                      </span>
                    </div>
                    <div className="flex items-end justify-end p-2">
                      <span className="px-2.5 py-1 rounded-lg bg-[#FFFEFA]/90 backdrop-blur-md text-amber-700 border border-[#E5E1D6] text-xs font-bold shadow-md">
                        South-East: Neat Groundnut
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Floating Zoom Controls */}
              <div className="absolute bottom-4 right-4 flex items-center gap-1.5 p-1 rounded-xl bg-[#FFFEFA]/90 backdrop-blur-md border border-[#E5E1D6] shadow-md z-20">
                <button
                  onClick={() => setPhotoZoom((z) => Math.min(3.0, z + 0.25))}
                  title="Zoom In"
                  className="p-1.5 rounded-lg hover:bg-[#E4EBDD] text-[#173D2B] cursor-pointer"
                >
                  <ZoomIn className="size-4" />
                </button>
                <button
                  onClick={() => setPhotoZoom((z) => Math.max(0.75, z - 0.25))}
                  title="Zoom Out"
                  className="p-1.5 rounded-lg hover:bg-[#E4EBDD] text-[#173D2B] cursor-pointer"
                >
                  <ZoomOut className="size-4" />
                </button>
                <button
                  onClick={() => setPhotoZoom(1.0)}
                  title="Reset Zoom"
                  className="px-2 py-1 rounded-lg hover:bg-[#E4EBDD] text-[0.68rem] font-mono text-[#173D2B] font-bold cursor-pointer"
                >
                  {Math.round(photoZoom * 100)}%
                </button>
              </div>
            </div>

            {/* Modal Footer with Plot Details & 3D Sync Action */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3.5 bg-[#F8F4EB] border-t border-[#E5E1D6] text-xs">
              <div className="flex items-center gap-4 text-[#20352A]">
                {selectedPhotoTab !== "composite" ? (
                  <>
                    <div>
                      <span className="text-[#68756A] block text-[0.65rem]">{t("twin.telemetry.variety", "Variety:")}</span>
                      <span className="font-bold text-[#173D2B]">{activePhotoPlot.variety}</span>
                    </div>
                    <div className="hidden sm:block">
                      <span className="text-[#68756A] block text-[0.65rem]">{t("twin.telemetry.irrigationType", "Irrigation:")}</span>
                      <span className="font-bold text-[#173D2B]">{activePhotoPlot.irrigationType}</span>
                    </div>
                    <div className="hidden md:block">
                      <span className="text-[#68756A] block text-[0.65rem]">{t("twin.telemetry.npkNutrients", "N-P-K Nutrients:")}</span>
                      <span className="font-mono font-bold text-[#173D2B]">
                        {activePhotoPlot.nitrogenPPM}N - {activePhotoPlot.phosphorusPPM}P - {activePhotoPlot.potassiumPPM}K
                      </span>
                    </div>
                  </>
                ) : (
                  <span className="text-[#68756A]">
                    {t("twin.realModal.farmSummary", "4 distinct cadastral sectors showing real canopy density, soil beds, and irrigation furrows.")}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {selectedPhotoTab !== "composite" && (
                  <button
                    onClick={() => {
                      handleSelectPlot(activePhotoPlot);
                      setCameraView(
                        activePhotoPlot.cropType === "Ragi (Finger Millet)"
                          ? "ragi"
                          : activePhotoPlot.cropType === "Tomato"
                          ? "tomato"
                          : activePhotoPlot.cropType === "Sugarcane"
                          ? "sugarcane"
                          : "groundnut"
                      );
                      setShowRealPhotoModal(false);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-[#173D2B] hover:bg-[#102F22] text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Eye className="size-3.5" />
                    <span>{t("twin.realModal.focusIn3D", "Sync 3D Camera to This Plot")}</span>
                  </button>
                )}
                <button
                  onClick={() => setShowRealPhotoModal(false)}
                  className="px-3.5 py-1.5 rounded-xl bg-[#FFFEFA] hover:bg-[#E4EBDD] text-[#68756A] hover:text-[#173D2B] border border-[#E5E1D6] font-semibold text-xs transition-colors cursor-pointer"
                >
                  {t("twin.realModal.close", "Close")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
