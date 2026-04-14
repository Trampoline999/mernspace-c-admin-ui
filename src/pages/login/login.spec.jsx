import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import LoginPage from "./LoginPage"



describe("Login page",()=>{

    it("should show required login details",()=>{
        render(<LoginPage/>)
        expect(screen.getByText(/Sign in/)).toBeInTheDocument()
        expect(screen.getByPlaceholderText("username")).toBeInTheDocument()
        expect(screen.getByPlaceholderText("password")).toBeInTheDocument()
        expect(screen.getByRole('button',{name:"login"})).toBeInTheDocument()
        expect(screen.getByRole('checkbox',{name:"Remember me"})).toBeInTheDocument()
        expect(screen.getByText("Forget password")).toBeInTheDocument()
    })
})