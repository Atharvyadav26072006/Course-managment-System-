import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaArrowLeft,
  FaBookOpen,
  FaClock,
  FaEdit,
  FaGraduationCap,
  FaPlus,
  FaRupeeSign,
  FaSearch,
  FaTrash,
  FaUserCheck,
  FaUserPlus,
  FaTimes,
} from "react-icons/fa";

import API_BASE_URL from "../Services/api";
import "./Classes.css";

function Classes() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [searchText, setSearchText] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [editingCourseId, setEditingCourseId] = useState(null);

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [buyers, setBuyers] = useState([]);
  const [buyersLoading, setBuyersLoading] = useState(false);
  const [buyersError, setBuyersError] = useState("");
  const [assigningEnrollmentId, setAssigningEnrollmentId] =
    useState(null);

  const [form, setForm] = useState({
    courseName: "",
    amount: "",
    duration: "",
    classType: "Offline",
    isActive: true,
  });

  const token = localStorage.getItem("token");

  // =========================
  // CHECK ADMIN + LOAD COURSES
  // =========================

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (!token || role !== "Admin") {
      navigate("/login");
      return;
    }

    loadCourses();
  }, []);

  // =========================
  // READ API RESPONSE
  // =========================

  const readResponse = async (response) => {
    const contentType = response.headers.get("content-type");

    if (
      contentType &&
      contentType.includes("application/json")
    ) {
      return await response.json();
    }

    const text = await response.text();

    return {
      message: text || "Request failed.",
    };
  };

  // =========================
  // LOAD COURSES
  // =========================

  const loadCourses = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/Course`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await readResponse(response);

      if (!response.ok) {
        if (
          response.status === 401 ||
          response.status === 403
        ) {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          navigate("/login");
          return;
        }

        throw new Error(
          data?.message || "Unable to load courses."
        );
      }

      setCourses(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (requestError) {
      console.error(requestError);

      setError(
        requestError.message ||
          "Backend connection failed."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // FILTER + COURSE ORDER
  // =========================

  const filteredCourses = useMemo(() => {
    const search = searchText
      .trim()
      .toLowerCase();

    let result = [...courses];

    /*
      COURSE DISPLAY ORDER

      1. JEE
      2. NEET
      3. MHT-CET
      4. बाकी courses

      यामुळे API कडून order:
      MHT-CET
      NEET
      JEE

      आला तरी UI मध्ये:
      JEE
      NEET
      MHT-CET

      असा order दिसेल.
    */

    const courseOrder = {
      "jee": 1,
      "neet": 2,
      "mht-cet": 3,
      "mhtcet": 3,
    };

    result.sort((a, b) => {
      const nameA = (
        a.courseName ||
        a.name ||
        ""
      )
        .trim()
        .toLowerCase();

      const nameB = (
        b.courseName ||
        b.name ||
        ""
      )
        .trim()
        .toLowerCase();

      const orderA =
        courseOrder[nameA] || 999;

      const orderB =
        courseOrder[nameB] || 999;

      if (orderA !== orderB) {
        return orderA - orderB;
      }

      return nameA.localeCompare(nameB);
    });

    // SEARCH
    if (!search) {
      return result;
    }

    return result.filter((course) => {
      const courseName = (
        course.courseName ||
        course.name ||
        ""
      ).toLowerCase();

      const duration = (
        course.duration ||
        ""
      ).toLowerCase();

      const classType = (
        course.classType ||
        ""
      ).toLowerCase();

      return (
        courseName.includes(search) ||
        duration.includes(search) ||
        classType.includes(search)
      );
    });
  }, [courses, searchText]);

  // =========================
  // COURSE STATISTICS
  // =========================

  const activeCourseCount =
    courses.filter(
      (course) => course.isActive
    ).length;

  const highestCourseFee =
    courses.length === 0
      ? 0
      : Math.max(
          ...courses.map((course) =>
            Number(course.amount || 0)
          )
        );

  // =========================
  // FORM CHANGE
  // =========================

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // =========================
  // RESET FORM
  // =========================

  const resetForm = () => {
    setForm({
      courseName: "",
      amount: "",
      duration: "",
      classType: "Offline",
      isActive: true,
    });

    setEditingCourseId(null);
  };

  // =========================
  // ADD / UPDATE COURSE
  // =========================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.courseName.trim()) {
      alert("Please enter course name.");
      return;
    }

    if (!form.duration.trim()) {
      alert("Please enter course duration.");
      return;
    }

    if (
      form.amount === "" ||
      Number(form.amount) < 0
    ) {
      alert("Please enter a valid amount.");
      return;
    }

    setSaving(true);

    const courseData = {
      courseName:
        form.courseName.trim(),

      amount:
        Number(form.amount),

      duration:
        form.duration.trim(),

      classType:
        form.classType,

      isActive:
        form.isActive,
    };

    try {
      const isEditing =
        editingCourseId !== null;

      const url = isEditing
        ? `${API_BASE_URL}/Course/${editingCourseId}`
        : `${API_BASE_URL}/Course`;

      const response = await fetch(
        url,
        {
          method: isEditing
            ? "PUT"
            : "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body:
            JSON.stringify(courseData),
        }
      );

      const data =
        await readResponse(response);

      if (!response.ok) {
        throw new Error(
          data?.message ||
            `Unable to ${
              isEditing
                ? "update"
                : "create"
            } course.`
        );
      }

      alert(
        data?.message ||
          `Course ${
            isEditing
              ? "updated"
              : "created"
          } successfully.`
      );

      resetForm();

      await loadCourses();

    } catch (requestError) {
      console.error(requestError);

      alert(
        requestError.message ||
          "Course operation failed."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // EDIT COURSE
  // =========================

  const handleEdit = (course) => {
    setEditingCourseId(
      course.id
    );

    setForm({
      courseName:
        course.courseName ||
        course.name ||
        "",

      amount:
        course.amount ?? "",

      duration:
        course.duration || "",

      classType:
        course.classType ||
        "Offline",

      isActive:
        course.isActive ?? true,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // DELETE COURSE
  // =========================

  const handleDelete = async (
    course
  ) => {
    const courseName =
      course.courseName ||
      course.name ||
      "this course";

    const confirmed =
      window.confirm(
        `Are you sure you want to delete ${courseName}?`
      );

    if (!confirmed) {
      return;
    }

    try {
      const response =
        await fetch(
          `${API_BASE_URL}/Course/${course.id}`,
          {
            method: "DELETE",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      const data =
        await readResponse(response);

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Unable to delete course."
        );
      }

      alert(
        data?.message ||
          "Course deleted successfully."
      );

      if (
        editingCourseId ===
        course.id
      ) {
        resetForm();
      }

      if (
        selectedCourse?.id ===
        course.id
      ) {
        closeBuyers();
      }

      await loadCourses();

    } catch (requestError) {
      console.error(requestError);

      alert(
        requestError.message ||
          "Course delete failed."
      );
    }
  };

  // =========================
  // LOAD COURSE BUYERS
  // =========================

  const loadCourseBuyers =
    async (course) => {
      setSelectedCourse(course);
      setBuyers([]);
      setBuyersLoading(true);
      setBuyersError("");

      try {
        const response =
          await fetch(
            `${API_BASE_URL}/Admin/courses/${course.id}/students`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const data =
          await readResponse(response);

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Unable to load course buyers."
          );
        }

        setBuyers(
          Array.isArray(data)
            ? data
            : []
        );

      } catch (requestError) {
        console.error(requestError);

        setBuyersError(
          requestError.message ||
            "Unable to load course buyers."
        );
      } finally {
        setBuyersLoading(false);
      }
    };

  // =========================
  // ASSIGN STUDENT
  // =========================

  const assignStudent =
    async (enrollmentId) => {
      const confirmed =
        window.confirm(
          "Do you want to assign this student to the course?"
        );

      if (!confirmed) {
        return;
      }

      setAssigningEnrollmentId(
        enrollmentId
      );

      try {
        const response =
          await fetch(
            `${API_BASE_URL}/Admin/enrollments/${enrollmentId}/approve`,
            {
              method: "PUT",

              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const data =
          await readResponse(response);

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Unable to assign student."
          );
        }

        alert(
          data?.message ||
            "Student assigned successfully."
        );

        setBuyers(
          (previousBuyers) =>
            previousBuyers.map(
              (buyer) =>
                buyer.enrollmentId ===
                enrollmentId
                  ? {
                      ...buyer,

                      paymentStatus:
                        "Paid",

                      enrollmentStatus:
                        "Approved",

                      isAccessGranted:
                        true,
                    }
                  : buyer
            )
        );

      } catch (requestError) {
        console.error(requestError);

        alert(
          requestError.message ||
            "Student assignment failed."
        );
      } finally {
        setAssigningEnrollmentId(
          null
        );
      }
    };

  // =========================
  // CLOSE BUYERS
  // =========================

  const closeBuyers = () => {
    setSelectedCourse(null);
    setBuyers([]);
    setBuyersError("");
  };

  // =========================
  // FORMAT AMOUNT
  // =========================

  const formatAmount = (
    amount
  ) => {
    return new Intl.NumberFormat(
      "en-IN",
      {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }
    ).format(
      Number(amount || 0)
    );
  };

  // =========================
  // FORMAT DATE
  // =========================

  const formatDate = (
    dateValue
  ) => {
    if (!dateValue) {
      return "-";
    }

    return new Date(
      dateValue
    ).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =========================
  // JSX
  // =========================

  return (
    <div className="classes-page">

      <div className="classes-container">

        {/* TOP BAR */}

        <div className="classes-topbar">

          <button
            type="button"
            className="classes-back-button"
            onClick={() =>
              navigate("/admin")
            }
          >
            <FaArrowLeft />
            Back to Dashboard
          </button>

          <div className="classes-topbar-badge">
            <FaGraduationCap />
            Course Management
          </div>

        </div>

        {/* HERO */}

        <section className="classes-hero">

          <div>

            <p className="classes-hero-label">
              ADMIN MANAGEMENT
            </p>

            <h1>
              Manage Classes & Courses
            </h1>

            <p>
              Create courses, manage fees
              and assign only students who
              clicked the Buy button.
            </p>

          </div>

          <div className="classes-hero-icon">
            <FaGraduationCap />
          </div>

        </section>

        {/* STATISTICS */}

        <section className="classes-statistics">

          <div className="classes-stat-card">

            <div className="classes-stat-icon purple">
              <FaBookOpen />
            </div>

            <div>
              <span>
                Total Courses
              </span>

              <strong>
                {courses.length}
              </strong>
            </div>

          </div>

          <div className="classes-stat-card">

            <div className="classes-stat-icon green">
              <FaGraduationCap />
            </div>

            <div>
              <span>
                Active Courses
              </span>

              <strong>
                {activeCourseCount}
              </strong>
            </div>

          </div>

          <div className="classes-stat-card">

            <div className="classes-stat-icon orange">
              <FaRupeeSign />
            </div>

            <div>
              <span>
                Highest Course Fee
              </span>

              <strong>
                {formatAmount(
                  highestCourseFee
                )}
              </strong>
            </div>

          </div>

        </section>

        {/* CONTENT GRID */}

        <div className="classes-content-grid">

          {/* FORM */}

          <section className="classes-panel classes-form-panel">

            <div className="classes-panel-heading">

              <div className="classes-panel-icon">

                {editingCourseId ? (
                  <FaEdit />
                ) : (
                  <FaPlus />
                )}

              </div>

              <div>

                <h2>
                  {editingCourseId
                    ? "Edit Course"
                    : "Add New Class"}
                </h2>

                <p>
                  {editingCourseId
                    ? "Update the selected course."
                    : "Create a new course for students."}
                </p>

              </div>

            </div>

            <form
              className="classes-form"
              onSubmit={handleSubmit}
            >

              {/* COURSE NAME */}

              <div className="classes-form-group">

                <label htmlFor="courseName">
                  Course Name
                </label>

                <div className="classes-input-wrapper">

                  <FaBookOpen />

                  <input
                    id="courseName"
                    type="text"
                    name="courseName"
                    value={
                      form.courseName
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Example: JEE"
                    required
                  />

                </div>

              </div>

              {/* AMOUNT */}

              <div className="classes-form-group">

                <label htmlFor="amount">
                  Amount
                </label>

                <div className="classes-input-wrapper">

                  <FaRupeeSign />

                  <input
                    id="amount"
                    type="number"
                    name="amount"
                    value={
                      form.amount
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Example: 75000"
                    min="0"
                    required
                  />

                </div>

              </div>

              {/* DURATION */}

              <div className="classes-form-group">

                <label htmlFor="duration">
                  Duration
                </label>

                <div className="classes-input-wrapper">

                  <FaClock />

                  <input
                    id="duration"
                    type="text"
                    name="duration"
                    value={
                      form.duration
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Example: 2 Years"
                    required
                  />

                </div>

              </div>

              {/* CLASS TYPE */}

              <div className="classes-form-group">

                <label htmlFor="classType">
                  Class Type
                </label>

                <select
                  id="classType"
                  name="classType"
                  value={
                    form.classType
                  }
                  onChange={
                    handleChange
                  }
                  required
                >

                  <option value="Offline">
                    Offline
                  </option>

                  <option value="Online">
                    Online
                  </option>

                  <option value="Hybrid">
                    Hybrid
                  </option>

                </select>

              </div>

              {/* ACTIVE */}

              <label className="classes-checkbox-row">

                <input
                  type="checkbox"
                  name="isActive"
                  checked={
                    form.isActive
                  }
                  onChange={
                    handleChange
                  }
                />

                <span>
                  Keep this course active
                </span>

              </label>

              {/* SAVE */}

              <button
                type="submit"
                className="classes-save-button"
                disabled={saving}
              >

                {editingCourseId ? (
                  <FaEdit />
                ) : (
                  <FaPlus />
                )}

                {saving
                  ? "Saving..."
                  : editingCourseId
                  ? "Update Course"
                  : "Add Class"}

              </button>

              {/* CANCEL */}

              {editingCourseId && (
                <button
                  type="button"
                  className="classes-cancel-button"
                  onClick={
                    resetForm
                  }
                  disabled={saving}
                >

                  <FaTimes />
                  Cancel Edit

                </button>
              )}

            </form>

          </section>

          {/* COURSE TABLE */}

          <section className="classes-panel classes-table-panel">

            <div className="classes-table-header">

              <div className="classes-panel-heading">

                <div className="classes-panel-icon">
                  <FaBookOpen />
                </div>

                <div>

                  <h2>
                    Course List
                  </h2>

                  <p>
                    View, edit, delete and
                    assign course buyers.
                  </p>

                </div>

              </div>

              {/* SEARCH */}

              <div className="classes-search-box">

                <FaSearch />

                <input
                  type="text"
                  value={
                    searchText
                  }
                  onChange={(event) =>
                    setSearchText(
                      event.target.value
                    )
                  }
                  placeholder="Search course..."
                />

              </div>

            </div>

            {/* ERROR */}

            {error && (
              <div className="classes-error-message">
                {error}
              </div>
            )}

            {/* LOADING */}

            {loading ? (
              <div className="classes-loading">
                Loading courses...
              </div>
            ) : (

              <div className="classes-table-wrapper">

                <table className="classes-table">

                  <thead>

                    <tr>
                      <th>ID</th>
                      <th>Course Name</th>
                      <th>Amount</th>
                      <th>Duration</th>
                      <th>Class Type</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>

                  </thead>

                  <tbody>

                    {filteredCourses.length === 0 ? (

                      <tr>

                        <td
                          colSpan="7"
                          className="classes-empty-row"
                        >
                          No courses found.
                        </td>

                      </tr>

                    ) : (

                      filteredCourses.map(
                        (course, index) => {

                          const courseName =
                            course.courseName ||
                            course.name ||
                            "Course";

                          const classType =
                            course.classType ||
                            "Offline";

                          return (

                            <tr
                              key={course.id}
                            >

                              {/* DISPLAY ID */}

                              <td>

                                <span className="classes-id">
                                  #{index + 1}
                                </span>

                              </td>

                              {/* COURSE NAME */}

                              <td>

                                <div className="classes-course-name">

                                  <div className="classes-course-icon">

                                    {courseName
                                      .charAt(0)
                                      .toUpperCase()}

                                  </div>

                                  <strong>
                                    {courseName}
                                  </strong>

                                </div>

                              </td>

                              {/* AMOUNT */}

                              <td className="classes-amount">

                                {formatAmount(
                                  course.amount
                                )}

                              </td>

                              {/* DURATION */}

                              <td>
                                {course.duration ||
                                  "-"}
                              </td>

                              {/* CLASS TYPE */}

                              <td>

                                <span
                                  className={`classes-type ${classType.toLowerCase()}`}
                                >
                                  {classType}
                                </span>

                              </td>

                              {/* STATUS */}

                              <td>

                                <span
                                  className={
                                    course.isActive
                                      ? "classes-status active"
                                      : "classes-status inactive"
                                  }
                                >

                                  {course.isActive
                                    ? "Active"
                                    : "Inactive"}

                                </span>

                              </td>

                              {/* ACTION */}

                              <td>

                                <div className="classes-actions">

                                  {/* VIEW BUYERS */}

                                  <button
                                    type="button"
                                    className="classes-assign-button"
                                    title={`View buyers for ${courseName}`}
                                    onClick={() =>
                                      loadCourseBuyers(
                                        course
                                      )
                                    }
                                  >

                                    <FaUserPlus />

                                    <span>
                                      View Buyers
                                    </span>

                                  </button>

                                  {/* EDIT */}

                                  <button
                                    type="button"
                                    className="classes-edit-button"
                                    title="Edit Course"
                                    onClick={() =>
                                      handleEdit(
                                        course
                                      )
                                    }
                                  >

                                    <FaEdit />

                                  </button>

                                  {/* DELETE */}

                                  <button
                                    type="button"
                                    className="classes-delete-button"
                                    title="Delete Course"
                                    onClick={() =>
                                      handleDelete(
                                        course
                                      )
                                    }
                                  >

                                    <FaTrash />

                                  </button>

                                </div>

                              </td>

                            </tr>

                          );
                        }
                      )

                    )}

                  </tbody>

                </table>

              </div>

            )}

          </section>

        </div>

        {/* BUYERS SECTION */}

        {selectedCourse && (

          <section className="course-buyers-section">

            <div className="buyers-heading">

              <div>

                <p className="classes-hero-label">
                  COURSE BUYERS
                </p>

                <h2>
                  Buyers for{" "}
                  {selectedCourse.courseName ||
                    selectedCourse.name}
                </h2>

                <p>
                  Only students who clicked Buy
                  for this course are displayed here.
                </p>

              </div>

              <button
                type="button"
                className="buyers-close-button"
                onClick={
                  closeBuyers
                }
              >

                <FaTimes />
                Close

              </button>

            </div>

            {/* BUYERS LOADING */}

            {buyersLoading && (

              <div className="classes-loading">
                Loading buyers...
              </div>

            )}

            {/* BUYERS ERROR */}

            {buyersError && (

              <div className="classes-error-message">
                {buyersError}
              </div>

            )}

            {/* NO BUYERS */}

            {!buyersLoading &&
              !buyersError &&
              buyers.length === 0 && (

                <div className="classes-empty-buyers">

                  <FaUserPlus />

                  <h3>
                    No buyers found
                  </h3>

                  <p>
                    No student has clicked
                    Buy for this course yet.
                  </p>

                </div>

              )}

            {/* BUYERS TABLE */}

            {!buyersLoading &&
              buyers.length > 0 && (

                <div className="classes-table-wrapper">

                  <table className="classes-table buyers-table">

                    <thead>

                      <tr>

                        <th>
                          Student
                        </th>

                        <th>
                          Email
                        </th>

                        <th>
                          Mobile
                        </th>

                        <th>
                          Buy Date
                        </th>

                        <th>
                          Payment
                        </th>

                        <th>
                          Status
                        </th>

                        <th>
                          Action
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {buyers.map(
                        (buyer) => (

                          <tr
                            key={
                              buyer.enrollmentId
                            }
                          >

                            {/* STUDENT */}

                            <td>

                              <div className="classes-course-name">

                                <div className="classes-course-icon">

                                  {(
                                    buyer.studentName ||
                                    "S"
                                  )
                                    .charAt(0)
                                    .toUpperCase()}

                                </div>

                                <strong>
                                  {buyer.studentName ||
                                    "Student"}
                                </strong>

                              </div>

                            </td>

                            {/* EMAIL */}

                            <td>
                              {buyer.email ||
                                "-"}
                            </td>

                            {/* MOBILE */}

                            <td>
                              {buyer.mobileNumber ||
                                "-"}
                            </td>

                            {/* DATE */}

                            <td>

                              {formatDate(
                                buyer.enrollmentDate
                              )}

                            </td>

                            {/* PAYMENT */}

                            <td>

                              <span
                                className={
                                  buyer.paymentStatus ===
                                    "Paid" ||
                                  buyer.paymentStatus ===
                                    "Completed"
                                    ? "classes-status active"
                                    : "classes-status pending"
                                }
                              >

                                {buyer.paymentStatus ||
                                  "Pending"}

                              </span>

                            </td>

                            {/* STATUS */}

                            <td>

                              <span
                                className={
                                  buyer.isAccessGranted
                                    ? "classes-status active"
                                    : "classes-status pending"
                                }
                              >

                                {buyer.enrollmentStatus ||
                                  "Pending"}

                              </span>

                            </td>

                            {/* ASSIGN */}

                            <td>

                              {buyer.isAccessGranted ? (

                                <button
                                  type="button"
                                  className="classes-assigned-button"
                                  disabled
                                >

                                  <FaUserCheck />
                                  Assigned

                                </button>

                              ) : (

                                <button
                                  type="button"
                                  className="classes-assign-button"
                                  disabled={
                                    assigningEnrollmentId ===
                                    buyer.enrollmentId
                                  }
                                  onClick={() =>
                                    assignStudent(
                                      buyer.enrollmentId
                                    )
                                  }
                                >

                                  <FaUserPlus />

                                  {assigningEnrollmentId ===
                                  buyer.enrollmentId
                                    ? "Assigning..."
                                    : "Assign"}

                                </button>

                              )}

                            </td>

                          </tr>

                        )
                      )}

                    </tbody>

                  </table>

                </div>

              )}

          </section>

        )}

      </div>

    </div>
  );
}

export default Classes;