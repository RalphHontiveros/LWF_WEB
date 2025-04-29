import React, { useState, useEffect } from "react";
import Sidebar from "../../components/PatientSidebar";
import { FaUserMd } from "react-icons/fa";

// Reusable component for Doctor Card
const DoctorCard = ({ id, name, specialty }) => (
  <div className="bg-white p-6 rounded-2xl shadow-xl flex items-center transition-all transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-200">
    <div className="flex-shrink-0 bg-gradient-to-r from-blue-300 to-blue-500 p-4 rounded-full">
      <FaUserMd className="text-white text-4xl" />
    </div>
    <div className="ml-5">
      <h2 className="text-2xl font-semibold text-gray-800">{name} <span className="text-sm text-gray-500">#{id}</span></h2>
      <p className="text-sm text-gray-600 mt-2">Specialty: <span className="font-medium">{specialty}</span></p>
    </div>
  </div>
);

const PatientDoctors = () => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch("/api/doctors");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        const availableDoctors = data.filter(doctor => doctor.isAvailable);
        setDoctors(availableDoctors);
      } catch (error) {
        console.error("Error fetching doctors:", error.message);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6 md:p-10 ml-0">
        <h1 className="text-3xl font-bold mb-8">Available Doctors</h1>
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {doctors.map((doctor) => (
            <DoctorCard
              key={doctor.id}
              id={doctor.id}
              name={doctor.name}
              specialty={doctor.specialty}
            />
          ))}
          {doctors.length === 0 && (
            <div className="col-span-full text-center text-gray-500 mt-10">
              No available doctors at the moment. Please check back later.
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PatientDoctors;
