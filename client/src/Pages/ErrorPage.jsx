// src/Pages/ErrorPage.jsx
import React from "react";
import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div className="min-h-screen bg-[#F8F8F8] flex flex-col items-center justify-center text-center px-6">
      <div className="bg-white p-10 rounded-2xl shadow-xl max-w-md w-full">
        {/* Optional: you can swap this with a repair icon later */}
        <div className="text-7xl mb-4 text-[#1A3D61]">🔧</div>

        <h1 className="text-3xl font-extrabold text-[#1A3D61] mb-2">
          Sorry, looks like something needs repaired!
        </h1>

        <p className="text-gray-600 mb-6">
          We couldn’t find the page you’re looking for — or something just broke along the way.
        </p>

        <Link
          to="/"
          className="inline-block px-6 py-3 bg-[#1A3D61] text-white rounded-xl hover:bg-opacity-90 transition text-lg font-medium shadow-md"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
