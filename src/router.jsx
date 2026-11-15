import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/login/LoginPage";
import DashBoard from "./layouts/DashBoard";
import NonAuth from "./layouts/NonAuth";
import Root from "./layouts/Root";
import Users from "./pages/users/Users";
import RequireRole from "./components/RequireRole";
import { Tenants } from "./pages/tenants/Tenants";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        children:
            [
                {
                    path: "",
                    element: <DashBoard />,
                    children: [
                        {
                            path: "/home",
                            element: <HomePage />,
                        },
                        {
                            path: "/users",
                            element: (
                                <RequireRole roles={["admin"]}>
                                    <Users />
                                </RequireRole>
                            ),
                        },
                        {
                            path: "/tenants",
                            element: (
                                <Tenants />
                            ),
                        }
                    ]
                },

                {
                    path: "/auth",
                    element: <NonAuth />,
                    children:
                        [
                            {
                                path: "login",
                                element: <LoginPage />,
                            }
                        ]
                }
            ]
    }

])