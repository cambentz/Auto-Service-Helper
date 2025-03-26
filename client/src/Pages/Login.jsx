import React from "react";
import InputField from "../components/InputField";
import Button from "../components/Button";

const Login = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Login to GestureGarage</h2>
        <InputField className="placeholder-gray-500" type="email" placeholder="Email" />
        <InputField className="placeholder-gray-500" type="password" placeholder="Password" />
        <a href="/forgot-password" className="text-blue-500 hover:underline">Forgot Password?</a>
        <Button className="w-full mt-4">Login</Button>
      </div>
    </div>
  );
};

export default Login;
