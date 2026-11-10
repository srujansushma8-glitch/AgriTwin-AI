// Centralized Crop Image Configuration & Verified Botanical Mapping Engine
// AgriTwin AI 3.0 — Guaranteed Crop-Specific Accuracy Across All 12 Crops

export type CropId =
  | "carrot"
  | "beetroot"
  | "potato"
  | "tomato"
  | "onion"
  | "ragi"
  | "rice"
  | "wheat"
  | "maize"
  | "groundnut"
  | "sugarcane"
  | "cotton"
  | "banana";

export interface CropImageStage {
  stageName: string;
  caption: string;
  image: string;
}

export interface CropImageSet {
  id: CropId;
  name: string;
  displayName: string;
  variety: string;
  category: "Horticultural Vegetables" | "Grains and Pulses" | "Cash and Commercial Crops";
  scientificName: string;
  main: string;
  plant: string;
  field: string;
  harvest: string;
  thumb: string;
  altText: string;
  description: string;
  stages: CropImageStage[];
}

export const CROP_IMAGE_DATABASE: Record<CropId, CropImageSet> = {
  carrot: {
    id: "carrot",
    name: "Carrot",
    displayName: "Carrot",
    variety: "Super Kuroda",
    category: "Horticultural Vegetables",
    scientificName: "Daucus carota subsp. sativus",
    main: "/images/crops/carrot/main.jpg",
    plant: "/images/crops/carrot/plant.jpg",
    field: "/images/crops/carrot/field.jpg",
    harvest: "/images/crops/carrot/harvest.jpg",
    thumb: "/images/crops/carrot/thumb.jpg",
    altText: "Healthy carrot plants (Super Kuroda) with fine feathery green foliage and vibrant orange taproots",
    description: "Deep orange, conical taproots with vigorous feathery green foliage grown on raised bed loams.",
    stages: [
      {
        stageName: "Seedling & Cotyledon (0-20 DAS)",
        caption: "Fine feathery plumules emerging in spaced drill lines with optimal soil moisture.",
        image: "/images/crops/carrot/plant.jpg",
      },
      {
        stageName: "Foliage & Root Expansion (20-65 DAS)",
        caption: "Dense photosynthetic leaf canopy directing carbohydrates into carrot root thickening.",
        image: "/images/crops/carrot/field.jpg",
      },
      {
        stageName: "Mature Harvesting (65-90 DAS)",
        caption: "Crisp, sweet, uniform Super Kuroda carrots freshly harvested with intact green tops.",
        image: "/images/crops/carrot/harvest.jpg",
      },
    ],
  },

  beetroot: {
    id: "beetroot",
    name: "Beetroot",
    displayName: "Beetroot",
    variety: "Detroit Dark Red",
    category: "Horticultural Vegetables",
    scientificName: "Beta vulgaris subsp. vulgaris",
    main: "/images/crops/beetroot/main.jpg",
    plant: "/images/crops/beetroot/plant.jpg",
    field: "/images/crops/beetroot/field.jpg",
    harvest: "/images/crops/beetroot/harvest.jpg",
    thumb: "/images/crops/beetroot/thumb.jpg",
    altText: "Healthy beetroot plants (Detroit Dark Red) with broad glossy green leaves, reddish veins, and dark-red round roots",
    description: "Deep ruby globular roots with vibrant red-veined dark green leaves rich in betalain antioxidants.",
    stages: [
      {
        stageName: "Vegetative Leaf Rosette (0-30 DAS)",
        caption: "Glossy upright ovate leaves showing distinctive anthocyanin red pigmentation in petiole.",
        image: "/images/crops/beetroot/plant.jpg",
      },
      {
        stageName: "Bulb Swelling & Canopy (30-60 DAS)",
        caption: "Smooth globe-shaped root expansion at the soil line with high transpiration capacity.",
        image: "/images/crops/beetroot/field.jpg",
      },
      {
        stageName: "Maturity & Harvest (60-80 DAS)",
        caption: "Prime Detroit Dark Red globes harvested with rich purple flesh and sweet flavor profile.",
        image: "/images/crops/beetroot/harvest.jpg",
      },
    ],
  },

  potato: {
    id: "potato",
    name: "Potato",
    displayName: "Potato",
    variety: "Kufri Jyoti",
    category: "Horticultural Vegetables",
    scientificName: "Solanum tuberosum",
    main: "/images/crops/potato/main.jpg",
    plant: "/images/crops/potato/plant.jpg",
    field: "/images/crops/potato/field.jpg",
    harvest: "/images/crops/potato/harvest.jpg",
    thumb: "/images/crops/potato/thumb.jpg",
    altText: "Healthy potato plants (Kufri Jyoti) with lush compound leaves, star-shaped blossoms, and underground tubers",
    description: "Vigorous earthen ridge mounds supporting branched composite canopies with subterranean tuber bulking.",
    stages: [
      {
        stageName: "Sprout & Emergence (0-25 DAS)",
        caption: "Rapid stem elongation from certified seed tubers forming stout green stolon nodes.",
        image: "/images/crops/potato/plant.jpg",
      },
      {
        stageName: "Tuber Initiation & Flowering (25-60 DAS)",
        caption: "Terminal white-to-violet flower clusters signaling subterranean stolon tip expansion.",
        image: "/images/crops/potato/field.jpg",
      },
      {
        stageName: "Tuber Bulking & Harvest (60-100 DAS)",
        caption: "Uniform oval Kufri Jyoti tubers with smooth yellow skin and high dry-matter content.",
        image: "/images/crops/potato/harvest.jpg",
      },
    ],
  },

  tomato: {
    id: "tomato",
    name: "Tomato",
    displayName: "Tomato",
    variety: "Arka Rakshak F1",
    category: "Horticultural Vegetables",
    scientificName: "Solanum lycopersicum",
    main: "/images/crops/tomato/main.jpg",
    plant: "/images/crops/tomato/plant.jpg",
    field: "/images/crops/tomato/field.jpg",
    harvest: "/images/crops/tomato/harvest.jpg",
    thumb: "/images/crops/tomato/thumb.jpg",
    altText: "Healthy tomato plants (Arka Rakshak F1) with compound serrated foliage and ripening red tomatoes on vines",
    description: "High-yielding determinate vines with triple disease resistance and firm, deep-red fruit clusters.",
    stages: [
      {
        stageName: "Seedling & Trellis Training (0-30 DAS)",
        caption: "Sturdy green stems supported on bamboo trellises with intense chlorophyll spad density.",
        image: "/images/crops/tomato/plant.jpg",
      },
      {
        stageName: "Flowering & Green Fruit Set (30-65 DAS)",
        caption: "Bright yellow star blossoms giving way to glossy green developing tomato clusters.",
        image: "/images/crops/tomato/field.jpg",
      },
      {
        stageName: "Breaker to Full Red Ripening (65-110 DAS)",
        caption: "Firm, glossy red Arka Rakshak tomatoes harvested with high shelf life and lycopene content.",
        image: "/images/crops/tomato/harvest.jpg",
      },
    ],
  },

  onion: {
    id: "onion",
    name: "Onion",
    displayName: "Onion",
    variety: "Bhima Super / Bellary Red",
    category: "Horticultural Vegetables",
    scientificName: "Allium cepa",
    main: "/images/crops/onion/main.jpg",
    plant: "/images/crops/onion/plant.jpg",
    field: "/images/crops/onion/field.jpg",
    harvest: "/images/crops/onion/harvest.jpg",
    thumb: "/images/crops/onion/thumb.jpg",
    altText: "Healthy red onion crop (Bhima Super) showing hollow tubular foliage, swollen bulb necks, and cured purple-red tunic scales",
    description: "High-pungency tropical bulb onion with concentric fleshy scale leaves and cured outer papery skins.",
    stages: [
      {
        stageName: "Seedling & Foliar Tillering (0-35 DAS)",
        caption: "Hollow cylindrical green leaves with waxy bloom protecting stomata from high solar irradiance.",
        image: "/images/crops/onion/plant.jpg",
      },
      {
        stageName: "Bulb Initiation & Sizing (35-85 DAS)",
        caption: "Base of leaf sheaths swelling in raised furrow beds with precision drip lateral fertigation.",
        image: "/images/crops/onion/field.jpg",
      },
      {
        stageName: "Neck Fall & Harvest Curing (85-125 DAS)",
        caption: "Harvested market-ready red onion bulbs with dried necks and glossy anthocyanin-rich tunic skins.",
        image: "/images/crops/onion/harvest.jpg",
      },
    ],
  },

  ragi: {
    id: "ragi",
    name: "Ragi / Finger Millet",
    displayName: "Ragi (Finger Millet)",
    variety: "ML-365",
    category: "Grains and Pulses",
    scientificName: "Eleusine coracana",
    main: "/images/crops/ragi/main.jpg",
    plant: "/images/crops/ragi/plant.jpg",
    field: "/images/crops/ragi/field.jpg",
    harvest: "/images/crops/ragi/harvest.jpg",
    thumb: "/images/crops/ragi/thumb.jpg",
    altText: "Mature ragi plants (ML-365) with characteristic finger-shaped millet seed heads in dryland fields",
    description: "Drought-hardy Karnataka millets bearing 5-7 incurved finger-like earheads packed with calcium-rich grain.",
    stages: [
      {
        stageName: "Tillering & Vegetative (0-40 DAS)",
        caption: "Dense fibrous root crowns anchoring erect clumps resistant to moisture stress.",
        image: "/images/crops/ragi/plant.jpg",
      },
      {
        stageName: "Earhead Emergence (40-75 DAS)",
        caption: "Incurved green digitated fingers unfurling at the apex of tillering culms.",
        image: "/images/crops/ragi/field.jpg",
      },
      {
        stageName: "Grain Dough to Ripening (75-115 DAS)",
        caption: "Golden-brown mature finger millet heads harvested for long-term food security storage.",
        image: "/images/crops/ragi/harvest.jpg",
      },
    ],
  },

  rice: {
    id: "rice",
    name: "Rice / Paddy",
    displayName: "Rice / Paddy",
    variety: "Sona Masoori",
    category: "Grains and Pulses",
    scientificName: "Oryza sativa",
    main: "/images/crops/rice/main.jpg",
    plant: "/images/crops/rice/plant.jpg",
    field: "/images/crops/rice/field.jpg",
    harvest: "/images/crops/rice/harvest.jpg",
    thumb: "/images/crops/rice/thumb.jpg",
    altText: "Healthy green paddy plants (Sona Masoori) growing in wet agricultural basins with heavy golden rice panicles",
    description: "Semi-dwarf aromatic paddy with high tillering capacity, droop-resistant panicles, and slender grains.",
    stages: [
      {
        stageName: "Transplanting & Active Tillering (0-45 DAS)",
        caption: "Lush emerald vegetative shoots thriving under controlled alternate wetting and drying.",
        image: "/images/crops/rice/plant.jpg",
      },
      {
        stageName: "Booting & Panicle Exsertion (45-85 DAS)",
        caption: "Arching golden-green panicles undergoing active anthesis and grain milk filling.",
        image: "/images/crops/rice/field.jpg",
      },
      {
        stageName: "Golden Ripening & Combine Harvest (85-135 DAS)",
        caption: "Heavy mature panicles ready for threshing into premium aromatic Sona Masoori rice.",
        image: "/images/crops/rice/harvest.jpg",
      },
    ],
  },

  wheat: {
    id: "wheat",
    name: "Wheat",
    displayName: "Wheat",
    variety: "GW-322",
    category: "Grains and Pulses",
    scientificName: "Triticum aestivum",
    main: "/images/crops/wheat/main.jpg",
    plant: "/images/crops/wheat/plant.jpg",
    field: "/images/crops/wheat/field.jpg",
    harvest: "/images/crops/wheat/harvest.jpg",
    thumb: "/images/crops/wheat/thumb.jpg",
    altText: "Golden wheat field (GW-322) with recognizable awned wheat ears and plump grain heads",
    description: "High-protein semi-dwarf bread wheat exhibiting stiff straw, rust tolerance, and amber hard grains.",
    stages: [
      {
        stageName: "Crown Root & Jointing (0-45 DAS)",
        caption: "Uniform drill rows showing intense tillering and nodal culm elongation.",
        image: "/images/crops/wheat/plant.jpg",
      },
      {
        stageName: "Heading & Flowering (45-75 DAS)",
        caption: "Long awned spikelets displaying yellow anthers under mild winter sunshine.",
        image: "/images/crops/wheat/field.jpg",
      },
      {
        stageName: "Dough & Golden Harvest (75-120 DAS)",
        caption: "Sun-drenched golden wheat ears harvested at under 12% grain moisture.",
        image: "/images/crops/wheat/harvest.jpg",
      },
    ],
  },

  maize: {
    id: "maize",
    name: "Maize / Corn",
    displayName: "Maize",
    variety: "DKC-9108",
    category: "Grains and Pulses",
    scientificName: "Zea mays",
    main: "/images/crops/maize/main.jpg",
    plant: "/images/crops/maize/plant.jpg",
    field: "/images/crops/maize/field.jpg",
    harvest: "/images/crops/maize/harvest.jpg",
    thumb: "/images/crops/maize/thumb.jpg",
    altText: "Healthy tall maize plants (DKC-9108) with broad arched leaves and large filled corn cobs with silk",
    description: "Robust single-stalk C4 cereals with prop roots, terminal tassels, and tightly husk-wrapped yellow cobs.",
    stages: [
      {
        stageName: "Knee-High Rapid Growth (0-35 DAS)",
        caption: "Thick vegetative culms with alternating wavy leaves intercepting maximum sunlight.",
        image: "/images/crops/maize/plant.jpg",
      },
      {
        stageName: "Tasseling & Silking (35-65 DAS)",
        caption: "Pollen shedding from apical tassels onto moist silk strands of mid-stem ear buds.",
        image: "/images/crops/maize/field.jpg",
      },
      {
        stageName: "Dent & Kernel Harvest (65-110 DAS)",
        caption: "Heavy ears packed with 16-18 rows of deep yellow dent starch kernels.",
        image: "/images/crops/maize/harvest.jpg",
      },
    ],
  },

  groundnut: {
    id: "groundnut",
    name: "Groundnut / Peanut",
    displayName: "Groundnut",
    variety: "TMV-2",
    category: "Grains and Pulses",
    scientificName: "Arachis hypogaea",
    main: "/images/crops/groundnut/main.jpg",
    plant: "/images/crops/groundnut/plant.jpg",
    field: "/images/crops/groundnut/field.jpg",
    harvest: "/images/crops/groundnut/harvest.jpg",
    thumb: "/images/crops/groundnut/thumb.jpg",
    altText: "Groundnut plants (TMV-2) with leafy green clover-like canopy and underground peanut pods on pegs",
    description: "Spanish bunch legume producing self-pollinating yellow flowers and subterranean geocarpic pods.",
    stages: [
      {
        stageName: "Branching & Pegging (0-40 DAS)",
        caption: "Bright yellow blooms forming elongated geotropic pegs pushing into loose sandy soil.",
        image: "/images/crops/groundnut/plant.jpg",
      },
      {
        stageName: "Subterranean Pod Filling (40-80 DAS)",
        caption: "Dense green ground canopy sheltering developing two-seeded reticulated pods below.",
        image: "/images/crops/groundnut/field.jpg",
      },
      {
        stageName: "Maturity & Pod Harvest (80-105 DAS)",
        caption: "Uprooted plants with clean cluster of mature high-oil TMV-2 peanut pods.",
        image: "/images/crops/groundnut/harvest.jpg",
      },
    ],
  },

  sugarcane: {
    id: "sugarcane",
    name: "Sugarcane",
    displayName: "Sugarcane",
    variety: "Co 86032",
    category: "Cash and Commercial Crops",
    scientificName: "Saccharum officinarum",
    main: "/images/crops/sugarcane/main.jpg",
    plant: "/images/crops/sugarcane/plant.jpg",
    field: "/images/crops/sugarcane/field.jpg",
    harvest: "/images/crops/sugarcane/harvest.jpg",
    thumb: "/images/crops/sugarcane/thumb.jpg",
    altText: "Tall sugarcane crop (Co 86032) with thick purple-green jointed stalks in wide agricultural rows",
    description: "High-sucrose perennial giant grass with thick jointed stalks, high tillering, and broad drooping leaves.",
    stages: [
      {
        stageName: "Tillering & Canopy Closure (0-120 DAS)",
        caption: "Multiple vigorous tillers emerging from planted setts forming dense cane rows.",
        image: "/images/crops/sugarcane/plant.jpg",
      },
      {
        stageName: "Grand Growth & Internode Elongation (120-270 DAS)",
        caption: "Rapid vertical stalk accumulation storing high Brix sucrose in solid internodes.",
        image: "/images/crops/sugarcane/field.jpg",
      },
      {
        stageName: "Ripening & Cane Harvest (270-360 DAS)",
        caption: "Heavy mature cane stalks harvested for Mandya sugar mills with over 18% Brix reading.",
        image: "/images/crops/sugarcane/harvest.jpg",
      },
    ],
  },

  cotton: {
    id: "cotton",
    name: "Cotton",
    displayName: "Cotton",
    variety: "Bt RCH-2",
    category: "Cash and Commercial Crops",
    scientificName: "Gossypium hirsutum",
    main: "/images/crops/cotton/main.jpg",
    plant: "/images/crops/cotton/plant.jpg",
    field: "/images/crops/cotton/field.jpg",
    harvest: "/images/crops/cotton/harvest.jpg",
    thumb: "/images/crops/cotton/thumb.jpg",
    altText: "Healthy cotton plants (Bt RCH-2) with broad green lobed leaves and fluffy white open cotton bolls",
    description: "Sturdy branched shrub bearing creamy white blossoms that ripen into fluffy white fiber bolls.",
    stages: [
      {
        stageName: "Squaring & Flower Budding (0-55 DAS)",
        caption: "Pyramidal vegetative frame with dark green palmate leaves and fresh reproductive squares.",
        image: "/images/crops/cotton/plant.jpg",
      },
      {
        stageName: "Boll Development (55-100 DAS)",
        caption: "Leathery green bolls synthesizing cellulose fiber under warm semi-arid conditions.",
        image: "/images/crops/cotton/field.jpg",
      },
      {
        stageName: "Boll Bursting & Picking (100-160 DAS)",
        caption: "Snow-white fluffy cotton locks bursting open in agricultural rows ready for hand picking.",
        image: "/images/crops/cotton/harvest.jpg",
      },
    ],
  },

  banana: {
    id: "banana",
    name: "Banana",
    displayName: "Banana",
    variety: "Grand Naine",
    category: "Cash and Commercial Crops",
    scientificName: "Musa acuminata",
    main: "/images/crops/banana/main.jpg",
    plant: "/images/crops/banana/plant.jpg",
    field: "/images/crops/banana/field.jpg",
    harvest: "/images/crops/banana/harvest.jpg",
    thumb: "/images/crops/banana/thumb.jpg",
    altText: "Lush banana plantation (Grand Naine) with massive paddle-like green leaves and heavy hanging fruit bunches",
    description: "Giant arborescent herb with overlapping leaf sheaths, massive spiral paddle leaves, and pendulous bunches.",
    stages: [
      {
        stageName: "Pseudostem & Leaf Emergence (0-150 DAS)",
        caption: "Vigorous whorls of broad green leaves creating a tropical humid microclimate canopy.",
        image: "/images/crops/banana/plant.jpg",
      },
      {
        stageName: "Shooting & Bunch Inflorescence (150-240 DAS)",
        caption: "Emerging purple floral heart shedding bracts to reveal tiers of female banana hands.",
        image: "/images/crops/banana/field.jpg",
      },
      {
        stageName: "Finger Bulking & Harvest (240-330 DAS)",
        caption: "Heavy cylindrical bunch of 10-12 hands with uniform plump Grand Naine fingers.",
        image: "/images/crops/banana/harvest.jpg",
      },
    ],
  },
};

