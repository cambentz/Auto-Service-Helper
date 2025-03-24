import React from "react";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";

/**
 * Layout component for wrapping routed pages.
 *
 * @returns {JSX.Element}
 */
const Layout = () => {
  return (
    <>
      <Header />
      <main className="w-full bg-neutral-950 text-white min-h-screen">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
