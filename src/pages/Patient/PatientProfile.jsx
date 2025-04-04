import React from "react";
import Sidebar from "../../components/PatientSidebar";
import Header from "../../components/header";

const PatientProfile = () => {
  const patient = {
    id: "123456",
    name: "John Doe",
    dob: "1985-01-15",
    age: 39,
    gender: "Male",
    bloodType: "O+",
    contact: "(123) 456-7890",
    email: "johndoe@email.com",
    address: "123 Main St, City, State, ZIP",
    allergies: ["Penicillin", "Peanuts"],
    conditions: ["Hypertension", "Type 2 Diabetes"],
    medications: [
      { name: "Metformin 500mg", frequency: "2x daily" },
      { name: "Lisinopril 10mg", frequency: "1x daily" },
    ],
    visitHistory: [
      { date: "2024-08-10", reason: "Routine Check-up", doctor: "Dr. Smith" },
      { date: "2024-07-15", reason: "Diabetes Management", doctor: "Dr. Brown" },
      { date: "2024-06-05", reason: "Knee Pain", doctor: "Dr. Green" },
    ],
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="max-w-4xl mx-auto p-8 bg-white shadow-xl rounded-2xl w-full mt-10">
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
