import { create } from "zustand";
import {devtools} from "zustand/middleware"


export const authStore = create(
    devtools((set)=>({
        user:null,
        setUser:(user)=>set(()=>({user})),   
        logout:()=> set(()=>({user:null})),        
    }))
)