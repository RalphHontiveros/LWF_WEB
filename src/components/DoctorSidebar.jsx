import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaHome, FaUserMd, FaCalendarCheck, FaBookmark, FaCog, FaUser, FaSignOutAlt } from "react-icons/fa";

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
    useEffect(() => {
      const handleResize = () => setIsMobile(window.innerWidth <= 768);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);
  
    return (
      <div>
        {isMobile ? (
          <nav className="bg-gray-800 text-white p-4 flex justify-between items-center fixed top-0 left-0 right-0 z-50 shadow-md">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 focus:outline-none">
              <FaBars className="text-xl" />
            </button>
          </nav>
        ) : (
          <div className={`h-full bg-gray-800 text-white p-4 ${isOpen ? "w-64" : "w-16"} transition-width duration-300 flex flex-col fixed top-0 left-0 bottom-0`}>
            <button onClick={() => setIsOpen(!isOpen)} className="mb-4 p-2 focus:outline-none self-start">
              <FaBars className="text-xl" />
            </button>
            <ul className="flex-1 overflow-y-auto font-semibold">
              <li className="mb-2">
                <Link to="/doctor-dashboard" className="flex items-center p-2 hover:bg-gray-700 rounded">
                  <FaHome className="text-xl" /> <span className={`${isOpen ? "ml-2 font-semibold" : "hidden"}`}>Dashboard</span>
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/doctor-appointments" className="flex items-center p-2 hover:bg-gray-700 rounded">
                  <FaUserMd className="text-xl" /> <span className={`${isOpen ? "ml-2 font-semibold" : "hidden"}`}>My Appointments</span>
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/doctor-sessions" className="flex items-center p-2 hover:bg-gray-700 rounded">
                  <FaCalendarCheck className="text-xl" /> <span className={`${isOpen ? "ml-2 font-semibold" : "hidden"}`}>My Sessions</span>
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/doctor-patients" className="flex items-center p-2 hover:bg-gray-700 rounded">
                  <FaBookmark className="text-xl" /> <span className={`${isOpen ? "ml-2 font-semibold" : "hidden"}`}>My Patients</span>
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/doctor-settings" className="flex items-center p-2 hover:bg-gray-700 rounded">
                  <FaCog className="text-xl" /> <span className={`${isOpen ? "ml-2 font-semibold" : "hidden"}`}>Settings</span>
                </Link>
              </li>
            </ul>
            <div className="border-t border-gray-600 pt-4">
              <li className="mb-2">
                <Link to="/doctor-profile" className="flex items-center p-2 hover:bg-gray-700 rounded">
                  <FaUser className="text-xl" /> <span className={`${isOpen ? "ml-2" : "hidden"}`}>Profile</span>
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/logout" className="flex items-center p-2 hover:bg-gray-700 rounded">
                  <FaSignOutAlt className="text-xl" /> <span className={`${isOpen ? "ml-2" : "hidden"}`}>Logout</span>
                </Link>
              </li>
            </div>
          </div>
        )}
        {isMobile && isOpen && (
          <div className="fixed top-16 left-0 right-0 bg-gray-800 text-white p-4 flex flex-col z-50 shadow-md font-semibold">
            <ul className="w-full">
              <li className="mb-2">
                <Link to="/doctor-dashboard" className="flex items-center p-2 hover:bg-gray-700 rounded">
                  <FaHome className="text-xl" /> <span className="ml-2 font-semibold">Dashboard</span>
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/doctor-appointments" className="flex items-center p-2 hover:bg-gray-700 rounded">
                  <FaUserMd className="text-xl" /> <span className="ml-2 font-semibold">My Appointments</span>
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/doctor-sessions" className="flex items-center p-2 hover:bg-gray-700 rounded">
                  <FaCalendarCheck className="text-xl" /> <span className="ml-2 font-semibold">My Sessions</span>
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/doctor-patients" className="flex items-center p-2 hover:bg-gray-700 rounded">
                  <FaBookmark className="text-xl" /> <span className="ml-2 font-semibold">My Patients</span>
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/doctor-settings" className="flex items-center p-2 hover:bg-gray-700 rounded">
                  <FaCog className="text-xl" /> <span className="ml-2 font-semibold">Settings</span>
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    );
  };
  
  export default Sidebar;
  
