import Input from "../../components/form/input/InputField";
import { TOffer, TCourse } from "@/types";

interface OfferModalProps {
  open: boolean;
  offers: TOffer[];
  selectedOffer: TOffer | null;
  course: TCourse | null;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  onSelectOffer: (offer: TOffer) => void;
  onCloseOffer: () => void;
}

export default function OfferModal({
  open,
  offers,
  selectedOffer,
  course,
  searchQuery,
  setSearchQuery,
  onSelectOffer,
  onCloseOffer,
}: OfferModalProps) {
  if (!open) return null;
  console.log("All offers passed to modal:", offers);

  const filteredOffers = offers.filter((o) =>
    o.offerName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="modal fade show d-block">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content rounded-3 shadow-sm border-0">
            <div className="modal-header flex-column align-items-start">
              <div className="row col-12">
                <div className="col-12 col-md-6">
                  <h5 className="modal-title mb-1">🎯 Select an Offer</h5>
                  <small className="text-muted">
                    Course:{" "}
                    <span className="fw-bold text-dark">
                      {course?.courseName}
                    </span>
                  </small>
                </div>
                <div className="col-12 col-md-6">
                  <Input
                    placeholder="Search offers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="form-control"
                  />
                </div>
              </div>
            </div>
            <div
              className="modal-body"
              style={{ maxHeight: "400px", overflowY: "auto" }}
            >
              <div className="row gx-3 gy-2">
                {filteredOffers.map((o, idx) => (
                  <div key={idx} className="col-12 col-md-6">
                    <button
                      type="button"
                      className={`w-100 text-start p-3 mb-2 rounded-2 border shadow-sm ${
                        selectedOffer?.id === o.id
                          ? "border-primary bg-primary-transparent shadow"
                          : "border-light bg-white"
                      }`}
                      onClick={() => onSelectOffer(o)}
                    >
                      <div className="position-relative p-0">
                        {o.featured && (
                          <span className="position-absolute top-0 end-0 badge bg-warning text-dark m-1">
                            ⭐ Featured
                          </span>
                        )}
                        <h5 className="mb-1">{o.offerName}</h5>
                        {o.courseDays && (
                          <h6 className="small mb-0">📅 {o.courseDays} Days</h6>
                        )}
                        {o.amount && (
                          <h6 className="small mb-0">💰 {o.amount}</h6>
                        )}
                        {o.discount && (
                          <h6 className="small text-success mb-0">
                            🎉 {o.discount}% OFF
                          </h6>
                        )}
                        {o.additionalInfo && (
                          <h6 className="small text-muted fst-italic mb-0">
                            ℹ️ {o.additionalInfo}
                          </h6>
                        )}
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-footer bg-light">
              <button
                type="button"
                className="btn text-black border-black btn-soft-danger btn-md"
                onClick={onCloseOffer}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" onClick={onCloseOffer}></div>
    </>
  );
}
