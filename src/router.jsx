import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/login/LoginPage";
import DashBoard from "./layouts/DashBoard";
import NonAuth from "./layouts/NonAuth";
import Root from "./layouts/Root";

export const router = createBrowserRouter([
{
        path: "/",
        element: <Root />,
        children:
        [
            {
                path:"",
                element:<DashBoard/>,
                children:[
            {
                path:"",
                element:<HomePage/>,
            }
        ]
    },

    {
            path:"/auth",
            element:<NonAuth/>,
            children:
            [
                {
                    path:"login",
                    element:<LoginPage/>,
                }
            ]
    }
        ]
}
    
])