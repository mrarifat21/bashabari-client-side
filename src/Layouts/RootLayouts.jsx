import React from "react";
import { Outlet } from "react-router";
import NavBar from "../Pages/Shared/NavBar/NavBar";
import Footer from "../Pages/Shared/Footer/Footer";

const RootLayouts = () => {
  return (
    <div className="">
      <nav className="fixed top-0 left-0 w-full z-50">
        <NavBar></NavBar>
      </nav>
      <main className="pt-16">
        <Outlet></Outlet>
      </main>
      <footer>
        <Footer></Footer>
      </footer>
    </div>
  );
};

export default RootLayouts;
