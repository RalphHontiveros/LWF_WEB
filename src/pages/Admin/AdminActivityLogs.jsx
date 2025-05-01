import React, { useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";

const AdminActivityLogs = () => {
  const logs = [
    { id: 1, user: "Admin", action: "Logged in", timestamp: "2025-05-01 10:00 AM" },
    { id: 2, user: "Nurse1", action: "Updated patient record", timestamp: "2025-05-01 10:10 AM" },
    { id: 3, user: "DoctorA", action: "Created appointment", timestamp: "2025-05-01 10:20 AM" },
    { id: 4, user: "Admin", action: "Logged out", timestamp: "2025-05-01 10:30 AM" },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  // Filtered logs
  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = selectedRole
      ? log.user.toLowerCase().includes(selectedRole)
      : true;

    return matchesSearch && matchesRole;
  });

  return (
    <AdminSidebar>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Activity Logs</h1>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <input
            type="text"
            placeholder="Search by user or action..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/3 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"
          />
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full md:w-1/4 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"
          >
            <option value="">Filter by Role</option>
            <option value="admin">Admin</option>
            <option value="doctor">Doctor</option>
            <option value="nurse">Nurse</option>
          </select>
        </div>

        {/* Logs Table */}
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full text-left text-sm text-gray-700">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{log.id}</td>
                    <td className="px-4 py-2">{log.user}</td>
                    <td className="px-4 py-2">{log.action}</td>
                    <td className="px-4 py-2">{log.timestamp}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center text-gray-500 py-4">
                    No logs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminSidebar>
  );
};

export default AdminActivityLogs;
