import React, { useState } from "react";
import Sidebar from "../../components/DoctorSidebar";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const SimpleDoctorSettings = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const getCookie = (name) => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const toggleShowPassword = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwords.newPassword !== passwords.confirmPassword) {
      alert("New password and confirm password do not match!");
      return;
    }

    if (passwords.currentPassword === passwords.newPassword) {
      alert("New password must be different from current password!");
      return;
    }

    try {
      const response = await fetch("/api/auth/change-password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getCookie("access_token")}`,
        },
        credentials: "include",
        body: JSON.stringify({
          oldPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
          confirmNewPassword: passwords.confirmPassword,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert(result.message || "Password changed successfully.");
        setPasswords({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        alert(result.message || "Failed to change password.");
      }
    } catch (error) {
      console.error("Failed to change password:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <main className="flex-1 p-8 transition-all duration-300">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>

        <div className="bg-white p-6 rounded-md shadow-md max-w-md">
          <h2 className="text-xl font-bold mb-4">Change Password</h2>
          <form onSubmit={handleChangePassword}>
            {/* Current Password */}
            <div className="mb-4 relative">
              <label className="block text-gray-600 mb-1">Current Password</label>
              <input
                type={showPasswords.currentPassword ? "text" : "password"}
                name="currentPassword"
                value={passwords.currentPassword}
                onChange={handlePasswordChange}
                className="w-full p-2 border border-gray-300 rounded-md pr-10"
                required
              />
              <button
                type="button"
                onClick={() => toggleShowPassword("currentPassword")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
              >
                {showPasswords.currentPassword ? (
                  <AiOutlineEyeInvisible size={20} />
                ) : (
                  <AiOutlineEye size={20} />
                )}
              </button>
            </div>

            {/* New Password */}
            <div className="mb-4 relative">
              <label className="block text-gray-600 mb-1">New Password</label>
              <input
                type={showPasswords.newPassword ? "text" : "password"}
                name="newPassword"
                value={passwords.newPassword}
                onChange={handlePasswordChange}
                className="w-full p-2 border border-gray-300 rounded-md pr-10"
                required
              />
              <button
                type="button"
                onClick={() => toggleShowPassword("newPassword")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
              >
                {showPasswords.newPassword ? (
                  <AiOutlineEyeInvisible size={20} />
                ) : (
                  <AiOutlineEye size={20} />
                )}
              </button>
            </div>

            {/* Confirm New Password */}
            <div className="mb-6 relative">
              <label className="block text-gray-600 mb-1">Confirm New Password</label>
              <input
                type={showPasswords.confirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={passwords.confirmPassword}
                onChange={handlePasswordChange}
                className="w-full p-2 border border-gray-300 rounded-md pr-10"
                required
              />
              <button
                type="button"
                onClick={() => toggleShowPassword("confirmPassword")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
              >
                {showPasswords.confirmPassword ? (
                  <AiOutlineEyeInvisible size={20} />
                ) : (
                  <AiOutlineEye size={20} />
                )}
              </button>
            </div>

            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md">
              Update Password
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default SimpleDoctorSettings;
