import API_BASE_URL from "../Services/api";
import { useNavigate } from "react-router-dom";
import {
  FaBookOpen,
  FaCheckCircle,
  FaClock,
  FaGraduationCap,
  FaHome,
  FaRupeeSign,
  FaShoppingCart,
  FaSignOutAlt,
  FaTimesCircle,
  FaUserGraduate,
} from "react-icons/fa";

import "./UserDashboard.css";

function UserDashboard() {
  const navigate = useNavigate();

  const userName = localStorage.getItem("name") || "Student";

  const courses = [
    {
      id: 1,
      courseName: "JEE",
      amount: 75000,
      duration: "2 Years",
      classType: "Offline",
      description:
        "Complete JEE preparation with expert faculty, tests and study material.",
      isActive: true,
    },
    {
      id: 2,
      courseName: "NEET",
      amount: 80000,
      duration: "2 Years",
      classType: "Offline",
      description:
        "Professional NEET preparation for Physics, Chemistry and Biology.",
      isActive: true,
    },
    {
      id: 3,
      courseName: "MHT-CET",
      amount: 40000,
      duration: "1 Year",
      classType: "Hybrid",
      description:
        "Complete MHT-CET preparation with online and offline lectures.",
      isActive: true,
    },
    {
      id: 4,
      courseName: "NDA",
      amount: 35000,
      duration: "6 Months",
      classType: "Online",
      description:
        "NDA entrance preparation with tests and personal guidance.",
      isActive: false,
    },
  ];

  const activeCourses = courses.filter(
    (course) => course.isActive
  );

  const inactiveCourses = courses.filter(
    (course) => !course.isActive
  );

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleBuyCourse = (course) =>navigate(`/user/course/${course.id}`, {
    state: {
        courseName: course.courseName
    }
});

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="user-dashboard-layout">
      <aside className="user-sidebar">
        <div className="user-logo">
          <div className="user-logo-icon">
            <FaGraduationCap />
          </div>

          <div>
            <h2>EduFlow</h2>
            <p>Student Portal</p>
          </div>
        </div>

        <nav className="user-navigation">
          <button
            type="button"
            className="user-nav-item active"
            onClick={() => navigate("/user")}
          >
            <FaHome />
            Dashboard
          </button>

          <button
            type="button"
            className="user-nav-item"
            onClick={() => navigate("/user/courses")}
          >
            <FaBookOpen />
            All Courses
          </button>

          <button
            type="button"
            className="user-nav-item"
            onClick={() => navigate("/user/my-courses")}
          >
            <FaUserGraduate />
            My Courses
          </button>
        </nav>

        <button
          type="button"
          className="user-logout-button"
          onClick={logout}
        >
          <FaSignOutAlt />
          Logout
        </button>
      </aside>

      <main className="user-dashboard-content">
        <header className="user-dashboard-header">
          <div>
            <p className="user-page-label">STUDENT DASHBOARD</p>
            <h1>Welcome, {userName}</h1>  
            <p>
              Explore courses and start your learning journey.
            </p>
          </div>

          <div className="user-profile">
            <div className="user-avatar">
              {userName.charAt(0).toUpperCase()}
            </div>

            <div>
              <strong>{userName}</strong>
              <span>Student</span>
            </div>
          </div>
        </header>

        <section className="user-hero-section">
          <div>
            <span className="user-hero-badge">
              LEARN AND GROW
            </span>

            <h2>Find the right course for your future.</h2>

            <p>
              View available JEE, NEET, MHT-CET and other
              professional courses.
            </p>

            <button
              type="button"
              onClick={() => navigate("/user/courses")}
            >
              Explore Courses
              <FaBookOpen />
            </button>
          </div>

          <div className="user-hero-icon">
            <FaGraduationCap />
          </div>
        </section>

        <section className="user-dashboard-statistics">
          <div className="user-stat-card">
            <div className="user-stat-icon total">
              <FaBookOpen />
            </div>

            <div>
              <span>Total Courses</span>
              <strong>{courses.length}</strong>
            </div>
          </div>

          <div className="user-stat-card">
            <div className="user-stat-icon active">
              <FaCheckCircle />
            </div>

            <div>
              <span>Active Courses</span>
              <strong>{activeCourses.length}</strong>
            </div>
          </div>

          <div className="user-stat-card">
            <div className="user-stat-icon inactive">
              <FaTimesCircle />
            </div>

            <div>
              <span>Inactive Courses</span>
              <strong>{inactiveCourses.length}</strong>
            </div>
          </div>
        </section>

        <section className="available-courses-section">
          <div className="user-section-heading">
            <div>
              <p>AVAILABLE PROGRAMS</p>
              <h2>Explore Our Courses</h2>
            </div>

            <button
              type="button"
              onClick={() => navigate("/user/courses")}
            >
              View All Courses
            </button>
          </div>

          <div className="user-courses-grid">
            {courses.map((course) => (
              <article
                className={`user-course-card ${
                  !course.isActive ? "course-disabled" : ""
                }`}
                key={course.id}
              >
                <div className="user-course-card-header">
                  <div className="user-course-logo">
                    {course.courseName.charAt(0)}
                  </div>

                  <span
                    className={
                      course.isActive
                        ? "user-course-status active"
                        : "user-course-status inactive"
                    }
                  >
                    {course.isActive ? (
                      <>
                        <FaCheckCircle />
                        Active
                      </>
                    ) : (
                      <>
                        <FaTimesCircle />
                        Inactive
                      </>
                    )}
                  </span>
                </div>

                <h3>{course.courseName}</h3>

                <p className="user-course-description">
                  {course.description}
                </p>

                <div className="user-course-information">
                  <span>
                    <FaRupeeSign />
                    {formatAmount(course.amount)}
                  </span>

                  <span>
                    <FaClock />
                    {course.duration}
                  </span>

                  <span>
                    <FaBookOpen />
                    {course.classType}
                  </span>
                </div>

                <button
                  type="button"
                  className="user-buy-course-button"
                  disabled={!course.isActive}
                  onClick={() => handleBuyCourse(course)}
                >
                  <FaShoppingCart />

                  {course.isActive
                    ? "Buy Course"
                    : "Currently Unavailable"}
                </button>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default UserDashboard;