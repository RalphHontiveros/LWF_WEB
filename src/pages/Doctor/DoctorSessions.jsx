import React, { useEffect, useState } from "react";
import Sidebar from "../../components/DoctorSidebar";
import { FaStethoscope, FaClock } from "react-icons/fa";

const MySessions = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await fetch("/api/doctor-sessions");
        const data = await response.json();
        setSessions(data);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      }
    };

    fetchSessions();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <main className={`flex-1 p-8 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-16"}`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Sessions</h1>
          <div className="bg-white p-3 rounded-md shadow text-gray-600 flex items-center">
            🩺 <span className="ml-2">Date: {new Date().toLocaleDateString()}</span>
          </div>
        </div>

        {sessions.length === 0 ? (
          <p className="text-gray-600">You currently have no scheduled sessions.</p>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => (
              <div
                key={session.sessionId}
                className="bg-white p-5 rounded-md shadow-md hover:shadow-lg transition"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-bold">{session.sessionTitle}</h2>
                    <p className="text-gray-700">Location: {session.location}</p>
                    <p className="text-gray-600">Time: {session.startTime} - {session.endTime}</p>
                    <p className="text-gray-600">Date: {session.sessionDate}</p>
                  </div>
                  <div className="text-right text-blue-500">
                    <FaClock className="text-2xl mb-2" />
                    <p className="text-sm">{session.status || "Scheduled"}</p>
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

export default MySessions;
