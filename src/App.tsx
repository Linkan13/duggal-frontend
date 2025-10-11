import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Navigate } from "react-router-dom";

import GlobalLoader from "@/components/common/GlobalLoader";
import { ScrollToTop } from "./components/common/ScrollToTop";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import PublicRoute from "./components/auth/PublicRoute";
import AppLayout from "./layout/AppLayout";

// Public Pages
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import SignUpAdmin from "./pages/AuthPages/SignUpAdmin";
import NotFound from "./pages/OtherPage/NotFound";

// Dashboard & Layout Pages
import Home from "./pages/Dashboard/Home";
import LeadDashboard from "./pages/Dashboard/LeadDashboard";
import AttendanceDashboard from "./pages/Dashboard/AttendanceDashboard";
import PaymentDashboard from "./pages/Dashboard/PaymentDashboard";
import UserProfiles from "./pages/UserProfiles";
import Calendar from "./pages/Calendar";
import Blank from "./pages/Blank";

// Forms & Tables
import StudentAttendance from "./pages/Forms/StudentAttendance";
import BasicTables from "./pages/Tables/BasicTables";

// UI Elements
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";

// Charts
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";

// Rooms
import { RoomList, AddRoomForm, RoomDetails, EditRoomForm } from "./pages/Room";
// Roles
import { RolesList, AddRolesForm, EditRolesForm } from "./pages/Roles";
// Batches
import {
  BatchList,
  AddBatchForm,
  BatchDetails,
  EditBatchForm,
} from "./pages/Batch";
// Offers
import {
  OfferList,
  AddOfferForm,
  OfferDetails,
  EditOfferForm,
} from "./pages/Offer";
// Courses
import {
  CourseList,
  AddCourseForm,
  CourseDetails,
  EditCourseForm,
} from "./pages/Course";
// Students
import {
  StudentList,
  AddStudentForm,
  StudentDetails,
  EditStudentForm,
} from "./pages/Student";
// Leads
import {
  LeadList,
  AddLeadForm,
  LeadDetails,
  EditLeadForm,
} from "./pages/Leads";
// Staff
import {
  StaffList,
  AddStaffForm,
  StaffDetails,
  EditStaffForm,
} from "./pages/Staff";

export default function App() {
  return (
    <>
      <GlobalLoader />
      <Router>
        <ScrollToTop />
        <Routes>
          <Route
            path="/"
            element={
              localStorage.getItem("token") ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/signin" replace />
              )
            }
          />
          {/* Public Routes */}
          <Route
            path="/signin"
            element={
              <PublicRoute>
                <SignIn />
              </PublicRoute>
            }
          />

          <Route
            path="/signup"
            element={
              <PublicRoute>
                <SignUp />
              </PublicRoute>
            }
          />

          <Route
            path="/signup-admin"
            element={
              <PublicRoute>
                <SignUpAdmin />
              </PublicRoute>
            }
          />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              {/* Dashboard */}
              <Route path="/dashboard" element={<Home />} />
              <Route path="/lead-dashboard" element={<LeadDashboard />} />
              <Route
                path="/attendance-dashboard"
                element={<AttendanceDashboard />}
              />
              <Route path="/payment-dashboard" element={<PaymentDashboard />} />

              {/* Profile & Pages */}
              <Route path="/profile" element={<UserProfiles />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/blank" element={<Blank />} />
              <Route
                path="/student-attendance"
                element={<StudentAttendance />}
              />

              {/* Rooms */}
              <Route path="/rooms">
                <Route index element={<RoomList />} />
                <Route path="create" element={<AddRoomForm />} />
                <Route path="view/:id" element={<RoomDetails />} />
                <Route path="edit/:id" element={<EditRoomForm />} />
              </Route>

              {/* Roles */}
              <Route path="/roles">
                <Route index element={<RolesList />} />
                <Route path="create" element={<AddRolesForm />} />
                <Route path="edit/:id" element={<EditRolesForm />} />
              </Route>

              {/* Batches */}
              <Route path="/batches">
                <Route index element={<BatchList />} />
                <Route path="create" element={<AddBatchForm />} />
                <Route path="view/:id" element={<BatchDetails />} />
                <Route path="edit/:id" element={<EditBatchForm />} />
              </Route>

              {/* Offers */}
              <Route path="/offers">
                <Route index element={<OfferList />} />
                <Route path="create" element={<AddOfferForm />} />
                <Route path="view/:id" element={<OfferDetails />} />
                <Route path="edit/:id" element={<EditOfferForm />} />
              </Route>

              {/* Staff */}
              <Route path="/staff">
                <Route index element={<StaffList />} />
                <Route path="create" element={<AddStaffForm />} />
                <Route path="view/:id" element={<StaffDetails />} />
                <Route path="edit/:id" element={<EditStaffForm />} />
              </Route>

              {/* Leads */}
              <Route path="/leads">
                <Route index element={<LeadList />} />
                <Route path="create" element={<AddLeadForm />} />
                <Route path="view/:id" element={<LeadDetails />} />
                <Route path="edit/:id" element={<EditLeadForm />} />
              </Route>

              {/* Students */}
              <Route path="/student">
                <Route index element={<StudentList />} />
                <Route path="create" element={<AddStudentForm />} />
                <Route path="view/:id" element={<StudentDetails />} />
                <Route path="edit/:id" element={<EditStudentForm />} />
              </Route>

              {/* Courses */}
              <Route path="/course">
                <Route index element={<CourseList />} />
                <Route path="create" element={<AddCourseForm />} />
                <Route path="view/:id" element={<CourseDetails />} />
                <Route path="edit/:id" element={<EditCourseForm />} />
              </Route>

              {/* UI Elements */}
              <Route path="/basic-tables" element={<BasicTables />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/avatars" element={<Avatars />} />
              <Route path="/badge" element={<Badges />} />
              <Route path="/buttons" element={<Buttons />} />
              <Route path="/images" element={<Images />} />
              <Route path="/videos" element={<Videos />} />

              {/* Charts */}
              <Route path="/line-chart" element={<LineChart />} />
              <Route path="/bar-chart" element={<BarChart />} />
            </Route>
          </Route>

          {/* Catch All */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ToastContainer />
      </Router>
    </>
  );
}
