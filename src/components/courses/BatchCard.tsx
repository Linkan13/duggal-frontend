import { TBatch, TOffer } from "@/types";

interface BatchCardProps {
  selectedBatch: TBatch | null;
  selectedOffer: TOffer | null;
  onSelectBatch: () => void;
  onClearBatch: () => void;
}

export default function BatchCard({
  selectedBatch,
  selectedOffer,
  onSelectBatch,
  onClearBatch,
}: BatchCardProps) {
  return (
    <div className="card shadow-sm rounded-4 p-3 m-0">
      <h6 className="fw-bold text-secondary mb-3">🏷️ Batch</h6>

      {selectedBatch ? (
        <div className="border rounded-3 p-3 bg-light mb-3">
          <h5 className="fw-bold text-primary mb-2">🏷️ {selectedBatch.batchName}</h5>

          {selectedBatch.startTime && selectedBatch.endTime && (
            <p className="mb-1 text-muted">
              ⏰ <strong>Time:</strong>{" "}
              <span className="fw-semibold">
                {selectedBatch.startTime} - {selectedBatch.endTime}
              </span>
            </p>
          )}

          {selectedBatch.maxStudents !== undefined && (
            <p className="mb-1 text-muted">
              👥 <strong>Max Students:</strong>{" "}
              <span className="fw-semibold">{selectedBatch.maxStudents}</span>
            </p>
          )}

          {selectedBatch.rooms && selectedBatch.rooms.length > 0 && (
            <p className="mb-0 text-muted">
              🏠 <strong>Rooms:</strong>{" "}
              <span className="fw-semibold">
                {selectedBatch.rooms.map((r) => r.roomName).join(", ")}
              </span>
            </p>
          )}
        </div>
      ) : (
        <></>
        // <p className="text-muted mb-3">⚠️ No batch selected</p>
      )}

      <div className="d-flex gap-2">
        {selectedBatch ? (
          <button
            type="button"
            className="btn btn-outline-danger flex-grow-1"
            onClick={onClearBatch}
          >
            ❌ Clear
          </button>
        ) : (
          <button
            type="button"
            className="btn flex-grow-1 btn-info text-white"
            onClick={onSelectBatch}
            disabled={!selectedOffer}
          >
            ➕ Select Batch 🏷️
          </button>
        )}
      </div>
    </div>
  );
}
