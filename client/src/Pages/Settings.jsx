import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TicketModal from "../components/TicketModal";
import { useAuth } from "../utils/AuthContext";
import PolicyModal from "../components/PolicyModal";
import privacyContent from "../utils/privacyContent";
import termsContent from "../utils/termsContent";

/**
 * Settings Page
 *
 * This page manages user account info, vehicle preferences, and support/legal access.
 *
 * - Backend Developers:
 * - All data is currently stored in localStorage (e.g., name, unitPreference).
 * - Replace localStorage with authenticated user profile data from your backend.
 * - Email is hardcoded for now; should come from backend session.
 * - Terms and privacy content are imported from local files; replace with dynamic content if needed.
 * - Support ticket submission (TicketModal) is frontend-only—connect to backend form/email service.
 */


const Settings = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);



  // Gets user name from localStorage (simulate user profile)
  const storedFirst = localStorage.getItem("userName") || "Gary";
  const [firstName, setFirstName] = useState(storedFirst);
  const storedLast = localStorage.getItem("userLastName") || "";
  const [lastName, setLastName] = useState(storedLast);

  const [savedMessage, setSavedMessage] = useState("");

  const [showTicketModal, setShowTicketModal] = useState(false);

  // Units also saved locally — should sync with backend user settings
  const [unitPreference, setUnitPreference] = useState(
    localStorage.getItem("unitPreference") || "miles"
  );

  const handleUnitChange = (e) => {
    const newUnit = e.target.value;
    setUnitPreference(newUnit);
    localStorage.setItem("unitPreference", newUnit); // Replace with user update API
  };


  const handleSaveName = () => {
    login(firstName); // Temporary mock login update
    localStorage.setItem("userName", firstName);
    localStorage.setItem("userLastName", lastName);
    setSavedMessage("Name saved!");
    setTimeout(() => setSavedMessage(""), 3000);

  };


  return (
    <div className="flex min-h-screen bg-[#F8F8F8] text-black">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-6">
        <nav className="space-y-4 text-sm">
          <h2 className="text-lg font-semibold mb-4 text-[#1A3D61]">Settings</h2>
          <a href="#account" className="text-[#1A3D61] font-medium block">Account</a>
          <a href="#vehicle" className="text-gray-700 hover:text-[#1A3D61] block">Vehicle Preferences</a>
          <a href="#support" className="text-gray-700 hover:text-[#1A3D61] block">Support & Privacy</a>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex justify-center p-10">
        <div className="w-full max-w-3xl space-y-10">

          {/* Account Info */}
          <section id="account" className="bg-white rounded-xl shadow p-8">
            <h3 className="text-2xl font-bold text-[#1A3D61] mb-6">Account Info</h3>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1A3D61] transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1A3D61] transition"
                    />
                  </div>
                </div>

              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value="gary@email.com"
                  disabled
                  className="w-full px-4 py-2 border border-gray-200 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <button
                  onClick={() => navigate("/auth/reset")}
                  className="text-[#1A3D61] hover:underline hover:text-[#17405f] mt-1 transition cursor-pointer"
                >
                  Reset Password
                </button>

              </div>
              <button
                onClick={handleSaveName}
                className="bg-[#1A3D61] text-white px-5 py-2 rounded-md hover:bg-[#17405f] transition cursor-pointer"
              >
                Save Changes
              </button>

              {savedMessage && (
                <p className="text-sm text-green-600 mt-2">{savedMessage}</p>
              )}

            </div>
          </section>

          {/* Vehicle Preferences */}
          <section id="vehicle" className="bg-white rounded-xl shadow p-8">
            <h3 className="text-2xl font-bold text-[#1A3D61] mb-6">Vehicle Preferences</h3>

            {/* Units Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Units</label>
              <select
                value={unitPreference}
                onChange={handleUnitChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-800"
              >
                <option value="miles">Miles</option>
                <option value="kilometers">Kilometers</option>
              </select>

              <p className="text-xs text-gray-500 mt-1">Used for odometer and distance-based guides.</p>
            </div>

            {/* Service History Placeholder */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Service History</label>
              <div className="text-gray-600 text-sm italic">
                No service history records available.
              </div>
            </div>
          </section>

          {/* Support Section */}
          <section id="support" className="bg-white rounded-xl shadow p-8">
            <h3 className="text-2xl font-bold text-[#1A3D61] mb-6">Support & Privacy</h3>
            <div className="space-y-3">
              <button
                onClick={() => setShowTicketModal(true)}
                className="block text-left w-fit text-[#1A3D61] hover:underline hover:text-[#17405f] transition cursor-pointer"
              >
                Contact Support
              </button>

              <button
                onClick={() => setShowPrivacyModal(true)}
                className="block text-left w-fit text-[#1A3D61] hover:underline hover:text-[#17405f] transition cursor-pointer"
              >
                Privacy Policy
              </button>

              <button
                onClick={() => setShowTermsModal(true)}
                className="block text-left w-fit text-[#1A3D61] hover:underline hover:text-[#17405f] transition cursor-pointer"
              >
                Terms of Service
              </button>
            </div>
          </section>

        </div>
      </main>

      {/* Ticket Modal */}
      <PolicyModal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
        title="Privacy Policy"
        content={privacyContent}
      />

      <PolicyModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        title="Terms of Service"
        content={termsContent}
      />

      <TicketModal isOpen={showTicketModal} onClose={() => setShowTicketModal(false)} />
    </div>
  );
};

export default Settings;
