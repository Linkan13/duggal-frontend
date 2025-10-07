// pages/Leads/AddLeadForm.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { showMessage, MESSAGE_TYPE } from "@/utils/notify";
import { setAlertMessage } from "@/utils/alertService";
import { createLeadRequest } from "@/client/endpoints/student/leadService";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

interface LeadData {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phone: string;
  status: "new" | "in_progress" | "converted" | "lost";
}

export default function AddLeadForm() {
  const navigate = useNavigate();
  const [leadData, setLeadData] = useState<LeadData>({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phone: "",
    status: "new",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setLeadData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!leadData.firstName || !leadData.lastName || !leadData.email) {
      const msg = "First name, last name, and email are required.";
      setError(msg);
      showMessage(msg, MESSAGE_TYPE.ERROR);
      return;
    }

    setLoading(true);
    try {
      await createLeadRequest(leadData);
      setAlertMessage("Lead added successfully!");
      showMessage("Lead added successfully!", MESSAGE_TYPE.SUCCESS);

      setLeadData({
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        phone: "",
        status: "new",
      });

      navigate("/leads");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      setError(msg);
      showMessage(msg, MESSAGE_TYPE.ERROR);
    } finally {
      setLoading(false);
    }
  };

  const isSubmitDisabled =
    !leadData.firstName || !leadData.lastName || !leadData.email || loading;

  return (
    <div className="card shadow-sm">
      <div className="card-header d-flex justify-content-between align-items-center">
        <PageBreadcrumb pageTitle="📝 Add New Lead" />
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => navigate("/leads")}
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
                value={leadData.firstName}
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
                value={leadData.middleName || ""}
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
                value={leadData.lastName}
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
                value={leadData.email}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="phone" className="form-label">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="form-control"
                value={leadData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="status" className="form-label">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={leadData.status}
                onChange={handleChange}
                className="form-select"
              >
                <option value="new">New</option>
                <option value="in_progress">In Progress</option>
                <option value="converted">Converted</option>
                <option value="lost">Lost</option>
              </select>
            </div>
          </div>

          <div className="d-flex justify-content-center mt-4">
            <button
              type="submit"
              className="btn btn-primary px-5"
              disabled={isSubmitDisabled}
            >
              {loading ? "⏳ Saving..." : "➕ Add Lead"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
