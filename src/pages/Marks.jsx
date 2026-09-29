import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Marks.css";

function Marks() {
  const navigate = useNavigate();

  const [results, setResults] = useState([
    {
      id: 1,
      studentName: "Rahul Patil",
      email: "rahul@gmail.com",
      course: "JEE",
      testName: "Mathematics Test 1",
      totalMarks: 100,
      obtainedMarks: 85,
      date: "2026-08-05",
    },
    {
      id: 2,
      studentName: "Amit Sharma",
      email: "amit@gmail.com",
      course: "NEET",
      testName: "Biology Test 1",
      totalMarks: 100,
      obtainedMarks: 72,
      date: "2026-08-05",
    },
    {
      id: 3,
      studentName: "Sneha More",
      email: "sneha@gmail.com",
      course: "JEE",
      testName: "Physics Test 1",
      totalMarks: 100,
      obtainedMarks: 91,
      date: "2026-08-06",
    },
    {
      id: 4,
      studentName: "Rohit Kumar",
      email: "rohit@gmail.com",
      course: "MHT-CET",
      testName: "Chemistry Test 1",
      totalMarks: 100,
      obtainedMarks: 42,
      date: "2026-08-06",
    },
    {
      id: 5,
      studentName: "Priya Singh",
      email: "priya@gmail.com",
      course: "JEE",
      testName: "Mathematics Test 2",
      totalMarks: 100,
      obtainedMarks: 67,
      date: "2026-08-07",
    },
  ]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [showForm, setShowForm] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    studentName: "",
    email: "",
    course: "",
    testName: "",
    totalMarks: "",
    obtainedMarks: "",
    date: new Date().toISOString().split("T")[0],
  });

  // ------------------------------------------------
  // ADMIN + TEACHER ACCESS
  // ------------------------------------------------

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role !== "Admin" && role !== "Teacher") {
      navigate("/login");
    }
  }, [navigate]);

  // ------------------------------------------------
  // RESULT CALCULATIONS
  // ------------------------------------------------

  const getPercentage = (obtained, total) => {
    if (!total || total === 0) return 0;

    return ((obtained / total) * 100).toFixed(1);
  };

  const getGrade = (percentage) => {
    if (percentage >= 90) return "A+";
    if (percentage >= 80) return "A";
    if (percentage >= 70) return "B";
    if (percentage >= 60) return "C";
    if (percentage >= 50) return "D";
    return "F";
  };

  const getStatus = (percentage) => {
    return percentage >= 40 ? "Pass" : "Fail";
  };

  // ------------------------------------------------
  // SEARCH + FILTER
  // ------------------------------------------------

  const filteredResults = useMemo(() => {
    return results.filter((result) => {
      const percentage = Number(
        getPercentage(
          result.obtainedMarks,
          result.totalMarks
        )
      );

      const status = getStatus(percentage);

      const matchesSearch =
        result.studentName
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        result.email
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        result.course
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        result.testName
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" ||
        status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [results, search, statusFilter]);

  // ------------------------------------------------
  // STATISTICS
  // ------------------------------------------------

  const totalResults = results.length;

  const passedResults = results.filter((result) => {
    const percentage = Number(
      getPercentage(
        result.obtainedMarks,
        result.totalMarks
      )
    );

    return percentage >= 40;
  }).length;

  const failedResults = results.filter((result) => {
    const percentage = Number(
      getPercentage(
        result.obtainedMarks,
        result.totalMarks
      )
    );

    return percentage < 40;
  }).length;

  const averagePercentage =
    results.length > 0
      ? (
          results.reduce(
            (sum, result) =>
              sum +
              Number(
                getPercentage(
                  result.obtainedMarks,
                  result.totalMarks
                )
              ),
            0
          ) / results.length
        ).toFixed(1)
      : 0;

  // ------------------------------------------------
  // FORM HANDLING
  // ------------------------------------------------

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      studentName: "",
      email: "",
      course: "",
      testName: "",
      totalMarks: "",
      obtainedMarks: "",
      date: new Date().toISOString().split("T")[0],
    });

    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.studentName ||
      !formData.email ||
      !formData.course ||
      !formData.testName ||
      !formData.totalMarks ||
      formData.obtainedMarks === ""
    ) {
      alert("Please fill all required fields.");
      return;
    }

    if (
      Number(formData.obtainedMarks) >
      Number(formData.totalMarks)
    ) {
      alert("Obtained marks cannot be greater than total marks.");
      return;
    }

    if (editingId) {
      setResults((prev) =>
        prev.map((result) =>
          result.id === editingId
            ? {
                ...result,
                ...formData,
                totalMarks: Number(formData.totalMarks),
                obtainedMarks: Number(
                  formData.obtainedMarks
                ),
              }
            : result
        )
      );

      alert("Result updated successfully.");
    } else {
      const newResult = {
        id: Date.now(),
        ...formData,
        totalMarks: Number(formData.totalMarks),
        obtainedMarks: Number(formData.obtainedMarks),
      };

      setResults((prev) => [newResult, ...prev]);

      alert("Result added successfully.");
    }

    resetForm();
  };

  // ------------------------------------------------
  // EDIT
  // ------------------------------------------------

  const handleEdit = (result) => {
    setFormData({
      studentName: result.studentName,
      email: result.email,
      course: result.course,
      testName: result.testName,
      totalMarks: result.totalMarks,
      obtainedMarks: result.obtainedMarks,
      date: result.date,
    });

    setEditingId(result.id);
    setShowForm(true);
  };

  // ------------------------------------------------
  // DELETE
  // ------------------------------------------------

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this result?"
    );

    if (!confirmDelete) return;

    setResults((prev) =>
      prev.filter((result) => result.id !== id)
    );
  };

  return (
    <div className="marks-page">

      {/* HEADER */}

      <div className="marks-header">

        <div>
          <div className="page-label">
            TEST RESULTS
          </div>

          <h1>Test Results</h1>

          <p>
            View and manage student test marks and performance.
          </p>
        </div>

        <button
          className="back-btn"
          onClick={() => navigate("/admin")}
        >
          ← Back to Dashboard
        </button>

      </div>

      {/* STATISTICS */}

      <div className="marks-stats">

        <div className="stat-card blue">
          <div className="stat-icon">📊</div>

          <div>
            <span>Total Results</span>
            <strong>{totalResults}</strong>
          </div>
        </div>

        <div className="stat-card green">
          <div className="stat-icon">✓</div>

          <div>
            <span>Passed</span>
            <strong>{passedResults}</strong>
          </div>
        </div>

        <div className="stat-card red">
          <div className="stat-icon">✕</div>

          <div>
            <span>Failed</span>
            <strong>{failedResults}</strong>
          </div>
        </div>

        <div className="stat-card purple">
          <div className="stat-icon">%</div>

          <div>
            <span>Average Score</span>
            <strong>{averagePercentage}%</strong>
          </div>
        </div>

      </div>

      {/* MAIN CARD */}

      <div className="marks-card">

        {/* TOOLBAR */}

        <div className="marks-toolbar">

          <div className="search-box">
            <span>🔍</span>

            <input
              type="text"
              placeholder="Search student, course or test..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
          >
            <option value="All">All Results</option>
            <option value="Pass">Passed</option>
            <option value="Fail">Failed</option>
          </select>

          <button
            className="add-result-btn"
            onClick={() => {
              setEditingId(null);
              setShowForm(true);
            }}
          >
            + Add Result
          </button>

        </div>

        {/* ADD / EDIT FORM */}

        {showForm && (
          <div className="result-form-container">

            <div className="form-heading">
              <h2>
                {editingId
                  ? "Edit Test Result"
                  : "Add Test Result"}
              </h2>

              <button
                onClick={resetForm}
                className="close-form"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>

              <div className="form-grid">

                <div className="form-group">
                  <label>Student Name *</label>

                  <input
                    type="text"
                    name="studentName"
                    value={formData.studentName}
                    onChange={handleChange}
                    placeholder="Enter student name"
                  />
                </div>

                <div className="form-group">
                  <label>Email *</label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter student email"
                  />
                </div>

                <div className="form-group">
                  <label>Course / Class *</label>

                  <input
                    type="text"
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    placeholder="Example: JEE"
                  />
                </div>

                <div className="form-group">
                  <label>Test Name *</label>

                  <input
                    type="text"
                    name="testName"
                    value={formData.testName}
                    onChange={handleChange}
                    placeholder="Example: Mathematics Test 1"
                  />
                </div>

                <div className="form-group">
                  <label>Total Marks *</label>

                  <input
                    type="number"
                    name="totalMarks"
                    value={formData.totalMarks}
                    onChange={handleChange}
                    placeholder="100"
                    min="1"
                  />
                </div>

                <div className="form-group">
                  <label>Obtained Marks *</label>

                  <input
                    type="number"
                    name="obtainedMarks"
                    value={formData.obtainedMarks}
                    onChange={handleChange}
                    placeholder="Enter marks"
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label>Test Date</label>

                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                  />
                </div>

              </div>

              <div className="form-buttons">

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={resetForm}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="submit-result-btn"
                >
                  {editingId
                    ? "Update Result"
                    : "Save Result"}
                </button>

              </div>

            </form>

          </div>
        )}

        {/* TABLE */}

        <div className="table-container">

          <table className="marks-table">

            <thead>
              <tr>
                <th>#</th>
                <th>Student</th>
                <th>Course</th>
                <th>Test</th>
                <th>Marks</th>
                <th>Percentage</th>
                <th>Grade</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {filteredResults.length === 0 ? (

                <tr>
                  <td
                    colSpan="10"
                    className="no-results"
                  >
                    No test results found.
                  </td>
                </tr>

              ) : (

                filteredResults.map((result, index) => {

                  const percentage = Number(
                    getPercentage(
                      result.obtainedMarks,
                      result.totalMarks
                    )
                  );

                  const grade =
                    getGrade(percentage);

                  const status =
                    getStatus(percentage);

                  return (
                    <tr key={result.id}>

                      <td>{index + 1}</td>

                      <td>
                        <div className="student-info">

                          <div className="student-avatar">
                            {result.studentName
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>
                            <strong>
                              {result.studentName}
                            </strong>

                            <small>
                              {result.email}
                            </small>
                          </div>

                        </div>
                      </td>

                      <td>
                        <span className="course-badge">
                          {result.course}
                        </span>
                      </td>

                      <td>
                        {result.testName}
                      </td>

                      <td>
                        <strong>
                          {result.obtainedMarks}
                        </strong>
                        {" / "}
                        {result.totalMarks}
                      </td>

                      <td>
                        <strong>
                          {percentage}%
                        </strong>
                      </td>

                      <td>
                        <span
                          className={`grade grade-${grade
                            .replace("+", "plus")
                            .toLowerCase()}`}
                        >
                          {grade}
                        </span>
                      </td>

                      <td>
                        <span
                          className={
                            status === "Pass"
                              ? "status-pass"
                              : "status-fail"
                          }
                        >
                          {status}
                        </span>
                      </td>

                      <td>
                        {new Date(
                          result.date
                        ).toLocaleDateString("en-IN")}
                      </td>

                      <td>

                        <div className="action-buttons">

                          <button
                            className="edit-btn"
                            onClick={() =>
                              handleEdit(result)
                            }
                          >
                            Edit
                          </button>

                          <button
                            className="delete-btn"
                            onClick={() =>
                              handleDelete(result.id)
                            }
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>
                  );
                })

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default Marks;