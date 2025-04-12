import React, { useEffect, useState } from "react";
import Sidebar from "../../components/DoctorSidebar";
import { FaUserInjured, FaPhone, FaEnvelope } from "react-icons/fa";

const MyPatients = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch("/api/doctor-patients");
        const data = await response.json();
        setPatients(data);
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

    fetchPatients();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <main className={`flex-1 p-8 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-16"}`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Patients</h1>
          <div className="bg-white p-3 rounded-md shadow text-gray-600 flex items-center">
            🧑‍⚕️ <span className="ml-2">Doctor View</span>
          </div>
        </div>

        {patients.length === 0 ? (
          <p className="text-gray-600">You currently have no patients assigned.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {patients.map((patient) => (
              <div
                key={patient.patientId}
                className="bg-white p-5 rounded-md shadow-md hover:shadow-lg transition"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold">{patient.fullName}</h2>
                    <p className="text-gray-700">Age: {patient.age}</p>
                    <p className="text-gray-600">Gender: {patient.gender}</p>
                    <div className="mt-2 text-sm text-gray-600 space-y-1">
                      <p className="flex items-center gap-2">
                        <FaPhone /> {patient.phone}
                      </p>
                      <p className="flex items-center gap-2">
                        <FaEnvelope /> {patient.email}
                      </p>
                    </div>
                  </div>
                  <FaUserInjured className="text-green-500 text-3xl" />
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyPatients;
