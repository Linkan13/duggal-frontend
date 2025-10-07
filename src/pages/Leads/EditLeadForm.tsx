// pages/Leads/EditLeadForm.tsx
import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { showMessage, MESSAGE_TYPE } from "@/utils/notify";
import { setAlertMessage } from "@/utils/alertService";
import {
  TLead,
  getLeadRequest,
  updateLeadRequest,
} from "@/client/endpoints/student/leadService";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

export default function EditLeadForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [leadData, setLeadData] = useState<TLead>({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phone: "",
    status: "new",
    interestedCourseId: null,
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fetchedRef = useRef(false);

  // --- Fetch Lead ---
  useEffect(() => {
    if (!id || fetchedRef.current) return;
    fetchedRef.current = true;

    const fetchLead = async () => {
      try {
        setLoading(true);
        const res = await getLeadRequest(id);
        const lead = res.data;

        setLeadData({
          firstName: lead.firstName,
          middleName: lead.middleName || "",
          lastName: lead.lastName,
          email: lead.email,
          phone: lead.phone || "",
          status: lead.status,
          interestedCourseId: lead.interestedCourseId,
          notes: lead.notes || "",
        });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to load lead";
        setError(msg);
        showMessage(msg, MESSAGE_TYPE.ERROR);
      } finally {
        setLoading(false);
      }
    };

    fetchLead();
  }, [id]);

  // --- Handle input changes ---
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setLeadData((prev) => ({ ...prev, [name]: value }));
  };

  // --- Submit ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!leadData.firstName || !leadData.lastName || !leadData.email) {
      const msg = "First name, last name, and email are required.";
      setError(msg);
      showMessage(msg, MESSAGE_TYPE.ERROR);
      return;
    }

    try {
      if (!id) throw new Error("Lead ID is missing");

      const payload: TLead = {
        ...leadData,
        interestedCourseId: leadData.interestedCourseId ?? undefined,
      };

      setLoading(true);
      await updateLeadRequest(id, payload);

      setAlertMessage("Lead updated successfully!");
      showMessage("Lead updated successfully!", MESSAGE_TYPE.SUCCESS);
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
        <PageBreadcrumb
          pageTitle={`✏️ Edit Lead - ${leadData.firstName || ""}`}
        />
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
                value={leadData.phone || ""}
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

            <div className="col-md-6">
              <label htmlFor="interestedCourseId" className="form-label">
                Interested Course
              </label>
              <input
                type="text"
                id="interestedCourseId"
                name="interestedCourseId"
                className="form-control"
                value={leadData.interestedCourseId || ""}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-12">
              <label htmlFor="notes" className="form-label">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={leadData.notes || ""}
                onChange={handleChange}
                className="form-control"
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
