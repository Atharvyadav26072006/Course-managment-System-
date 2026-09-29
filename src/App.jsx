import Results from "./pages/Results";
import Tests from "./pages/Tests";
import Marks from "./pages/Marks";
import Attendance from "./pages/Attendance";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";

import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";

import Users from "./pages/Users";
import EditUser from "./pages/EditUser";
import Teachers from "./pages/Teachers";
import Classes from "./pages/Classes";
import Buyers from "./pages/Buyers";

import MyCourses from "./pages/MyCourse";
import CourseDetails from "./pages/CourseDetails";
import Payment from "./pages/Payment";
import CourseContent from "./pages/CourseContent";


function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* ================= PUBLIC ROUTES ================= */}

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/login"
          element={<Login />}
        />


        {/* ================= ADMIN ROUTES ================= */}

        <Route
          path="/admin"
          element={<AdminDashboard />}
        />

        <Route
          path="/admin/results"
          element={<Results />}
        />

        <Route
          path="/admin/tests"
          element={<Tests />}
        />

        <Route
          path="/admin/marks"
          element={<Marks />}
        />

        <Route
          path="/admin/attendance"
          element={<Attendance />}
        />

        <Route
          path="/admin/users"
          element={<Users />}
        />

        <Route
          path="/admin/users/edit/:id"
          element={<EditUser />}
        />

        <Route
          path="/admin/teachers"
          element={<Teachers />}
        />

        <Route
          path="/admin/classes"
          element={<Classes />}
        />

        {/* Admin Course Buyers */}

        <Route
          path="/admin/buyers/:id"
          element={<Buyers />}
        />


        {/* ================= USER ROUTES ================= */}

        <Route
          path="/user"
          element={<UserDashboard />}
        />

        <Route
          path="/user/my-courses"
          element={<MyCourses />}
        />

        {/* Course Details */}

        <Route
          path="/user/course/:id"
          element={<CourseDetails />}
        />


        {/* ================= PAYMENT ================= */}

        <Route
          path="/payment/:id"
          element={<Payment />}
        />


        {/* ================= COURSE CONTENT ================= */}

        <Route
          path="/user/course-content/:id"
          element={<CourseContent />}
        />

      </Routes>

    </BrowserRouter>

  );

}

export default App;