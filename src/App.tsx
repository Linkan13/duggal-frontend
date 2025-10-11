import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import StudentAttendance from "./pages/Forms/StudentAttendance";
import GlobalLoader from "@/components/common/GlobalLoader";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import LeadDashboard from "./pages/Dashboard/LeadDashboard";
import AttendanceDashboard from "./pages/Dashboard/AttendanceDashboard";
import PaymentDashboard from "./pages/Dashboard/PaymentDashboard";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { RoomList, AddRoomForm, RoomDetails, EditRoomForm } from "./pages/Room";
import { RolesList, AddRolesForm, EditRolesForm } from "./pages/Roles";
import {
  BatchList,
  AddBatchForm,
  BatchDetails,
  EditBatchForm,
} from "./pages/Batch";
import {
  OfferList,
  AddOfferForm,
  OfferDetails,
  EditOfferForm,
} from "./pages/Offer";
import {
  CourseList,
  AddCourseForm,
  CourseDetails,
  EditCourseForm,
} from "./pages/Course";
import {
  StudentList,
  AddStudentForm,
  StudentDetails,
  EditStudentForm,
} from "./pages/Student";
import {
  LeadList,
  AddLeadForm,
  LeadDetails,
  EditLeadForm,
} from "./pages/Leads";
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
          {/* Public Routes */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Protected Dashboard Layout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route index path="/dashboard" element={<Home />} />
              <Route index path="/lead-dashboard" element={<LeadDashboard />} />
              <Route index path="/attendance-dashboard" element={<AttendanceDashboard />} />
              <Route index path="/payment-dashboard" element={<PaymentDashboard />} />
              <Route path="/profile" element={<UserProfiles />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/blank" element={<Blank />} />
              <Route
                path="/student-attendance"
                element={<StudentAttendance />}
              />
              <Route path="/create-batch" element={<AddBatchForm />} />
              <Route path="/create-room" element={<AddRoomForm />} />
              <Route path="/rooms">
                <Route index element={<RoomList />} />
                <Route path="create" element={<AddRoomForm />} />
                <Route path="view/:id" element={<RoomDetails />} />
                <Route path="edit/:id" element={<EditRoomForm />} />
              </Route>
              <Route path="/roles">
                <Route index element={<RolesList />} />
                <Route path="create" element={<AddRolesForm />} />
                <Route path="edit/:id" element={<EditRolesForm />} />
              </Route>
              <Route path="/batches">
                <Route index element={<BatchList />} />
                <Route path="create" element={<AddBatchForm />} />
                <Route path="view/:id" element={<BatchDetails />} />
                <Route path="edit/:id" element={<EditBatchForm />} />
              </Route>
              <Route path="/offers">
                <Route index element={<OfferList />} />
                <Route path="create" element={<AddOfferForm />} />
                <Route path="view/:id" element={<OfferDetails />} />
                <Route path="edit/:id" element={<EditOfferForm />} />
              </Route>
              <Route path="/staff">
                <Route index element={<StaffList />} />
                <Route path="create" element={<AddStaffForm />} />
                <Route path="view/:id" element={<StaffDetails />} />
                <Route path="edit/:id" element={<EditStaffForm />} />
              </Route>
              <Route path="/leads">
                <Route index element={<LeadList />} />
                <Route path="create" element={<AddLeadForm />} />
                <Route path="view/:id" element={<LeadDetails />} />
                <Route path="edit/:id" element={<EditLeadForm />} />
              </Route>
              <Route path="/student">
                <Route index element={<StudentList />} />
                <Route path="create" element={<AddStudentForm />} />
                <Route path="view/:id" element={<StudentDetails />} />
                <Route path="edit/:id" element={<EditStudentForm />} />
              </Route>
              <Route path="/course">
                <Route index element={<CourseList />} />
                <Route path="create" element={<AddCourseForm />} />
                <Route path="view/:id" element={<CourseDetails />} />
                <Route path="edit/:id" element={<EditCourseForm />} />
              </Route>
              <Route path="/basic-tables" element={<BasicTables />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/avatars" element={<Avatars />} />
              <Route path="/badge" element={<Badges />} />
              <Route path="/buttons" element={<Buttons />} />
              <Route path="/images" element={<Images />} />
              <Route path="/videos" element={<Videos />} />
              <Route path="/line-chart" element={<LineChart />} />
              <Route path="/bar-chart" element={<BarChart />} />
            </Route>
          </Route>

          {/* Catch all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ToastContainer />
      </Router>
    </>
  );
}
