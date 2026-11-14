import { api } from "./client";
export const AUTH_SERVICE = '/api/auth';

export const login = (credentials) => api.post("/auth/login", credentials)
export const self = () => api.get("/auth/self")
export const logout = () => api.get("/auth/logout")
export const getUsers = (paramsOrQuery) => {
  if (typeof paramsOrQuery === "string") {
    return api.get(paramsOrQuery ? `/users?${paramsOrQuery}` : "/users");
  }
  return api.get("/users", { params: paramsOrQuery });
};
