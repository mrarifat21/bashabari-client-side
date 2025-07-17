import { createBrowserRouter } from "react-router";
import RootLayouts from "../Layouts/RootLayouts";
import Home from "../Pages/Home/Home";
import Login from "../Pages/Authentication/Login/Login";
import Register from "../Pages/Authentication/Register/Register";
import DashboardLayout from "../Layouts/DashboardLayout";
import Forbidden from "../Pages/Forbidden/Forbidden";

import PrivateRoutes from "../routes/PrivateRoutes";
import AllProperties from "../Pages/AllProperties/AllProperties";
import AddProperty from "../Pages/Dashboard/AgentDashboard/AddProperty";
import MyAddedProperties from "../Pages/Dashboard/AgentDashboard/MyAddedProperties";
import UpdateProperty from "../Pages/Dashboard/AgentDashboard/UpdateProperty";
import ManageProperties from "../Pages/Dashboard/AdminDashboard/ManageProperties";
import ManageUsers from "../Pages/Dashboard/AdminDashboard/ManageUsers";
import PropertyDetails from "../Pages/AllProperties/PropertyDetails";


export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayouts,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "login",
        Component: Login,
      },
      {
        path: "register",
        Component: Register,
      },
      {
        path: "forbidden",
        Component: Forbidden,
      },
      {
        path: "allProperties",
        element: <PrivateRoutes>
          <AllProperties></AllProperties>
        </PrivateRoutes>
      },
      {
        path: "property/:id",
        element: <PrivateRoutes>
          <PropertyDetails></PropertyDetails>
        </PrivateRoutes>
      },
    ],
  },
  {
    path: "dashboard",
    element: (
      <PrivateRoutes>
        <DashboardLayout></DashboardLayout>
      </PrivateRoutes>
    ),
    children: [
      // agent dashboard
      {
        path: "addProperty",
        element: <AddProperty></AddProperty>,
      },
      {
        path: "myAddedProperties",
        element: <MyAddedProperties></MyAddedProperties>,
      },
      {
        path: "updateProperty/:id",
        element: <UpdateProperty />,
      },

      // admin dashboard
      {
        path: 'manageProperties',
        element: <ManageProperties></ManageProperties>
      },
      {
        path: 'manageUsers',
        element: <ManageUsers></ManageUsers>
      },
    ],
  },
]);
