import * as THREE from "three";

export type SupportedCrop =
  | "Ragi (Finger Millet)"
  | "Tomato"
  | "Sugarcane"
  | "Rice / Paddy"
  | "Wheat"
  | "Maize"
  | "Cotton"
  | "Groundnut"
  | "Banana"
  | "Carrot"
  | "Beetroot"
  | "Potato";

export const VEGETABLE_CROPS: SupportedCrop[] = [
  "Tomato",
  "Carrot",
  "Beetroot",
  "Potato",
];

export interface GrowthStageSpec {
  id: number;
  label: string;
  das: number;
  scale: number;
  stageName: string;
  description: string;
}

export const NINE_GROWTH_STAGES: GrowthStageSpec[] = [
  { id: 0, label: "1. Land Preparation (0 DAS)", das: 0, scale: 0.05, stageName: "Land Prep", description: "Furrowed tillage and leveled soil bed ready for sowing" },
  { id: 1, label: "2. Seed Sowing (5 DAS)", das: 5, scale: 0.12, stageName: "Sowing", description: "Moist seed drill lines with initial capillary hydration" },
  { id: 2, label: "3. Germination (10 DAS)", das: 10, scale: 0.22, stageName: "Germination", description: "Emerging radicles and first green plumule shoots" },
  { id: 3, label: "4. Seedling (20 DAS)", das: 20, scale: 0.38, stageName: "Seedling", description: "Primary leaf collar expansion and crown establishment" },
  { id: 4, label: "5. Vegetative (40 DAS)", das: 40, scale: 0.65, stageName: "Vegetative", description: "Active tillering, branching stem elongation, and root expansion" },
  { id: 5, label: "6. Flowering (60 DAS)", das: 60, scale: 0.85, stageName: "Flowering", description: "Anthesis, blossom clusters, and earhead emergence" },
  { id: 6, label: "7. Fruiting / Grain Fill (80 DAS)", das: 80, scale: 1.0, stageName: "Fruiting / Grain Fill", description: "Milk-to-dough stage, green fruit sizing, and sucrose accumulation" },
  { id: 7, label: "8. Maturity (100 DAS)", das: 100, scale: 1.15, stageName: "Maturity", description: "Golden grain ripening, fruit color break, and physiological maturity" },
  { id: 8, label: "9. Harvest (115+ DAS)", das: 115, scale: 1.05, stageName: "Harvest", description: "Ripe harvest-ready crop, field gathering, and post-harvest drying" },
];

export interface CropBotanicalConfig {
  cropType: SupportedCrop;
  displayName: string;
  scientificName: string;
  plantHeight: number; // in 3D world units
  rowSpacing: number; // distance between rows
  plantSpacing: number; // distance between plants in a row
  rowArrangement: "raised_beds" | "furrows" | "flooded_basin" | "dense_drill" | "wide_orchard";
  irrigationType: "drip" | "furrow" | "flooded" | "sprinkler" | "micro_jet";
  rootDepth: number;
  rootStyle: "taproot" | "fibrous_shallow" | "deep_mat" | "prop_roots" | "pegging_nodules" | "rhizome_cord";
  visualDescription: string;
  waterConsumptionDaily: string;
  optimalSoilPH: string;
  tempTolerance: string;
  harvestCycle: string;
  keyPestRisks: string[];
}

