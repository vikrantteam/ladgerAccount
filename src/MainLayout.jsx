import React from "react";
import Navbar from "./NAvbar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <>
      <div className="main-layout-div">
        <Navbar />
        <div className="right-div">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default MainLayout;
