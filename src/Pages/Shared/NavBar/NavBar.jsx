import React from "react";
import { Link, NavLink } from "react-router";
import useAuth from "../../../hooks/useAuth";

const NavBar = () => {
  const { user, logOut } = useAuth();

  const handleLogout = () => {
    logOut()
      .then(() => console.log("logout successfully"))
      .catch((error) => console.log(error));
  };

  const navItems = (
    <>
      <li>
        <NavLink
          to="/"
          className={({ isActive }) =>
            `text-base-content hover:text-primary ${isActive ? "active" : ""}`
          }
        >
          Home
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/allProperties"
          className={({ isActive }) =>
            `text-base-content hover:text-primary ${isActive ? "active" : ""}`
          }
        >
          All properties
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `text-base-content hover:text-primary ${isActive ? "active" : ""}`
          }
        >
          Dashboard
        </NavLink>
      </li>
    </>
  );

  return (
    <div className="bg-base-100 shadow-sm">
      <div className="w-11/12 mx-auto navbar">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              {navItems}
            </ul>
          </div>
          <p>
            <Link to="/" className="text-2xl text-primary font-extrabold">
              BashaBari
            </Link>
          </p>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">{navItems}</ul>
        </div>

        <div className="navbar-end space-x-3">
          {user ? (
            <button onClick={handleLogout} className="btn btn-primary border-0 rounded-lg">
              Log Out
            </button>
          ) : (
            <>
              <Link to="/login" className="btn btn-primary border-0 rounded-lg">
                Log in
              </Link>
              <Link to="/register" className="btn btn-primary border-0 rounded-lg">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
