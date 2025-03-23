import React from "react";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 p-8 w-full bg-gray-800 min-h-screen text-white relative">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
