export type FuelEntry = {
  id: string;
  activity: "Mobile combustion" | "Stationary combustion";
  fuel: "Diesel" | "Petrol" | "LPG" | "Natural Gas";
  amount: number;
};

export type Region = "Peninsular" | "Sabah" | "Sarawak";

export type Constraints = {
  budget: "Low" | "Medium" | "High";
  machineAvailable: boolean;
  weather: "Good" | "Rainy" | "Hot";
  time: "Limited" | "Flexible";
  labor: "Low" | "Medium" | "High";
};

export type ActionRecommendation = {
  title: string;
  description: string;
  impact: string;
  cost: string;
  tags: string[];
};

export type CalcResult = {
  totalEmissions: number;
  scope1: number;
  scope2: number;
  breakdown: { name: string; value: number }[];
  topActions: ActionRecommendation[];
  timestamp?: string; 
};

// --- EMISSION FACTORS (kg CO2e per unit) ---
const FACTORS = {
  fuel: {
    Diesel: 2.68, // per Liter
    Petrol: 2.31, // per Liter
    LPG: 1.51,    // per kg
    "Natural Gas": 2.02, // per m3
  },
  grid: {
    Peninsular: 0.78, // per kWh
    Sabah: 0.53,
    Sarawak: 0.25,
  },
};

// --- SMART ACTION DATABASE ---
// These actions will only show up if the user's constraints match the requirements.
const ACTIONS_DB = [
  {
    id: "solar_pump",
    title: "Tukar ke Pam Air Solar",
    description: "Gantikan pam air diesel/petrol kepada pam berkuasa solar untuk sistem pengairan.",
    impact: "Tinggi",
    cost: "Sederhana",
    requirements: { budget: ["Medium", "High"], weather: ["Good", "Hot"] },
  },
  {
    id: "tractor_maintenance",
    title: "Servis Traktor Berjadual",
    description: "Penukaran penapis udara dan minyak hitam secara berjadual boleh menjimatkan penggunaan diesel sehingga 15%.",
    impact: "Sederhana",
    cost: "Rendah",
    requirements: { budget: ["Low", "Medium", "High"], machineAvailable: true },
  },
  {
    id: "led_lighting",
    title: "Naik Taraf Pencahayaan LED",
    description: "Tukar semua mentol di rumah hijau/stor kepada LED. Ia mengurangkan penggunaan elektrik bilik secara drastik.",
    impact: "Rendah",
    cost: "Rendah",
    requirements: { budget: ["Low", "Medium", "High"] },
  },
  {
    id: "rainwater_harvesting",
    title: "Sistem Tadahan Air Hujan",
    description: "Kurangkan penggunaan tenaga elektrik pam grid dengan menadah air hujan untuk pengairan semasa musim tengkujuh.",
    impact: "Sederhana",
    cost: "Sederhana",
    requirements: { budget: ["Medium", "High"], weather: ["Rainy"] },
  },
  {
    id: "optimize_routes",
    title: "Optimumkan Laluan Jentera",
    description: "Rancang laluan traktor untuk membajak/menuai bagi mengurangkan jarak perjalanan dan pembakaran diesel.",
    impact: "Rendah",
    cost: "Percuma",
    requirements: { budget: ["Low", "Medium", "High"], machineAvailable: true },
  },
];

export function calculate(data: {
  entries: FuelEntry[];
  region: Region;
  electricity: number;
  constraints: Constraints;
}): CalcResult {
  
  // 1. Calculate Scope 1 (Fuel)
  let scope1 = 0;
  const breakdownMap: Record<string, number> = {};

  data.entries.forEach((entry) => {
    // Math: Amount * Emission Factor
    const factor = FACTORS.fuel[entry.fuel] || 0;
    const emissions = entry.amount * factor;
    scope1 += emissions;
    
    // Track breakdown for Root Cause charts
    const label = `${entry.activity} (${entry.fuel})`;
    breakdownMap[label] = (breakdownMap[label] || 0) + emissions;
  });

  // 2. Calculate Scope 2 (Electricity)
  const scope2 = data.electricity * (FACTORS.grid[data.region] || 0);
  if (scope2 > 0) {
    breakdownMap["Electricity (Grid)"] = scope2;
  }

  // Format Breakdown for charts (Sort highest emissions to lowest)
  const breakdown = Object.entries(breakdownMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value); 

  // 3. Filter Actions Based on Constraints
  const validActions = ACTIONS_DB.filter((action) => {
    const reqs = action.requirements;
    
    if (reqs.budget && !reqs.budget.includes(data.constraints.budget)) return false;
    if (reqs.weather && !reqs.weather.includes(data.constraints.weather)) return false;
    if (reqs.machineAvailable !== undefined && reqs.machineAvailable !== data.constraints.machineAvailable) return false;

    return true; // Keep it if it passes all tests
  });

  // 4. Return Top 3 Actions
  const topActions = validActions.slice(0, 3).map(a => ({
    title: a.title,
    description: a.description,
    impact: a.impact,
    cost: a.cost,
    tags: [a.impact === "Tinggi" ? "Impak Tinggi" : "Impak Cepat"],
  }));

  // Fallback just in case they filter everything out
  if (topActions.length === 0) {
    topActions.push({
      title: "Audit Tenaga Ladang",
      description: "Lakukan audit tenaga menyeluruh untuk mengenal pasti pembaziran memandangkan kekangan semasa anda.",
      impact: "Sederhana",
      cost: "Rendah",
      tags: ["Asas"],
    });
  }

  return {
    totalEmissions: scope1 + scope2,
    scope1,
    scope2,
    breakdown,
    topActions,
  };
}