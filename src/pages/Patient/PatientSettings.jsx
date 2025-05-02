import React, { useState } from "react";
import Sidebar from "../../components/PatientSidebar";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const SimplePatientSettings = () => {
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
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
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
    <div className="flex h-screen bg-gray-100">
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <main className="flex-1 flex justify-center items-center p-6">
        <div className="bg-white w-full max-w-lg p-8 rounded-xl shadow-lg transition-all duration-300">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">
            Change Password
          </h1>
          <form onSubmit={handleChangePassword} className="space-y-5">
            {["currentPassword", "newPassword", "confirmPassword"].map((field) => (
              <div key={field}>
                <label className="block text-gray-700 font-medium capitalize mb-1">
                  {field.replace(/([A-Z])/g, " $1")}
                </label>
                <div className="relative">
                  <input
                    type={showPasswords[field] ? "text" : "password"}
                    name={field}
                    value={passwords[field]}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => toggleShowPassword(field)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-blue-600 focus:outline-none"
                  >
                    {showPasswords[field] ? (
                      <AiOutlineEyeInvisible size={20} />
                    ) : (
                      <AiOutlineEye size={20} />
                    )}
                  </button>
                </div>
              </div>
            ))}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium transition duration-200"
            >
              Update Password
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default SimplePatientSettings;
