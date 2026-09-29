import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import {
  FaEnvelope,
  FaLock,
  FaCheck,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

import API_BASE_URL from "../Services/api";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();

  // =========================
  // STATE
  // =========================

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // HANDLE INPUT
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  // =========================
  // LOGIN
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // =========================
    // VALIDATION
    // =========================

    if (!formData.email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!formData.password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // =========================
      // CLEAR OLD USER DATA
      // =========================

      localStorage.removeItem("userId");
      localStorage.removeItem("userName");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("role");
      localStorage.removeItem("token");

      // =========================
      // LOGIN API
      // =========================

      const response = await axios.post(
        `${API_BASE_URL}/Auth/login`,
        {
          email: formData.email.trim(),
          password: formData.password,
        }
      );

      console.log("Login Response:", response.data);

      // =========================
      // GET RESPONSE DATA
      // =========================

      const token = response.data?.token;
      const role = response.data?.role;

      // IMPORTANT:
      // AuthController returns user inside response.data.user

      const userId = response.data?.user?.id;
      const userName = response.data?.user?.name;
      const userEmail = response.data?.user?.email;

      // =========================
      // CHECK TOKEN
      // =========================

      if (!token) {
        setError("Login failed. Token was not received.");
        return;
      }

      // =========================
      // CHECK USER ID
      // =========================

      if (!userId) {
        console.error(
          "User ID not received from backend:",
          response.data
        );

        setError("Login failed. User ID was not received.");
        return;
      }

      // =========================
      // DEBUG
      // =========================

      console.log("Logged User ID:", userId);
      console.log("Logged User Name:", userName);
      console.log("Logged User Email:", userEmail);
      console.log("Logged User Role:", role);

      // =========================
      // SAVE LOGIN DATA
      // =========================

      localStorage.setItem("token", token);

      localStorage.setItem(
        "userId",
        String(userId)
      );

      localStorage.setItem(
        "userName",
        userName || ""
      );

      localStorage.setItem(
        "userEmail",
        userEmail || ""
      );

      // =========================
      // NORMALIZE ROLE
      // =========================

      const userRole = String(role || "")
        .trim()
        .toLowerCase();

      // =========================
      // SAVE ROLE
      // =========================

      if (userRole === "admin") {
        localStorage.setItem("role", "Admin");
      } else {
        localStorage.setItem("role", "User");
      }

      // =========================
      // REMEMBER EMAIL
      // =========================

      if (rememberMe) {
        localStorage.setItem(
          "rememberEmail",
          formData.email.trim()
        );
      } else {
        localStorage.removeItem("rememberEmail");
      }

      // =========================
      // VERIFY LOCAL STORAGE
      // =========================

      console.log(
        "LocalStorage User ID:",
        localStorage.getItem("userId")
      );

      console.log(
        "LocalStorage User Name:",
        localStorage.getItem("userName")
      );

      console.log(
        "LocalStorage Role:",
        localStorage.getItem("role")
      );

      // =========================
      // NAVIGATION
      // =========================

      if (userRole === "admin") {
        console.log("Admin login successful");

        navigate("/admin");
      } else {
        console.log("User login successful");

        navigate("/user");
      }

    } catch (err) {
      console.error("Login Error:", err);

      // =========================
      // SERVER ERROR
      // =========================

      if (err.response) {
        const message =
          err.response.data?.message ||
          err.response.data?.title ||
          err.response.data?.error ||
          "Invalid email or password.";

        setError(message);

      } else if (err.request) {
        setError(
          "Server is not responding. Please start your backend."
        );

      } else {
        setError(
          "Something went wrong. Please try again."
        );
      }

    } finally {
      setLoading(false);
    }
  };

  // =========================
  // UI
  // =========================

  return (
    <div className="login-page">

      {/* =========================================
          LEFT SIDE
      ========================================== */}

      <div className="login-left">

        <div className="left-decoration top-decoration"></div>

        <div className="left-decoration bottom-decoration"></div>

        {/* BRAND */}

        <div className="brand">

          <div className="brand-logo">
            S
          </div>

          <div>
            <h2>
              Student Portal
            </h2>

            <p>
              Learning Management System
            </p>
          </div>

        </div>


        {/* LEFT CONTENT */}

        <div className="left-content">

          <div className="welcome-badge">
            Welcome to your portal
          </div>

          <h1>
            Manage your
            <br />
            learning journey from
            <br />
            one simple platform.
          </h1>

          <p className="description">
            Access courses, classes, study materials, tests and
            <br className="desktop-break" />
            academic information securely.
          </p>


          {/* FEATURES */}

          <div className="features">

            <div className="feature-item">

              <span className="check-icon">
                <FaCheck />
              </span>

              <span>
                Secure role-based login
              </span>

            </div>


            <div className="feature-item">

              <span className="check-icon">
                <FaCheck />
              </span>

              <span>
                Access courses and classes
              </span>

            </div>


            <div className="feature-item">

              <span className="check-icon">
                <FaCheck />
              </span>

              <span>
                Simple and organized dashboard
              </span>

            </div>

          </div>

        </div>


        {/* COPYRIGHT */}

        <p className="copyright">
          © 2026 Student Portal. All rights reserved.
        </p>

      </div>


      {/* =========================================
          RIGHT SIDE
      ========================================== */}

      <div className="login-right">

        <div className="login-container">

          {/* WELCOME */}

          <div className="welcome-text">
            Welcome back
          </div>


          {/* HEADING */}

          <div className="login-heading">

            <h1>
              Sign in to
              <br />
              your account
            </h1>

            <p>
              Enter your registered email
              <br />
              and password to continue.
            </p>

          </div>


          {/* =====================================
              LOGIN FORM
          ====================================== */}

          <form
            className="login-form"
            onSubmit={handleSubmit}
          >

            {/* EMAIL */}

            <div className="form-group">

              <label htmlFor="email">
                Email address
              </label>

              <div className="input-box">

                <FaEnvelope className="input-icon" />

                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                />

              </div>

            </div>


            {/* PASSWORD */}

            <div className="form-group">

              <div className="password-label">

                <label htmlFor="password">
                  Password
                </label>

                <Link to="/forgot-password">
                  Forgot password?
                </Link>

              </div>


              <div className="input-box">

                <FaLock className="input-icon" />

                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />


                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (prev) => !prev
                    )
                  }
                >

                  {showPassword ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}

                  <span>
                    {showPassword
                      ? "Hide"
                      : "Show"}
                  </span>

                </button>

              </div>

            </div>


            {/* ERROR */}

            {error && (
              <div className="login-error">
                {error}
              </div>
            )}


            {/* REMEMBER ME */}

            <label className="remember-row">

              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) =>
                  setRememberMe(
                    e.target.checked
                  )
                }
              />

              <span>
                Remember me on this device
              </span>

            </label>


            {/* SIGN IN BUTTON */}

            <button
              type="submit"
              className="sign-in-btn"
              disabled={loading}
            >

              {loading ? (
                "Signing in..."
              ) : (
                "Sign in"
              )}

            </button>

          </form>


          {/* DIVIDER */}

          <div className="divider"></div>


          {/* CREATE ACCOUNT */}

          <div className="create-account">

            <span>
              Do not have an account?
            </span>

            <Link to="/register">
              Create an account
            </Link>

          </div>


          {/* SUPPORT */}

          <div className="support">

            <span>
              Need help?
            </span>

            <a href="mailto:support@studentportal.com">
              Contact support
            </a>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Login;