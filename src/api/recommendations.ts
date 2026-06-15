import { DashboardStats, Priority, Recommendation, RecommendationStatus } from "../types";

const now = new Date().toISOString();

// In-memory store. Mutations persist for the session so create/accept/delete
// visibly update the UI. PHASE 8 replaces every function body with axios calls.
let store: Recommendation[] = [
  { id: "1", title: "Reduce customer churn", description: "Email the 120 at-risk users with a re-engagement offer.", priority: "High", status: "Pending", createdAt: now, updatedAt: null },
  { id: "2", title: "Optimize ad spend", description: "Shift 15% of budget from display to search based on last quarter's ROAS.", priority: "Medium", status: "Accepted", createdAt: now, updatedAt: now },
  { id: "3", title: "Archive stale projects", description: "Three projects have had no activity in 90 days.", priority: "Low", status: "Dismissed", createdAt: now, updatedAt: now },
];

// Simulates network latency so loading states are actually visible.
function delay<T>(value: T, ms = 400): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export async function getDashboard(): Promise<DashboardStats> {
  const count = (s: RecommendationStatus) => store.filter((r) => r.status === s).length;
  return delay({
    total: store.length,
    pending: count("Pending"),
    accepted: count("Accepted"),
    dismissed: count("Dismissed"),
  });
}

export async function getRecommendations(): Promise<Recommendation[]> {
  return delay([...store].sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
}

export async function getRecommendation(id: string): Promise<Recommendation> {
  const found = store.find((r) => r.id === id);
  if (!found) throw new Error("Not found");
  return delay(found);
}

export async function createRecommendation(
  input: { title: string; description: string; priority: Priority }
): Promise<Recommendation> {
  const created: Recommendation = {
    id: String(Date.now()),
    ...input,
    status: "Pending",
    createdAt: new Date().toISOString(),
    updatedAt: null,
  };
  store = [created, ...store];
  return delay(created);
}

export async function setStatus(id: string, status: RecommendationStatus): Promise<Recommendation> {
  const r = store.find((x) => x.id === id);
  if (!r) throw new Error("Not found");
  r.status = status;
  r.updatedAt = new Date().toISOString();
  return delay({ ...r });
}

export async function deleteRecommendation(id: string): Promise<void> {
  store = store.filter((r) => r.id !== id);
  return delay(undefined);
}