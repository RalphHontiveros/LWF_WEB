import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import Sidebar from "../../components/PatientSidebar";
import Header from "../../components/header";

const PatientProfile = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthentication = () => {
      const token = localStorage.getItem("token");
      const userRole = localStorage.getItem("userRole");

      // If no token or user role is not 'patient', redirect to login page
      if (!token || userRole !== "patient") {
        navigate("/login");
        return false;
      }

      return true;
    };

    const fetchPatientData = async () => {
      if (!checkAuthentication()) {
        return;
      }

      try {
        const token = localStorage.getItem("token");

        // Fetching patient's own EMR from the backend
        const res = await fetch("/api/emr/own", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          // Handle non-OK response, e.g., 403 Forbidden
          throw new Error("Failed to fetch patient data. Please check your token.");
        }

        const data = await res.json();

        if (data.success) {
          setPatient(data.emr);
        } else {
          // Handle other server errors
          throw new Error(data.message || "Failed to fetch patient data");
        }

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [navigate]);

  if (loading) return <div className="p-8">Loading patient profile...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;
  if (!patient) return null;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className={`transition-all duration-300 ml-${isSidebarOpen ? "64" : "16"} flex-1 p-8`}>
        <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-3">Patient Profile</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-b pb-6 mb-6">
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
          <p><strong className="text-gray-700">Allergies:</strong> {patient.allergies?.join(", ") || "None"}</p>
          <p><strong className="text-gray-700">Chronic Conditions:</strong> {patient.conditions?.join(", ") || "None"}</p>
          <p><strong className="text-gray-700">Current Medications:</strong></p>
          <ul className="list-disc list-inside text-gray-700 ml-4">
            {patient.medications?.length > 0 ? (
              patient.medications.map((med, index) => (
                <li key={index}>{med.name} ({med.frequency})</li>
              ))
            ) : (
              <li>None</li>
            )}
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
              {patient.visitHistory?.length > 0 ? (
                patient.visitHistory.map((visit, index) => (
                  <tr key={index} className="border bg-gray-50 even:bg-gray-100">
                    <td className="p-3 border text-gray-700">{visit.date}</td>
                    <td className="p-3 border text-gray-700">{visit.reason}</td>
                    <td className="p-3 border text-gray-700">{visit.doctor}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="p-3 text-center text-gray-500">No visits recorded.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
