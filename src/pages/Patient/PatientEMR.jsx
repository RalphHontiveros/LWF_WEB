import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/PatientSidebar";

const PatientEMR = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthentication = () => {
      const userRole = localStorage.getItem("userRole");
      if (userRole !== "patient") {
        navigate("/login");
        return false;
      }
      return true;
    };

    const fetchPatientData = async () => {
      if (!checkAuthentication()) return;

      try {
        const res = await fetch("/api/emr/own", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch patient data. You may be unauthorized.");
        }

        const data = await res.json();

        if (data.success) {
          setPatient(data.emr);
        } else {
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
      <div className={`transition-all duration-300 ml-${isSidebarOpen ? "64" : "16"} flex-1 p-6 md:p-10`}>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold text-blue-700 mb-6 border-b pb-3">Patient Profile</h2>

          {/* Personal Information */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <Info label="Name" value={patient.name} />
            <Info label="Age" value={`${patient.age} (DOB: ${patient.dob})`} />
            <Info label="Gender" value={patient.gender} />
            <Info label="Blood Type" value={patient.bloodType} />
            <Info label="Contact" value={patient.contact} />
            <Info label="Email" value={patient.email} />
            <div className="sm:col-span-2">
              <Info label="Address" value={patient.address} />
            </div>
          </section>

          {/* Medical Information */}
          <section className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Medical Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Info label="Allergies" value={patient.allergies?.join(", ") || "None"} />
              <Info label="Chronic Conditions" value={patient.conditions?.join(", ") || "None"} />
            </div>

            <div className="mt-6">
              <h4 className="text-lg font-semibold text-gray-700 mb-2">Current Medications:</h4>
              <ul className="list-disc list-inside text-gray-600 ml-4">
                {patient.medications?.length > 0 ? (
                  patient.medications.map((med, idx) => (
                    <li key={idx}>
                      {med.name} ({med.frequency})
                    </li>
                  ))
                ) : (
                  <li>None</li>
                )}
              </ul>
            </div>
          </section>

          {/* Recent Visits */}
          <section>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Recent Visits</h3>
            <div className="overflow-x-auto shadow rounded-lg">
              <table className="w-full text-sm text-gray-700 bg-white border border-gray-300 rounded-md">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="px-6 py-3 text-left">Date</th>
                    <th className="px-6 py-3 text-left">Reason</th>
                    <th className="px-6 py-3 text-left">Doctor</th>
                  </tr>
                </thead>
                <tbody>
                  {patient.visitHistory?.length > 0 ? (
                    patient.visitHistory.map((visit, index) => (
                      <tr key={index} className="odd:bg-gray-100 even:bg-gray-50">
                        <td className="px-6 py-4">{visit.date}</td>
                        <td className="px-6 py-4">{visit.reason}</td>
                        <td className="px-6 py-4">{visit.doctor}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center px-6 py-4 text-gray-500">
                        No visits recorded.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

// Reusable Info Component
const Info = ({ label, value }) => (
  <div>
    <p className="text-sm text-gray-500 mb-1">{label}</p>
    <p className="font-medium text-gray-800">{value}</p>
  </div>
);

export default PatientEMR;
