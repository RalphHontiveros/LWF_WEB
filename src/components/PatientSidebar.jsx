import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaBars, FaHome, FaUserMd, FaCalendarCheck,
  FaBookmark, FaCog, FaUser, FaSignOutAlt, FaWpforms
} from "react-icons/fa";
import { signout } from "../api";

const Sidebar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSignout = async () => {
    try {
      await signout();
      navigate("/login");
    } catch (error) {
      console.error("Signout failed", error);
    }
  };

  const navItems = [
    { to: "/patient-dashboard", icon: <FaHome />, label: "Home" },
    // { to: "/patient-doctors", icon: <FaUserMd />, label: "All Doctors" },
    { to: "/patient-scheduled", icon: <FaCalendarCheck />, label: "Scheduled Sessions" },
    // { to: "/patient-bookings", icon: <FaBookmark />, label: "My Bookings" },
    { to: "/patient-settings", icon: <FaCog />, label: "Settings" },
    { to: "/patient-profile", icon: <FaWpforms />, label: "Patient Profile" },
    { to: "/patient-emr", icon: <FaUser />, label: "EMR" },
  ];

  const linkClasses = (path) =>
    `flex items-center p-2 rounded transition-all duration-300 ${
      location.pathname === path ? "bg-blue-600" : "hover:bg-gray-700"
    }`;

  const renderNavLinks = () => (
    <>
      {navItems.map((item) => (
        <Link key={item.to} to={item.to} className={linkClasses(item.to)} onClick={() => isMobile && setIsOpen(false)}>
          <span className="text-xl">{item.icon}</span>
          <span
            className={`ml-3 whitespace-nowrap overflow-hidden transition-all duration-300 ${
              isOpen ? "opacity-100" : isMobile ? "opacity-100" : "opacity-0 w-0"
            }`}
          >
            {item.label}
          </span>
        </Link>
      ))}
      <button
        onClick={handleSignout}
        className="flex items-center p-2 hover:bg-red-600 rounded transition-all duration-300 w-full"
      >
        <FaSignOutAlt className="text-xl" />
        <span
          className={`ml-3 whitespace-nowrap overflow-hidden transition-all duration-300 ${
            isOpen ? "opacity-100" : isMobile ? "opacity-100" : "opacity-0 w-0"
          }`}
        >
          Logout
        </span>
      </button>
    </>
  );

  return (
    <div className="flex">
      {/* Top Navbar for Mobile */}
      {isMobile && (
        <nav className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-4 flex justify-between items-center fixed top-0 left-0 right-0 z-50 shadow-md">
          <button onClick={() => setIsOpen(!isOpen)} className="p-2 focus:outline-none">
            <FaBars className="text-2xl" />
          </button>
        </nav>
      )}

      {/* Sidebar */}
      {!isMobile && (
        <div
          className={`h-screen bg-gradient-to-b from-gray-800 to-gray-900 text-white p-4
            flex flex-col fixed top-0 left-0 shadow-lg transition-all duration-300 z-40
            ${isOpen ? "w-64" : "w-20"}`}
        >
          <button onClick={() => setIsOpen(!isOpen)} className="mb-6 p-2 focus:outline-none">
            <FaBars className="text-2xl" />
          </button>
          <div className="flex-1 flex flex-col gap-2 overflow-y-auto">
            {renderNavLinks()}
          </div>
        </div>
      )}

      {/* Sidebar Overlay for Mobile */}
      {isMobile && isOpen && (
        <div className="fixed top-16 left-0 right-0 bg-gradient-to-b from-gray-800 to-gray-900 text-white p-4 flex flex-col gap-2 z-50 shadow-md">
          {renderNavLinks()}
        </div>
      )}

      {/* Main Content */}
      <div
        className={`flex-1 pt-0 transition-all duration-300 ${
          isMobile ? "mt-16" : isOpen ? "ml-64" : "ml-20"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default Sidebar;
