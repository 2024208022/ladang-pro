export const EMISSION_FACTORS = {
  fuel: {
    Diesel: 2.57082,
    Petrol: 2.06916,
    LPG: 2575.46,
    "Natural Gas": 2.06672,
  },
  electricity: {
    Peninsular: 0.74,
    Sabah: 0.539,
    Sarawak: 0.199,
  },
} as const;

export type FuelType = keyof typeof EMISSION_FACTORS.fuel;
export type Region = keyof typeof EMISSION_FACTORS.electricity;
export type ActivityType = "Mobile combustion" | "Stationary combustion";

export interface FuelEntry {
  id: string;
  activity: ActivityType;
  fuel: FuelType;
  amount: number;
}

export interface Constraints {
  budget: "Low" | "Medium" | "High";
  machineAvailable: boolean;
  weather: "Good" | "Rainy" | "Hot";
  time: "Limited" | "Flexible";
  labor: "Low" | "Medium" | "High";
}

export interface CalcInput {
  entries: FuelEntry[];
  region: Region;
  electricity: number;
  constraints: Constraints;
}

export interface Breakdown {
  source: string;
  value: number;
  pct: number;
}

export interface ActionItem {
  title: string;
  impact: "High" | "Medium" | "Low";
  effort: "Low" | "Medium" | "High";
  reduction: number; // kgCO2e
  reason: string;
  source: string;
  needs: Partial<Constraints>;
}

export interface CalcResult {
  id: string;
  date: string;
  total: number;
  level: "Low" | "Medium" | "High";
  breakdown: Breakdown[];
  dominant: string;
  actions: ActionItem[];
  input: CalcInput;
}

export function calculate(input: CalcInput): CalcResult {
  const items: Breakdown[] = [];
  for (const e of input.entries) {
    if (e.amount > 0) {
      const v = e.amount * EMISSION_FACTORS.fuel[e.fuel];
      items.push({ source: e.fuel, value: v, pct: 0 });
    }
  }
  if (input.electricity > 0) {
    const v = input.electricity * EMISSION_FACTORS.electricity[input.region];
    items.push({ source: "Electricity", value: v, pct: 0 });
  }
  // merge by source
  const merged = new Map<string, number>();
  items.forEach((i) => merged.set(i.source, (merged.get(i.source) ?? 0) + i.value));
  const breakdown: Breakdown[] = Array.from(merged.entries()).map(([source, value]) => ({
    source,
    value,
    pct: 0,
  }));
  const total = breakdown.reduce((s, b) => s + b.value, 0);
  breakdown.forEach((b) => (b.pct = total ? (b.value / total) * 100 : 0));
  breakdown.sort((a, b) => b.value - a.value);
  const dominant = breakdown[0]?.source ?? "—";

  const level: CalcResult["level"] =
    total < 5000 ? "Low" : total < 50000 ? "Medium" : "High";

  const actions = buildActions(breakdown, total, input.constraints);

  return {
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    total,
    level,
    breakdown,
    dominant,
    actions,
    input,
  };
}

