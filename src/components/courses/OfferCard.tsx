import { TOffer, TCourse } from "@/types";

interface OfferCardProps {
  selectedOffer: TOffer | null;
  selectedCourse: TCourse | null;
  onSelectOffer: () => void;
  onClearOffer: () => void;
}

export default function OfferCard({
  selectedOffer,
  selectedCourse,
  onSelectOffer,
  onClearOffer,
}: OfferCardProps) {
  return (
    <div className="card shadow-sm rounded-4 p-3 m-0">
      <h6 className="fw-bold text-secondary mb-3">🎯 Offer</h6>

      {selectedOffer ? (
        <div className="border rounded-3 p-3 bg-light mb-3 position-relative">
          {selectedOffer.featured && (
            <span className="position-absolute top-0 end-0 badge bg-warning text-dark m-2">
              ⭐
            </span>
          )}

          <h5 className="fw-bold text-primary mb-2">
            🎯 {selectedOffer.offerName}
          </h5>

          <div className="d-flex flex-column gap-1">
            {selectedOffer.courseDays && (
              <p className="mb-1 text-muted">
                📅 <strong>Duration:</strong>{" "}
                <span className="fw-semibold">
                  {selectedOffer.courseDays} Days
                </span>
              </p>
            )}

            {selectedOffer.amount !== undefined && (
              <p className="mb-1 text-success">
                💰 <strong>Amount:</strong>{" "}
                <span className="fw-semibold">
                  {selectedOffer.amount.toLocaleString()}
                </span>
              </p>
            )}

            {selectedOffer.discount && (
              <p className="mb-1 text-danger">
                🎉 <strong>Discount:</strong>{" "}
                <span className="fw-semibold">
                  {selectedOffer.discount}% OFF
                </span>
              </p>
            )}

            {selectedOffer.additionalInfo && (
              <p className="mb-0 text-muted fst-italic">
                {selectedOffer.additionalInfo}
              </p>
            )}
          </div>
        </div>
      ) : (
        <></>
        // <p className="text-muted mb-3">⚠️ No offer selected</p>
      )}

      <div className="d-flex gap-2">
        {selectedOffer ? (
          <button
            type="button"
            className="btn btn-outline-danger flex-grow-1"
            onClick={onClearOffer}
          >
            ❌ Clear
          </button>
        ) : (
          <button
            type="button"
            className="btn flex-grow-1 btn-warning text-white"
            onClick={onSelectOffer}
            disabled={!selectedCourse}
          >
            ➕ Select Offer 🎯
          </button>
        )}
      </div>
    </div>
  );
}
