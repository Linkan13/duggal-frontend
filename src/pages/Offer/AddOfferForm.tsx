import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { showMessage, MESSAGE_TYPE } from "@/utils/notify";
import { setAlertMessage } from "@/utils/alertService";
import { createOfferRequest } from "@/client/endpoints/student";
import { TOffer } from "../../types";

const initialOfferData: TOffer = {
  offerName: "",
  courseDays: 0,
  amount: 0,
  discount: 0,
  additionalInfo: "",
  featured: false,
};

export default function AddOfferForm() {
  const navigate = useNavigate();

  const [offerData, setOfferData] = useState<TOffer>(initialOfferData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof TOffer
  ) => {
    const value =
      e.target.type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : e.target.type === "number"
        ? Number(e.target.value)
        : e.target.value;
    setOfferData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!offerData.offerName || offerData.courseDays <= 0) {
      const msg = "Offer Name and Course Days are required.";
      setError(msg);
      showMessage(msg, MESSAGE_TYPE.ERROR);
      return;
    }

    setLoading(true);
    try {
      await createOfferRequest(offerData);
      setAlertMessage("Offer added successfully!");
      showMessage("Offer added successfully!", MESSAGE_TYPE.SUCCESS);

      setOfferData(initialOfferData);
      navigate("/offers");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      setError(msg);
      showMessage(msg, MESSAGE_TYPE.ERROR);
    } finally {
      setLoading(false);
    }
  };

  const isSubmitDisabled = !offerData.offerName || offerData.courseDays <= 0 || loading;

  return (
    <div className="card shadow-sm">
      <div className="card-header d-flex justify-content-between align-items-center">
        <PageBreadcrumb pageTitle="🎁 Add New Offer" />
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => navigate("/offers")}
        >
          ← Back
        </button>
      </div>

      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="offerName" className="form-label">
                Offer Name *
              </label>
              <input
                type="text"
                id="offerName"
                name="offerName"
                className="form-control"
                value={offerData.offerName}
                onChange={(e) => handleChange(e, "offerName")}
              />
            </div>

            <div className="col-md-6 d-flex align-items-center mt-4">
              <input
                type="checkbox"
                id="featured"
                checked={offerData.featured}
                onChange={(e) => handleChange(e, "featured")}
                className="form-check-input me-2"
              />
              <label htmlFor="featured" className="form-check-label">
                Featured
              </label>
            </div>

            <div className="col-md-6">
              <label htmlFor="courseDays" className="form-label">
                Course Days *
              </label>
              <input
                type="number"
                id="courseDays"
                name="courseDays"
                className="form-control"
                value={offerData.courseDays}
                onChange={(e) => handleChange(e, "courseDays")}
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="amount" className="form-label">
                Amount
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                className="form-control"
                value={offerData.amount}
                onChange={(e) => handleChange(e, "amount")}
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="discount" className="form-label">
                Discount (%)
              </label>
              <input
                type="number"
                id="discount"
                name="discount"
                className="form-control"
                value={offerData.discount}
                onChange={(e) => handleChange(e, "discount")}
              />
            </div>

            <div className="col-md-12">
              <label htmlFor="additionalInfo" className="form-label">
                Additional Info
              </label>
              <textarea
                id="additionalInfo"
                name="additionalInfo"
                className="form-control"
                value={offerData.additionalInfo}
                onChange={(e) => handleChange(e, "additionalInfo")}
                rows={3}
              />
            </div>
          </div>

          <div className="d-flex justify-content-center mt-4">
            <button type="submit" className="btn btn-primary px-5" disabled={isSubmitDisabled}>
              {loading ? "⏳ Saving..." : "➕ Add Offer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
