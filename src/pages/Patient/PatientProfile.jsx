import React, { useState, useEffect } from "react";
import Sidebar from "../../components/PatientSidebar";
import Header from "../../components/header";

const PatientProfile = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [patient, setPatient] = useState(null); // dynamic patient data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Replace this with your actual API endpoint
    fetch("http://localhost:3000/api/patient/123456")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch patient data");
        return res.json();
      })
      .then((data) => {
        setPatient(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8">Loading patient profile...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;
  if (!patient) return null;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className={`transition-all duration-300 ml-${isSidebarOpen ? "64" : "16"} flex-1 p-8`}>
        <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-3">Patient Profile</h2>
        
        <div className="grid grid-cols-2 gap-6 border-b pb-6 mb-6">
          <p><strong className="text-gray-700">Name:</strong> {patient.name}</p>
          <p><strong className="text-gray-700">Age:</strong> {patient.age} (DOB: {patient.dob})</p>
          <p><strong className="text-gray-700">Gender:</strong> {patient.gender}</p>
          <p><strong className="text-gray-700">Blood Type:</strong> {patient.bloodType}</p>
          <p><strong className="text-gray-700">Contact:</strong> {patient.contact}</p>
          <p><strong className="text-gray-700">Email:</strong> {patient.email}</p>
          <p className="col-span-2"><strong className="text-gray-700">Address:</strong> {patient.address}</p>
        </div>

        <div className="border-b pb-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Medical Information</h3>
          <p><strong className="text-gray-700">Allergies:</strong> {patient.allergies.join(", ")}</p>
          <p><strong className="text-gray-700">Chronic Conditions:</strong> {patient.conditions.join(", ")}</p>
          <p><strong className="text-gray-700">Current Medications:</strong></p>
          <ul className="list-disc list-inside text-gray-700 ml-4">
            {patient.medications.map((med, index) => (
              <li key={index}>{med.name} ({med.frequency})</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Recent Visits</h3>
          <table className="w-full border border-gray-300 text-left rounded-lg overflow-hidden shadow-md">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="p-3">Date</th>
                <th className="p-3">Reason</th>
                <th className="p-3">Doctor</th>
              </tr>
            </thead>
            <tbody>
              {patient.visitHistory.map((visit, index) => (
                <tr key={index} className="border bg-gray-50 even:bg-gray-100">
                  <td className="p-3 border text-gray-700">{visit.date}</td>
                  <td className="p-3 border text-gray-700">{visit.reason}</td>
                  <td className="p-3 border text-gray-700">{visit.doctor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
