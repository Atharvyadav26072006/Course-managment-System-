import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaArrowLeft,
  FaChalkboardTeacher,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaPlus,
  FaSearch,
  FaUserCheck,
  FaUserTimes,
} from "react-icons/fa";

import API_BASE_URL from "../Services/api";
import "./Teachers.css";

function Teachers() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // =========================================================
  // STATES
  // =========================================================

  const [teachers, setTeachers] = useState([]);

  const [searchText, setSearchText] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    mobileNumber: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);

  const [fetchLoading, setFetchLoading] = useState(true);

  const [message, setMessage] = useState("");

  const [messageType, setMessageType] = useState("");

  // =========================================================
  // SHOW MESSAGE
  // =========================================================

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);

    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 4000);
  };

  // =========================================================
  // GET ALL TEACHERS
  // =========================================================

  const getTeachers = async () => {
    setFetchLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/Admin/teachers`,
        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // =====================================================
      // AUTHORIZATION CHECK
      // =====================================================

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        localStorage.clear();
        navigate("/login");
        return;
      }

      const data = await response.json();

      // =====================================================
      // API ERROR
      // =====================================================

      if (!response.ok) {
        showMessage(
          data.message || "Unable to load teachers.",
          "error"
        );

        return;
      }

      // =====================================================
      // SET TEACHERS
      // =====================================================

      setTeachers(Array.isArray(data) ? data : []);

    } catch (error) {
      console.error(
        "Get teachers error:",
        error
      );

      showMessage(
        "Backend is not running or API URL is incorrect.",
        "error"
      );

    } finally {
      setFetchLoading(false);
    }
  };

  // =========================================================
  // PAGE LOAD
  // =========================================================

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    getTeachers();
  }, []);

  // =========================================================
  // HANDLE INPUT CHANGE
  // =========================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  };

  // =========================================================
  // CREATE TEACHER
  // =========================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/Admin/teachers`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            name: form.name.trim(),
            email: form.email.trim(),
            password: form.password,
            mobileNumber: form.mobileNumber.trim(),
            address: form.address.trim(),
          }),
        }
      );

      const data = await response.json();

      // =====================================================
      // API ERROR
      // =====================================================

      if (!response.ok) {
        showMessage(
          data.message || "Teacher creation failed.",
          "error"
        );

        return;
      }

      // =====================================================
      // SUCCESS
      // =====================================================

      showMessage(
        data.message ||
          "Teacher created successfully.",
        "success"
      );

      // =====================================================
      // RESET FORM
      // =====================================================

      setForm({
        name: "",
        email: "",
        password: "",
        mobileNumber: "",
        address: "",
      });

      // =====================================================
      // REFRESH TEACHER LIST
      // =====================================================

      await getTeachers();

    } catch (error) {
      console.error(
        "Create teacher error:",
        error
      );

      showMessage(
        "Backend is not running or API URL is incorrect.",
        "error"
      );

    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // SEARCH / FILTER
  // =========================================================

  const filteredTeachers = teachers.filter(
    (teacher) => {
      const search =
        searchText.toLowerCase();

      return (
        teacher.name
          ?.toLowerCase()
          .includes(search) ||

        teacher.email
          ?.toLowerCase()
          .includes(search) ||

        teacher.mobileNumber
          ?.toLowerCase()
          .includes(search) ||

        teacher.address
          ?.toLowerCase()
          .includes(search)
      );
    }
  );

  // =========================================================
  // STATISTICS
  // =========================================================

  const activeTeachers =
    teachers.filter(
      (teacher) => teacher.isActive
    ).length;

  const inactiveTeachers =
    teachers.filter(
      (teacher) => !teacher.isActive
    ).length;

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="teachers-page">

      <div className="teachers-container">

        {/* =====================================================
            TOP BAR
        ====================================================== */}

        <div className="teachers-topbar">

          <button
            type="button"
            className="back-button"
            onClick={() => navigate("/admin")}
          >
            <FaArrowLeft />
            Back to Dashboard
          </button>

          <div className="topbar-badge">
            <FaChalkboardTeacher />
            Teacher Management
          </div>

        </div>


        {/* =====================================================
            HERO
        ====================================================== */}

        <section className="teachers-hero">

          <div>

            <p className="hero-label">
              ADMIN MANAGEMENT
            </p>

            <h1>
              Manage Teachers
            </h1>

            <p className="hero-description">
              Create teacher accounts, review teacher
              details and manage active teaching staff
              from one place.
            </p>

          </div>

          <div className="hero-icon">
            <FaChalkboardTeacher />
          </div>

        </section>


        {/* =====================================================
            STATISTICS
        ====================================================== */}

        <section className="teacher-statistics">

          {/* TOTAL */}

          <div className="teacher-stat-card">

            <div className="stat-icon stat-total">
              <FaChalkboardTeacher />
            </div>

            <div>
              <span>Total Teachers</span>

              <strong>
                {teachers.length}
              </strong>
            </div>

          </div>


          {/* ACTIVE */}

          <div className="teacher-stat-card">

            <div className="stat-icon stat-active">
              <FaUserCheck />
            </div>

            <div>
              <span>Active Teachers</span>

              <strong>
                {activeTeachers}
              </strong>
            </div>

          </div>


          {/* INACTIVE */}

          <div className="teacher-stat-card">

            <div className="stat-icon stat-inactive">
              <FaUserTimes />
            </div>

            <div>
              <span>Inactive Teachers</span>

              <strong>
                {inactiveTeachers}
              </strong>
            </div>

          </div>

        </section>


        {/* =====================================================
            MESSAGE
        ====================================================== */}

        {message && (
          <div
            className={`teacher-message ${messageType}`}
          >
            {message}
          </div>
        )}


        {/* =====================================================
            MAIN GRID
        ====================================================== */}

        <div className="teachers-content-grid">


          {/* ===================================================
              CREATE TEACHER
          ==================================================== */}

          <section className="teacher-panel create-teacher-panel">

            <div className="panel-heading">

              <div className="panel-title-icon">
                <FaPlus />
              </div>

              <div>

                <h2>
                  Create Teacher
                </h2>

                <p>
                  Add a new teacher account to the system.
                </p>

              </div>

            </div>


            {/* FORM */}

            <form
              className="teacher-form"
              onSubmit={handleSubmit}
            >

              {/* TEACHER NAME */}

              <div className="form-field">

                <label htmlFor="name">
                  Teacher Name
                </label>

                <div className="input-wrapper">

                  <FaChalkboardTeacher />

                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter teacher name"
                    required
                  />

                </div>

              </div>


              {/* EMAIL */}

              <div className="form-field">

                <label htmlFor="email">
                  Email Address
                </label>

                <div className="input-wrapper">

                  <FaEnvelope />

                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="teacher@example.com"
                    required
                  />

                </div>

              </div>


              {/* PASSWORD */}

              <div className="form-field">

                <label htmlFor="password">
                  Password
                </label>

                <div className="input-wrapper">

                  <span className="password-symbol">
                    •••
                  </span>

                  <input
                    id="password"
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Minimum 6 characters"
                    minLength={6}
                    required
                  />

                </div>

              </div>


              {/* MOBILE */}

              <div className="form-field">

                <label htmlFor="mobileNumber">
                  Mobile Number
                </label>

                <div className="input-wrapper">

                  <FaPhoneAlt />

                  <input
                    id="mobileNumber"
                    type="text"
                    name="mobileNumber"
                    value={form.mobileNumber}
                    onChange={handleChange}
                    placeholder="Enter mobile number"
                  />

                </div>

              </div>


              {/* ADDRESS */}

              <div className="form-field full-width">

                <label htmlFor="address">
                  Address
                </label>

                <div className="textarea-wrapper">

                  <FaMapMarkerAlt />

                  <textarea
                    id="address"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Enter teacher address"
                    rows={4}
                  />

                </div>

              </div>


              {/* CREATE BUTTON */}

              <button
                type="submit"
                className="create-teacher-button"
                disabled={loading}
              >

                <FaPlus />

                {loading
                  ? "Creating Teacher..."
                  : "Create Teacher"}

              </button>

            </form>

          </section>


          {/* ===================================================
              TEACHER LIST
          ==================================================== */}

          <section className="teacher-panel teacher-list-panel">

            {/* HEADER */}

            <div className="teacher-list-header">

              <div className="panel-heading">

                <div className="panel-title-icon">
                  <FaChalkboardTeacher />
                </div>

                <div>

                  <h2>
                    Teacher List
                  </h2>

                  <p>
                    View all registered teacher accounts.
                  </p>

                </div>

              </div>


              {/* SEARCH */}

              <div className="teacher-search">

                <FaSearch />

                <input
                  type="text"
                  value={searchText}
                  onChange={(event) =>
                    setSearchText(
                      event.target.value
                    )
                  }
                  placeholder="Search teachers..."
                />

              </div>

            </div>


            {/* =================================================
                LOADING
            ================================================== */}

            {fetchLoading ? (

              <div className="teacher-empty-state">

                <div className="teacher-loader" />

                <p>
                  Loading teachers...
                </p>

              </div>


            ) : filteredTeachers.length === 0 ? (

              /* =================================================
                  EMPTY
              ================================================== */

              <div className="teacher-empty-state">

                <FaChalkboardTeacher />

                <h3>
                  No teachers found
                </h3>

                <p>
                  Create a teacher or change your
                  search text.
                </p>

              </div>


            ) : (

              /* =================================================
                  TABLE
              ================================================== */

              <div className="teacher-table-wrapper">

                <table className="teacher-table">

                  <thead>

                    <tr>

                      <th>ID</th>

                      <th>Teacher</th>

                      <th>Contact</th>

                      <th>Address</th>

                      <th>Status</th>

                    </tr>

                  </thead>


                  <tbody>

                    {filteredTeachers.map(
                      (teacher, index) => (

                        <tr key={teacher.id}>

                          {/* =================================
                              SEQUENCE ID
                          ================================== */}

                          <td>

                            <span className="teacher-id">
                              #{index + 1}
                            </span>

                          </td>


                          {/* =================================
                              TEACHER
                          ================================== */}

                          <td>

                            <div className="teacher-profile">

                              <div className="teacher-avatar">

                                {teacher.name
                                  ?.charAt(0)
                                  .toUpperCase()}

                              </div>

                              <div>

                                <strong>
                                  {teacher.name}
                                </strong>

                                <span>
                                  {teacher.email}
                                </span>

                              </div>

                            </div>

                          </td>


                          {/* =================================
                              CONTACT
                          ================================== */}

                          <td>

                            <div className="teacher-contact">

                              <span>

                                <FaEnvelope />

                                {teacher.email}

                              </span>


                              <span>

                                <FaPhoneAlt />

                                {teacher.mobileNumber ||
                                  "Not provided"}

                              </span>

                            </div>

                          </td>


                          {/* =================================
                              ADDRESS
                          ================================== */}

                          <td>

                            <span className="teacher-address">

                              <FaMapMarkerAlt />

                              {teacher.address ||
                                "Not provided"}

                            </span>

                          </td>


                          {/* =================================
                              STATUS
                          ================================== */}

                          <td>

                            <span
                              className={
                                teacher.isActive
                                  ? "teacher-status active"
                                  : "teacher-status inactive"
                              }
                            >

                              {teacher.isActive
                                ? "Active"
                                : "Inactive"}

                            </span>

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            )}

          </section>

        </div>

      </div>

    </div>
  );
}

export default Teachers;