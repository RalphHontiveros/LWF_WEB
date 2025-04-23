import React, { useState } from "react";
import Sidebar from "../../components/PatientSidebar";
import { useNavigate } from "react-router-dom";

const PatientProfile = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    birthDate: "",
    gender: "",
    address: "",
    contactNumber: "",
  });

  const [step, setStep] = useState("form"); // 'form' | 'verify' | 'done'
  const [verificationCode, setVerificationCode] = useState("");
  const [userInputCode, setUserInputCode] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const calculateAge = (dob) => {
    const birth = new Date(dob);
    const diff = Date.now() - birth.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setVerificationCode(code);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("/api/patient/create-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.fullName,
          dob: formData.birthDate,
          gender: formData.gender.toLowerCase(),
          address: formData.address,
          contact: formData.contactNumber,
          age: calculateAge(formData.birthDate),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Error submitting profile");
      }

      setMessage(`A verification code has been sent. (code: ${code})`);
      setStep("verify");
    } catch (err) {
      console.error("Error creating profile:", err);
      setMessage("Something went wrong. Please try again.");
    }
  };

  const handleVerify = () => {
    if (userInputCode === verificationCode) {
      setStep("done");
      setMessage("Profile verified successfully! 🎉");
    } else {
      setMessage("Invalid verification code. Try again.");
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100">
        <div className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-center">
            {step === "done" ? "✅ Verified" : "📝 Patient Profile Form"}
          </h2>

          {message && (
            <div className="mb-4 text-sm text-blue-600 text-center">{message}</div>
          )}

          {step === "form" && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded-lg"
                placeholder="Full Name"
                required
              />
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded-lg"
                required
              />
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded-lg"
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded-lg"
                placeholder="Address"
                required
              />
              <input
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded-lg"
                placeholder="Contact Number"
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Submit & Generate Code
              </button>
            </form>
          )}

          {step === "verify" && (
            <div className="space-y-4">
              <input
                type="text"
                value={userInputCode}
                onChange={(e) => setUserInputCode(e.target.value)}
                className="w-full border px-4 py-2 rounded-lg"
                placeholder="Enter verification code"
              />
              <button
                onClick={handleVerify}
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
              >
                Verify
              </button>
            </div>
          )}

          {step === "done" && (
            <div className="text-center text-green-600 font-semibold text-lg">
              🎉 Your profile has been successfully submitted and verified!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