function buildActions(
  breakdown: Breakdown[],
  total: number,
  c: Constraints,
): ActionItem[] {
  const pool: ActionItem[] = [];
  const get = (s: string) => breakdown.find((b) => b.source === s)?.value ?? 0;

  if (get("Diesel") > 0) {
    pool.push({
      title: "Optimize tractor & machinery routes",
      impact: "High",
      effort: "Low",
      reduction: get("Diesel") * 0.15,
      reason: "Diesel is a top emission source — route planning cuts idle hours.",
      source: "Diesel",
      needs: { machineAvailable: true },
    });
    pool.push({
      title: "Switch to biodiesel B20 blend",
      impact: "High",
      effort: "Medium",
      reduction: get("Diesel") * 0.2,
      reason: "B20 reduces lifecycle CO₂ from diesel combustion.",
      source: "Diesel",
      needs: { budget: "Medium" },
    });
    pool.push({
      title: "Service & tune diesel engines",
      impact: "Medium",
      effort: "Low",
      reduction: get("Diesel") * 0.08,
      reason: "Tuned engines burn less diesel per hectare.",
      source: "Diesel",
      needs: {},
    });
  }
  if (get("Petrol") > 0) {
    pool.push({
      title: "Replace petrol pumps with electric units",
      impact: "Medium",
      effort: "High",
      reduction: get("Petrol") * 0.4,
      reason: "Petrol contributes notably; electrification removes direct emissions.",
      source: "Petrol",
      needs: { budget: "High" },
    });
    pool.push({
      title: "Carpool farm crew transport",
      impact: "Medium",
      effort: "Low",
      reduction: get("Petrol") * 0.12,
      reason: "Cuts petrol use for daily worker movement.",
      source: "Petrol",
      needs: { labor: "Medium" },
    });
  }
  if (get("LPG") > 0) {
    pool.push({
      title: "Insulate LPG-heated drying sheds",
      impact: "High",
      effort: "Medium",
      reduction: get("LPG") * 0.18,
      reason: "LPG drying loses heat — insulation cuts gas use.",
      source: "LPG",
      needs: { budget: "Medium" },
    });
    pool.push({
      title: "Use solar-assisted drying when weather permits",
      impact: "High",
      effort: "Low",
      reduction: get("LPG") * 0.25,
      reason: "Reduces LPG burned for crop drying.",
      source: "LPG",
      needs: { weather: "Good" },
    });
  }
  if (get("Natural Gas") > 0) {
    pool.push({
      title: "Schedule gas heating during off-peak",
      impact: "Medium",
      effort: "Low",
      reduction: get("Natural Gas") * 0.1,
      reason: "Optimizes natural gas combustion windows.",
      source: "Natural Gas",
      needs: { time: "Flexible" },
    });
  }
  if (get("Electricity") > 0) {
    pool.push({
      title: "Install rooftop solar PV on barn",
      impact: "High",
      effort: "High",
      reduction: get("Electricity") * 0.5,
      reason: "Grid electricity is a top driver — solar offsets it directly.",
      source: "Electricity",
      needs: { budget: "High" },
    });
    pool.push({
      title: "Switch all lighting to LED + timers",
      impact: "Medium",
      effort: "Low",
      reduction: get("Electricity") * 0.12,
      reason: "Quick win on grid electricity consumption.",
      source: "Electricity",
      needs: {},
    });
    pool.push({
      title: "Run irrigation pumps in off-peak hours",
      impact: "Medium",
      effort: "Low",
      reduction: get("Electricity") * 0.08,
      reason: "Reduces peak grid load tied to your usage.",
      source: "Electricity",
      needs: { time: "Flexible" },
    });
  }

  // Constraint filter
  const ok = (a: ActionItem) => {
    if (a.needs.budget === "High" && c.budget === "Low") return false;
    if (a.needs.budget === "Medium" && c.budget === "Low") return false;
    if (a.needs.machineAvailable && !c.machineAvailable) return false;
    if (a.needs.weather && a.needs.weather !== c.weather) return false;
    if (a.needs.time === "Flexible" && c.time === "Limited") return false;
    if (a.needs.labor === "Medium" && c.labor === "Low") return false;
    return true;
  };
  const filtered = pool.filter(ok);

  // Rank by impact*reduction matched to dominant sources
  const dominantOrder = breakdown.map((b) => b.source);
  const impactScore = { High: 3, Medium: 2, Low: 1 } as const;
  const effortPenalty = { Low: 0, Medium: 0.15, High: 0.3 } as const;
  filtered.sort((a, b) => {
    const aRank =
      a.reduction * impactScore[a.impact] * (1 - effortPenalty[a.effort]) +
      (dominantOrder.indexOf(a.source) === 0 ? total * 0.05 : 0);
    const bRank =
      b.reduction * impactScore[b.impact] * (1 - effortPenalty[b.effort]) +
      (dominantOrder.indexOf(b.source) === 0 ? total * 0.05 : 0);
    return bRank - aRank;
  });

  return filtered.slice(0, 3);
}