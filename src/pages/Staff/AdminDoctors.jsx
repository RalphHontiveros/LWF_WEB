import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import { FaUserMd } from "react-icons/fa";

const AdminDoctors = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch("/api/admin/doctors");
        const data = await response.json();
        setDoctors(data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <main className={`flex-1 p-8 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-16"}`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FaUserMd className="text-blue-600" /> Doctors Management
          </h1>
          {/* You can add an "Add Doctor" button here later */}
        </div>

        {doctors.length === 0 ? (
          <p className="text-gray-600">No doctors found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {doctors.map((doctor) => (
              <div key={doctor.id} className="bg-white p-5 rounded-md shadow-md hover:shadow-lg transition">
                <h2 className="text-lg font-bold text-blue-700">{doctor.fullName}</h2>
                <p className="text-gray-600">Specialization: {doctor.specialization}</p>
                <p className="text-gray-600">Email: {doctor.email}</p>
                <p className="text-gray-600">Phone: {doctor.phone}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDoctors;
