import { api } from "./client";

export const login =(credentials)=> api.post("/auth/login",credentials)
export const self = ()=> api.get("/auth/self")
export const logout =()=> api.get("/auth/logout")