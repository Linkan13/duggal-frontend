// pages/Leads/AddStaffForm.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { showMessage, MESSAGE_TYPE } from "@/utils/notify";
import { setAlertMessage } from "@/utils/alertService";
import { createStaffRequest } from "@/client/endpoints/student";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

interface StaffData {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  profilePhoto?: string;
  bio?: string;
}

export default function AddStaffForm() {
  const navigate = useNavigate();
  const [staffData, setStaffData] = useState<StaffData>({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    profilePhoto: "",
    bio: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setStaffData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!staffData.firstName || !staffData.lastName || !staffData.email) {
      const msg = "First Name, Last Name, and Email are required.";
      setError(msg);
      showMessage(msg, MESSAGE_TYPE.ERROR);
      return;
    }

    setLoading(true);
    try {
      await createStaffRequest({
        ...staffData,
        fullName: [
          staffData.firstName,
          staffData.middleName,
          staffData.lastName,
        ]
          .filter(Boolean)
          .join(" "),
      });

      setAlertMessage("Staff added successfully!");
      showMessage("Staff added successfully!", MESSAGE_TYPE.SUCCESS);

      setStaffData({
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        profilePhoto: "",
        bio: "",
      });

      navigate("/staff");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      setError(msg);
      showMessage(msg, MESSAGE_TYPE.ERROR);
    } finally {
      setLoading(false);
    }
  };

  const isSubmitDisabled =
    !staffData.firstName || !staffData.lastName || !staffData.email || loading;

  return (
    <div className="card shadow-sm">
      <div className="card-header d-flex justify-content-between align-items-center">
        <PageBreadcrumb pageTitle="👨‍💼 Add New Staff" />
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => navigate("/staff")}
        >
          ← Back
        </button>
      </div>

      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="row g-3">
            <div className="col-md-4">
              <label htmlFor="firstName" className="form-label">
                First Name *
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                className="form-control"
                value={staffData.firstName}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-4">
              <label htmlFor="middleName" className="form-label">
                Middle Name
              </label>
              <input
                type="text"
                id="middleName"
                name="middleName"
                className="form-control"
                value={staffData.middleName || ""}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-4">
              <label htmlFor="lastName" className="form-label">
                Last Name *
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                className="form-control"
                value={staffData.lastName}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="email" className="form-label">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                value={staffData.email}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="phoneNumber" className="form-label">
                Phone Number
              </label>
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                className="form-control"
                value={staffData.phoneNumber || ""}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="profilePhoto" className="form-label">
                Profile Photo URL
              </label>
              <input
                type="text"
                id="profilePhoto"
                name="profilePhoto"
                className="form-control"
                value={staffData.profilePhoto || ""}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-12">
              <label htmlFor="bio" className="form-label">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                value={staffData.bio || ""}
                onChange={handleChange}
                className="form-control"
                rows={3}
              />
            </div>
          </div>

          <div className="d-flex justify-content-center mt-4">
            <button
              type="submit"
              className="btn btn-primary px-5"
              disabled={isSubmitDisabled}
            >
              {loading ? "⏳ Saving..." : "➕ Add Staff"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
