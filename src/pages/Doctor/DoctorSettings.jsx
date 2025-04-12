import React, { useState, useEffect } from "react";
import Sidebar from "../../components/DoctorSidebar";

const Settings = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    // Fetch current doctor profile info
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/doctor-profile");
        const data = await res.json();
        setFormData({ ...formData, fullName: data.fullName, email: data.email });
      } catch (error) {
        console.error("Error loading profile:", error);
      }
    };

    fetchProfile();
    // eslint-disable-next-line
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      return setStatusMessage("Passwords do not match.");
    }

    try {
      const res = await fetch("/api/doctor-update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      setStatusMessage(result.message || "Settings updated successfully.");
    } catch (error) {
      console.error("Error updating profile:", error);
      setStatusMessage("Error updating profile.");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      <main className={`flex-1 p-8 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-16"}`}>
        <h1 className="text-2xl font-bold mb-6">Settings</h1>

        <form onSubmit={handleSave} className="bg-white p-6 rounded-md shadow-md max-w-xl">
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-600">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 p-2 rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 p-2 rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-600">New Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 p-2 rounded-md"
              placeholder="Leave blank to keep current password"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-600">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 p-2 rounded-md"
            />
          </div>

          {statusMessage && <p className="text-sm text-blue-600 mb-4">{statusMessage}</p>}

          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Save Changes
          </button>
        </form>
      </main>
    </div>
  );
};

export default Settings;
