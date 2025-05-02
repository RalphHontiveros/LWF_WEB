import React, { useEffect, useState } from "react";
import Sidebar from "../../components/PatientSidebar";
import { FaCalendarAlt } from "react-icons/fa";
import axios from "axios";

const ScheduledSessions = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(
          "/api/patient/my-appointments/status",
          {
            withCredentials: true, // Enables sending cookies (e.g., JWT)
          }
        );

        setAppointments(response.data.appointments || []);
      } catch (error) {
        console.error("Error fetching appointments:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);
  console.log(appointments);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <main className="flex-1 p-4 sm:p-6 md:p-8 transition-all duration-300">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <h1 className="text-2xl font-bold">Scheduled Sessions</h1>
          <div className="bg-white p-3 rounded-md shadow text-gray-600 flex items-center mt-4 sm:mt-0">
            <FaCalendarAlt className="text-blue-500 mr-2" />
            <span>{new Date().toLocaleDateString()}</span>
          </div>
        </div>

        <div className="mt-6">
          {loading ? (
            <p className="text-gray-600">Loading...</p>
          ) : appointments.length === 0 ? (
            <p className="text-gray-600">No upcoming sessions scheduled.</p>
          ) : (
            appointments.map((appointment) => (
              <div
                key={appointment._id}
                className="mt-4 sm:mt-6 flex flex-col sm:flex-row sm:justify-between"
              >
                <div className="bg-white p-4 rounded-md shadow-md w-full sm:w-2/3 lg:w-1/2">
                <p className="text-lg font-bold">Doctor: {appointment.doctorName || "Unknown"}</p>
                  <p className="text-gray-600">Reason: {appointment.reason}</p>
                  <p className="text-gray-600">
                    Date: {new Date(appointment.scheduledDateTime).toLocaleDateString()}
                    <p className="text-gray-600"> Time: {appointment.timeSlot}</p>
                  </p>
                  <p className="text-sm text-gray-500"> Status: {appointment.status || "Pending" }
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default ScheduledSessions;
