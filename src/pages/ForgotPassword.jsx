import { useState } from "react";
import { useNavigate } from "react-router-dom";
import forgotBg from "../assets/images/bg.jpg"; // Adjust if necessary

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleResetPassword = (e) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email.");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    
    if (user && user.email === email) {
      setMessage("A password reset link has been sent to your email.");
      setError("");
      setEmail("");
      // Simulate an email send operation
      setTimeout(() => navigate("/"), 3000);
    } else {
      setError("No account found with this email.");
      setMessage("");
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Image Section (Hidden on Mobile) */}
      <div className="hidden md:flex w-1/2 h-full items-center justify-center shadow-lg">
        <img
          src={forgotBg}
          alt="Forgot Password Illustration"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Forgot Password Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-50 px-8 md:px-16 shadow-2xl border border-gray-200 h-screen">
        <div className="w-full max-w-sm">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 text-center">
            Forgot Password?
          </h2>

          <p className="text-gray-600 text-md md:text-lg mb-6 text-center">
            Enter your registered email to reset your password.
          </p>

          {message && (
            <p className="text-green-600 text-md md:text-lg bg-green-100 p-3 rounded-lg text-center shadow">
              {message}
            </p>
          )}

          {error && (
            <p className="text-red-600 text-md md:text-lg bg-red-100 p-3 rounded-lg text-center shadow">
              {error}
            </p>
          )}

          <form onSubmit={handleResetPassword} className="space-y-4">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 md:p-4 text-md md:text-lg border rounded-lg bg-white shadow-md focus:outline-none focus:ring-4 focus:ring-blue-500 transition duration-300"
              required
            />

            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-3 md:p-4 rounded-lg text-lg md:text-xl font-semibold shadow-lg hover:bg-blue-700 hover:scale-[1.03] transition duration-300"
            >
              Send Reset Link
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate("/login")}
              className="text-blue-600 font-semibold hover:underline transition duration-200 text-md md:text-lg"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
