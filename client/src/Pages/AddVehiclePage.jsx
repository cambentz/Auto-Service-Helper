import React from "react";
import AddVehicleForm from "../components/AddVehicleForm";

const AddVehiclePage = () => {
  return (
    <div className="min-h-screen bg-[#F8F8F8] text-black px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <AddVehicleForm />
      </div>
    </div>
  );
};

export default AddVehiclePage;
