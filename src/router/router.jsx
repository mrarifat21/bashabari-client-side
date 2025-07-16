import { createBrowserRouter } from "react-router";
import RootLayouts from "../Layouts/RootLayouts";
import Home from "../Pages/Home/Home";
import Login from "../Pages/Authentication/Login/Login";
import Register from "../Pages/Authentication/Register/Register";
import DashboardLayout from "../Layouts/DashboardLayout";
import AddProperty from "../Pages/Shared/Dashboard/AgentDashboard/AddProperty";
import Forbidden from "../Pages/Forbidden/Forbidden";
import MyAddedProperties from "../Pages/Shared/Dashboard/AgentDashboard/MyAddedProperties";
import PrivateRoutes from "../routes/PrivateRoutes";
import UpdateProperty from "../Pages/Shared/Dashboard/AgentDashboard/UpdateProperty";
import AllProperties from "../Pages/AllProperties/AllProperties";

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
      // agent dashbord
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
    ],
  },
]);
