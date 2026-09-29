import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaUserShield,
  FaChalkboardTeacher,
  FaSchool,
  FaClipboardCheck,
  FaFileAlt,
  FaLaptopCode,
  FaChartLine,
  FaSignOutAlt,
  FaHome,
  FaArrowRight,
  FaBell,
} from "react-icons/fa";

import API_BASE_URL from "../Services/api";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState({
    totalUsers: 0,
    totalNormalUsers: 0,
    totalAdmins: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "Admin") {
      navigate("/login");
      return;
    }

    loadDashboard(token);
  }, [navigate]);

  const loadDashboard = async (token) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/Admin/dashboard`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401 || response.status === 403) {
        localStorage.clear();
        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error("Dashboard data could not be loaded.");
      }

      const data = await response.json();

      setDashboard({
        totalUsers: data.totalUsers ?? 0,
        totalNormalUsers: data.totalNormalUsers ?? 0,
        totalAdmins: data.totalAdmins ?? 0,
      });
    } catch (err) {
      console.error(err);
      setError("Dashboard data could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const managementItems = [
    {
      title: "Registered Users",
      description: "View, update and delete registered users.",
      icon: <FaUsers />,
      path: "/admin/users",
      className: "blue",
    },
    {
      title: "Teachers",
      description: "Create teachers and manage their details.",
      icon: <FaChalkboardTeacher />,
      path: "/admin/teachers",
      className: "violet",
    },
    {
      title: "Classes",
      description: "Create classes and manage class information.",
      icon: <FaSchool />,
      path: "/admin/classes",
      className: "orange",
    },
    {
      title: "Attendance",
      description: "View and manage student attendance.",
      icon: <FaClipboardCheck />,
      path: "/admin/attendance",
      className: "green",
    },
    {
      title: "Test Marks",
      description: "Manage marks and student performance.",
      icon: <FaFileAlt />,
      path: "/admin/marks",
      className: "yellow",
    },
    {
      title: "Online Tests",
      description: "Schedule and manage online tests.",
      icon: <FaLaptopCode />,
      path: "/admin/tests",
      className: "pink",
    },
    {
      title: "Test Results",
      description: "View student results and reports.",
      icon: <FaChartLine />,
      path: "/admin/results",
      className: "cyan",
    },
  ];

  return (
    <div className="admin-dashboard-layout">
      <aside className="admin-sidebar">
        <div className="sidebar-logo">
          <div className="logo-box">
            <FaSchool />
          </div>

          <div>
            <h2>EduFlow</h2>
            <p>Management System</p>
          </div>
        </div>

        <div className="sidebar-section-title">MAIN MENU</div>

        <nav className="sidebar-navigation">
          <Link to="/admin" className="sidebar-item active">
            <FaHome />
            <span>Dashboard</span>
          </Link>

          <Link to="/admin/users" className="sidebar-item">
            <FaUsers />
            <span>Users</span>
          </Link>

          <Link to="/admin/teachers" className="sidebar-item">
            <FaChalkboardTeacher />
            <span>Teachers</span>
          </Link>

          <Link to="/admin/classes" className="sidebar-item">
            <FaSchool />
            <span>Classes</span>
          </Link>

          <Link to="/admin/attendance" className="sidebar-item">
            <FaClipboardCheck />
            <span>Attendance</span>
          </Link>

          <Link to="/admin/tests" className="sidebar-item">
            <FaLaptopCode />
            <span>Online Tests</span>
          </Link>

          <Link to="/admin/results" className="sidebar-item">
            <FaChartLine />
            <span>Results</span>
          </Link>
        </nav>

        <div className="sidebar-bottom">
          <button className="logout-button" onClick={logout}>
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="admin-content">
        <header className="admin-header">
          <div>
            <p className="page-label">ADMIN PANEL</p>
            <h1>Dashboard Overview</h1>
            <p className="page-description">
              Manage users, classes, teachers and online tests.
            </p>
          </div>

          <div className="header-actions">
            <button className="notification-button">
              <FaBell />
              <span className="notification-dot"></span>
            </button>

            <div className="admin-profile">
              <div className="admin-avatar">A</div>

              <div>
                <strong>Administrator</strong>
                <span>Super Admin</span>
              </div>
            </div>
          </div>
        </header>

        <section className="hero-banner">
          <div className="hero-content">
            <span className="hero-badge">STUDENT MANAGEMENT</span>

            <h2>Everything you need to manage your institute.</h2>

            <p>
              Control registered users, classes, attendance,
              online tests, marks and results from one dashboard.
            </p>

            <Link to="/admin/users" className="hero-button">
              Manage Users
              <FaArrowRight />
            </Link>
          </div>

          <div className="hero-decoration">
            <FaSchool />
          </div>
        </section>

        {error && <div className="dashboard-alert">{error}</div>}

        {loading ? (
          <div className="dashboard-loader">
            Loading dashboard...
          </div>
        ) : (
          <section className="statistics-grid">
            <div className="statistics-card users-card">
              <div className="statistics-icon">
                <FaUsers />
              </div>

              <div>
                <p>Total Accounts</p>
                <h3>{dashboard.totalUsers}</h3>
                <span>All registered accounts</span>
              </div>
            </div>

            

            <div className="statistics-card admin-card">
              <div className="statistics-icon">
                <FaUserShield />
              </div>
          
              <div>
                <p>Administrators</p>
                <h3>{dashboard.totalAdmins}</h3>
                <span>Authorized administrators</span>
              </div>
            </div>
          </section>
        )}

        <section className="quick-actions-section">
          <div className="section-header">
            <div>
              <p>QUICK ACCESS</p>
              <h2>Management Modules</h2>
            </div>

            <span>
              Select a module to continue
            </span>
          </div>

          <div className="management-cards-grid">
            {managementItems.map((item) => (
              <Link
                key={item.title}
                to={item.path}
                className="management-module-card"
              >
                <div
                  className={`module-icon ${item.className}`}
                >
                  {item.icon}
                </div>

                <div className="module-details">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>

                <div className="module-arrow">
                  <FaArrowRight />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;