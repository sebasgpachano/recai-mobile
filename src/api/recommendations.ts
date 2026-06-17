import { DashboardStats, Paged, Priority, Recommendation, RecommendationStatus } from "../types";
import { api } from "./client";

export async function getDashboard(): Promise<DashboardStats> {
  const { data } = await api.get<DashboardStats>("/dashboard");
  return data;
}

export interface RecommendationFilters {
  status?: RecommendationStatus;
  priority?: Priority;
  search?: string;
}

export async function getRecommendations(
  filters: RecommendationFilters = {},
  cursor?: string
): Promise<Paged<Recommendation>> {
  const { data } = await api.get<Paged<Recommendation>>("/recommendations", {
    params: { ...filters, cursor },
  });
  return data;
}

export async function getRecommendation(id: string): Promise<Recommendation> {
  const { data } = await api.get<Recommendation>(`/recommendations/${id}`);
  return data;
}

export async function createRecommendation(
  input: { title: string; description: string; priority: Priority }
): Promise<Recommendation> {
  const { data } = await api.post<Recommendation>("/recommendations", input);
  return data;
}

export async function setStatus(id: string, status: RecommendationStatus): Promise<Recommendation> {
  // The backend exposes status changes as actions, not a generic update.
  const action = status === "Accepted" ? "accept" : "dismiss";
  const { data } = await api.post<Recommendation>(`/recommendations/${id}/${action}`);
  return data;
}

export async function deleteRecommendation(id: string): Promise<void> {
  await api.delete(`/recommendations/${id}`);
}