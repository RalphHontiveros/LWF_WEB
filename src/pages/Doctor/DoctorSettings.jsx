import React, { useState } from "react";
import Sidebar from "../../components/DoctorSidebar";

const SimplePatientSettings = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(passwords),
      });
      const result = await response.json();
      alert("Password changed successfully.");
    } catch (error) {
      console.error("Failed to change password:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <main className={`flex-1 p-8 transition-all duration-300 `}>
        <h1 className="text-3xl font-bold mb-8">Settings</h1>

        <div className="bg-white p-8 rounded-xl shadow-lg max-w-lg mx-auto">
          <h2 className="text-2xl font-bold mb-6">Change Password</h2>
          <form onSubmit={handleChangePassword} className="space-y-6">
            <div className="mb-6">
              <label className="block text-sm font-medium ">Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={passwords.currentPassword}
                onChange={handlePasswordChange}
                className="w-full p-4 mt-2 border-2  rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition duration-200"
                required
                placeholder="Enter your current password"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium ">New Password</label>
              <input
                type="password"
                name="newPassword"
                value={passwords.newPassword}
                onChange={handlePasswordChange}
                className="w-full p-4 mt-2 border-2  rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition duration-200"
                required
                placeholder="Enter your new password"
              />
            </div>


            <div className="flex justify-center">
              <button
                type="submit"
                className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
              >
                Update Password
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default SimplePatientSettings;
