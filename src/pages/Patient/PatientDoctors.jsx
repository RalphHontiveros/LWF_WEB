import React from "react";
import Sidebar from "../../components/PatientSidebar";
import { FaUserMd } from "react-icons/fa";

const PatientDoctors = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-8 ml-64">
        <h1 className="text-2xl font-bold mb-4">Available Doctors</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3].map((id) => (
            <div key={id} className="bg-white p-4 shadow rounded-md flex items-center">
              <FaUserMd className="text-blue-500 text-3xl mr-4" />
              <div>
                <h2 className="text-lg font-bold">Dr. Jane Smith {id}</h2>
                <p className="text-sm text-gray-600">Specialty: Internal Medicine</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default PatientDoctors;
