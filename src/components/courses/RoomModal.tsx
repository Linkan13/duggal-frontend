import { TRoom, TBatch } from "@/types";

interface RoomModalProps {
  open: boolean;
  selectedBatch: TBatch | null;
  selectedRoom: TRoom | null;
  onSelectRoom: (room: TRoom) => void;
  onClose: () => void;
}

export default function RoomModal({
  open,
  selectedBatch,
  selectedRoom,
  onSelectRoom,
  onClose,
}: RoomModalProps) {
  if (!open || !selectedBatch) return null;

  return (
    <>
      <div className="modal fade show d-block" tabIndex={-1}>
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content rounded-3 shadow-sm border-0">
            <div className="modal-header flex-column align-items-start">
              <h5 className="modal-title mb-1">🏠 Select a Room</h5>
              <small className="text-muted">
                selectedBatch:{" "}
                <span className="fw-bold text-dark">
                  {selectedBatch.batchName}
                </span>
              </small>
            </div>
            <div
              className="modal-body"
              style={{ maxHeight: "400px", overflowY: "auto" }}
            >
              {selectedBatch.rooms && selectedBatch.rooms.length > 0 ? (
                <div className="row gx-3 gy-2 overflow-auto">
                  {selectedBatch.rooms.map((r) => (
                    <div key={r.id} className="col-12 col-md-6">
                      <button
                        type="button"
                        className={`w-100 text-start p-3 mb-2 rounded-2 border shadow-sm ${
                          selectedRoom?.id === r.id
                            ? "border-primary bg-primary-transparent shadow"
                            : "border-light bg-white"
                        }`}
                        onClick={() => onSelectRoom(r)}
                        style={{ transition: "all 0.2s" }}
                      >
                        <h6 className="mb-1">🏠 {r.roomName}</h6>
                        <small className="d-block text-muted">
                          🔢 Code: {r.roomCode} | 👥 Capacity:{" "}
                          {r.capacity ?? "N/A"} | 📍 {r.location}
                        </small>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted">⚠️ No rooms available</p>
              )}
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
