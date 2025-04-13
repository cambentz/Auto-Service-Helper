import React from "react";
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from "react-router-dom";
import Layout from "./layouts/Layout";
import Home from "./Pages/Home";
import Garage from "./Pages/Garage";
import Guides from "./Pages/Guides";
import GuidePage from "./Pages/GuidePage";
import Help from "./Pages/Help";
import Auth from "./Pages/Auth";
import Settings from "./Pages/Settings";
import ResetPassword from './Pages/ResetPassword';
import AddVehiclePage from "./Pages/AddVehiclePage";
import ErrorPage from "./Pages/ErrorPage";
import { AuthProvider } from "./utils/AuthContext";

const App = () => {
  return (
    <BrowserRouter basename="/">
    <Router>
      <AuthProvider>
        <Routes>
          {/* Parent route with layout */}
          <Route path="/" element={<Layout />}>
            {/* Nested routes */}
            <Route index element={<Home />} />
            <Route path="garage" element={<Garage />} />
            <Route path="guides" element={<Guides />} />
            <Route path="guides/:guideId" element={<GuidePage />} />
            <Route path="help" element={<Help />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/auth/reset" element={<Auth />} />
            <Route path="reset-password" element={<ResetPassword />} />
            <Route path="settings" element={<Settings />} />
            <Route path="/add-vehicle" element={<AddVehiclePage />} />
            <Route path="*" element={<ErrorPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
    </BrowserRouter>
  );
};

export default App;
