import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Results.css";

function Results() {
  const navigate = useNavigate();

  const [results] = useState([
    {
      id: 1,
      studentName: "Rahul Patil",
      email: "rahul@gmail.com",
      course: "JEE",
      tests: 5,
      totalMarks: 500,
      obtainedMarks: 425,
      percentage: 85,
      grade: "A",
      status: "Pass",
    },
    {
      id: 2,
      studentName: "Amit Sharma",
      email: "amit@gmail.com",
      course: "NEET",
      tests: 5,
      totalMarks: 500,
      obtainedMarks: 360,
      percentage: 72,
      grade: "B",
      status: "Pass",
    },
    {
      id: 3,
      studentName: "Sneha More",
      email: "sneha@gmail.com",
      course: "JEE",
      tests: 6,
      totalMarks: 600,
      obtainedMarks: 546,
      percentage: 91,
      grade: "A+",
      status: "Pass",
    },
    {
      id: 4,
      studentName: "Rohit Kumar",
      email: "rohit@gmail.com",
      course: "MHT-CET",
      tests: 4,
      totalMarks: 400,
      obtainedMarks: 156,
      percentage: 39,
      grade: "F",
      status: "Fail",
    },
    {
      id: 5,
      studentName: "Priya Singh",
      email: "priya@gmail.com",
      course: "JEE",
      tests: 5,
      totalMarks: 500,
      obtainedMarks: 335,
      percentage: 67,
      grade: "C",
      status: "Pass",
    },
    {
      id: 6,
      studentName: "Akash Joshi",
      email: "akash@gmail.com",
      course: "NEET",
      tests: 6,
      totalMarks: 600,
      obtainedMarks: 498,
      percentage: 83,
      grade: "A",
      status: "Pass",
    },
  ]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [courseFilter, setCourseFilter] = useState("All");

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
  // FILTER RESULTS
  // ------------------------------------------------

  const filteredResults = useMemo(() => {
    return results.filter((result) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        result.studentName
          .toLowerCase()
          .includes(searchText) ||
        result.email
          .toLowerCase()
          .includes(searchText) ||
        result.course
          .toLowerCase()
          .includes(searchText);

      const matchesStatus =
        statusFilter === "All" ||
        result.status === statusFilter;

      const matchesCourse =
        courseFilter === "All" ||
        result.course === courseFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCourse
      );
    });
  }, [
    results,
    search,
    statusFilter,
    courseFilter,
  ]);

  // ------------------------------------------------
  // STATISTICS
  // ------------------------------------------------

  const totalStudents = results.length;

  const passedStudents = results.filter(
    (result) => result.status === "Pass"
  ).length;

  const failedStudents = results.filter(
    (result) => result.status === "Fail"
  ).length;

  const averagePercentage =
    results.length > 0
      ? (
          results.reduce(
            (sum, result) =>
              sum + result.percentage,
            0
          ) / results.length
        ).toFixed(1)
      : 0;

  // ------------------------------------------------
  // TOPPER
  // ------------------------------------------------

  const topper = [...results].sort(
    (a, b) => b.percentage - a.percentage
  )[0];

  // ------------------------------------------------
  // EXPORT REPORT
  // ------------------------------------------------

  const handleExport = () => {
    let csv =
      "Student Name,Email,Course,Tests,Total Marks,Obtained Marks,Percentage,Grade,Status\n";

    filteredResults.forEach((result) => {
      csv += `${result.studentName},${result.email},${result.course},${result.tests},${result.totalMarks},${result.obtainedMarks},${result.percentage}%,${result.grade},${result.status}\n`;
    });

    const blob = new Blob([csv], {
      type: "text/csv",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "student-results.csv";

    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="results-page">

      {/* HEADER */}

      <div className="results-header">

        <div>
          <div className="results-label">
            TEST RESULTS
          </div>

          <h1>Student Results</h1>

          <p>
            View student performance, results and reports.
          </p>
        </div>

        <button
          className="results-back-btn"
          onClick={() => navigate("/admin")}
        >
          ← Back to Dashboard
        </button>

      </div>

      {/* STATISTICS */}

      <div className="results-stats">

        <div className="result-stat-card blue">

          <div className="result-stat-icon">
            👨‍🎓
          </div>

          <div>
            <span>Total Students</span>
            <strong>{totalStudents}</strong>
          </div>

        </div>

        <div className="result-stat-card green">

          <div className="result-stat-icon">
            ✓
          </div>

          <div>
            <span>Passed</span>
            <strong>{passedStudents}</strong>
          </div>

        </div>

        <div className="result-stat-card red">

          <div className="result-stat-icon">
            ✕
          </div>

          <div>
            <span>Failed</span>
            <strong>{failedStudents}</strong>
          </div>

        </div>

        <div className="result-stat-card purple">

          <div className="result-stat-icon">
            %
          </div>

          <div>
            <span>Average Score</span>
            <strong>{averagePercentage}%</strong>
          </div>

        </div>

      </div>

      {/* TOPPER CARD */}

      {topper && (
        <div className="topper-card">

          <div className="topper-icon">
            🏆
          </div>

          <div className="topper-info">
            <span>TOP PERFORMER</span>

            <h2>{topper.studentName}</h2>

            <p>
              {topper.course} • {topper.tests} Tests
            </p>
          </div>

          <div className="topper-score">
            <strong>{topper.percentage}%</strong>
            <span>{topper.grade} Grade</span>
          </div>

        </div>
      )}

      {/* MAIN CARD */}

      <div className="results-card">

        {/* TOOLBAR */}

        <div className="results-toolbar">

          <div className="results-search">

            <span>🔍</span>

            <input
              type="text"
              placeholder="Search student or course..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

          <select
            value={courseFilter}
            onChange={(e) =>
              setCourseFilter(e.target.value)
            }
          >
            <option value="All">
              All Courses
            </option>

            <option value="JEE">
              JEE
            </option>

            <option value="NEET">
              NEET
            </option>

            <option value="MHT-CET">
              MHT-CET
            </option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
          >
            <option value="All">
              All Results
            </option>

            <option value="Pass">
              Passed
            </option>

            <option value="Fail">
              Failed
            </option>
          </select>

          <button
            className="export-btn"
            onClick={handleExport}
          >
            ↓ Export Report
          </button>

        </div>

        {/* TABLE */}

        <div className="results-table-wrapper">

          <table className="results-table">

            <thead>

              <tr>
                <th>#</th>
                <th>Student</th>
                <th>Course</th>
                <th>Tests</th>
                <th>Total Marks</th>
                <th>Obtained</th>
                <th>Percentage</th>
                <th>Grade</th>
                <th>Status</th>
              </tr>

            </thead>

            <tbody>

              {filteredResults.length === 0 ? (

                <tr>

                  <td
                    colSpan="9"
                    className="no-results"
                  >
                    No student results found.
                  </td>

                </tr>

              ) : (

                filteredResults.map(
                  (result, index) => (

                    <tr key={result.id}>

                      <td>{index + 1}</td>

                      <td>

                        <div className="result-student">

                          <div className="result-avatar">
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

                        <span className="result-course">
                          {result.course}
                        </span>

                      </td>

                      <td>
                        {result.tests}
                      </td>

                      <td>
                        {result.totalMarks}
                      </td>

                      <td>

                        <strong>
                          {result.obtainedMarks}
                        </strong>

                      </td>

                      <td>

                        <div className="percentage-wrapper">

                          <div className="percentage-bar">

                            <div
                              className="percentage-fill"
                              style={{
                                width: `${result.percentage}%`,
                              }}
                            />

                          </div>

                          <span>
                            {result.percentage}%
                          </span>

                        </div>

                      </td>

                      <td>

                        <span
                          className={`result-grade grade-${result.grade
                            .replace("+", "plus")
                            .toLowerCase()}`}
                        >
                          {result.grade}
                        </span>

                      </td>

                      <td>

                        <span
                          className={
                            result.status === "Pass"
                              ? "result-pass"
                              : "result-fail"
                          }
                        >
                          {result.status}
                        </span>

                      </td>

                    </tr>

                  )
                )

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default Results;