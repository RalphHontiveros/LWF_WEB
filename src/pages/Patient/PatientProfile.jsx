import React, { useEffect, useState } from "react";
import Sidebar from "../../components/DoctorSidebar";

const DoctorProfile = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    specialization: "",
    phone: "",
  });

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  // Usage
  const userId = getCookie('UserID');
  console.log(userId);

  const current_cookie = getCookie("Authorization");
  console.log(current_cookie);
  console.log(document.cookie);

  //retrieve the doctor profile from the API
  const fetchDoctorProfile = async () => {
    try {
      const response = await fetch("/api/doctor/profile/" + userID, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
      });
      console.log("Response:", response);
      console.debug(print_r(response, true));
      const data = await response.json();
      if (response.ok) {
        setProfile(data);
      } else {
        console.error("Error fetching doctor profile:", data.message);
      }
    } catch (error) {
      console.error("Error fetching doctor profile:", error);
    }
  };


  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      <main className={`flex-1 p-8 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-16"}`}>
        <h1 className="text-2xl font-bold mb-6">Doctor Profile</h1>

        <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl">
          <div className="mb-4">
            <label className="text-gray-600 font-semibold">Full Name:</label>
            <p className="text-gray-800">{profile.fullName}</p>
          </div>

          <div className="mb-4">
            <label className="text-gray-600 font-semibold">Email:</label>
            <p className="text-gray-800">{profile.email}</p>
          </div>

          <div className="mb-4">
            <label className="text-gray-600 font-semibold">Specialization:</label>
            <p className="text-gray-800">{profile.specialization || "N/A"}</p>
          </div>

          <div className="mb-4">
            <label className="text-gray-600 font-semibold">Phone:</label>
            <p className="text-gray-800">{profile.phone || "N/A"}</p>
          </div>

          <pre>
            <label className="text-gray-600 font-semibold">Profile Data:</label>
            <code>{JSON.stringify(profile, null, 2)}</code>

          </pre>

        </div>
      </main>
    </div>
  );
};

export default DoctorProfile;