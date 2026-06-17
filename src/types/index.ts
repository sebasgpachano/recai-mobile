export type Priority = "Low" | "Medium" | "High";
export type RecommendationStatus = "Pending" | "Accepted" | "Dismissed";

export interface AuthResponse {
  token: string;
  name: string;
  email: string;
  expiresAt: string;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: RecommendationStatus;
  createdAt: string;
  updatedAt: string | null;
}

export interface DashboardStats {
  total: number;
  pending: number;
  accepted: number;
  dismissed: number;
}

export interface Paged<T> {
  items: T[];
  nextCursor: string | null;
}