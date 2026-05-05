import { CalcResult } from "./carbon";

// =========================================================
// IN-MEMORY DATABASE (Wipes completely on page refresh)
// =========================================================
let currentUser: { name: string; email: string } | null = null;
let registeredUsers: Record<string, { name: string; email: string; password: string }> = {}; 
let historyDb: Record<string, CalcResult[]> = {};
let prefsDb: Record<string, Record<string, { likes: number; dismisses: number }>> = {};

// ---------------------------------------------------------
// 1. AUTHENTICATION (Real Simulation)
// ---------------------------------------------------------

export function registerNewUser(name: string, email: string, password: string) {
  // Save user with password
  registeredUsers[email] = { name, email, password };
  setCurrentUser(name, email);
}

export function attemptLogin(email: string, password: string): boolean {
  const user = registeredUsers[email];
  
  // Verify both email exists AND password matches
  if (user && user.password === password) {
    setCurrentUser(user.name, user.email);
    return true; // Login success!
  }
  
  return false; // Login failed!
}

function setCurrentUser(name: string, email: string) {
  currentUser = { name, email };
  if (!historyDb[email]) historyDb[email] = [];
  if (!prefsDb[email]) prefsDb[email] = {};
}

export function getCurrentUser(): { name: string; email: string } | null {
  return currentUser;
}

export function logout() {
  currentUser = null;
}

// ---------------------------------------------------------
// 2. DATA STORAGE & HISTORY
// ---------------------------------------------------------

export function loadHistory(): CalcResult[] {
  if (!currentUser) return [];
  return historyDb[currentUser.email] || [];
}

export function saveResult(result: CalcResult) {
  if (!currentUser) return;
  const all = loadHistory();
  const newEntry = { ...result, timestamp: new Date().toISOString() };
  all.unshift(newEntry);
  historyDb[currentUser.email] = all.slice(0, 50);
}

export function getLatest(): CalcResult | null {
  return loadHistory()[0] ?? null;
}

export function getPrevious(): CalcResult | null {
  return loadHistory()[1] ?? null;
}

export function clearHistory() {
  if (!currentUser) return;
  historyDb[currentUser.email] = [];
}

// ---------------------------------------------------------
// 3. ACTION PREFERENCES
// ---------------------------------------------------------

export type ActionPref = Record<string, { likes: number; dismisses: number }>;

export function loadPrefs(): ActionPref {
  if (!currentUser) return {};
  return prefsDb[currentUser.email] || {};
}

export function recordPref(title: string, kind: "like" | "dismiss") {
  if (!currentUser) return;
  const p = loadPrefs();
  const cur = p[title] ?? { likes: 0, dismisses: 0 };
  if (kind === "like") cur.likes++;
  else cur.dismisses++;
  p[title] = cur;
  prefsDb[currentUser.email] = p;
}