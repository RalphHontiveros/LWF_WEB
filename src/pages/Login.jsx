import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useState, useEffect } from "react";
import axios from "axios";
import loginBg from "../assets/images/bg.jpg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for remembered user credentials in localStorage
    const remembered = localStorage.getItem("rememberedUser");
    if (remembered) {
      const { email, password } = JSON.parse(remembered);
      setEmail(email);
      setPassword(password);
      setRemember(true);
    }

    // Check for any query parameters (e.g., role)
    const urlParams = new URLSearchParams(window.location.search);
    const role = urlParams.get("role");

    if (role) {
      localStorage.setItem("auth", "true");
      localStorage.setItem("userRole", role);
      navigate(role === "admin" ? "/admin-dashboard" :
               role === "doctor" ? "/doctor-dashboard" :
               "/patient-dashboard");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/auth/signin",
        { email, password, rememberMe: remember },
        { withCredentials: true }
      );

      if (response.data.success) {
        const { role } = response.data;

        // Save role to localStorage
        localStorage.setItem("auth", "true");
        localStorage.setItem("userRole", role);

        // Navigate based on user role
        if (role) {
          if (role === "admin") {
            navigate("/admin-dashboard");
          } else if (role === "doctor") {
            navigate("/doctor-dashboard");
          } else if (role === "patient") {
            navigate("/patient-dashboard");
          } else {
            setError("Invalid role received.");
          }
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.open("http://localhost:8000/auth/google", "_self");
  };

  return (
    <div className="flex h-screen">
      {/* Left Image */}
      <div className="hidden md:flex w-1/2 h-full items-center justify-center shadow-lg">
        <img src={loginBg} alt="Login Illustration" className="w-full h-full object-cover" />
      </div>

      {/* Right Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-50 px-8 md:px-16 shadow-2xl border border-gray-200 h-screen">
        <div className="w-full max-w-sm">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 md:mb-8 text-gray-900 text-center md:text-left">
            SIGN IN
          </h2>

          {error && (
            <p className="text-red-600 text-md w-full text-center bg-red-100 p-3 rounded-lg">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-lg bg-white shadow-md focus:outline-none focus:ring-4 focus:ring-blue-500"
              required
            />
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border rounded-lg bg-white shadow-md focus:ring-4 focus:ring-blue-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600"
              >
                {showPassword ? <AiOutlineEye size={22} /> : <AiOutlineEyeInvisible size={22} />}
              </button>
            </div>

            <div className="flex items-center justify-between text-gray-700">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={() => setRemember(!remember)}
                  className="mr-2 accent-blue-600"
                />
                Remember me
              </label>
              <button
                type="button"
                className="text-blue-600 hover:underline"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold shadow-lg hover:bg-blue-700 transition"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="flex items-center my-6 w-full">
            <div className="w-full border-t shadow-md"></div>
            <span className="px-3 text-gray-500">OR</span>
            <div className="w-full border-t shadow-md"></div>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center border p-3 rounded-lg bg-white font-semibold shadow-lg hover:bg-gray-100 transition"
          >
            <FcGoogle className="mr-3 text-2xl" /> Continue with Google
          </button>

          <p className="text-gray-700 mt-6 text-center">
            Don't have an account?{" "}
            <button onClick={() => navigate("/register")} className="text-blue-600 font-semibold hover:underline">
              Register
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
