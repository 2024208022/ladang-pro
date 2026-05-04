import type { CalcResult } from "./carbon";

const KEY = "ladangpro_history_v1";

export function loadHistory(): CalcResult[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function saveResult(r: CalcResult) {
  const all = loadHistory();
  all.unshift(r);
  localStorage.setItem(KEY, JSON.stringify(all.slice(0, 50)));
}

export function getLatest(): CalcResult | null {
  return loadHistory()[0] ?? null;
}

export function getPrevious(): CalcResult | null {
  return loadHistory()[1] ?? null;
}

export function clearHistory() {
  localStorage.removeItem(KEY);
}

// Track action interactions to learn user preferences (basic)
const PREF_KEY = "ladangpro_action_prefs_v1";
export type ActionPref = Record<string, { likes: number; dismisses: number }>;

export function loadPrefs(): ActionPref {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(PREF_KEY) ?? "{}");
  } catch {
    return {};
  }
}
export function recordPref(title: string, kind: "like" | "dismiss") {
  const p = loadPrefs();
  const cur = p[title] ?? { likes: 0, dismisses: 0 };
  if (kind === "like") cur.likes++;
  else cur.dismisses++;
  p[title] = cur;
  localStorage.setItem(PREF_KEY, JSON.stringify(p));
}