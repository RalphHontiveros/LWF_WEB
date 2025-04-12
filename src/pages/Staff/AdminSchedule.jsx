import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import { FaCalendarAlt } from "react-icons/fa";

const AdminSchedule = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await fetch("/api/admin/schedules");
        const data = await response.json();
        setSchedules(data);
      } catch (error) {
        console.error("Error fetching schedules:", error);
      }
    };

    fetchSchedules();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <main className={`flex-1 p-8 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-16"}`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FaCalendarAlt className="text-green-600" /> Doctor Schedules
          </h1>
        </div>

        {schedules.length === 0 ? (
          <p className="text-gray-600">No schedules found.</p>
        ) : (
          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="min-w-full table-auto text-left">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="px-6 py-3">Doctor</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Time</th>
                  <th className="px-6 py-3">Patient</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {schedules.map((sched) => (
                  <tr key={sched.id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4">{sched.doctorName}</td>
                    <td className="px-6 py-4">{sched.date}</td>
                    <td className="px-6 py-4">{sched.time}</td>
                    <td className="px-6 py-4">{sched.patientName}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${sched.status === "Confirmed" ? "bg-green-200 text-green-800" : "bg-yellow-200 text-yellow-800"}`}>
                        {sched.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminSchedule;
