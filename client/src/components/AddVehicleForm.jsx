import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// This component handles both adding and editing a vehicle.
// Backend devs: Replace all localStorage usage with API/database integration.


const AddVehicleForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // If editing, vehicle and index come from location.state
  // Backend devs: Adjust this logic when pulling vehicle details from your DB or API

  const editing = !!location.state;
  const { vehicle: existingVehicle, index } = location.state || {};
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [nickname, setNickname] = useState("");
  const [mileage, setMileage] = useState("");

  // Pre-fill the form when editing an existing vehicle
  useEffect(() => {
    if (editing && existingVehicle) {
      setSelectedMake(existingVehicle.make || "");
      setSelectedModel(existingVehicle.model || "");
      setSelectedYear(existingVehicle.year || "");
      setNickname(existingVehicle.nickname || "");
      setMileage(existingVehicle.mileage || "");
    }
  }, [editing, existingVehicle]);


  // Fetch stored unit preference (miles/km)
  // Backend devs: Replace this with user preference from backend account settings
  const years = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);
  const [unitPreference, setUnitPreference] = useState("miles");
  useEffect(() => {
    const storedUnits = localStorage.getItem("unitPreference");
    if (storedUnits) {
      setUnitPreference(storedUnits);
    }
  }, []);

  // Fetch and filter popular vehicle makes
  // Backend devs: You could cache this data server-side or replace with a backend endpoint
  useEffect(() => {
    fetch("https://vpic.nhtsa.dot.gov/api/vehicles/GetAllMakes?format=json")
      .then((res) => res.json())
      .then((data) => {
        const popularMakes = [
          "toyota", "honda", "ford", "chevrolet", "nissan", "bmw", "mercedesbenz", "hyundai",
          "kia", "volkswagen", "subaru", "mazda", "lexus", "jeep", "dodge", "ram", "gmc", "tesla",
          "acura", "infiniti", "buick", "chrysler", "cadillac", "volvo", "lincoln", "mitsubishi",
          "mini", "porsche", "audi", "genesis", "landrover", "jaguar"
        ];

        const filtered = data.Results.filter((make) =>
          popularMakes.includes(make.Make_Name.toLowerCase().replace(/[^a-z]/gi, ""))
        );
        filtered.sort((a, b) => a.Make_Name.localeCompare(b.Make_Name));
        setMakes(filtered);
      })
      .catch((err) => console.error("Error fetching makes:", err));
  }, []);

  // Fetch models when a make is selected
  useEffect(() => {
    if (!selectedMake) return;
    fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMake/${selectedMake}?format=json`)
      .then((res) => res.json())
      .then((data) => setModels(data.Results))
      .catch((err) => console.error("Error fetching models:", err));
  }, [selectedMake]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const vehicleData = {
      make: selectedMake,
      model: selectedModel,
      year: selectedYear,
      nickname: nickname || null,
      mileage: mileage || null,
      imageURL: null, // Placeholder for future image upload
    };

    // Save vehicle data to localStorage for now
    // Backend devs: Replace this entire block with API POST/PUT request to store vehicle
    const existing = JSON.parse(localStorage.getItem("garageVehicles")) || [];
    let updated;

    if (editing && typeof index === "number") {
      updated = [...existing];
      updated[index] = vehicleData;
    } else {
      updated = [...existing, vehicleData];
    }

    localStorage.setItem("garageVehicles", JSON.stringify(updated));
    // Redirect to garage view
    // Backend devs: Consider refreshing the vehicle list on redirect
    navigate("/garage");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Add a Vehicle</h2>

      <label className="block mb-2 text-sm font-medium text-gray-700">Make</label>
      <select
        value={selectedMake}
        onChange={(e) => {
          setSelectedMake(e.target.value);
          setSelectedModel("");
        }}
        className="w-full mb-4 p-2 border border-gray-300 rounded bg-gray-100"
        disabled={editing}
      >

        <option value="">Select Make</option>
        {makes.map((make) => (
          <option key={make.Make_ID} value={make.Make_Name}>
            {make.Make_Name}
          </option>
        ))}
      </select>

      <label className="block mb-2 text-sm font-medium text-gray-700">Model</label>
      <select
        value={selectedModel}
        onChange={(e) => setSelectedModel(e.target.value)}
        disabled={editing || !models.length}
        className="w-full mb-4 p-2 border border-gray-300 rounded bg-gray-100"
      >

        <option value="">{selectedMake ? "Select Model" : "Select Make First"}</option>
        {models.map((model) => (
          <option key={model.Model_ID} value={model.Model_Name}>
            {model.Model_Name}
          </option>
        ))}
      </select>

      <label className="block mb-2 text-sm font-medium text-gray-700">Year</label>
      <select
        value={selectedYear}
        onChange={(e) => setSelectedYear(e.target.value)}
        className="w-full mb-4 p-2 border border-gray-300 rounded bg-gray-100"
        disabled={editing}
      >

        <option value="">Select Year</option>
        {years.map((year) => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select>

      <label className="block mb-2 text-sm font-medium text-gray-700">Nickname (optional)</label>
      <input
        type="text"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        placeholder="e.g. Dad's Car"
        className="w-full mb-6 p-2 border border-gray-300 rounded" />

      <label className="block mb-2 text-sm font-medium text-gray-700">
        Current Mileage ({unitPreference === "kilometers" ? "km" : "mi"})
      </label>
      <input
        type="number"
        value={mileage}
        onChange={(e) => {
          const value = e.target.value.replace(/\D/g, "").slice(0, 6); // digits only, max 6 chars
          setMileage(value);
        }}
        placeholder="e.g. 45200"
        className="w-full mb-6 p-2 border border-gray-300 rounded"
      />


      <button
        type="submit"
        disabled={!selectedMake || !selectedModel || !selectedYear || !mileage}
        className={`w-full bg-[#1A3D61] text-white py-2 rounded transition cursor-pointer shadow-md font-semibold ${!selectedMake || !selectedModel || !selectedYear || !mileage
          ? "opacity-50 cursor-not-allowed"
          : "hover:bg-[#17405f]"
          }`}
      >
        Submit Vehicle
      </button>

    </form>
  );
};

export default AddVehicleForm;
