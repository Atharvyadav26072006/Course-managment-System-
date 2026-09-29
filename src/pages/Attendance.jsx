import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Attendance.css";

const API_BASE_URL = "http://localhost:5000/api";

function Attendance() {
  const navigate = useNavigate();

  const [classRooms, setClassRooms] = useState([]);
  const [selectedClassRoomId, setSelectedClassRoomId] = useState("");

  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [showAddStudent, setShowAddStudent] = useState(false);
  const [newStudentEmail, setNewStudentEmail] = useState("");
  const [addingStudent, setAddingStudent] = useState(false);

  // ===== Access check =====
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "Admin" && role !== "Teacher") {
      navigate("/login");
    }
  }, [navigate]);

  // ===== Load classrooms on mount =====
  useEffect(() => {
    loadClassRooms();
  }, []);

  // ===== Load students whenever classroom or date changes =====
  useEffect(() => {
    if (selectedClassRoomId) {
      loadStudentsForAttendance();
    } else {
      setStudents([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClassRoomId, date]);

  const getToken = () => localStorage.getItem("token");

  const loadClassRooms = async () => {
    try {
      const token = getToken();
      const response = await axios.get(
        `${API_BASE_URL}/Attendance/classrooms`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setClassRooms(response.data || []);

      if (response.data && response.data.length > 0) {
        setSelectedClassRoomId(response.data[0].id);
      }
    } catch (error) {
      console.error("Error loading classrooms:", error);
    }
  };

  const loadStudentsForAttendance = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const response = await axios.get(
        `${API_BASE_URL}/Attendance/classroom/${selectedClassRoomId}`,
        {
          params: { date },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const loadedStudents = (response.data.students || []).map((s) => ({
        id: s.studentId,
        name: s.name,
        email: s.email,
        status: s.status,
      }));

      setStudents(loadedStudents);
    } catch (error) {
      console.error("Error loading students:", error);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (id, status) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === id ? { ...student, status } : student
      )
    );
  };

  const saveAttendance = async () => {
    if (!selectedClassRoomId) {
      alert("Please select a class first.");
      return;
    }

    if (students.length === 0) {
      alert("No students to save attendance for.");
      return;
    }

    setSaving(true);
    try {
      const token = getToken();

      const payload = {
        classRoomId: Number(selectedClassRoomId),
        date: date,
        records: students.map((s) => ({
          studentId: s.id,
          status: s.status,
        })),
      };

      await axios.post(`${API_BASE_URL}/Attendance/save`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Attendance saved successfully!");
    } catch (error) {
      console.error("Error saving attendance:", error);
      alert("Failed to save attendance.");
    } finally {
      setSaving(false);
    }
  };

  const addStudentToClass = async () => {
    if (!selectedClassRoomId) {
      alert("Please select a class first.");
      return;
    }

    if (!newStudentEmail.trim()) {
      alert("Please enter student email.");
      return;
    }

    setAddingStudent(true);
    try {
      const token = getToken();

      await axios.post(
        `${API_BASE_URL}/Attendance/add-student`,
        {
          classRoomId: Number(selectedClassRoomId),
          email: newStudentEmail.trim(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Student added to class successfully!");
      setNewStudentEmail("");
      setShowAddStudent(false);
      loadStudentsForAttendance();
    } catch (error) {
      const msg =
        error.response?.data?.message || "Failed to add student.";
      alert(msg);
    } finally {
      setAddingStudent(false);
    }
  };

  return (
    <div className="attendance-page">
      {/* Header */}
      <div className="attendance-header">
        <div>
          <h1>Attendance Management</h1>
          <p>Manage and track student attendance</p>
        </div>

        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>

      {/* Main Card */}
      <div className="attendance-card">
        {/* Top Section */}
        <div className="attendance-top">
          <div>
            <h2>Student Attendance</h2>
            <p>Mark attendance for the selected class and date</p>
          </div>

          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <select
              value={selectedClassRoomId}
              onChange={(e) => setSelectedClassRoomId(e.target.value)}
            >
              <option value="">Select Class</option>
              {classRooms.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.className} - {c.division} ({c.academicYear})
                </option>
              ))}
            </select>

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />

            <button
              className="save-attendance"
              onClick={() => setShowAddStudent((prev) => !prev)}
            >
              + Add Student
            </button>
          </div>
        </div>

        {showAddStudent && (
          <div
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
              padding: "16px 30px",
              background: "#f8fafc",
              borderBottom: "1px solid #e5e7eb",
            }}
          >
            <input
              type="email"
              placeholder="Student email (already registered)"
              value={newStudentEmail}
              onChange={(e) => setNewStudentEmail(e.target.value)}
              style={{
                flex: 1,
                padding: "10px 14px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
              }}
            />

            <button
              className="save-attendance"
              onClick={addStudentToClass}
              disabled={addingStudent}
            >
              {addingStudent ? "Adding..." : "Add to Class"}
            </button>

            <button
              className="back-btn"
              onClick={() => {
                setShowAddStudent(false);
                setNewStudentEmail("");
              }}
            >
              Cancel
            </button>
          </div>
        )}

        {/* Table */}
        <div className="attendance-table-wrapper">
          {loading ? (
            <p style={{ padding: "20px" }}>Loading students...</p>
          ) : students.length === 0 ? (
            <p style={{ padding: "20px" }}>
              {selectedClassRoomId
                ? "No students found for this class."
                : "Please select a class."}
            </p>
          ) : (
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Student Name</th>
                  <th>Email</th>
                  <th>Attendance</th>
                </tr>
              </thead>

              <tbody>
                {students.map((student) => (
                  <tr key={student.id}>
                    <td>{student.id}</td>
                    <td>
                      <strong>{student.name}</strong>
                    </td>
                    <td>{student.email}</td>
                    <td>
                      <div className="attendance-actions">
                        <button
                          className={
                            student.status === "Present"
                              ? "present active"
                              : "present"
                          }
                          onClick={() =>
                            handleStatusChange(student.id, "Present")
                          }
                        >
                          Present
                        </button>

                        <button
                          className={
                            student.status === "Absent"
                              ? "absent active"
                              : "absent"
                          }
                          onClick={() =>
                            handleStatusChange(student.id, "Absent")
                          }
                        >
                          Absent
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        {students.length > 0 && (
          <div className="attendance-footer">
            <div className="attendance-summary">
              <span className="present-count">
                Present:{" "}
                {students.filter((s) => s.status === "Present").length}
              </span>

              <span className="absent-count">
                Absent:{" "}
                {students.filter((s) => s.status === "Absent").length}
              </span>
            </div>

            <button
              className="save-attendance"
              onClick={saveAttendance}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Attendance"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Attendance;