export const CROP_CONFIGS: Record<SupportedCrop, CropBotanicalConfig> = {
  "Ragi (Finger Millet)": {
    cropType: "Ragi (Finger Millet)",
    displayName: "Ragi / Finger Millet (ML-365)",
    scientificName: "Eleusine coracana",
    plantHeight: 1.25,
    rowSpacing: 1.8,
    plantSpacing: 1.2,
    rowArrangement: "raised_beds",
    irrigationType: "drip",
    rootDepth: 1.1,
    rootStyle: "fibrous_shallow",
    visualDescription: "Dense tufted tillers, narrow upright strap leaves, terminal whorl of 4-6 finger-shaped claw panicle seed heads",
    waterConsumptionDaily: "3.2 mm/day",
    optimalSoilPH: "5.5 - 7.5",
    tempTolerance: "22°C - 32°C",
    harvestCycle: "105 - 120 Days",
    keyPestRisks: ["Blast (Pyricularia)", "Stem Borer", "Foot Rot"],
  },
  Tomato: {
    cropType: "Tomato",
    displayName: "Tomato (Arka Rakshak F1)",
    scientificName: "Solanum lycopersicum",
    plantHeight: 1.5,
    rowSpacing: 3.2,
    plantSpacing: 2.2,
    rowArrangement: "raised_beds",
    irrigationType: "drip",
    rootDepth: 1.2,
    rootStyle: "taproot",
    visualDescription: "Bushy vine, serrated compound leaflets, bamboo supporting stakes, green and bright red tomato fruits",
    waterConsumptionDaily: "4.5 mm/day",
    optimalSoilPH: "6.0 - 6.8",
    tempTolerance: "18°C - 30°C",
    harvestCycle: "95 - 110 Days",
    keyPestRisks: ["Early Blight", "Late Blight", "Fruit Borer", "Leaf Curl Virus"],
  },
  Sugarcane: {
    cropType: "Sugarcane",
    displayName: "Sugarcane (Co-86032)",
    scientificName: "Saccharum officinarum",
    plantHeight: 3.2,
    rowSpacing: 2.8,
    plantSpacing: 1.6,
    rowArrangement: "furrows",
    irrigationType: "furrow",
    rootDepth: 2.2,
    rootStyle: "deep_mat",
    visualDescription: "Dense tall sucrose cane stalks (3m+), segmented rings, long arching strap leaves with prominent midrib",
    waterConsumptionDaily: "7.2 mm/day",
    optimalSoilPH: "6.5 - 7.8",
    tempTolerance: "24°C - 38°C",
    harvestCycle: "360 - 420 Days",
    keyPestRisks: ["Red Rot", "Early Shoot Borer", "Smut", "Woolly Aphid"],
  },
  "Rice / Paddy": {
    cropType: "Rice / Paddy",
    displayName: "Rice / Paddy (JGL 1798)",
    scientificName: "Oryza sativa",
    plantHeight: 1.1,
    rowSpacing: 1.4,
    plantSpacing: 1.1,
    rowArrangement: "flooded_basin",
    irrigationType: "flooded",
    rootDepth: 0.8,
    rootStyle: "fibrous_shallow",
    visualDescription: "Flooded water basin with realistic water reflections, perimeter bunds, fine green tillers and drooping golden panicles",
    waterConsumptionDaily: "8.5 mm/day",
    optimalSoilPH: "5.5 - 7.2",
    tempTolerance: "22°C - 34°C",
    harvestCycle: "115 - 135 Days",
    keyPestRisks: ["Paddy Blast", "Bacterial Leaf Blight", "Brown Planthopper", "Stem Borer"],
  },
  Wheat: {
    cropType: "Wheat",
    displayName: "Wheat (UAS-304)",
    scientificName: "Triticum aestivum",
    plantHeight: 0.95,
    rowSpacing: 1.2,
    plantSpacing: 0.8,
    rowArrangement: "dense_drill",
    irrigationType: "sprinkler",
    rootDepth: 1.4,
    rootStyle: "fibrous_shallow",
    visualDescription: "Dense golden-green stands, slender upright hollow culms with awned bearded grain heads",
    waterConsumptionDaily: "3.8 mm/day",
    optimalSoilPH: "6.0 - 7.5",
    tempTolerance: "15°C - 26°C",
    harvestCycle: "105 - 120 Days",
    keyPestRisks: ["Brown Rust", "Karnal Bunt", "Terminal Heat Stress"],
  },
  Maize: {
    cropType: "Maize",
    displayName: "Maize / Corn (CP-818)",
    scientificName: "Zea mays",
    plantHeight: 2.2,
    rowSpacing: 2.4,
    plantSpacing: 1.5,
    rowArrangement: "furrows",
    irrigationType: "drip",
    rootDepth: 1.6,
    rootStyle: "prop_roots",
    visualDescription: "Sturdy bamboo-like stalks, prominent aerial prop roots, broad arching leaves, corn cobs with golden silk and top tassels",
    waterConsumptionDaily: "5.4 mm/day",
    optimalSoilPH: "5.8 - 7.2",
    tempTolerance: "20°C - 32°C",
    harvestCycle: "100 - 115 Days",
    keyPestRisks: ["Fall Armyworm", "Stem Borer", "Maydis Leaf Blight"],
  },
  Cotton: {
    cropType: "Cotton",
    displayName: "Cotton (Bt Hybrid RCH-2)",
    scientificName: "Gossypium hirsutum",
    plantHeight: 1.35,
    rowSpacing: 3.0,
    plantSpacing: 1.8,
    rowArrangement: "raised_beds",
    irrigationType: "drip",
    rootDepth: 1.8,
    rootStyle: "taproot",
    visualDescription: "Branching woody shrub, lobed dark leaves, sulfur-yellow blossoms, bursting fluffy white cotton bolls with dried capsules",
    waterConsumptionDaily: "5.2 mm/day",
    optimalSoilPH: "6.5 - 8.0",
    tempTolerance: "22°C - 36°C",
    harvestCycle: "150 - 180 Days",
    keyPestRisks: ["Pink Bollworm", "Whitefly", "Bacterial Blight"],
  },
  Groundnut: {
    cropType: "Groundnut",
    displayName: "Groundnut / Peanut (TMV-2)",
    scientificName: "Arachis hypogaea",
    plantHeight: 0.45,
    rowSpacing: 1.6,
    plantSpacing: 1.0,
    rowArrangement: "raised_beds",
    irrigationType: "micro_jet",
    rootDepth: 0.6,
    rootStyle: "pegging_nodules",
    visualDescription: "Dense low-growing spreading clover canopy, bright yellow flowers, geocarpic subterranean pegs with underground peanut pods",
    waterConsumptionDaily: "3.4 mm/day",
    optimalSoilPH: "6.0 - 7.2",
    tempTolerance: "22°C - 32°C",
    harvestCycle: "105 - 120 Days",
    keyPestRisks: ["Tikka Leaf Spot", "Collar Rot", "Spodoptera litura"],
  },
  Banana: {
    cropType: "Banana",
    displayName: "Banana (Grand Naine G9)",
    scientificName: "Musa acuminata",
    plantHeight: 3.4,
    rowSpacing: 3.6,
    plantSpacing: 3.2,
    rowArrangement: "wide_orchard",
    irrigationType: "micro_jet",
    rootDepth: 0.8,
    rootStyle: "rhizome_cord",
    visualDescription: "Stout succulent pseudostem trunk, massive broad drooping paddle leaves (2.5m), pendant flower heart and hanging bunch of green curved fingers",
    waterConsumptionDaily: "9.2 mm/day",
    optimalSoilPH: "6.0 - 7.5",
    tempTolerance: "20°C - 35°C",
    harvestCycle: "330 - 365 Days",
    keyPestRisks: ["Panama Wilt (Fusarium)", "Sigatoka Leaf Spot", "Banana Bunchy Top Virus"],
  },
  Carrot: {
    cropType: "Carrot",
    displayName: "Carrot (Kuroda / Pusa Rudhira)",
    scientificName: "Daucus carota subsp. sativus",
    plantHeight: 0.45,
    rowSpacing: 1.2,
    plantSpacing: 0.4,
    rowArrangement: "raised_beds",
    irrigationType: "drip",
    rootDepth: 0.35,
    rootStyle: "taproot",
    visualDescription: "Lush feathery bipinnate fern-like green rosette leaves (0.4m), thick conical orange taproot swelling partially at the crown shoulder",
    waterConsumptionDaily: "3.8 mm/day",
    optimalSoilPH: "6.0 - 6.8",
    tempTolerance: "16°C - 24°C",
    harvestCycle: "85 - 105 Days",
    keyPestRisks: ["Cavity Spot (Pythium)", "Carrot Rust Fly", "Powdery Mildew", "Bacterial Soft Rot"],
  },
  Beetroot: {
    cropType: "Beetroot",
    displayName: "Beetroot (Detroit Dark Red / Crimson Globe)",
    scientificName: "Beta vulgaris subsp. vulgaris",
    plantHeight: 0.40,
    rowSpacing: 1.2,
    plantSpacing: 0.45,
    rowArrangement: "raised_beds",
    irrigationType: "drip",
    rootDepth: 0.30,
    rootStyle: "taproot",
    visualDescription: "Upright dark green crinkled leaves with prominent magenta-red midribs and ruby petiole stalks, globose deep purple-red hypocotyl bulb protruding above soil",
    waterConsumptionDaily: "3.5 mm/day",
    optimalSoilPH: "6.0 - 7.0",
    tempTolerance: "15°C - 22°C",
    harvestCycle: "65 - 80 Days",
    keyPestRisks: ["Cercospora Leaf Spot", "Root Aphids", "Heart Rot (Boron Deficiency)", "Downy Mildew"],
  },
  Potato: {
    cropType: "Potato",
    displayName: "Potato (Kufri Jyoti / Kufri Pukhraj)",
    scientificName: "Solanum tuberosum",
    plantHeight: 0.65,
    rowSpacing: 1.8,
    plantSpacing: 0.8,
    rowArrangement: "furrows",
    irrigationType: "sprinkler",
    rootDepth: 0.50,
    rootStyle: "taproot",
    visualDescription: "Herbaceous multi-stemmed bush with compound pinnate foliage, star-shaped white-violet blossoms with yellow anthers, ridged earthen mounds harboring subterranean cluster of 6-10 oval tubers",
    waterConsumptionDaily: "4.8 mm/day",
    optimalSoilPH: "5.5 - 6.5",
    tempTolerance: "15°C - 24°C",
    harvestCycle: "90 - 110 Days",
    keyPestRisks: ["Late Blight (Phytophthora infestans)", "Early Blight", "Potato Tuber Moth", "Bacterial Wilt / Brown Rot"],
  },
};

