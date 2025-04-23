import React, { useState, useEffect } from "react";
import Sidebar from "../../components/PatientSidebar";
import { useNavigate } from "react-router-dom";

const PatientProfile = () => {
  // Initialize state with stored values from localStorage or defaults
  const storedFormData = JSON.parse(localStorage.getItem("formData")) || {
    fullName: "",
    birthDate: "",
    gender: "",
    address: "",
    contactNumber: "",
  };
  const storedVerificationStatus = JSON.parse(localStorage.getItem("isVerified")) || false;

  const [formData, setFormData] = useState(storedFormData);
  const [step, setStep] = useState(storedVerificationStatus ? "done" : "form");
  const [submittedData, setSubmittedData] = useState(storedFormData);
  const [isVerified, setIsVerified] = useState(storedVerificationStatus);
  const [verificationCode, setVerificationCode] = useState("");
  const [userInputCode, setUserInputCode] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    // Whenever formData or verification status changes, save them to localStorage
    localStorage.setItem("formData", JSON.stringify(formData));
    localStorage.setItem("isVerified", JSON.stringify(isVerified));
  }, [formData, isVerified]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Skip verification if already verified
    if (isVerified) {
      setSubmittedData(formData); // If already verified, just save the data and skip verification
      setStep("done");
      setMessage("Profile updated successfully!");
      return;
    }

    // Simulate generating a verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setVerificationCode(code);

    // Store the form data in the submittedData state
    setSubmittedData(formData);

    // Simulate sending the form data to the backend (you can replace this with an API call)
    setMessage(`A verification code has been sent. (code: ${code})`);
    setStep("verify");
  };

  // Handle verification of the code
  const handleVerify = () => {
    if (userInputCode === verificationCode) {
      setIsVerified(true); // Mark profile as verified
      setStep("done");
      setMessage("Profile verified successfully!");
    } else {
      setMessage("Invalid verification code. Try again.");
    }
  };

  // Handle edit button click (go back to form step)
  const handleEdit = () => {
    if (isVerified) {
      setFormData(submittedData); // Populate form with previously submitted data
      setStep("form");
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

          {/* Show submitted data and allow editing if verified */}
          {submittedData && step !== "form" && (
            <div>
              <h3>Submitted Profile</h3>
              <p><strong>Full Name:</strong> {submittedData.fullName}</p>
              <p><strong>Birth Date:</strong> {submittedData.birthDate}</p>
              <p><strong>Gender:</strong> {submittedData.gender}</p>
              <p><strong>Address:</strong> {submittedData.address}</p>
              <p><strong>Contact Number:</strong> {submittedData.contactNumber}</p>
              <button
                onClick={handleEdit}
                className={`w-full py-2 rounded-lg hover:bg-yellow-700 transition ${isVerified ? "bg-yellow-600 text-white" : "bg-gray-400 text-gray-700 cursor-not-allowed"}`}
                disabled={!isVerified} // Disable the button if not verified
              >
                Edit Profile
              </button>
            </div>
          )}

          {/* Patient form submission step */}
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
                {isVerified ? "Update Profile" : "Submit & Generate Code"}
              </button>
            </form>
          )}

          {/* Verification step */}
          {step === "verify" && !isVerified && (
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

          {/* Completion message */}
          {step === "done" && isVerified && (
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
