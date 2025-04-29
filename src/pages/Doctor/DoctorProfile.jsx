import React, { useEffect, useState } from "react";
import Sidebar from "../../components/DoctorSidebar";

const DoctorProfile = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [profile, setProfile] = useState({
    fullName: "",
    specialization: "",
    phone: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editProfile, setEditProfile] = useState(profile);

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  const userId = getCookie('UserID');

  const fetchDoctorProfile = async () => {
    if (!userId) {
      console.error("User ID is not available.");
      return;
    }
    try {
      const response = await fetch(`/api/doctor/profile/${userId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
      });

      const data = await response.json();
      if (response.ok) {
        setProfile(data);
        setEditProfile(data); // Initialize edit form with current data
      } else {
        console.error("Error fetching doctor profile:", data.message);
      }
    } catch (error) {
      console.error("Error fetching doctor profile:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchDoctorProfile();
    }
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/doctor/profile/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify(editProfile),
      });

      const data = await response.json();
      if (response.ok) {
        setProfile(data);
        setIsEditing(false);
      } else {
        console.error("Error updating doctor profile:", data.message);
      }
    } catch (error) {
      console.error("Error updating doctor profile:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      <main className={`flex-1 p-8 transition-all duration-300 `}>
        <h1 className="text-2xl font-bold mb-6">Doctor Profile</h1>

        <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl">
          <div className="mb-4">
            <label className="text-gray-600 font-semibold">Full Name:</label>
            {isEditing ? (
              <input
                type="text"
                name="fullName"
                value={editProfile.fullName}
                onChange={handleChange}
                className="border p-2 w-full mt-1"
              />
            ) : (
              <p className="text-gray-800">{profile.fullName}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="text-gray-600 font-semibold">Specialization:</label>
            {isEditing ? (
              <input
                type="text"
                name="specialization"
                value={editProfile.specialization}
                onChange={handleChange}
                className="border p-2 w-full mt-1"
              />
            ) : (
              <p className="text-gray-800">{profile.specialization || "N/A"}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="text-gray-600 font-semibold">Phone:</label>
            {isEditing ? (
              <input
                type="text"
                name="phone"
                value={editProfile.phone}
                onChange={handleChange}
                className="border p-2 w-full mt-1"
              />
            ) : (
              <p className="text-gray-800">{profile.phone || "N/A"}</p>
            )}
          </div>

          <div className="flex space-x-4 mt-6">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Save
                </button>
                <button
                  onClick={() => { setIsEditing(false); setEditProfile(profile); }}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
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

export default DoctorProfile;
