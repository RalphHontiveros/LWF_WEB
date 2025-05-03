import axios from "axios";

const API = axios.create({
  baseURL: "https://appointment-lwf-queue.onrender.com/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🛠️ Error Handling Helper
const handleError = (error, defaultMessage) => {
  console.error("API Error:", error.response || error);

  if (
    error.response?.status === 401 &&
    error.response.data?.message.includes("Unauthorized")
  ) {
    console.warn("Auth issue detected. Redirecting to login...");
    window.location.href = "/login"; // Redirecting to login if unauthorized
  }

  return error.response?.data || { success: false, message: defaultMessage };
};

// 🟢 Signup API
export const signup = async ({ email, password, confirmPassword }) => {
  try {
    const response = await API.post("/auth/signup", {
      email,
      password,
      confirmPassword,
    });
    return response.data;
  } catch (error) {
    return handleError(error, "Signup failed. Please check your details.");
  }
};

// Helper function to get cookies by name
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
};

export const createQueue = async (queueData) => {
  try {
      const response = await API.post("/queue/create", queueData, {
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getCookie("access_token")}`,
          },
      });
      return response;
  } catch (error) {
      console.error("Error creating queue:", error);
      throw error;
  }
}

export const cancelQueueEntry = async () => {
  try {
    const response = await API.post("/queue/cancel", {}, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("access_token")}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Error canceling queue entry:", error);
    throw error;
  }
}

export const completeQueueEntry = async () => {
  try {
    const response = await API.post("/queue/complete", {}, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("access_token")}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Error completing queue entry:", error);
    throw error;
  }
}

export const nextQueueEntry = async () => {
  try {
    const response = await API.get("/queue/next", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("access_token")}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Error fetching next queue entry:", error);
    throw error;
  }
}

export const resetQueue = async () => {
  try {
    const response = await API.post("/queue/reset", {}, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("access_token")}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Error resetting queue:", error);
    throw error;
  }
}

export const getCurrentQueueEntry = async () => {
  try {
    const response = await API.get("/queue/current", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("access_token")}`,
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export const getQueues = async () => {
  try {
    const response = await API.get("/queue", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("access_token")}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Error fetching queues:", error);
    throw error;
  }
}

// 🟢 Login API
export const signin = async ({ email, password }) => {
  try {
    const response = await API.post("/auth/signin", {
      email,
      password,
    }, {
      withCredentials: true,
    });

    const { role } = response.data;

    if (role) {
      localStorage.setItem("userRole", role);
    }

    return response.data;
  } catch (error) {
    return handleError(error, "Signin failed. Please check your credentials.");
  }
};

// 🟢 Fetch User Profile (Including Google OAuth Users)
export const getUserProfile = async () => {
  try {
    const response = await API.get("/users/profile");
    return response.data;
  } catch (error) {
    return handleError(error, "Profile fetch failed. Please try again.");
  }
};

// 🟢 Google OAuth: Fetch Authenticated User
export const getGoogleUser = async () => {
  try {
    const response = await API.get("/auth/google/success");
    return response.data;
  } catch (error) {
    return handleError(error, "Google login failed.");
  }
};

// 🔴 Logout API
export const signout = async () => {
  try {
    const response = await axios.post("/api/auth/signout", null, { withCredentials: true }); // Ensure cookies are sent with the request
    if (response.status === 200) {
      localStorage.removeItem("authToken"); // Optional: clear localStorage
      localStorage.removeItem("userRole"); // Optional: clear role
    }
    return response.data; // Return the response (e.g., success message)
  } catch (error) {
    console.error("Logout failed", error);
    throw error; // Throw error to handle it in the component
  }
};

// 🟢 Forgot Password: Request Verification Code
export const requestForgotPassword = async (email) => {
  try {
    const response = await API.patch("/auth/send-forgot-password-code", { email });
    return response.data;
  } catch (error) {
    return handleError(error, "Failed to send verification code.");
  }
};

// 🟢 Forgot Password: Verify Code & Reset Password
export const verifyForgotPassword = async (email, providedCode, newPassword) => {
  try {
    const response = await API.patch("/auth/verify-forgot-password-code", {
      email,
      providedCode,
      newPassword,
    });
    return response.data;
  } catch (error) {
    return handleError(error, "Failed to reset password. Please try again.");
  }
};

// 🟢 Test Backend Connection
// export const testConnection = async () => {
//   try {
//     const response = await API.get("/test");
//     console.log("✅ Backend is connected:", response.data);
//   } catch (error) {
//     console.error("❌ Cannot connect to backend:", error);
//   }
// };

export default API;