import { Routes, Route, Link } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import VerifyOTP from "./pages/VerifyOtp";
import AdvisorDashboard from "./pages/AdvisorDashboard/AdvisorDashboard";

// Admin Dashboard Components
import AdminLayout from "./pages/AdminDashboard/AdminLayout";
import Rooms from "./pages/AdminDashboard/Rooms";
import Departments from "./pages/AdminDashboard/Departments";
import Attendance from "./pages/AdminDashboard/Attendance";
import Caretakers from "./pages/AdminDashboard/Caretakers";
import Advisors from "./pages/AdminDashboard/Advisors";
import Placements from "./pages/AdminDashboard/Placements";
import Students from "./pages/AdminDashboard/Students";
import PlacementAttendance from "./pages/AdminDashboard/PlacementAttendance";
import Overview from "./pages/AdminDashboard/Overview";
import PassManagement from "./pages/AdminDashboard/PassManagement";
import UserAccounts from "./pages/AdminDashboard/UserAccounts";
import AdminProfile from "./pages/AdminDashboard/AdminProfile";
import StudentDashboard from "./pages/StudentDashboard/StudentDashboard";

// Caretaker Dashboard Components
import CaretakerLayout from "./pages/CaretakerDashboard/CaretakerLayout";
import CaretakerOverview from "./pages/CaretakerDashboard/CaretakerOverview";
import CaretakerStudents from "./pages/CaretakerDashboard/CaretakerStudents";
import CaretakerPasses from "./pages/CaretakerDashboard/CaretakerPasses";
import CaretakerAttendance from "./pages/CaretakerDashboard/CaretakerAttendance";
import CaretakerPlacementAttendance from "./pages/CaretakerDashboard/CaretakerPlacementAttendance";
import CaretakerProfile from "./pages/CaretakerDashboard/CaretakerProfile";

export default function App() {
  return (
    <div style={{ margin: 0, padding: 0, minHeight: '100vh', width: '100%' }}>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />

        {/* Student Dashboard Route */}
        <Route path="/student-dashboard" element={<StudentDashboard />} />

        {/* Advisor Dashboard Route */}
        <Route path="/advisor-dashboard" element={<AdvisorDashboard />} />

        {/* Admin Dashboard Routes */}
        <Route path="/admin-dashboard" element={<AdminLayout />}>
          <Route index element={<Overview />} />
          <Route path="rooms" element={<Rooms />} />
          <Route path="departments" element={<Departments />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="caretakers" element={<Caretakers />} />
          <Route path="advisors" element={<Advisors />} />
          <Route path="placements" element={<Placements />} />
          <Route path="students" element={<Students />} />
          <Route path="placement-attendance" element={<PlacementAttendance />} />
          <Route path="passes" element={<PassManagement />} />
          <Route path="accounts" element={<UserAccounts />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>

        {/* Caretaker Dashboard Routes */}
        <Route path="/caretaker-dashboard" element={<CaretakerLayout />}>
          <Route index element={<CaretakerOverview />} />
          <Route path="students" element={<CaretakerStudents />} />
          <Route path="passes" element={<CaretakerPasses />} />
          <Route path="attendance" element={<CaretakerAttendance />} />
          <Route path="placement-attendance" element={<CaretakerPlacementAttendance />} />
          <Route path="profile" element={<CaretakerProfile />} />
        </Route>

      </Routes>
    </div>
  );
}
