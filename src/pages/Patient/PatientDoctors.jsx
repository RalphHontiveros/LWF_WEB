import React, { useState, useEffect } from "react";
import Sidebar from "../../components/PatientSidebar";
import { FaUserMd } from "react-icons/fa";

// Reusable component for Doctor Card
const DoctorCard = ({ id, name, specialty }) => (
  <div className="bg-white p-4 shadow rounded-md flex items-center">
    <FaUserMd className="text-blue-500 text-3xl mr-4" />
    <div>
      <h2 className="text-lg font-bold">{name} {id}</h2>
      <p className="text-sm text-gray-600">Specialty: {specialty}</p>
    </div>
  </div>
);

const PatientDoctors = () => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch("/api/doctors");
  
        // Check if the response is OK before parsing JSON
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const data = await response.json();
  
        // Filter only doctors who are available
        const availableDoctors = data.filter(doctor => doctor.isAvailable);
        setDoctors(availableDoctors);
      } catch (error) {
        console.error("Error fetching doctors:", error.message);
      }
    };
  
    fetchDoctors();
  }, []);
  

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8 ml-0 md:ml-64">
        <h1 className="text-2xl font-bold mb-4">Available Doctors</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {doctors.map((doctor) => (
            <DoctorCard
              key={doctor.id}
              id={doctor.id}
              name={doctor.name}
              specialty={doctor.specialty}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default PatientDoctors;
