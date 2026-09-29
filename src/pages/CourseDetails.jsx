import axios from "axios";
import API_BASE_URL from "../Services/api";

import "./CourseDetails.css";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  FaArrowLeft,
  FaBook,
  FaClock,
  FaUserGraduate,
  FaPlayCircle,
  FaCheckCircle,
  FaGraduationCap,
  FaMoneyBillWave,
} from "react-icons/fa";


function CourseDetails() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // ==========================================
  // FETCH SELECTED COURSE
  // ==========================================

  useEffect(() => {

    const fetchCourse = async () => {

      try {

        console.log("Course ID from URL:", id);

        setLoading(true);
        setError("");

        const response = await axios.get(
          `${API_BASE_URL}/Course/${id}`
        );

        console.log("Course Response:", response.data);

        setCourse(response.data);

      } catch (error) {

        console.error(
          "Error fetching course:",
          error
        );

        console.error(
          "Backend Error:",
          error.response?.data
        );

        setError(
          error.response?.data?.message ||
          "Unable to load course details."
        );

      } finally {

        setLoading(false);

      }

    };


    if (id) {

      fetchCourse();

    } else {

      setLoading(false);
      setError("Course ID is missing.");

    }

  }, [id]);


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <div className="course-page">

        <div className="course-loading">

          <h2>
            Loading Course Details...
          </h2>

          <p>
            Please wait...
          </p>

        </div>

      </div>

    );

  }


  // ==========================================
  // ERROR
  // ==========================================

  if (error || !course) {

    return (

      <div className="course-page">

        <div className="course-error">

          <h2>
            Course Not Found
          </h2>

          <p>
            {error || "Unable to load this course."}
          </p>

          <button
            className="back-button"
            onClick={() => navigate("/user")}
          >

            <FaArrowLeft />

            Back to Courses

          </button>

        </div>

      </div>

    );

  }


  // ==========================================
  // DYNAMIC COURSE DATA
  // ==========================================

  const courseName =
    course.courseName || "Course";


  const description =
    course.description ||
    `Learn ${courseName} with complete concepts, practice and expert guidance.`;


  const duration =
    course.duration || "Not Specified";


  const classType =
    course.classType || "Professional Course";


  const amount =
    Number(course.amount || 0);


  const formattedPrice =
    amount.toLocaleString("en-IN");


  // ==========================================
  // COURSE TOPICS
  // ==========================================

  const topics = [

    "Complete Course Concepts",
    "Important Topics",
    "Problem Solving",
    "Practice Questions",
    "Mock Tests",
    "Expert Guidance",

  ];


  // ==========================================
  // POPULAR COURSES GRAPH DATA
  // ==========================================

  const courseStats = [

    {
      name: "JEE",
      students: 95,
    },

    {
      name: "NEET",
      students: 82,
    },

    {
      name: "MHT-CET",
      students: 68,
    },

    {
      name: "NDA",
      students: 42,
    },

  ];


  // ==========================================
  // RETURN UI
  // ==========================================

  return (

    <div className="course-page">


      {/* =====================================
          TOP NAVBAR
      ====================================== */}

      <div className="course-top">

        <button
          className="back-button"
          onClick={() => navigate("/user")}
        >

          <FaArrowLeft />

          Back

        </button>


        <h1>
          Course Details
        </h1>

      </div>



      {/* =====================================
          MAIN COURSE CARD
      ====================================== */}

      <div className="course-main-card">


        {/* LEFT SIDE */}

        <div className="course-left">

          <span className="badge">

            <FaGraduationCap />

            {classType}

          </span>


          <h2>
            {courseName}
          </h2>


          <p>
            {description}
          </p>


          {/* COURSE INFORMATION */}

          <div className="info">

            <div>

              <FaUserGraduate />

              <span>
                Students
              </span>

            </div>


            <div>

              <FaClock />

              <span>
                {duration}
              </span>

            </div>


            <div>

              <FaBook />

              <span>
                Complete Course
              </span>

            </div>

          </div>


          {/* CONTINUE LEARNING */}

          <button
            className="learn-btn"
            onClick={() => {

              alert(
                "Course learning will be available after enrollment approval."
              );

            }}
          >

            <FaPlayCircle />

            Continue Learning

          </button>

        </div>



        {/* =====================================
            PRICE BOX
        ====================================== */}

        <div className="price-box">

          <FaMoneyBillWave
            className="price-icon"
          />


          <h2>
            ₹{formattedPrice}
          </h2>


          <p>
            One Time Payment
          </p>


          <button
            onClick={() =>
              navigate(`/payment/${course.id}`)
            }
          >

            Enroll Now

          </button>

        </div>

      </div>



      {/* =====================================
          COURSE INFORMATION
      ====================================== */}

      <div className="section">

        <h2>
          Course Information
        </h2>


        <div className="instructor-card">

          <div className="avatar">

            <FaGraduationCap />

          </div>


          <div>

            <h3>
              {courseName}
            </h3>


            <p>

              {classType}

              {" | "}

              Duration: {duration}

            </p>

          </div>

        </div>

      </div>



      {/* =====================================
          CURRICULUM
      ====================================== */}

      <div className="section">

        <h2>
          Course Curriculum
        </h2>


        <div className="topics">

          {topics.map(
            (topic, index) => (

              <div
                className="topic"
                key={index}
              >

                <FaCheckCircle />

                <span>
                  {topic}
                </span>

              </div>

            )
          )}

        </div>

      </div>



      {/* =====================================
          POPULAR COURSES GRAPH
      ====================================== */}

      <div className="section course-analytics">

        <div className="analytics-header">

          <span className="analytics-label">
            COURSE ANALYTICS
          </span>

          <h2>
            Most Popular Courses
          </h2>

          <p>
            Student interest across available courses
          </p>

        </div>


        <div className="analytics-chart">

          <ResponsiveContainer
            width="100%"
            height={320}
          >

            <BarChart
              data={courseStats}
              layout="vertical"
              margin={{
                top: 10,
                right: 30,
                left: 20,
                bottom: 10,
              }}
            >

              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={false}
              />


              <XAxis
                type="number"
                domain={[0, 100]}
              />


              <YAxis
                type="category"
                dataKey="name"
                width={90}
              />


              <Tooltip />


              <Bar
                dataKey="students"
                name="Students"
                fill="#4f46e5"
                radius={[0, 8, 8, 0]}
                barSize={35}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>


    </div>

  );

}


export default CourseDetails;