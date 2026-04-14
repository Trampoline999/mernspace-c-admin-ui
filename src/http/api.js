import { api } from "./client";

export const login =(credentials)=> api.post("/auth/login",credentials)