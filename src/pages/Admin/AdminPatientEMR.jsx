import React, { useEffect, useState } from "react";
import Sidebar from "../../components/AdminSidebar";

const AdminPatientEMR = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [emrs, setEmrs] = useState([]);

  useEffect(() => {
    const fetchEMRs = async () => {
      try {
        const response = await fetch("/api/emr/all", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setEmrs(data.emrs);
        } else {
          console.error("Error fetching EMRs:", data.message);
        }
      } catch (error) {
        console.error("Error fetching EMRs:", error);
      }
    };

    fetchEMRs();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <main className="flex-1 p-8 transition-all duration-300">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Patient EMRs</h1>
        </div>

        <div className="bg-white rounded-md shadow p-4 overflow-auto">
          {emrs.length === 0 ? (
            <p className="text-gray-600">No EMRs found.</p>
          ) : (
            <table className="w-full table-auto">
              <thead>
                <tr className="text-left border-b">
                  <th className="p-2">Name</th>
                  <th className="p-2">Diagnosis</th>
                  <th className="p-2">Medications</th>
                  <th className="p-2">Notes</th>
                </tr>
              </thead>
              <tbody>
                {emrs.map((emr) => (
                  <tr key={emr._id} className="border-b hover:bg-gray-50">
                    <td className="p-2">{emr.name || "N/A"}</td>
                    <td className="p-2">{emr.diagnosis || "N/A"}</td>
                    <td className="p-2">{(emr.medications || []).join(", ") || "N/A"}</td>
                    <td className="p-2">{emr.notes || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminPatientEMR;
