import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminSidebar from "../../components/AdminSidebar";

const AdminActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = localStorage.getItem("token"); // adjust if you're using cookies
        const response = await axios.get("/api/logs", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLogs(response.data);
      } catch (error) {
        console.error("Failed to fetch logs", error);
      }
    };

    fetchLogs();
  }, []);

  // Filter logs
  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = selectedRole
      ? log.role.toLowerCase() === selectedRole.toLowerCase()
      : true;

    return matchesSearch && matchesRole;
  });

  return (
    <AdminSidebar>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Activity Logs</h1>

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
            <option value="patient">Patient</option>
          </select>
        </div>

        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full text-left text-sm text-gray-700">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log, index) => (
                  <tr key={log._id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{log.email}</td>
                    <td className="px-4 py-2">{log.action}</td>
                    <td className="px-4 py-2">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
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