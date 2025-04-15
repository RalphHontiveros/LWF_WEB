import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"; // Import icons
import { signup } from "../api";
import registerBg from "../assets/images/bg.jpg"; // Adjust path if needed

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await signup({ email, password, confirmPassword });
      if (response.success) {
        setMessage("Registration successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setError(response.message || "Registration failed.");
      }
    } catch (error) {
      setError("Signup failed. Please try again.");
    }
  };

  const handleGoogleSignup = () => {
    console.log("Google signup clicked");
  };

  return (
    <div className="flex h-screen">
      {/* Image Section */}
      <div className="hidden md:flex w-1/2 h-full items-center justify-center shadow-lg">
        <img src={registerBg} alt="Register Illustration" className="w-full h-full object-cover" />
      </div>

      {/* Registration Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-50 px-8 md:px-16 shadow-2xl border border-gray-200 h-screen">
        <div className="w-full max-w-sm">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 md:mb-8 text-gray-900 text-center md:text-left">
            SIGN UP
          </h2>

          {message && (
            <p className="text-green-600 bg-green-100 p-3 md:p-4 rounded-lg shadow text-center">
              {message}
            </p>
          )}
          {error && (
            <p className="text-red-600 bg-red-100 p-3 md:p-4 rounded-lg shadow text-center">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-lg bg-white shadow-md focus:ring-4 focus:ring-blue-500 transition duration-300"
              required
            />

            {/* Password Field with Toggle */}
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border rounded-lg bg-white shadow-md focus:ring-4 focus:ring-blue-500 transition duration-300"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-900"
              >
                {showPassword ? <AiOutlineEye size={22} /> : <AiOutlineEyeInvisible size={22} />}
              </button>
            </div>

            {/* Confirm Password Field with Toggle */}
            <div className="relative w-full">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 border rounded-lg bg-white shadow-md focus:ring-4 focus:ring-blue-500 transition duration-300"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-900"
              >
                {showConfirmPassword ? <AiOutlineEye size={22} /> : <AiOutlineEyeInvisible size={22} />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-3 rounded-lg text-lg font-semibold shadow-lg hover:bg-blue-700 hover:scale-105 transition duration-300"
            >
              Register
            </button>
          </form>

          <p className="text-gray-700 text-md mt-6 text-center">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-blue-600 font-semibold hover:underline transition duration-200"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;