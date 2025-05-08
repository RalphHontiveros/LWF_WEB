import React, { useState } from "react";
import LandingBg from "../assets/images/bg1.jpg";

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: "#about", label: "About Us" },
    { href: "#instruction", label: "Instructions" },
    { href: "#comments", label: "Comments" },
    { href: "#contact", label: "Contact" },
    { href: "/queue", label: "Queue Monitor" },
  ];

  return (
    <div className="font-sans">
      {/* Navbar */}
      <nav className="fixed w-full top-0 z-50 bg-transparent backdrop-blur-md shadow-md text-white px-6 py-4 flex justify-between items-center">
        <a
          href="#home"
          className="text-2xl font-bold tracking-wide hover:text-yellow-400 transition duration-300"
        >
          Hospital QueueSys
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="hover:text-yellow-400 transition duration-200 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              {label}
            </a>
          ))}
          {/* Login & Signup Buttons */}
          <a
            href="/login"
            className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition"
          >
            Login
          </a>
          <a
            href="/register"
            className="bg-yellow-400 text-white px-4 py-2 rounded-lg font-medium hover:bg-yellow-500 transition"
          >
            Signup
          </a>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white text-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
            aria-label="Toggle mobile menu"
          >
            ☰
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-blue-800/90 backdrop-blur-md text-white p-6 space-y-4 fixed w-full top-[64px] z-40">
          {navLinks.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="block text-lg hover:text-yellow-400 transition duration-200 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </a>
          ))}
          {/* Mobile Login & Signup */}
          <a
            href="/login"
            className="block bg-white text-blue-800 text-center py-2 rounded-lg font-medium hover:bg-gray-200 transition"
            onClick={() => setMenuOpen(false)}
          >
            Login
          </a>
          <a
            href="/register"
            className="block bg-yellow-400 text-white text-center py-2 rounded-lg font-medium hover:bg-yellow-500 transition"
            onClick={() => setMenuOpen(false)}
          >
            Signup
          </a>
        </div>
      )}

      {/* Hero Section */}
      <section
        id="home"
        className="relative text-white py-32 px-6 md:py-40 min-h-screen overflow-hidden"
      >
        <img
          src={LandingBg}
          alt="Hospital Appointment Background"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        <div className="absolute inset-0 bg-black/70 z-0"></div>

        <div className="relative z-10 max-w-4xl mx-auto text-center animate-fade-in">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-lg p-10">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-white drop-shadow-lg">
              Welcome to{" "}
              <span className="text-blue-400">Hospital Appointment</span> <br />
              & Queuing System
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8">
              Book your appointment and track your queue in real-time with ease.
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center max-w-lg mx-auto">
              <input
                type="text"
                placeholder="Search for a service..."
                className="w-full px-5 py-3 rounded-t-lg sm:rounded-l-lg sm:rounded-tr-none text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
              <button className="w-full sm:w-auto px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-b-lg sm:rounded-r-lg sm:rounded-bl-none hover:from-blue-700 hover:to-blue-600 transition-all duration-300 font-medium">
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* About Us */}
      <section id="about" className="py-16 px-6 bg-white">
        <h2 className="text-3xl font-semibold mb-4 text-center">About Us</h2>
        <p className="text-gray-700 text-center max-w-2xl mx-auto">
          We provide a digital solution for hospital appointments and queuing to reduce wait times and enhance patient experience.
        </p>
      </section>

      {/* Instructions */}
      <section id="instruction" className="py-16 px-6 bg-gray-100">
        <h2 className="text-3xl font-semibold mb-4 text-center">
          Appointment and Queue Instructions
        </h2>
        <ol className="list-decimal list-inside text-gray-700 space-y-2 mx-auto max-w-2xl">
          <li>Click Login or Signup to create an account.</li>
          <li>Select your service and book an appointment.</li>
          <li>Receive your queue number and monitor it live.</li>
          <li>Be present when your number is called.</li>
        </ol>
      </section>

      {/* Comments */}
      <section id="comments" className="py-16 px-6 bg-white">
        <h2 className="text-3xl font-semibold mb-4 text-center">Comments</h2>
        <div className="text-gray-700 text-center space-y-2">
          <p>"Great system, very convenient!" - Patient A</p>
          <p>"Helped me avoid long lines." - Patient B</p>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-16 px-6 bg-gray-100">
        <h2 className="text-3xl font-semibold mb-4 text-center">Contact Us</h2>
        <p className="text-gray-700 text-center">Email: support@hospitalqueuesys.com</p>
        <p className="text-gray-700 text-center">Phone: +63 912 345 6789</p>
      </section>

      {/* Footer */}
      <footer className="bg-blue-800 text-white text-center p-6">
        <p>&copy; 2025 Hospital QueueSys. All rights reserved.</p>
      </footer>
    </div>
  );
}