/**
 * Procedural 3D Botanical Mesh Generator for all 9 crops and 9 growth stages.
 */
export function buildBotanicalCrop(
  cropType: SupportedCrop,
  stageIndex: number = 6
): THREE.Group {
  const group = new THREE.Group();
  const stage = NINE_GROWTH_STAGES[stageIndex] || NINE_GROWTH_STAGES[6];
  const s = stage.scale;

  // Shared botanical materials with physically calibrated reflectance
  const stemGreen = new THREE.MeshStandardMaterial({ color: 0x4d7c0f, roughness: 0.7 });
  const leafDark = new THREE.MeshStandardMaterial({ color: 0x2e7d32, roughness: 0.6, side: THREE.DoubleSide });
  const flowerYellow = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4 });
  const drySoilMat = new THREE.MeshStandardMaterial({ color: 0x4a3525, roughness: 0.95 });

  // Early stages (0: Land Prep, 1: Sowing) show minimal shoot emergence
  if (stage.id === 0) {
    // Bare prepared soil mound with tilled ridge marker
    const tilledMound = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.25, 0.08, 8),
      drySoilMat
    );
    tilledMound.position.y = 0.04;
    group.add(tilledMound);
    return group;
  }

  if (stage.id === 1) {
    // Sowing: tiny furrow indent and seed drill marker
    const seedPeg = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.015, 0.08, 4),
      new THREE.MeshStandardMaterial({ color: 0x854d0e })
    );
    seedPeg.position.y = 0.04;
    group.add(seedPeg);
    return group;
  }

  if (stage.id === 2) {
    // Germination: tiny 2-leaf plumule
    const shoot = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.015, 0.12, 4), stemGreen);
    shoot.position.y = 0.06;
    group.add(shoot);

    const cotyledonGeo = new THREE.CircleGeometry(0.04, 5);
    const c1 = new THREE.Mesh(cotyledonGeo, leafDark);
    c1.position.set(0.03, 0.11, 0);
    c1.rotation.x = -Math.PI / 4;
    const c2 = new THREE.Mesh(cotyledonGeo, leafDark);
    c2.position.set(-0.03, 0.11, 0);
    c2.rotation.x = -Math.PI / 4;
    group.add(c1, c2);
    return group;
  }

  // ==================== 1. RAGI (FINGER MILLET) BOTANICAL MODEL ====================
  if (cropType === "Ragi (Finger Millet)") {
    // Mature ragi has reddish-brown grain heads as in reference photo
    const culmMat = new THREE.MeshStandardMaterial({
      color: stage.id >= 7 ? 0xb45309 : 0x65a30d,
      roughness: 0.65,
    });
    const headMatReddishBrown = new THREE.MeshStandardMaterial({
      color: 0x78350f, // Deep rusty reddish-brown finger spikes matching photo
      roughness: 0.55,
      metalness: 0.05,
    });
    const headMatSemiRipe = new THREE.MeshStandardMaterial({
      color: 0xa16207, // Amber brown
      roughness: 0.6,
    });

    // Tuft of 5-7 tillers emerging from crown
    const tillerCount = Math.min(7, 3 + Math.floor(stage.id * 0.6));
    for (let t = 0; t < tillerCount; t++) {
      const angle = (t * Math.PI * 2) / tillerCount;
      const height = (1.15 + (t % 3) * 0.12) * s;
      const culmGeo = new THREE.CylinderGeometry(0.022 * s, 0.032 * s, height, 6);
      const culm = new THREE.Mesh(culmGeo, culmMat);
      culm.position.set(Math.cos(angle) * 0.08 * s, height / 2, Math.sin(angle) * 0.08 * s);
      culm.rotation.z = Math.cos(angle) * 0.09;
      culm.rotation.x = Math.sin(angle) * 0.09;
      culm.castShadow = true;
      group.add(culm);

      // Narrow upright strap leaves along culm
      for (let l = 1; l < 4; l++) {
        const leafGeo = new THREE.ConeGeometry(0.06 * s, 0.65 * s, 3);
        const leaf = new THREE.Mesh(leafGeo, leafDark);
        leaf.position.set(Math.cos(angle) * 0.12 * s, (l * height) / 4.5, Math.sin(angle) * 0.12 * s);
        leaf.rotation.z = (Math.PI / 4) * (l % 2 === 0 ? 1 : -1);
        leaf.castShadow = true;
        group.add(leaf);
      }

      // Characteristic Finger Millet Earhead: 5-6 inward-curving reddish-brown fingers
      if (stage.id >= 5) {
        const earGroup = new THREE.Group();
        earGroup.position.set(culm.position.x, height, culm.position.z);

        const fingerCount = 5 + (t % 2);
        for (let f = 0; f < fingerCount; f++) {
          const fAngle = (f * Math.PI * 2) / fingerCount;
          // Inward curved digit/finger spike
          const fingerCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(Math.cos(fAngle) * 0.07 * s, 0.09 * s, Math.sin(fAngle) * 0.07 * s),
            new THREE.Vector3(Math.cos(fAngle) * 0.11 * s, 0.18 * s, Math.sin(fAngle) * 0.11 * s),
            new THREE.Vector3(Math.cos(fAngle) * 0.05 * s, 0.25 * s, Math.sin(fAngle) * 0.05 * s), // Graceful inward claw hook
          ]);
          const fingerGeo = new THREE.TubeGeometry(fingerCurve, 8, 0.03 * s, 6, false);
          const fingerMesh = new THREE.Mesh(fingerGeo, stage.id >= 7 ? headMatReddishBrown : headMatSemiRipe);
          fingerMesh.castShadow = true;
          earGroup.add(fingerMesh);
        }
        group.add(earGroup);
      }
    }
  }

  // ==================== 2. TOMATO BOTANICAL MODEL ====================
  else if (cropType === "Tomato") {
    // Tall bamboo support stake (matching reference photo)
    const stakeGeo = new THREE.CylinderGeometry(0.025, 0.028, 1.9 * s, 6);
    const stakeMat = new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.9 });
    const stake = new THREE.Mesh(stakeGeo, stakeMat);
    stake.position.set(0.08, 0.95 * s, -0.06);
    stake.castShadow = true;
    group.add(stake);

    // Main vine stem tied to stake
    const stemGeo = new THREE.CylinderGeometry(0.04 * s, 0.05 * s, 1.6 * s, 8);
    const stem = new THREE.Mesh(stemGeo, stemGreen);
    stem.position.y = 0.8 * s;
    stem.rotation.z = 0.04;
    stem.castShadow = true;
    group.add(stem);

    // Lush compound serrated leaves
    const leafCount = Math.min(14, 5 + stage.id);
    for (let i = 0; i < leafCount; i++) {
      const angle = (i * Math.PI) / 3.2;
      const leafGeo = new THREE.ConeGeometry(0.2 * s, 0.48 * s, 4);
      const leaf = new THREE.Mesh(leafGeo, leafDark);
      leaf.position.set(Math.cos(angle) * 0.28 * s, (0.28 + i * 0.1) * s, Math.sin(angle) * 0.28 * s);
      leaf.rotation.x = Math.PI / 2 + 0.15;
      leaf.rotation.y = angle;
      leaf.castShadow = true;
      group.add(leaf);
    }

    // Yellow blossom flowers
    if (stage.id >= 5) {
      for (let f = 0; f < 3; f++) {
        const flower = new THREE.Mesh(new THREE.ConeGeometry(0.05 * s, 0.08 * s, 5), flowerYellow);
        flower.position.set(0.18 * s, (0.75 + f * 0.2) * s, 0.18 * s);
        group.add(flower);
      }
    }

    // Visible red, ripening orange, and green tomatoes (matching photo)
    if (stage.id >= 5) {
      const redMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.2, metalness: 0.1 });
      const orangeMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.25 });
      const greenMat = new THREE.MeshStandardMaterial({ color: 0x65a30d, roughness: 0.35 });

      // 6 fruit specimens on each vine in varying ripeness
      const tomatoColors = [redMat, redMat, orangeMat, orangeMat, greenMat, greenMat];
      for (let t = 0; t < 6; t++) {
        const tAngle = t * 1.35;
        const radius = 0.085 * (0.8 + (t % 3) * 0.2) * s;
        const tGeo = new THREE.SphereGeometry(radius, 10, 10);
        const tMesh = new THREE.Mesh(tGeo, tomatoColors[t]);
        tMesh.position.set(
          Math.cos(tAngle) * 0.25 * s,
          (0.35 + t * 0.18) * s,
          Math.sin(tAngle) * 0.25 * s
        );
        tMesh.castShadow = true;
        group.add(tMesh);
      }
    }
  }

  // ==================== 3. SUGARCANE BOTANICAL MODEL ====================
  else if (cropType === "Sugarcane") {
    const caneMat = new THREE.MeshStandardMaterial({ color: 0x5a7c2f, roughness: 0.5 });
    const nodeMat = new THREE.MeshStandardMaterial({ color: 0x4d7c0f, roughness: 0.6 });
    const trashMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 }); // Dried lower cane leaves

    [-0.1, 0, 0.1].forEach((offset, idx) => {
      const height = (2.9 + idx * 0.25) * s;
      const stalkGeo = new THREE.CylinderGeometry(0.055 * s, 0.075 * s, height, 8);
      const stalk = new THREE.Mesh(stalkGeo, caneMat);
      stalk.position.set(offset, height / 2, (idx - 1) * 0.08);
      stalk.castShadow = true;
      group.add(stalk);

      // Node rings
      for (let n = 1; n < 8; n++) {
        const ringGeo = new THREE.TorusGeometry(0.068 * s, 0.015 * s, 6, 12);
        const ring = new THREE.Mesh(ringGeo, nodeMat);
        ring.rotation.x = Math.PI / 2;
        ring.position.set(offset, (n * height) / 9, (idx - 1) * 0.08);
        group.add(ring);
      }

      // Dried base leaves (cane trash)
      if (stage.id >= 4) {
        const trash = new THREE.Mesh(new THREE.ConeGeometry(0.08 * s, 0.45 * s, 4), trashMat);
        trash.position.set(offset + 0.04, 0.22 * s, (idx - 1) * 0.08);
        trash.rotation.z = (Math.PI / 3) * (idx % 2 === 0 ? 1 : -1);
        group.add(trash);
      }
    });

    // Arching dense canopy leaves
    for (let l = 0; l < 12; l++) {
      const angle = (l * Math.PI * 2) / 12;
      const strapGeo = new THREE.ConeGeometry(0.14 * s, 1.4 * s, 3);
      const strap = new THREE.Mesh(strapGeo, leafDark);
      strap.position.set(Math.cos(angle) * 0.35 * s, 2.7 * s, Math.sin(angle) * 0.35 * s);
      strap.rotation.z = Math.PI / 3.2;
      strap.rotation.y = angle;
      strap.castShadow = true;
      group.add(strap);
    }
  }

  // ==================== 4. RICE / PADDY BOTANICAL MODEL ====================
  else if (cropType === "Rice / Paddy") {
    const grainMat = new THREE.MeshStandardMaterial({ color: stage.id >= 7 ? 0xd97706 : 0x84cc16, roughness: 0.5 });
    for (let t = 0; t < 9; t++) {
      const angle = (t * Math.PI * 2) / 9;
      const tillerGeo = new THREE.CylinderGeometry(0.015 * s, 0.02 * s, 0.9 * s, 4);
      const tiller = new THREE.Mesh(tillerGeo, stemGreen);
      tiller.position.set(Math.cos(angle) * 0.08 * s, 0.45 * s, Math.sin(angle) * 0.08 * s);
      tiller.rotation.z = (Math.random() - 0.5) * 0.15;
      group.add(tiller);

      if (stage.id >= 6) {
        const panicleGeo = new THREE.ConeGeometry(0.04 * s, 0.28 * s, 4);
        const panicle = new THREE.Mesh(panicleGeo, grainMat);
        panicle.position.set(Math.cos(angle) * 0.12 * s, 0.85 * s, Math.sin(angle) * 0.12 * s);
        panicle.rotation.z = 0.5; // Drooping golden head
        group.add(panicle);
      }
    }
  }

  // ==================== 5. WHEAT BOTANICAL MODEL ====================
  else if (cropType === "Wheat") {
    const wheatGoldMat = new THREE.MeshStandardMaterial({ color: stage.id >= 7 ? 0xca8a04 : 0x65a30d, roughness: 0.6 });
    for (let w = 0; w < 7; w++) {
      const angle = (w * Math.PI * 2) / 7;
      const culmGeo = new THREE.CylinderGeometry(0.015 * s, 0.02 * s, 0.85 * s, 4);
      const culm = new THREE.Mesh(culmGeo, wheatGoldMat);
      culm.position.set(Math.cos(angle) * 0.06 * s, 0.42 * s, Math.sin(angle) * 0.06 * s);
      group.add(culm);

      if (stage.id >= 6) {
        const headGeo = new THREE.CylinderGeometry(0.035 * s, 0.035 * s, 0.22 * s, 6);
        const head = new THREE.Mesh(headGeo, wheatGoldMat);
        head.position.set(Math.cos(angle) * 0.06 * s, 0.88 * s, Math.sin(angle) * 0.06 * s);
        group.add(head);

        const awnGeo = new THREE.CylinderGeometry(0.005 * s, 0.005 * s, 0.15 * s, 3);
        const awn = new THREE.Mesh(awnGeo, wheatGoldMat);
        awn.position.set(Math.cos(angle) * 0.06 * s, 1.02 * s, Math.sin(angle) * 0.06 * s);
        group.add(awn);
      }
    }
  }

  // ==================== 6. MAIZE BOTANICAL MODEL ====================
  else if (cropType === "Maize") {
    const stalk = new THREE.Mesh(new THREE.CylinderGeometry(0.06 * s, 0.08 * s, 2.2 * s, 8), stemGreen);
    stalk.position.y = 1.1 * s;
    stalk.castShadow = true;
    group.add(stalk);

    for (let l = 0; l < 8; l++) {
      const leafSide = l % 2 === 0 ? 1 : -1;
      const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.22 * s, 1.1 * s, 4), leafDark);
      leaf.position.set(leafSide * 0.35 * s, (0.5 + l * 0.2) * s, 0);
      leaf.rotation.z = leafSide * 0.7;
      leaf.castShadow = true;
      group.add(leaf);
    }

    if (stage.id >= 6) {
      const cobGeo = new THREE.CylinderGeometry(0.08 * s, 0.06 * s, 0.35 * s, 8);
      const cob = new THREE.Mesh(cobGeo, new THREE.MeshStandardMaterial({ color: 0x84cc16 }));
      cob.position.set(0.12 * s, 0.95 * s, 0.05 * s);
      cob.rotation.z = -0.4;
      group.add(cob);

      const silk = new THREE.Mesh(new THREE.ConeGeometry(0.03 * s, 0.12 * s, 4), new THREE.MeshStandardMaterial({ color: 0xb45309 }));
      silk.position.set(0.16 * s, 1.15 * s, 0.05 * s);
      group.add(silk);
    }

    if (stage.id >= 5) {
      const tassel = new THREE.Mesh(new THREE.ConeGeometry(0.15 * s, 0.35 * s, 6), new THREE.MeshStandardMaterial({ color: 0xeab308 }));
      tassel.position.y = 2.25 * s;
      group.add(tassel);
    }
  }

  // ==================== 7. COTTON BOTANICAL MODEL ====================
  else if (cropType === "Cotton") {
    const shrubStem = new THREE.Mesh(new THREE.CylinderGeometry(0.05 * s, 0.07 * s, 1.2 * s, 6), stemGreen);
    shrubStem.position.y = 0.6 * s;
    group.add(shrubStem);

    const bollMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.95 });
    const capsuleMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8 });

    for (let c = 0; c < 6; c++) {
      const angle = (c * Math.PI * 2) / 6;
      const bBranch = new THREE.Mesh(new THREE.CylinderGeometry(0.02 * s, 0.02 * s, 0.35 * s, 4), stemGreen);
      bBranch.position.set(Math.cos(angle) * 0.15 * s, (0.4 + c * 0.12) * s, Math.sin(angle) * 0.15 * s);
      bBranch.rotation.z = Math.PI / 4;
      bBranch.rotation.y = angle;
      group.add(bBranch);

      if (stage.id >= 7) {
        const boll = new THREE.Mesh(new THREE.SphereGeometry(0.09 * s, 8, 8), bollMat);
        boll.position.set(Math.cos(angle) * 0.32 * s, (0.5 + c * 0.12) * s, Math.sin(angle) * 0.32 * s);
        group.add(boll);

        const capsule = new THREE.Mesh(new THREE.ConeGeometry(0.07 * s, 0.08 * s, 4), capsuleMat);
        capsule.rotation.z = Math.PI;
        capsule.position.set(Math.cos(angle) * 0.32 * s, (0.46 + c * 0.12) * s, Math.sin(angle) * 0.32 * s);
        group.add(capsule);
      }
    }
  }

  // ==================== 8. GROUNDNUT BOTANICAL MODEL ====================
  else if (cropType === "Groundnut") {
    // Spreading mound bush with dense 4-foliate rounded leaves (matching photo)
    const bushStem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02 * s, 0.03 * s, 0.22 * s, 6),
      stemGreen
    );
    bushStem.position.y = 0.11 * s;
    group.add(bushStem);

    const leafCount = Math.min(14, 6 + stage.id);
    for (let g = 0; g < leafCount; g++) {
      const angle = (g * Math.PI * 2) / leafCount;
      const leafGeo = new THREE.CircleGeometry(0.12 * s, 8);
      const leaf = new THREE.Mesh(leafGeo, leafDark);
      leaf.position.set(
        Math.cos(angle) * (0.18 + (g % 3) * 0.06) * s,
        (0.12 + (g % 4) * 0.04) * s,
        Math.sin(angle) * (0.18 + (g % 3) * 0.06) * s
      );
      leaf.rotation.x = -Math.PI / 2 + 0.25;
      leaf.rotation.y = angle * 0.5;
      leaf.castShadow = true;
      group.add(leaf);

      // Yellow blossoms at leaf axils
      if (stage.id >= 5 && g % 3 === 0) {
        const flower = new THREE.Mesh(new THREE.CircleGeometry(0.045 * s, 5), flowerYellow);
        flower.position.set(Math.cos(angle) * 0.16 * s, 0.18 * s, Math.sin(angle) * 0.16 * s);
        flower.rotation.x = -Math.PI / 2;
        group.add(flower);
      }
    }
  }

  // ==================== 9. BANANA BOTANICAL MODEL ====================
  else if (cropType === "Banana") {
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.16 * s, 0.22 * s, 2.2 * s, 10), new THREE.MeshStandardMaterial({ color: 0x5a7c2f, roughness: 0.6 }));
    trunk.position.y = 1.1 * s;
    trunk.castShadow = true;
    group.add(trunk);

    for (let b = 0; b < 7; b++) {
      const angle = (b * Math.PI * 2) / 7;
      const paddle = new THREE.Mesh(new THREE.ConeGeometry(0.45 * s, 2.2 * s, 4), leafDark);
      paddle.position.set(Math.cos(angle) * 0.6 * s, 2.3 * s, Math.sin(angle) * 0.6 * s);
      paddle.rotation.z = Math.PI / 3;
      paddle.rotation.y = angle;
      paddle.scale.set(1, 1, 0.2);
      paddle.castShadow = true;
      group.add(paddle);
    }

    if (stage.id >= 6) {
      const bunchGroup = new THREE.Group();
      bunchGroup.position.set(0.3 * s, 1.8 * s, 0.2 * s);
      const fingerMat = new THREE.MeshStandardMaterial({ color: stage.id >= 8 ? 0xeab308 : 0x84cc16, roughness: 0.4 });
      for (let f = 0; f < 12; f++) {
        const fAngle = (f * Math.PI * 2) / 12;
        const finger = new THREE.Mesh(new THREE.CylinderGeometry(0.025 * s, 0.02 * s, 0.22 * s, 5), fingerMat);
        finger.position.set(Math.cos(fAngle) * 0.12 * s, -Math.floor(f / 4) * 0.08 * s, Math.sin(fAngle) * 0.12 * s);
        finger.rotation.z = 0.5;
        bunchGroup.add(finger);
      }
      group.add(bunchGroup);
    }
  }

  // ==================== 10. CARROT BOTANICAL MODEL ====================
  else if (cropType === "Carrot") {
    const carrotOrange = new THREE.MeshStandardMaterial({ color: 0xe65100, roughness: 0.5 });
    const carrotFeatheryGreen = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.6, side: THREE.DoubleSide });

    // Taproot (swelling orange cone at crown, top protruding slightly above soil)
    if (stage.id >= 3) {
      const rootH = (0.2 + (stage.id / 8) * 0.35) * s;
      const rootR = (0.03 + (stage.id / 8) * 0.065) * s;
      const rootGeo = new THREE.ConeGeometry(rootR, rootH, 8);
      const rootMesh = new THREE.Mesh(rootGeo, carrotOrange);
      rootMesh.rotation.x = Math.PI;
      rootMesh.position.y = 0.03 * s - rootH / 2;
      group.add(rootMesh);
    }

    // Arching feathery bipinnate fern foliage rosettes (8-10 fronds)
    const frondCount = Math.min(10, 4 + stage.id);
    for (let f = 0; f < frondCount; f++) {
      const fAngle = (f * Math.PI * 2) / frondCount + (f % 2) * 0.2;
      const frondH = (0.35 + (f % 3) * 0.08) * s;
      const frondStalk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.008 * s, 0.012 * s, frondH, 4),
        stemGreen
      );
      frondStalk.position.set(Math.cos(fAngle) * 0.04 * s, frondH / 2 + 0.02, Math.sin(fAngle) * 0.04 * s);
      frondStalk.rotation.z = Math.cos(fAngle) * (0.35 + (f % 2) * 0.15);
      frondStalk.rotation.x = Math.sin(fAngle) * (0.35 + (f % 2) * 0.15);
      frondStalk.castShadow = true;
      group.add(frondStalk);

      // Fine pinnule leaflets along frond
      for (let p = 1; p < 4; p++) {
        const leaflet = new THREE.Mesh(new THREE.PlaneGeometry(0.06 * s, 0.03 * s), carrotFeatheryGreen);
        leaflet.position.set(frondStalk.position.x * (p / 3), (p * frondH) / 3.5 + 0.02, frondStalk.position.z * (p / 3));
        leaflet.rotation.y = fAngle;
        group.add(leaflet);
      }
    }

    // Stage 6+ white umbel blossom if flowering
    if (stage.id >= 6) {
      const umbel = new THREE.Mesh(new THREE.SphereGeometry(0.06 * s, 6, 6), new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.9 }));
      umbel.position.set(0, 0.45 * s, 0);
      group.add(umbel);
    }
  }

  // ==================== 11. BEETROOT BOTANICAL MODEL ====================
  else if (cropType === "Beetroot") {
    const beetRubyStalk = new THREE.MeshStandardMaterial({ color: 0x9f1239, roughness: 0.5 });
    const beetDarkFoliage = new THREE.MeshStandardMaterial({ color: 0x14532d, roughness: 0.6, side: THREE.DoubleSide });
    const beetBulbMat = new THREE.MeshStandardMaterial({ color: 0x581c87, roughness: 0.65 });

    // Swollen globose root bulb partially protruding 3cm above soil
    if (stage.id >= 3) {
      const bulbRadius = (0.04 + (stage.id / 8) * 0.09) * s;
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(bulbRadius, 10, 8), beetBulbMat);
      bulb.scale.set(1.1, 0.9, 1.1);
      bulb.position.y = bulbRadius * 0.4;
      bulb.castShadow = true;
      group.add(bulb);

      // Slender taproot tail below bulb
      const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.015 * s, 0.003 * s, 0.18 * s, 5), beetBulbMat);
      tail.position.y = -0.09 * s;
      group.add(tail);
    }

    // Upright ruby stalks with crinkled oval leaves (6-8 leaves)
    const leafCount = Math.min(8, 3 + stage.id);
    for (let l = 0; l < leafCount; l++) {
      const lAngle = (l * Math.PI * 2) / leafCount;
      const stalkH = (0.28 + (l % 2) * 0.08) * s;
      
      const stalk = new THREE.Mesh(new THREE.CylinderGeometry(0.01 * s, 0.016 * s, stalkH, 4), beetRubyStalk);
      stalk.position.set(Math.cos(lAngle) * 0.03 * s, stalkH / 2 + 0.02, Math.sin(lAngle) * 0.03 * s);
      stalk.rotation.z = Math.cos(lAngle) * 0.38;
      stalk.rotation.x = Math.sin(lAngle) * 0.38;
      stalk.castShadow = true;
      group.add(stalk);

      // Broad ovate leaf with red midrib
      const leafBlade = new THREE.Mesh(new THREE.ConeGeometry(0.12 * s, 0.22 * s, 4), beetDarkFoliage);
      leafBlade.position.set(Math.cos(lAngle) * 0.14 * s, stalkH + 0.04, Math.sin(lAngle) * 0.14 * s);
      leafBlade.rotation.y = lAngle;
      leafBlade.rotation.x = -Math.PI / 3;
      leafBlade.scale.set(1, 1, 0.2);
      leafBlade.castShadow = true;
      group.add(leafBlade);
    }
  }

  // ==================== 12. POTATO BOTANICAL MODEL ====================
  else if (cropType === "Potato") {
    const potatoLeafMat = new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.65, side: THREE.DoubleSide });
    const flowerWhiteViolet = new THREE.MeshStandardMaterial({ color: 0xe0e7ff, roughness: 0.4 });
    const flowerCenterYellow = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.3 });
    const tuberMat = new THREE.MeshStandardMaterial({ color: 0xa16207, roughness: 0.75 });

    // Raised soil furrow mound
    const ridgeMound = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24 * s, 0.36 * s, 0.12 * s, 8),
      drySoilMat
    );
    ridgeMound.position.y = 0.05 * s;
    ridgeMound.receiveShadow = true;
    group.add(ridgeMound);

    // Multi-stemmed bush (3-5 vigorous branching stems)
    const stemCount = Math.min(5, 2 + Math.floor(stage.id * 0.5));
    for (let st = 0; st < stemCount; st++) {
      const stAngle = (st * Math.PI * 2) / stemCount + 0.2;
      const stH = (0.55 + (st % 2) * 0.1) * s;
      const stemMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.016 * s, 0.024 * s, stH, 5),
        stemGreen
      );
      stemMesh.position.set(Math.cos(stAngle) * 0.08 * s, stH / 2 + 0.05, Math.sin(stAngle) * 0.08 * s);
      stemMesh.rotation.z = Math.cos(stAngle) * 0.22;
      stemMesh.rotation.x = Math.sin(stAngle) * 0.22;
      stemMesh.castShadow = true;
      group.add(stemMesh);

      // Compound pinnate leaflets
      for (let p = 1; p <= 4; p++) {
        const leaflet = new THREE.Mesh(new THREE.ConeGeometry(0.08 * s, 0.16 * s, 4), potatoLeafMat);
        leaflet.position.set(
          stemMesh.position.x + Math.cos(stAngle + p) * 0.08 * s,
          (p * stH) / 4.8 + 0.05,
          stemMesh.position.z + Math.sin(stAngle + p) * 0.08 * s
        );
        leaflet.rotation.z = (p % 2 === 0 ? 1 : -1) * 0.6;
        leaflet.rotation.y = stAngle;
        leaflet.scale.set(1, 1, 0.2);
        leaflet.castShadow = true;
        group.add(leaflet);
      }
    }

    // Blossoms at flowering stage (stage.id >= 5)
    if (stage.id >= 5) {
      for (let fl = 0; fl < 3; fl++) {
        const flAngle = (fl * Math.PI * 2) / 3;
        const flMesh = new THREE.Mesh(new THREE.CircleGeometry(0.045 * s, 5), flowerWhiteViolet);
        flMesh.position.set(Math.cos(flAngle) * 0.12 * s, 0.62 * s, Math.sin(flAngle) * 0.12 * s);
        flMesh.rotation.x = -Math.PI / 3;
        group.add(flMesh);

        const stamen = new THREE.Mesh(new THREE.SphereGeometry(0.018 * s, 5, 5), flowerCenterYellow);
        stamen.position.set(flMesh.position.x, flMesh.position.y + 0.01, flMesh.position.z);
        group.add(stamen);
      }
    }

    // Subterranean potato tubers visible inside root zone (stage.id >= 4)
    if (stage.id >= 4) {
      const tuberCount = Math.min(6, 2 + stage.id);
      for (let tb = 0; tb < tuberCount; tb++) {
        const tbAngle = (tb * Math.PI * 2) / tuberCount;
        const tuber = new THREE.Mesh(new THREE.SphereGeometry(0.055 * s, 7, 6), tuberMat);
        tuber.scale.set(1.4, 0.9, 0.9);
        tuber.position.set(Math.cos(tbAngle) * 0.14 * s, -0.04 * s, Math.sin(tbAngle) * 0.14 * s);
        tuber.rotation.y = tbAngle;
        group.add(tuber);
      }
    }
  }

  return group;
}
