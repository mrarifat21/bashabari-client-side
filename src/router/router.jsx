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
import ManageReviews from "../Pages/Dashboard/AdminDashboard/ManageReviews";
import Wishlish from "../Pages/Dashboard/UserDashboard/Wishlish";
import PropertyBought from "../Pages/Dashboard/UserDashboard/PropertyBought";
import MyReviews from "../Pages/Dashboard/UserDashboard/MyReviews";
import MakeOffer from "../Pages/Dashboard/UserDashboard/MakeOffer";
import AdminRoute from "./AdminRoute";
import AgentRoute from "./AgentRoute";
import UserRoute from "./UserRoute";
import Profile from "../Pages/Profile/Profile";
import AdvertiseProperty from "../Pages/Dashboard/AdminDashboard/AdvertiseProperty";
import RequestedProperties from "../Pages/Dashboard/AgentDashboard/RequestedProperties";
import ErrorPage from "../Pages/ErrorPage/ErrorPage";
import Payment from "../Pages/Dashboard/UserDashboard/Paymnet/Payment";
import AdminDashboard from "../Pages/Dashboard/DashboardHome/AdminDashboard";
import SoldProperties from "../Pages/Dashboard/AgentDashboard/SoldProperties";

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
        element: (
            <AllProperties></AllProperties>
        ),
      },
      {
        path: "property/:id",
        element: (
          // <PrivateRoutes>
            <PropertyDetails></PropertyDetails>
          // </PrivateRoutes>
        ),
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
      {
        index: true,
        Component: Profile,
      },
      {
        path: "addProperty",
        element: (
          <AgentRoute>
            <AddProperty></AddProperty>
          </AgentRoute>
        ),
      },
      {
        path: "myAddedProperties",
        element: (
          <AgentRoute>
            <MyAddedProperties></MyAddedProperties>
          </AgentRoute>
        ),
      },
      {
        path: "updateProperty/:id",
        element: (
          <AgentRoute>
            <UpdateProperty />
          </AgentRoute>
        ),
      },
      {
        path: "requestedProperties",
        element: (
          <AgentRoute>
            <RequestedProperties />
          </AgentRoute>
        ),
      },
      {
        path: "soldProperties",
        element: (
          <AgentRoute>
            <SoldProperties />
          </AgentRoute>
        ),
      },

      // admin dashboard
      {
        path: "manageProperties",
        element: (
          <AdminRoute>
            <ManageProperties></ManageProperties>
          </AdminRoute>
        ),
      },
      {
        path: "manageUsers",
        element: (
          <AdminRoute>
            <ManageUsers></ManageUsers>
          </AdminRoute>
        ),
      },
      {
        path: "manageReviews",
        element: (
          <AdminRoute>
            <ManageReviews></ManageReviews>
          </AdminRoute>
        ),
      },
      {
        path: "advertiseProperty",
        element: (
          <AdminRoute>
            <AdvertiseProperty></AdvertiseProperty>
          </AdminRoute>
        ),
      },
      //user dashboard
      {
        path: "wishlist",
        element: (
          <UserRoute>
            <Wishlish></Wishlish>
          </UserRoute>
        ),
      },
      {
        path: "propertyBought",
        element: (
          <UserRoute>
            <PropertyBought></PropertyBought>
          </UserRoute>
        ),
      },
      {
        path: "myReviews",
        element: (
          <UserRoute>
            <MyReviews></MyReviews>
          </UserRoute>
        ),
      },
      {
        path: "make-offer/:id",
        element: (
          <UserRoute>
            <MakeOffer />
          </UserRoute>
        ),
        loader: ({ params }) =>
          fetch(`https://bashabari-server.vercel.app/wishlist/${params.id}`),
      },
      {
        path: "payment/:propertyID",
        element: (
          <UserRoute>
            <Payment></Payment>
          </UserRoute>
        ),
        loader: ({ params }) =>
          fetch(`https://bashabari-server.vercel.app/offer/${params.id}`),
      },
    ],
  },
  {
    path: "*",
    Component: ErrorPage,
  },
]);
