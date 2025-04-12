import React, { useEffect, useState } from "react";
import Sidebar from "../../components/DoctorSidebar";
import { FaCalendarCheck, FaUserInjured } from "react-icons/fa";

const MyAppointments = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch("/api/doctor-appointments");
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Appointments</h1>
          <div className="bg-white p-3 rounded-md shadow text-gray-600 flex items-center">
            📅 <span className="ml-2">Date: {new Date().toLocaleDateString()}</span>
          </div>
        </div>

        {appointments.length === 0 ? (
          <p className="text-gray-600">You currently have no appointments.</p>
        ) : (
          <div className="space-y-4">
            {appointments.map((appt) => (
              <div
                key={appt.appointmentNumber}
                className="bg-white p-5 rounded-md shadow-md hover:shadow-lg transition"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-bold">
                      Appointment #{appt.appointmentNumber}
                    </h2>
                    <p className="text-gray-700">Patient: {appt.patientName}</p>
                    <p className="text-gray-600">Session: {appt.sessionTitle}</p>
                    <p className="text-gray-600">
                      Scheduled Time: {appt.scheduledDateTime}
                    </p>
                  </div>
                  <div className="text-right text-green-500">
                    <FaCalendarCheck className="text-2xl mb-2" />
                    <p className="text-sm">Upcoming</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyAppointments;
