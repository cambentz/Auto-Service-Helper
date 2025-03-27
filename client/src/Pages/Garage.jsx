import React from "react";

const vehicles = [
  {
    id: 1,
    make: "Toyota",
    model: "Camry",
    year: 2020,
    lastService: "Oil Change - Jan 2024",
  },
  {
    id: 2,
    make: "Honda",
    model: "Civic",
    year: 2018,
    lastService: "Tire Rotation - Feb 2024",
  },
];

const Garage = () => {
  return (
    <div className="min-h-screen bg-[#F8F8F8] text-black px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-[#1A3D61]">Your Garage</h1>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div
            className="border-2 border-dashed border-[#1A3D61] rounded-lg p-6 flex items-center justify-center text-center cursor-pointer hover:bg-[#e7eff7] transition"
            onClick={() => alert("Add new car flow coming soon!")}
          >
            <div>
              <p className="text-4xl mb-2">➕</p>
              <p className="font-semibold text-[#1A3D61] text-lg">Add a New Vehicle</p>
            </div>
          </div>

          {vehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition"
            >
              <h2 className="text-xl font-bold text-[#1A3D61]">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </h2>
              <p className="text-gray-600 mt-2">Last Service:</p>
              <p className="text-sm text-gray-800">{vehicle.lastService}</p>

              <button className="mt-4 px-4 py-2 bg-[#1A3D61] text-white rounded hover:bg-[#17405f] transition text-sm">
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Garage;
