import React from "react";

const Card = ({ title, description }) => {
  return (
    <div className="border rounded-lg p-4 shadow-md">
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
};

export default Card;
