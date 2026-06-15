import axios, { AxiosError } from "axios";
import { tokenStorage } from "../auth/tokenStorage";
import { API_BASE_URL } from "../config";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Lets AuthContext react to a forced logout (e.g. expired token) without
// creating a circular import between the client and the context.
let onUnauthorized: (() => void) | null = null;
export function setUnauthorizedHandler(handler: () => void) {
  onUnauthorized = handler;
}

// Request interceptor: attach the JWT to every outgoing request.
api.interceptors.request.use(async (config) => {
  const token = await tokenStorage.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor: on 401, clear the session and notify the app.
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      await tokenStorage.remove();
      onUnauthorized?.();
    }
    return Promise.reject(error);
  }
);

// Pulls a readable message out of the backend's ProblemDetails response.
export function getApiErrorMessage(error: unknown, fallback = "Something went wrong."): string {
  const data = (error as AxiosError<{ title?: string; detail?: string }>).response?.data;
  return data?.detail || data?.title || fallback;
}