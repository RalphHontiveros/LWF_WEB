import React, { useEffect, useState } from "react";
import Sidebar from "../../components/AdminSidebar";

const AdminProfile = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const response = await fetch("/api/admin-profile");
        const data = await response.json();
        setAdmin(data);
      } catch (error) {
        console.error("Error fetching admin profile:", error);
      }
    };

    fetchAdminProfile();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <main
        className={`flex-1 p-8 transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-16"
        }`}
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Admin Profile
        </h1>

        {admin ? (
          <div className="bg-white p-6 rounded-md shadow-md max-w-lg">
            <div className="mb-4">
              <label className="text-gray-600">Full Name</label>
              <p className="text-lg font-semibold">{admin.name}</p>
            </div>

            <div className="mb-4">
              <label className="text-gray-600">Email</label>
              <p className="text-lg font-semibold">{admin.email}</p>
            </div>

            <div className="mb-4">
              <label className="text-gray-600">Username</label>
              <p className="text-lg font-semibold">{admin.username}</p>
            </div>

            {/* Add more profile details if needed */}
          </div>
        ) : (
          <p className="text-gray-600">Loading profile...</p>
        )}
      </main>
    </div>
  );
};

export default AdminProfile;
