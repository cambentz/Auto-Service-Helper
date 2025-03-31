import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Garage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [unitPreference, setUnitPreference] = useState("miles");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("garageVehicles")) || [];
    setVehicles(stored);
  }, []);

  useEffect(() => {
    const storedUnits = localStorage.getItem("unitPreference");
    if (storedUnits) setUnitPreference(storedUnits);
  }, []);

  const handleDelete = (indexToDelete) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this vehicle and its history? This action cannot be undone."
    );
    if (!confirmed) return;

    const updated = vehicles.filter((_, index) => index !== indexToDelete);
    localStorage.setItem("garageVehicles", JSON.stringify(updated));
    setVehicles(updated);
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] text-black px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-[#1A3D61]">Your Garage</h1>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Add Vehicle Card */}
          <Link to="/add-vehicle" className="block">
            <div className="border-2 border-dashed border-[#1A3D61] rounded-xl p-6 flex items-center justify-center text-center hover:bg-[#e7eff7] transition cursor-pointer h-full min-h-[200px]">
              <div>
                <p className="text-4xl mb-2 text-[#1A3D61] font-bold">+</p>
                <p className="font-semibold text-[#1A3D61] text-lg">Add a New Vehicle</p>
              </div>
            </div>
          </Link>

          {/* Vehicle Cards */}
          {vehicles.map((vehicle, index) => (
            <div
              key={index}
              className="relative bg-white rounded-xl shadow-sm hover:shadow-md transition p-5 flex flex-col"
            >
              {/* Delete Button */}
              <button
                onClick={() => handleDelete(index)}
                className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-xl cursor-pointer"
                aria-label="Delete Vehicle"
                title="Delete Vehicle"
              >
                &times;
              </button>

              {/* Placeholder image */}
              <div className="w-full h-40 bg-gray-100 border border-gray-200 rounded mb-4 flex items-center justify-center text-gray-400 text-sm italic">
                No Image
              </div>

              {/* Vehicle Info */}
              <h2 className="text-lg sm:text-xl font-semibold text-[#1A3D61] mb-1">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </h2>

              {vehicle.nickname && (
                <p className="text-sm text-gray-500 italic mb-2">“{vehicle.nickname}”</p>
              )}

              {vehicle.mileage && (
                <div className="mb-3">
                  <p className="text-gray-600 text-sm">Mileage:</p>
                  <p className="text-sm text-gray-800 font-medium">
                    {Number(vehicle.mileage).toLocaleString()}{" "}
                    {unitPreference === "kilometers" ? "km" : "mi"}
                  </p>
                </div>
              )}

              <Link
                to="/add-vehicle"
                state={{ vehicle, index }}
                className="mt-auto block text-sm"
              >
                <button className="w-full px-4 py-2 bg-[#1A3D61] text-white rounded hover:bg-[#17405f] transition cursor-pointer">
                  Edit Details
                </button>
              </Link>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Garage;
