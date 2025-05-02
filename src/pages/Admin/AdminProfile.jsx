import React, { useEffect, useState } from "react";
import Sidebar from "../../components/AdminSidebar";

const AdminProfile = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    contactNumber: "",
  });
  const [editProfile, setEditProfile] = useState({
    fullName: "",
    email: "",
    contactNumber: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [profileExists, setProfileExists] = useState(false);

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

  const userId = getCookie("UserID");

  const fetchAdminProfile = async () => {
    if (!userId) {
      console.error("User ID is not available.");
      return;
    }
    try {
      const response = await fetch(`/api/admin/${userId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        setProfile(data);
        setEditProfile(data);
        setProfileExists(true);
      } else if (response.status === 404) {
        setProfileExists(false);
      } else {
        console.error("Error fetching admin profile:", data.message);
      }
    } catch (error) {
      console.error("Error fetching admin profile:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchAdminProfile();
    }
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const url = profileExists
        ? `/api/admin/${userId}`
        : `/api/admin`;

      const method = profileExists ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(editProfile),
      });

      const data = await response.json();

      if (response.ok) {
        setProfile(data);
        setIsEditing(false);
        setProfileExists(true);
      } else {
        console.error("Error saving profile:", data.message);
      }
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <main className="flex-1 px-4 md:px-8 py-6 transition-all duration-300 overflow-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Admin Profile</h1>

        <div className="bg-white p-6 rounded-2xl shadow-lg max-w-2xl mx-auto border border-gray-200">
          {/* Full Name */}
          <div className="mb-5">
            <label className="block text-gray-700 font-medium mb-1">Full Name</label>
            {isEditing || !profileExists ? (
              <input
                type="text"
                name="fullName"
                value={editProfile.fullName}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            ) : (
              <p className="text-gray-900">{profile.fullName}</p>
            )}
          </div>

          {/* Email */}
          <div className="mb-5">
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            {isEditing || !profileExists ? (
              <input
                type="email"
                name="email"
                value={editProfile.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            ) : (
              <p className="text-gray-900">{profile.email}</p>
            )}
          </div>

          {/* Contact Number */}
          <div className="mb-5">
            <label className="block text-gray-700 font-medium mb-1">Contact Number</label>
            {isEditing || !profileExists ? (
              <input
                type="text"
                name="contactNumber"
                value={editProfile.contactNumber}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            ) : (
              <p className="text-gray-900">{profile.contactNumber}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4 mt-6">
            {isEditing || !profileExists ? (
              <>
                <button
                  onClick={handleSave}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Save
                </button>
                {profileExists && (
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditProfile(profile);
                    }}
                    className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                )}
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminProfile;
