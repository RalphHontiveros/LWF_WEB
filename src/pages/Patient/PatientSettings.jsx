import React, { useState } from "react";
import React, { useState } from "react";
import Sidebar from "../../components/PatientSidebar";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const SimplePatientSettings = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    oldPassword: false,
    newPassword: false,
    confirmNewPassword: false,
  });

  // Helper to get cookie value by name
  const getCookie = (name) => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
    return null;
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

    // Client-side validation before API call
    if (passwords.newPassword !== passwords.confirmNewPassword) {
      alert("New password and confirm password do not match!");
      return;
    }
    if (passwords.oldPassword === passwords.newPassword) {
      alert("New password must be different from old password!");
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
          oldPassword: passwords.oldPassword,
          newPassword: passwords.newPassword,
          confirmNewPassword: passwords.confirmNewPassword,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert(result.message || "Password changed successfully.");
        setPasswords({
          oldPassword: "",
          newPassword: "",
          confirmNewPassword: "",
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
      <main className={`flex-1 p-8 transition-all duration-300 `}>
        <h1 className="text-3xl font-bold mb-8">Settings</h1>

        <div className="bg-white p-6 rounded-md shadow-md max-w-md">
          <h2 className="text-xl font-bold mb-4">Change Password</h2>
          <form onSubmit={handleChangePassword}>
            {/* Current Password */}
            <div className="mb-4 relative">
              <label className="block text-gray-600 mb-1">Current Password</label>
              <input
                type={showPasswords.oldPassword ? "text" : "password"}
                name="oldPassword"
                value={passwords.oldPassword}
                onChange={handlePasswordChange}
                className="w-full p-2 border border-gray-300 rounded-md pr-10"
                required
              />
              <button
                type="button"
                onClick={() => toggleShowPassword("oldPassword")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
                aria-label={showPasswords.oldPassword ? "Hide password" : "Show password"}
              >
                {showPasswords.oldPassword ? (
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
                aria-label={showPasswords.newPassword ? "Hide password" : "Show password"}
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
                type={showPasswords.confirmNewPassword ? "text" : "password"}
                name="confirmNewPassword"
                value={passwords.confirmNewPassword}
                onChange={handlePasswordChange}
                className="w-full p-2 border border-gray-300 rounded-md pr-10"
                required
              />
              <button
                type="button"
                onClick={() => toggleShowPassword("confirmNewPassword")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
                aria-label={showPasswords.confirmNewPassword ? "Hide password" : "Show password"}
              >
                {showPasswords.confirmNewPassword ? (
                  <AiOutlineEyeInvisible size={20} />
                ) : (
                  <AiOutlineEye size={20} />
                )}
              </button>
            </div>

            <button type="submit" className="bg-green-500 text-white px-6 py-2 rounded-md">
              Update Password
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default SimplePatientSettings;