import React, { useEffect, useState } from "react";
import Sidebar from "../../components/DoctorSidebar";

const DoctorProfile = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    specialization: "",
    phone: "",
    bio: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/doctor-profile");
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };

    fetchProfile();
  }, []);

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

          <div className="mb-4">
            <label className="text-gray-600 font-semibold">Bio:</label>
            <p className="text-gray-800">{profile.bio || "N/A"}</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DoctorProfile;
