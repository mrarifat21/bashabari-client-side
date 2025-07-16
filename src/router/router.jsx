import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import RootLayouts from "../Layouts/RootLayouts";
import Home from "../Pages/Home/Home";
import Login from "../Pages/Authentication/Login/Login";
import Register from "../Pages/Authentication/Register/Register";
import DashboardLayout from "../Layouts/DashboardLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayouts,
    children:[
        {
            index: true,
            Component: Home
        },
        {
            path: "login",
            Component: Login
        },
        {
            path: 'register',
            Component: Register
        }
    ]
  },
  {
    path: 'dashboard',
    element: <DashboardLayout></DashboardLayout>
  }
]);