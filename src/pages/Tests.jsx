import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Tests.css";

function Tests() {
  const navigate = useNavigate();

  const [tests, setTests] = useState([
    {
      id: 1,
      testName: "Mathematics Test 1",
      course: "JEE",
      subject: "Mathematics",
      totalMarks: 100,
      duration: 60,
      testDate: "2026-08-10",
      status: "Scheduled",
    },
    {
      id: 2,
      testName: "Physics Test 1",
      course: "JEE",
      subject: "Physics",
      totalMarks: 100,
      duration: 60,
      testDate: "2026-08-12",
      status: "Scheduled",
    },
    {
      id: 3,
      testName: "Biology Test 1",
      course: "NEET",
      subject: "Biology",
      totalMarks: 100,
      duration: 90,
      testDate: "2026-08-08",
      status: "Completed",
    },
  ]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    testName: "",
    course: "",
    subject: "",
    totalMarks: "",
    duration: "",
    testDate: "",
    status: "Scheduled",
  });

  // ADMIN + TEACHER ACCESS
  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role !== "Admin" && role !== "Teacher") {
      navigate("/login");
    }
  }, [navigate]);

  // SEARCH + FILTER
  const filteredTests = useMemo(() => {
    return tests.filter((test) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        test.testName.toLowerCase().includes(searchText) ||
        test.course.toLowerCase().includes(searchText) ||
        test.subject.toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === "All" ||
        test.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [tests, search, statusFilter]);

  // STATISTICS
  const totalTests = tests.length;

  const scheduledTests = tests.filter(
    (test) => test.status === "Scheduled"
  ).length;

  const completedTests = tests.filter(
    (test) => test.status === "Completed"
  ).length;

  // FORM CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // RESET FORM
  const resetForm = () => {
    setFormData({
      testName: "",
      course: "",
      subject: "",
      totalMarks: "",
      duration: "",
      testDate: "",
      status: "Scheduled",
    });

    setEditingId(null);
    setShowForm(false);
  };

  // SUBMIT
  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.testName ||
      !formData.course ||
      !formData.subject ||
      !formData.totalMarks ||
      !formData.duration ||
      !formData.testDate
    ) {
      alert("Please fill all required fields.");
      return;
    }

    if (editingId) {
      setTests((prev) =>
        prev.map((test) =>
          test.id === editingId
            ? {
                ...test,
                ...formData,
                totalMarks: Number(formData.totalMarks),
                duration: Number(formData.duration),
              }
            : test
        )
      );

      alert("Test updated successfully.");
    } else {
      const newTest = {
        id: Date.now(),
        ...formData,
        totalMarks: Number(formData.totalMarks),
        duration: Number(formData.duration),
      };

      setTests((prev) => [newTest, ...prev]);

      alert("Test created successfully.");
    }

    resetForm();
  };

  // EDIT
  const handleEdit = (test) => {
    setFormData({
      testName: test.testName,
      course: test.course,
      subject: test.subject,
      totalMarks: test.totalMarks,
      duration: test.duration,
      testDate: test.testDate,
      status: test.status,
    });

    setEditingId(test.id);
    setShowForm(true);
  };

  // DELETE
  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this test?"
    );

    if (!confirmDelete) return;

    setTests((prev) =>
      prev.filter((test) => test.id !== id)
    );
  };

  return (
    <div className="tests-page">

      {/* HEADER */}

      <div className="tests-header">

        <div>
          <div className="tests-label">
            ONLINE TESTS
          </div>

          <h1>Online Tests</h1>

          <p>
            Schedule and manage online tests for students.
          </p>
        </div>

        <button
          className="tests-back-btn"
          onClick={() => navigate("/admin")}
        >
          ← Back to Dashboard
        </button>

      </div>

      {/* STATISTICS */}

      <div className="tests-stats">

        <div className="test-stat-card blue">
          <div className="test-stat-icon">
            📝
          </div>

          <div>
            <span>Total Tests</span>
            <strong>{totalTests}</strong>
          </div>
        </div>

        <div className="test-stat-card purple">
          <div className="test-stat-icon">
            📅
          </div>

          <div>
            <span>Scheduled</span>
            <strong>{scheduledTests}</strong>
          </div>
        </div>

        <div className="test-stat-card green">
          <div className="test-stat-icon">
            ✓
          </div>

          <div>
            <span>Completed</span>
            <strong>{completedTests}</strong>
          </div>
        </div>

      </div>

      {/* MAIN CARD */}

      <div className="tests-card">

        {/* TOOLBAR */}

        <div className="tests-toolbar">

          <div className="tests-search">

            <span>🔍</span>

            <input
              type="text"
              placeholder="Search test, course or subject..."
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
            <option value="All">All Tests</option>
            <option value="Scheduled">
              Scheduled
            </option>
            <option value="Completed">
              Completed
            </option>
          </select>

          <button
            className="create-test-btn"
            onClick={() => {
              setEditingId(null);
              setShowForm(true);
            }}
          >
            + Create Test
          </button>

        </div>

        {/* FORM */}

        {showForm && (

          <div className="test-form">

            <div className="test-form-header">

              <h2>
                {editingId
                  ? "Edit Test"
                  : "Create New Test"}
              </h2>

              <button
                className="close-test-form"
                onClick={resetForm}
              >
                ×
              </button>

            </div>

            <form onSubmit={handleSubmit}>

              <div className="test-form-grid">

                <div className="test-form-group">
                  <label>Test Name *</label>

                  <input
                    type="text"
                    name="testName"
                    value={formData.testName}
                    onChange={handleChange}
                    placeholder="Example: Mathematics Test 1"
                  />
                </div>

                <div className="test-form-group">
                  <label>Course / Class *</label>

                  <input
                    type="text"
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    placeholder="Example: JEE"
                  />
                </div>

                <div className="test-form-group">
                  <label>Subject *</label>

                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Example: Mathematics"
                  />
                </div>

                <div className="test-form-group">
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

                <div className="test-form-group">
                  <label>Duration (Minutes) *</label>

                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder="60"
                    min="1"
                  />
                </div>

                <div className="test-form-group">
                  <label>Test Date *</label>

                  <input
                    type="date"
                    name="testDate"
                    value={formData.testDate}
                    onChange={handleChange}
                  />
                </div>

                <div className="test-form-group">

                  <label>Status</label>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="Scheduled">
                      Scheduled
                    </option>

                    <option value="Completed">
                      Completed
                    </option>
                  </select>

                </div>

              </div>

              <div className="test-form-buttons">

                <button
                  type="button"
                  className="cancel-test-btn"
                  onClick={resetForm}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-test-btn"
                >
                  {editingId
                    ? "Update Test"
                    : "Create Test"}
                </button>

              </div>

            </form>

          </div>

        )}

        {/* TABLE */}

        <div className="tests-table-wrapper">

          <table className="tests-table">

            <thead>

              <tr>
                <th>#</th>
                <th>Test Name</th>
                <th>Course</th>
                <th>Subject</th>
                <th>Total Marks</th>
                <th>Duration</th>
                <th>Test Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>

            </thead>

            <tbody>

              {filteredTests.length === 0 ? (

                <tr>
                  <td
                    colSpan="9"
                    className="no-tests"
                  >
                    No tests found.
                  </td>
                </tr>

              ) : (

                filteredTests.map((test, index) => (

                  <tr key={test.id}>

                    <td>{index + 1}</td>

                    <td>
                      <strong>
                        {test.testName}
                      </strong>
                    </td>

                    <td>
                      <span className="course-tag">
                        {test.course}
                      </span>
                    </td>

                    <td>
                      {test.subject}
                    </td>

                    <td>
                      {test.totalMarks}
                    </td>

                    <td>
                      {test.duration} min
                    </td>

                    <td>
                      {new Date(
                        test.testDate
                      ).toLocaleDateString("en-IN")}
                    </td>

                    <td>

                      <span
                        className={
                          test.status === "Scheduled"
                            ? "test-status scheduled"
                            : "test-status completed"
                        }
                      >
                        {test.status}
                      </span>

                    </td>

                    <td>

                      <div className="test-actions">

                        <button
                          className="test-edit-btn"
                          onClick={() =>
                            handleEdit(test)
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="test-delete-btn"
                          onClick={() =>
                            handleDelete(test.id)
                          }
                        >
                          Delete
                        </button>

                      </div>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default Tests;