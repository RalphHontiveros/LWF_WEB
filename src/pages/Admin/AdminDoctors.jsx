import React, { useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import { FaUserMd } from "react-icons/fa";

const AdminDoctors = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <main className={`flex-1 p-8 transition-all duration-300`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FaUserMd className="text-blue-600" /> Doctors Management
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="bg-white p-5 rounded-md shadow-md hover:shadow-lg transition">
            <h2 className="text-lg font-bold text-blue-700">Dr. Anna Reyes</h2>
            <p className="text-gray-600">Specialization: Pediatrics</p>
            <p className="text-gray-600">Email: anna.reyes@hospital.com</p>
            <p className="text-gray-600">Phone: 0917-123-4567</p>
          </div>
          <div className="bg-white p-5 rounded-md shadow-md hover:shadow-lg transition">
            <h2 className="text-lg font-bold text-blue-700">Dr. Mark Tan</h2>
            <p className="text-gray-600">Specialization: Surgery</p>
            <p className="text-gray-600">Email: mark.tan@hospital.com</p>
            <p className="text-gray-600">Phone: 0918-987-6543</p>
          </div>
          <div className="bg-white p-5 rounded-md shadow-md hover:shadow-lg transition">
            <h2 className="text-lg font-bold text-blue-700">Dr. Lisa Santos</h2>
            <p className="text-gray-600">Specialization: Dermatology</p>
            <p className="text-gray-600">Email: lisa.santos@hospital.com</p>
            <p className="text-gray-600">Phone: 0920-555-3344</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDoctors;
