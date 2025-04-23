// imports stay the same
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  FaBars, FaHome, FaUserMd, FaCalendarCheck, 
  FaBookmark, FaCog, FaUser, FaSignOutAlt, FaWpforms 
} from "react-icons/fa";
import { signout } from "../api";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();

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
          <ul className="flex-1 overflow-y-auto">
            <li className="mb-2">
              <Link to="/patient-dashboard" className="flex items-center p-2 hover:bg-gray-700 rounded">
                <FaHome className="text-xl" /> <span className={`${isOpen ? "ml-2" : "hidden"}`}>Home</span>
              </Link>
            </li>
            <li className="mb-2">
              <Link to="/patient-doctors" className="flex items-center p-2 hover:bg-gray-700 rounded">
                <FaUserMd className="text-xl" /> <span className={`${isOpen ? "ml-2" : "hidden"}`}>All Doctors</span>
              </Link>
            </li>
            <li className="mb-2">
              <Link to="/patient-scheduled" className="flex items-center p-2 hover:bg-gray-700 rounded">
                <FaCalendarCheck className="text-xl" /> <span className={`${isOpen ? "ml-2" : "hidden"}`}>Scheduled Sessions</span>
              </Link>
            </li>
            <li className="mb-2">
              <Link to="/patient-bookings" className="flex items-center p-2 hover:bg-gray-700 rounded">
                <FaBookmark className="text-xl" /> <span className={`${isOpen ? "ml-2" : "hidden"}`}>My Bookings</span>
              </Link>
            </li>
            <li className="mb-2">
              <Link to="/patient-settings" className="flex items-center p-2 hover:bg-gray-700 rounded">
                <FaCog className="text-xl" /> <span className={`${isOpen ? "ml-2" : "hidden"}`}>Settings</span>
              </Link>
            </li>
            <li className="mb-2">
              <Link to="/patient-profile" className="flex items-center p-2 hover:bg-gray-700 rounded">
                <FaUser className="text-xl" /> <span className={`${isOpen ? "ml-2" : "hidden"}`}>Profile</span>
              </Link>
            </li>
            <li className="mb-2">
              <button onClick={handleSignout} className="flex items-center p-2 hover:bg-gray-700 rounded">
                <FaSignOutAlt className="text-xl" /> <span className={`${isOpen ? "ml-2" : "hidden"}`}>Logout</span>
              </button>
            </li>
          </div>
        </div>
      )}

      {/* Mobile view when sidebar is open */}
      {isMobile && isOpen && (
        <div className="fixed top-16 left-0 right-0 bg-gray-800 text-white p-4 flex flex-col z-50 shadow-md">
          <ul className="w-full">
            <li className="mb-2">
              <Link to="/patient-dashboard" className="flex items-center p-2 hover:bg-gray-700 rounded">
                <FaHome className="text-xl" /> <span className="ml-2">Home</span>
              </Link>
            </li>
            {/* Other links */}
            <li className="mb-2">
              <button onClick={handleSignout} className="flex items-center p-2 hover:bg-gray-700 rounded">
                <FaSignOutAlt className="text-xl" /> <span className="ml-2">Logout</span>
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Sidebar;