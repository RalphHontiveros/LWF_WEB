import React, { useEffect, useState } from "react";
import Sidebar from "../../components/PatientSidebar";
import { FaCalendarAlt } from "react-icons/fa";

const ScheduledSessions = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch("/api/upcoming-appointments");
        const data = await response.json();
        setAppointments(data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <main className={`flex-1 p-8 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-16"}`}>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Scheduled Sessions</h1>
          <div className="bg-white p-3 rounded-md shadow text-gray-600 flex items-center">
            <FaCalendarAlt className="text-blue-500 mr-2" />
            <span>{new Date().toLocaleDateString()}</span>
          </div>
        </div>

        <div className="mt-6">
          {appointments.length === 0 ? (
            <p className="text-gray-600">No upcoming sessions scheduled.</p>
          ) : (
            appointments.map((appointment) => (
              <div key={appointment.appointmentNumber} className="mt-4">
                <div className="bg-white p-4 rounded-md shadow-md">
                  <p className="text-lg font-bold">
                    {appointment.sessionTitle}
                  </p>
                  <p className="text-gray-600">Doctor: {appointment.doctorName}</p>
                  <p className="text-gray-600">Date: {new Date(appointment.scheduledDateTime).toLocaleString()}</p>
                  <p className="text-sm text-gray-500">Appointment #: {appointment.appointmentNumber}</p>
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
