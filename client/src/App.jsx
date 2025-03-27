import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./layouts/Layout";
import Home from "./Pages/Home";
import Garage from "./Pages/Garage";
import Guides from "./Pages/Guides";
import Help from "./Pages/Help";
import Auth from "./Pages/Auth";
import Settings from "./Pages/Settings";
import ResetPassword from './Pages/ResetPassword';
import AddVehiclePage from "./Pages/AddVehiclePage";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Parent route with layout */}
        <Route path="/" element={<Layout />}>
          {/* Nested routes */}
          <Route index element={<Home />} />
          <Route path="garage" element={<Garage />} />
          <Route path="guides" element={<Guides />} />
          <Route path="help" element={<Help />} />
          <Route path="auth" element={<Auth />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route path="settings" element={<Settings />} />
          <Route path="/add-vehicle" element={<AddVehiclePage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
