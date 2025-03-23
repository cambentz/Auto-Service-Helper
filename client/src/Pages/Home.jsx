import React from "react";
import Header from "../components/Header";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <main className="flex-grow flex justify-center items-center">
        <div className="grid grid-cols-2 gap-6 max-w-3xl">
          <HomeButton text="Enter Car Info" />
          <HomeButton text="Find Parts" />
          <HomeButton text="Service History" />
          <HomeButton text="Recent Scans" />
        </div>
      </main>
    </div>
  );
};

// Reusable button component (without icons)
const HomeButton = ({ text }) => (
  <button className="p-6 bg-blue-700 text-white rounded-lg shadow-md hover:bg-blue-800 transition text-lg font-semibold">
    {text}
  </button>
);

export default Home;
