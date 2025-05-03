import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import axios from "axios";
import forgotBg from "../assets/images/bg.jpg"; // Adjust path if needed

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSendCode = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await axios.patch("/api/auth/send-forgot-password-code", { email });

      if (response.data.success) {
        setCodeSent(true);
        setMessage("Verification code sent to your email.");
      } else {
        setError(response.data.message || "Failed to send reset code.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await axios.patch("/api/auth/verify-forgot-password-code", {
        email,
        providedCode: verificationCode,
        newPassword,
      });

      if (response.data.success) {
        setMessage("Password reset successfully! Redirecting to login...");
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setError(response.data.message || "Reset failed.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Image */}
      <div className="hidden md:flex w-1/2 h-full items-center justify-center shadow-lg">
        <img
          src={forgotBg}
          alt="Forgot Password Illustration"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-50 px-8 md:px-16 shadow-2xl border border-gray-200 h-screen">
        <div className="w-full max-w-sm">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 text-center">
            {codeSent ? "Reset Your Password" : "Forgot Password?"}
          </h2>

          <p className="text-gray-600 text-md md:text-lg mb-6 text-center">
            {codeSent
              ? "Enter the code sent to your email and your new password."
              : "Enter your registered email to receive a verification code."}
          </p>

          {message && (
            <p className="text-green-600 text-md bg-green-100 p-3 rounded-lg text-center shadow mb-4">
              {message}
            </p>
          )}

          {error && (
            <p className="text-red-600 text-md bg-red-100 p-3 rounded-lg text-center shadow mb-4">
              {error}
            </p>
          )}

          {!codeSent ? (
            <form onSubmit={handleSendCode} className="space-y-4">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border rounded-lg bg-white shadow-md focus:ring-4 focus:ring-blue-500"
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold shadow-lg hover:bg-blue-700 transition"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Reset Code"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <input
                type="text"
                placeholder="Enter verification code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="w-full p-3 border rounded-lg bg-white shadow-md focus:ring-4 focus:ring-blue-500"
                required
              />
              <div className="relative">
  <input
    type={showPassword ? "text" : "password"}
    placeholder="Enter new password"
    value={newPassword}
    onChange={(e) => setNewPassword(e.target.value)}
    className="w-full p-3 border rounded-lg bg-white shadow-md focus:ring-4 focus:ring-blue-500 pr-12"
    required
  />
  <button
    type="button"
    onClick={() => setShowPassword((prev) => !prev)}
    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600"
    tabIndex={-1}
  >
    {showPassword ? <AiOutlineEye size={22} /> : <AiOutlineEyeInvisible size={22} />}
  </button>
</div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold shadow-lg hover:bg-blue-700 transition"
                disabled={loading}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate("/login")}
              className="text-blue-600 font-semibold hover:underline text-md"
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
