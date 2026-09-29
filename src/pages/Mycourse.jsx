import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../Services/api";

function MyCourses() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadMyCourses = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/Course/mycourses`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Unable to load courses.");
          return;
        }

        setCourses(data);
      } catch (error) {
        console.error(error);
        setError("Backend connection failed.");
      } finally {
        setLoading(false);
      }
    };

    loadMyCourses();
  }, [navigate]);

  if (loading) {
    return <h2>Loading courses...</h2>;
  }

  return (
    <div style={{ padding: "30px" }}>
      <button
        type="button"
        onClick={() => navigate("/user")}
      >
        Back
      </button>

      <h1>My Courses</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!error && courses.length === 0 && (
        <p>No approved courses found.</p>
      )}

      {courses.map((course) => (
        <div
          key={course.enrollmentId}
          style={{
            border: "1px solid #ccc",
            padding: "20px",
            marginBottom: "15px",
            borderRadius: "8px",
          }}
        >
          <h2>{course.courseName}</h2>

          <p>{course.description}</p>

          <p>
            <strong>Amount:</strong> ₹{course.amount}
          </p>

          <p>
            <strong>Duration:</strong> {course.duration}
          </p>

          <p>
            <strong>Class Type:</strong> {course.classType}
          </p>

          <p>
            <strong>Status:</strong> {course.enrollmentStatus}
          </p>
        </div>
      ))}
    </div>
  );
}

export default MyCourses;