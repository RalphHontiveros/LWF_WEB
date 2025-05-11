import React, { useState } from "react";
import LandingBg from "../assets/images/bg1.jpg";

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: "#about", label: "About Us" },
    { href: "#instructions", label: "Instructions" },
    { href: "#services", label: "Service" },
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
      <section id="about" className="py-24 px-6 bg-gradient-to-b from-gray-800 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-5xl font-extrabold text-white mb-6">
            About Hospital QueueSys
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-16">
            Hospital QueueSys is an innovative queuing management platform tailored for healthcare institutions. 
            We streamline the patient journey from check-in to consultation with modern tools that improve efficiency and user experience.
          </p>

          <div className="grid gap-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-md p-8 hover:shadow-xl transition-transform transform hover:-translate-y-1">
              <div className="text-blue-400 text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-white mb-3">Our Mission</h3>
              <p className="text-gray-400">
                To simplify hospital visits by optimizing queues and reducing patient wait times through smart digital tools.
              </p>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-md p-8 hover:shadow-xl transition-transform transform hover:-translate-y-1">
              <div className="text-blue-400 text-4xl mb-4">🛠️</div>
              <h3 className="text-xl font-semibold text-white mb-3">What We Offer</h3>
              <p className="text-gray-400">
                Customizable modules for kiosks, queue monitors, service counters, and transaction management with real-time updates.
              </p>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-md p-8 hover:shadow-xl transition-transform transform hover:-translate-y-1">
              <div className="text-blue-400 text-4xl mb-4">🌍</div>
              <h3 className="text-xl font-semibold text-white mb-3">Global Impact</h3>
              <p className="text-gray-400">
                We aim to expand globally by adapting our platform to various healthcare institutions and hospitals worldwide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Instructions Section */}
      <section id="instructions" class="py-24 px-6 bg-gray-800 text-white">
        <div class="max-w-7xl mx-auto text-center">
          <h2 class="text-4xl font-extrabold mb-6 text-yellow-400">How It Works</h2>
          <p class="text-lg text-gray-400 mb-16 max-w-3xl mx-auto">
            Our easy-to-use system helps streamline the hospital visit process, making it simple to book an appointment and get checked in.
          </p>

          <div class="grid gap-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            <div class="bg-gray-700 border border-gray-600 rounded-xl p-8 transform transition duration-500 hover:scale-105 hover:bg-gray-600">
              <h3 class="text-xl font-semibold text-white mb-4">Step 1: Create an Account</h3>
              <p class="text-gray-400">
                Create an account. If you already have one, proceed to login and access your dashboard.
              </p>
            </div>

            <div class="bg-gray-700 border border-gray-600 rounded-xl p-8 transform transition duration-500 hover:scale-105 hover:bg-gray-600">
              <h3 class="text-xl font-semibold text-white mb-4">Step 2: Verify Your Account</h3>
              <p class="text-gray-400">
                Verify your account by checking the email linked to your patient profile.
              </p>
            </div>

            <div class="bg-gray-700 border border-gray-600 rounded-xl p-8 transform transition duration-500 hover:scale-105 hover:bg-gray-600">
              <h3 class="text-xl font-semibold text-white mb-4">Step 3: Book an Appointment</h3>
              <p class="text-gray-400">
                Once verified, go to the homepage and book your appointment.
              </p>
            </div>

            <div class="bg-gray-700 border border-gray-600 rounded-xl p-8 transform transition duration-500 hover:scale-105 hover:bg-gray-600">
              <h3 class="text-xl font-semibold text-white mb-4">Step 4: Choose Doctor and Schedule</h3>
              <p class="text-gray-400">
                Select your doctor and specialization, then pick a suitable schedule.
              </p>
            </div>

            <div class="bg-gray-700 border border-gray-600 rounded-xl p-8 transform transition duration-500 hover:scale-105 hover:bg-gray-600">
              <h3 class="text-xl font-semibold text-white mb-4">Step 5: Await Doctor Approval</h3>
              <p class="text-gray-400">
                After booking, your appointment will be under "Schedule Session." Wait for the doctor to approve based on availability.
              </p>
            </div>

            <div class="bg-gray-700 border border-gray-600 rounded-xl p-8 transform transition duration-500 hover:scale-105 hover:bg-gray-600">
              <h3 class="text-xl font-semibold text-white mb-4">Step 6: Appointment Confirmation</h3>
              <p class="text-gray-400">
                Once approved, you can proceed with your appointment as scheduled.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* Services Section */}
      <section id="services" className="py-24 px-6 bg-gradient-to-b from-gray-900 to-gray-700 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold mb-6">Our Services</h2>
          <p className="text-lg text-gray-400 mb-16">
            We offer a variety of services to ensure that your visit to the hospital is as seamless and efficient as possible. From quick consultations to essential medical tests, we are here to provide comprehensive healthcare.
          </p>

          <div className="grid gap-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            
            <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-8 transform transition duration-300 hover:scale-105 hover:shadow-xl">
              <h3 className="text-xl font-semibold text-white mb-4">OPD Services</h3>
              <p className="text-gray-400 mb-6">
                Our Outpatient Department (OPD) provides a range of medical consultations and treatments. With quick and efficient queuing systems, we aim to reduce your wait time and ensure that you receive the care you need without unnecessary delays.
              </p>
              <p className="text-gray-500">
                Whether it’s a routine check-up or specialized consultation, our doctors are here to provide the highest quality of care.
              </p>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-8 transform transition duration-300 hover:scale-105 hover:shadow-xl">
              <h3 className="text-xl font-semibold text-white mb-4">Pharmacy</h3>
              <p className="text-gray-400 mb-6">
                Our pharmacy service ensures that you can quickly pick up your prescribed medications. With a streamlined process, our pharmacy counters are equipped to handle your needs with ease, and we offer notifications to keep you updated on your prescriptions.
              </p>
              <p className="text-gray-500">
                Whether it's refilling a prescription or obtaining new medications, our pharmacy team is dedicated to providing accurate and timely service.
              </p>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-8 transform transition duration-300 hover:scale-105 hover:shadow-xl">
              <h3 className="text-xl font-semibold text-white mb-4">X-Ray Services</h3>
              <p className="text-gray-400 mb-6">
                Our advanced X-ray services help in diagnosing various conditions with precise imaging. We provide quick turnaround times to ensure that your results are available promptly, aiding in swift decision-making for your treatment.
              </p>
              <p className="text-gray-500">
                From routine scans to more specialized imaging, our team works diligently to ensure your X-ray process is as efficient and comfortable as possible.
              </p>
            </div>
            
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-6 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-extrabold text-yellow-400 mb-6">Contact Us</h2>
        <p className="text-lg text-gray-400 mb-16 max-w-3xl mx-auto">
          Have questions? Feel free to reach out to us. We are here to help you!
        </p>

        <div className="max-w-2xl mx-auto bg-gray-800 p-8 rounded-lg shadow-xl hover:shadow-2xl transition duration-300">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-white mb-4">Contact Information</h3>
            <p className="text-lg text-gray-400 mb-4">You can reach us at:</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="flex items-center space-x-3 hover:text-yellow-400 transition duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.745a9.002 9.002 0 10-12.856 0m4.308-2.524a5.5 5.5 0 11-6.416-6.416m9.804 3.053a9.003 9.003 0 01-4.696-4.72" />
                </svg>
                <p className="text-lg text-gray-300">contact@hospital.com</p>
              </div>
              <div className="flex items-center space-x-3 hover:text-yellow-400 transition duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8a5 5 0 015-5h8a5 5 0 015 5v8a5 5 0 01-5 5H8a5 5 0 01-5-5V8z" />
                </svg>
                <p className="text-lg text-gray-300">(123) 456-7890</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-gray-400">We look forward to hearing from you!</p>
          </div>
        </div>
      </div>
    </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-10">
        <div className="max-w-7xl mx-auto text-center">
          <p>&copy; 2025 Hospital QueueSys. All rights reserved.</p>
          <div className="mt-4">
            <a
              href="https://www.facebook.com"
              className="text-blue-400 hover:text-blue-600 transition duration-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              Facebook
            </a>
            <span className="mx-4">|</span>
            <a
              href="https://www.twitter.com"
              className="text-blue-400 hover:text-blue-600 transition duration-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              Twitter
            </a>
            <span className="mx-4">|</span>
            <a
              href="https://www.instagram.com"
              className="text-blue-400 hover:text-blue-600 transition duration-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
