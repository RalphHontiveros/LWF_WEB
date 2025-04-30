import React, { useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import { FaCalendarAlt } from "react-icons/fa";

const AdminSchedule = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <main className={`flex-1 p-8 transition-all duration-300`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FaCalendarAlt className="text-green-600" /> Doctor Schedules
          </h1>
        </div>

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
              <tr className="border-t hover:bg-gray-50">
                <td className="px-6 py-4">Dr. Smith</td>
                <td className="px-6 py-4">2025-05-01</td>
                <td className="px-6 py-4">10:00 AM</td>
                <td className="px-6 py-4">John Doe</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded-full text-xs bg-green-200 text-green-800">
                    Confirmed
                  </span>
                </td>
              </tr>
              <tr className="border-t hover:bg-gray-50">
                <td className="px-6 py-4">Dr. Lee</td>
                <td className="px-6 py-4">2025-05-02</td>
                <td className="px-6 py-4">11:30 AM</td>
                <td className="px-6 py-4">Jane Roe</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded-full text-xs bg-yellow-200 text-yellow-800">
                    Pending
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AdminSchedule;
