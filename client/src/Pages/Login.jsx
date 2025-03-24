import React from "react";
import InputField from "../components/InputField";
import Button from "../components/Button";

const Login = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-xl font-bold mb-4">Login to GestureGarage</h2>
        <InputField type="email" placeholder="Email" />
        <InputField type="password" placeholder="Password" />
        <Button className="w-full mt-4">Login</Button>
      </div>
    </div>
  );
};

export default Login;