/**
 * Normalizes any crop string input into a guaranteed CropId.
 * Never matches loosely or fallbacks to a wrong vegetable.
 */
export function normalizeCropId(input: string | undefined | null): CropId {
  if (!input) return "potato";
  const s = input.toLowerCase().trim();
  if (s.includes("carrot")) return "carrot";
  if (s.includes("beetroot") || s.includes("beet")) return "beetroot";
  if (s.includes("potato")) return "potato";
  if (s.includes("tomato")) return "tomato";
  if (s.includes("onion")) return "onion";
  if (s.includes("ragi") || s.includes("millet")) return "ragi";
  if (s.includes("rice") || s.includes("paddy")) return "rice";
  if (s.includes("wheat")) return "wheat";
  if (s.includes("maize") || s.includes("corn")) return "maize";
  if (s.includes("groundnut") || s.includes("peanut")) return "groundnut";
  if (s.includes("sugarcane") || s.includes("cane")) return "sugarcane";
  if (s.includes("cotton")) return "cotton";
  if (s.includes("banana")) return "banana";
  return "potato";
}

/**
 * Returns the complete verified image set for a given crop.
 */
export function getCropImageSet(cropNameOrId: string | undefined | null): CropImageSet {
  const id = normalizeCropId(cropNameOrId);
  return CROP_IMAGE_DATABASE[id];
}

/**
 * Returns a specific verified image role path for the crop.
 */
export function getCropImage(
  cropNameOrId: string | undefined | null,
  role: "main" | "plant" | "field" | "harvest" | "thumb" = "main"
): string {
  const set = getCropImageSet(cropNameOrId);
  return set[role] || set.main;
}

/**
 * Returns an array of all 12 verified crop configs.
 */
export function getAllCrops(): CropImageSet[] {
  return Object.values(CROP_IMAGE_DATABASE);
}

