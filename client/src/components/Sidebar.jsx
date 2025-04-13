import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="bg-red-500 text-white w-64 min-h-screen p-6 fixed left-0 top-0 shadow-lg flex flex-col justify-between z-50">
      {/* Logo + Title */}
      <div>
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <span className="mr-2">🚗</span> Gesture Garage
        </h2>

        {/* Navigation Links */}
        <nav className="space-y-4">
          <Link to="/" className="block p-3 rounded hover:bg-gray-700 transition">
            🏠 Home
          </Link>
          <Link to="/garage" className="block p-3 rounded hover:bg-gray-700 transition">
            🚘 Garage
          </Link>
          <Link to="/guides" className="block p-3 rounded hover:bg-gray-700 transition">
            🔧 Guides
          </Link>
          <Link to="/settings" className="block p-3 rounded hover:bg-gray-700 transition">
            ⚙️ Settings
          </Link>
          <Link to="/help" className="block p-3 rounded hover:bg-gray-700 transition">
            ❓ Help
          </Link>
        </nav>
      </div>

      {/* Footer */}
      <div className="text-gray-400 text-sm mt-6">
        <p>© 2025 Gesture Garage</p>
      </div>
    </aside>
  );
};

export default Sidebar;
