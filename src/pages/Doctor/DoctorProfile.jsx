import React, { useEffect, useState } from "react";
import Sidebar from "../../components/DoctorSidebar";
import { FaPhoneAlt, FaUserMd, FaRegSave, FaRegEdit } from 'react-icons/fa';
import axios from "axios";

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
      const response = await axios.get(`/api/doctor/profile/${userId}`, {
        withCredentials: true,
      });
  
      setProfile(response.data);
      setEditProfile(response.data);
  
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.warn("Profile not found. Attempting to create a new one...");
  
        // You can change these defaults or prompt the user later
        const defaultProfile = {
          fullName: "Dr. New User",
          specialization: "General",
          phone: "000-000-0000",
        };
  
        try {
          const createResponse = await axios.post(
            `/api/doctor/create-profile/${userId}`,
            defaultProfile,
            {
              headers: { "Content-Type": "application/json" },
              withCredentials: true,
            }
          );
  
          setProfile(createResponse.data);
          setEditProfile(createResponse.data);
  
        } catch (createError) {
          console.error("Failed to create profile:", createError.response?.data?.message || createError.message);
        }
      } else {
        console.error("Error fetching doctor profile:", error.response?.data?.message || error.message);
      }
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

      <main className={`flex-1 p-8 transition-all duration-300`}>
        <h1 className="text-3xl font-semibold mb-6 text-gray-800">Doctor Profile</h1>

        <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl mx-auto">
          <div className="mb-6">
            <label className="text-gray-700 font-medium">Full Name:</label>
            {isEditing ? (
              <input
                type="text"
                name="fullName"
                value={editProfile.fullName}
                onChange={handleChange}
                className="border p-3 w-full mt-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-800">{profile.fullName}</p>
            )}
          </div>

          <div className="mb-6">
            <label className="text-gray-700 font-medium">Specialization:</label>
            {isEditing ? (
              <input
                type="text"
                name="specialization"
                value={editProfile.specialization}
                onChange={handleChange}
                className="border p-3 w-full mt-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-800">{profile.specialization || "N/A"}</p>
            )}
          </div>

          <div className="mb-6">
            <label className="text-gray-700 font-medium">Phone:</label>
            {isEditing ? (
              <input
                type="text"
                name="phone"
                value={editProfile.phone}
                onChange={handleChange}
                className="border p-3 w-full mt-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-800">{profile.phone || "N/A"}</p>
            )}
          </div>

          <div className="flex space-x-4 mt-8">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="flex items-center bg-green-600 text-white px-6 py-3 rounded-md shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <FaRegSave className="mr-2" />
                  Save
                </button>
                <button
                  onClick={() => { setIsEditing(false); setEditProfile(profile); }}
                  className="flex items-center bg-gray-600 text-white px-6 py-3 rounded-md shadow-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  <FaRegEdit className="mr-2" />
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center bg-blue-600 text-white px-6 py-3 rounded-md shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <FaRegEdit className="mr-2" />
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
