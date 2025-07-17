import React from "react";
import { Link, NavLink, Outlet } from "react-router";
import {
  FaHome,
  FaUser,
  FaBuilding,
  FaUsers,
  FaComments,
  FaPlus,
  FaFolderOpen,
  FaDollarSign,
  FaClock,
  FaHeart,
  FaShoppingCart,
  FaCommentDots,
} from "react-icons/fa";

const DashboardLayout = () => {
  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <div className="navbar bg-base-300 w-full lg:hidden">
          <div className="flex-none">
            <label
              htmlFor="my-drawer-2"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-6 w-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>
          <div className="mx-2 flex-1 px-2 lg:hidden">Dashboard</div>
        </div>

        {/* Page content */}
        <Outlet />
      </div>

      <div className="drawer-side">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-base-200 text-base-content min-h-full w-fit p-4 space-y-2" >
          {/* Sidebar content */}
          <Link to="/" className="text-2xl text-primary font-extrabold mb-4">
            BashaBari
          </Link>

          {/* Common */}
          <li>
            <NavLink to="/dashboard">
              <FaHome /> Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/myProfile">
              <FaUser /> My Profile
            </NavLink>
          </li>
          {/* User */}
          <p>user</p>
          <li>
            <NavLink to="/dashboard/wishlist">
              <FaHeart /> Wishlist
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/propertyBougth">
              <FaShoppingCart /> Property Bought
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/myReviews">
              <FaCommentDots /> My Reviews
            </NavLink>
          </li>
          {/* ===============Agent =======*/}
          <p>agent</p>
          <li>
            <NavLink to="/dashboard/addProperty">
              <FaPlus /> Add Property
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/myAddedProperties">
              <FaFolderOpen /> My Added Properties
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/mySoldProperties">
              <FaDollarSign /> My Sold Properties
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/requestedProperties">
              <FaClock /> Requested Properties
            </NavLink>
          </li>
          {/* ===========Admin ==========*/}
          <p>admin</p>
          <li>
            <NavLink to="/dashboard/manageProperties">
              <FaBuilding /> Manage Properties
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/manageUsers">
              <FaUsers /> Manage Users
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/manageReviews">
              <FaComments /> Manage Reviews
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DashboardLayout;
