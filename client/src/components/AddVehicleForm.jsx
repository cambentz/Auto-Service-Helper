import React, { useEffect, useState } from "react";

const AddVehicleForm = () => {
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [nickname, setNickname] = useState("");

  const years = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);

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
        
  
        // Sort alphabetically
        filtered.sort((a, b) => a.Make_Name.localeCompare(b.Make_Name));
        setMakes(filtered);
      })
      .catch((err) => console.error("Error fetching makes:", err));
  }, []);

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
    };

    console.log("🚗 Submitting vehicle:", vehicleData);
    // This is where you'd send vehicleData to the backend when ready
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
        className="w-full mb-4 p-2 border border-gray-300 rounded"
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
        disabled={!models.length}
        className="w-full mb-4 p-2 border border-gray-300 rounded"
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
        className="w-full mb-4 p-2 border border-gray-300 rounded"
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
        className="w-full mb-6 p-2 border border-gray-300 rounded"
      />

      <button
        type="submit"
        className="w-full bg-[#1A3D61] text-white py-2 rounded hover:bg-[#17405f] transition"
      >
        Submit Vehicle
      </button>
    </form>
  );
};

export default AddVehicleForm;
