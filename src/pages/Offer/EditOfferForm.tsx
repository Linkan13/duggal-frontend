import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { showMessage, MESSAGE_TYPE } from "@/utils/notify";
import { setAlertMessage } from "@/utils/alertService";
import {
  getOfferRequest,
  updateOfferRequest,
} from "@/client/endpoints/student";
import { TOffer } from "../../types";

const initialOfferData: TOffer = {
  offerName: "",
  courseDays: 0,
  amount: 0,
  discount: 0,
  additionalInfo: "",
  featured: false,
};

export default function EditOfferForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [offerData, setOfferData] = useState<TOffer>(initialOfferData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // --- Fetch offer by ID ---
  useEffect(() => {
    if (!id) return;

    const fetchOffer = async () => {
      setLoading(true);
      try {
        const res = await getOfferRequest(id);
        // Convert fields to number/boolean if needed
        const data = res.data;
        setOfferData({
          ...initialOfferData,
          offerName: data.offerName || "",
          courseDays: Number(data.courseDays) || 0,
          amount: Number(data.amount) || 0,
          discount: Number(data.discount) || 0,
          additionalInfo: data.additionalInfo || "",
          featured: Boolean(data.featured),
        });
      } catch (err: unknown) {
        const msg =
          err instanceof Error ? err.message : "Failed to fetch offer";
        setError(msg);
        showMessage(msg, MESSAGE_TYPE.ERROR);
      } finally {
        setLoading(false);
      }
    };

    fetchOffer();
  }, [id]);

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

    if (!id) return;

    setLoading(true);
    try {
      await updateOfferRequest(id, offerData);
      setAlertMessage("Offer updated successfully!");
      showMessage("Offer updated successfully!", MESSAGE_TYPE.SUCCESS);
      navigate("/offers");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setError(msg);
      showMessage(msg, MESSAGE_TYPE.ERROR);
    } finally {
      setLoading(false);
    }
  };

  const isSubmitDisabled =
    !offerData.offerName || offerData.courseDays <= 0 || loading;

  return (
    <div className="card shadow-sm">
      <div className="card-header d-flex justify-content-between align-items-center">
        <PageBreadcrumb
          pageTitle={`✏️ Edit Offer - ${offerData.offerName || ""}`}
        />
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
