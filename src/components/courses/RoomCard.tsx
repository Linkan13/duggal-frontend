import { TBatch, TRoom } from "@/types";

interface RoomCardProps {
  selectedBatch: TBatch | null;
  selectedRoom: TRoom | null;
  onSelectRoom: () => void;
  onClearRoom: () => void;
}

export default function RoomCard({
  selectedBatch,
  selectedRoom,
  onSelectRoom,
  onClearRoom,
}: RoomCardProps) {
  return (
    <div className="card shadow-sm rounded-4 p-3 m-0">
      <h6 className="fw-bold text-secondary mb-3">🏠 Room</h6>

      {selectedRoom ? (
        <div className="border rounded-3 p-3 bg-light mb-3">
          <h5 className="fw-bold text-primary mb-2">
            🏠 {selectedRoom.roomName}
          </h5>
          <p className="mb-1 text-muted">
            🔢 <strong>Code:</strong>{" "}
            <span className="fw-semibold">{selectedRoom.roomCode}</span>
          </p>
          <p className="mb-1 text-muted">
            👥 <strong>Capacity:</strong>{" "}
            <span className="fw-semibold">
              {selectedRoom.capacity ?? "N/A"}
            </span>
          </p>
          <p className="mb-0 text-muted">
            📍 <strong>Location:</strong>{" "}
            <span className="fw-semibold">{selectedRoom.location}</span>
          </p>
        </div>
      ) : (
        <></>
        // <p className="text-muted mb-3">⚠️ No room selected</p>
      )}

      <div className="d-flex gap-2">
        {selectedRoom ? (
          <button
            type="button"
            className="btn btn-outline-danger flex-grow-1"
            onClick={onClearRoom}
          >
            ❌ Clear
          </button>
        ) : (
          <button
            type="button"
            className="btn flex-grow-1 btn-dark text-white"
            onClick={onSelectRoom}
            disabled={!selectedBatch}
          >
            ➕ Select Room 🏠
          </button>
        )}
      </div>
    </div>
  );
}
