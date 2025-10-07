// pages/Leads/EditStaffForm.tsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { showMessage, MESSAGE_TYPE } from "@/utils/notify";
import { setAlertMessage } from "@/utils/alertService";
import {
  getStaffRequest,
  updateStaffRequest,
} from "@/client/endpoints/student";

interface StaffData {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  profilePhoto?: string;
  bio?: string;
}

export default function EditStaffForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

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

  // --- Fetch staff data ---
  useEffect(() => {
    if (!id) return;

    const fetchStaff = async () => {
      setLoading(true);
      try {
        const res = await getStaffRequest(id);
        const {
          firstName,
          middleName,
          lastName,
          email,
          phoneNumber,
          profilePhoto,
          bio,
        } = res.data;
        setStaffData({
          firstName,
          middleName,
          lastName,
          email,
          phoneNumber,
          profilePhoto,
          bio,
        });
      } catch (err: unknown) {
        const msg =
          err instanceof Error ? err.message : "Failed to fetch staff";
        setError(msg);
        showMessage(msg, MESSAGE_TYPE.ERROR);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setStaffData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    if (!staffData.firstName || !staffData.lastName || !staffData.email) {
      const msg = "First Name, Last Name, and Email are required.";
      setError(msg);
      showMessage(msg, MESSAGE_TYPE.ERROR);
      return;
    }

    setLoading(true);
    setError("");

    try {
      await updateStaffRequest(id, {
        ...staffData,
        fullName: [
          staffData.firstName,
          staffData.middleName,
          staffData.lastName,
        ]
          .filter(Boolean)
          .join(" "),
      });

      setAlertMessage("Staff updated successfully!");
      showMessage("Staff updated successfully!", MESSAGE_TYPE.SUCCESS);
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
        <PageBreadcrumb
          pageTitle={`👨‍💼 Edit Staff - ${staffData.firstName || ""}`}
        />
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
                className="form-control"
                value={staffData.bio || ""}
                onChange={handleChange}
                rows={3}
              />
            </div>
          </div>

          <div className="d-flex justify-content-center mt-4">
            <button
              type="submit"
              className={`px-5 btn ${
                isSubmitDisabled ? "btn-primary" : "btn-success"
              }`}
              disabled={isSubmitDisabled}
            >
              {loading ? "⏳ Updating..." : "💾 Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
