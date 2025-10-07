import { TBatch } from "@/types";

interface BatchModalProps {
  open: boolean;
  batches: TBatch[];
  selectedBatch: TBatch | null;
  onSelectBatch: (batch: TBatch) => void;
  onClose: () => void;
}

export default function BatchModal({
  open,
  batches,
  selectedBatch,
  onSelectBatch,
  onClose,
}: BatchModalProps) {
  if (!open) return null;

  return (
    <>
      <div className="modal fade show d-block" tabIndex={-1}>
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content rounded-3 shadow-sm border-0">
            <div className="modal-header">
              <h5 className="modal-title">📚 Select a Batch</h5>
            </div>
            <div
              className="modal-body"
              style={{ maxHeight: "400px", overflowY: "auto" }}
            >
              <div className="row gx-3 gy-2 overflow-auto">
                {batches.map((b) => (
                  <div key={b.id} className="col-12 col-md-6">
                    <button
                      type="button"
                      className={`w-100 text-start p-3 mb-2 rounded-2 border shadow-sm ${
                        selectedBatch?.id === b.id
                          ? "border-primary bg-primary-transparent shadow"
                          : "border-light bg-white"
                      }`}
                      onClick={() => onSelectBatch(b)}
                      style={{ transition: "all 0.2s" }}
                    >
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h6 className="mb-0 fw-bold">{b.batchName}</h6>
                        <small className="text-muted">
                          👥 {b.maxStudents} Students
                        </small>
                      </div>
                      <small className="text-muted">
                        ⏰ {b.startTime} - {b.endTime}
                      </small>
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-footer bg-light">
              <button
                type="button"
                className="btn text-black border-black btn-soft-danger btn-md"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" onClick={onClose}></div>
    </>
  );
}
