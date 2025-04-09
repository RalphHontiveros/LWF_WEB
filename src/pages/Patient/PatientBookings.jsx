import React, { useEffect, useState } from "react";
import Sidebar from "../../components/PatientSidebar";
import { FaCalendarAlt, FaClock, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const MyBookings = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch("/api/my-bookings");
        const data = await response.json();
        setBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <main className={`flex-1 p-8 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-16"}`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Bookings</h1>
          <div className="bg-white p-3 rounded-md shadow text-gray-600 flex items-center">
            📅 <span className="ml-2">Today's Date: {new Date().toLocaleDateString()}</span>
          </div>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center text-gray-500 mt-20">No bookings yet.</div>
        ) : (
          <div className="grid gap-4">
            {bookings.map((booking) => (
              <div key={booking.appointmentNumber} className="bg-white p-5 rounded-md shadow-md flex justify-between items-center">
                <div>
                  <p className="text-lg font-bold">Appointment #{booking.appointmentNumber}</p>
                  <p className="text-gray-600">Doctor: {booking.doctorName}</p>
                  <p className="text-gray-600">Session: {booking.sessionTitle}</p>
                  <p className="text-gray-600 flex items-center gap-2">
                    <FaClock /> {new Date(booking.scheduledDateTime).toLocaleString()}
                  </p>
                </div>
                <div>
                  {booking.status === "Completed" ? (
                    <span className="text-green-600 flex items-center gap-2">
                      <FaCheckCircle /> Completed
                    </span>
                  ) : booking.status === "Cancelled" ? (
                    <span className="text-red-600 flex items-center gap-2">
                      <FaTimesCircle /> Cancelled
                    </span>
                  ) : (
                    <span className="text-yellow-600 flex items-center gap-2">
                      <FaClock /> Upcoming
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyBookings;
