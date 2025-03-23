import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-gray-900 text-white p-4 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-bold">GestureGarage</h1>
      <nav className="space-x-6">
        <Link to="/">Home</Link>
        <Link to="/garage">Garage</Link>
        <Link to="/guides">Guides</Link>
      </nav>
    </header>
  );
};

export default Header;
