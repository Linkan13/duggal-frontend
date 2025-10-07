// pages/Leads/EditBatchForm.tsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { showMessage, MESSAGE_TYPE } from "@/utils/notify";
import { setAlertMessage } from "@/utils/alertService";

import {
  getBatchRequest,
  updateBatchRequest,
  listRoomRequest,
} from "@/client/endpoints/student";
import { TRoomList } from "../../types";

interface BatchData {
  batchName: string;
  startTime: string;
  endTime: string;
  maxStudents: string;
  rooms: string[];
}

export default function EditBatchForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [batchData, setBatchData] = useState<BatchData>({
    batchName: "",
    startTime: "",
    endTime: "",
    maxStudents: "",
    rooms: [],
  });

  const [roomsList, setRoomsList] = useState<TRoomList[]>([]);
  const [roomsLoading, setRoomsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch batch details
  useEffect(() => {
    const fetchBatch = async () => {
      if (!id) return;
      try {
        const res = await getBatchRequest(id);
        if (res?.data) {
          const batch = res.data;
          setBatchData({
            batchName: batch.batchName || "",
            startTime: batch.startTime || "09:00",
            endTime: batch.endTime || "10:00",
            maxStudents: batch.maxStudents?.toString() || "",
            rooms: Array.isArray(batch.rooms)
              ? batch.rooms
              : JSON.parse(batch.rooms || "[]"),
          });
        }
      } catch {
        showMessage("Failed to load batch details", MESSAGE_TYPE.ERROR);
      }
    };
    fetchBatch();
  }, [id]);

  // Fetch rooms
  useEffect(() => {
    let isFetched = false;
    const fetchRooms = async () => {
      if (isFetched) return;
      isFetched = true;
      setRoomsLoading(true);
      try {
        const res = await listRoomRequest({ skip: 0, size: 100 });
        setRoomsList(Array.isArray(res?.data?.data) ? res.data.data : []);
      } catch {
        setRoomsList([]);
      } finally {
        setRoomsLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof BatchData
  ) => {
    setBatchData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const toggleRoom = (roomId: string) => {
    setBatchData((prev) => ({
      ...prev,
      rooms: prev.rooms.includes(roomId)
        ? prev.rooms.filter((id) => id !== roomId)
        : [...prev.rooms, roomId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    const [startH, startM] = batchData.startTime.split(":").map(Number);
    const [endH, endM] = batchData.endTime.split(":").map(Number);
    if (endH * 60 + endM <= startH * 60 + startM) {
      const msg = "End time must be later than start time";
      setError(msg);
      showMessage(msg, MESSAGE_TYPE.ERROR);
      return;
    }

    setLoading(true);
    setError("");
    try {
      await updateBatchRequest(id, batchData);
      setAlertMessage("Batch updated successfully!");
      showMessage("Batch updated successfully!", MESSAGE_TYPE.SUCCESS);
      navigate("/batches");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setError(msg);
      showMessage(msg, MESSAGE_TYPE.ERROR);
    } finally {
      setLoading(false);
    }
  };

  const filteredRooms = roomsList.filter((room) =>
    room.roomName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="card shadow-sm">
      <div className="card-header d-flex justify-content-between align-items-center">
        <PageBreadcrumb
          pageTitle={`✏️ Edit Batch - ${batchData.batchName || ""}`}
        />
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => navigate("/batches")}
        >
          ← Back
        </button>
      </div>

      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit} autoComplete="off">
          {/* Batch Details */}
          <div className="card mb-3 p-3">
            <h5 className="mb-3">Batch Details</h5>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Batch Name *</label>
                <input
                  type="text"
                  className="form-control"
                  value={batchData.batchName}
                  onChange={(e) => handleChange(e, "batchName")}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Start Time</label>
                <input
                  type="time"
                  className="form-control"
                  value={batchData.startTime}
                  onChange={(e) => handleChange(e, "startTime")}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">End Time</label>
                <input
                  type="time"
                  className="form-control"
                  value={batchData.endTime}
                  onChange={(e) => handleChange(e, "endTime")}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Max Students</label>
                <input
                  type="number"
                  className="form-control"
                  value={batchData.maxStudents}
                  onChange={(e) => handleChange(e, "maxStudents")}
                />
              </div>
            </div>
          </div>

          {/* Rooms */}
          <div className="card mb-3 p-3">
            <h5 className="mb-3">Select Rooms</h5>
            <input
              type="text"
              placeholder="Search rooms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control mb-3"
            />

            {roomsLoading ? (
              <p className="text-center text-gray-500 py-2">
                ⏳ Loading rooms...
              </p>
            ) : filteredRooms.length === 0 ? (
              <p className="text-center text-gray-400 py-2">
                ❌ No rooms found
              </p>
            ) : (
              <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-3">
                {filteredRooms.map((room) => {
                  if (!room.id || !room.roomName) return null;
                  const isSelected = batchData.rooms.includes(room.id);
                  return (
                    <div key={room.id} className="col">
                      <div
                        onClick={() => toggleRoom(room.id)}
                        className={`p-3 border rounded shadow cursor-pointer text-start w-100 transition ${
                          isSelected
                            ? "ring-2 ring-yellow-400 border-primary bg-light"
                            : "border-gray-300 bg-white"
                        }`}
                      >
                        <h6 className="mb-1">🏠 {room.roomName}</h6>
                        <small className="d-block text-muted">
                          🔢 Code: {room.roomCode} | 👥 Capacity:{" "}
                          {room.capacity ?? "N/A"} | 📍 {room.location}
                        </small>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="d-flex justify-content-center mt-3">
            <button
              type="submit"
              className={`px-5 btn ${
                loading || !batchData.batchName ? "btn-primary" : "btn-success"
              }`}
              disabled={loading || !batchData.batchName}
            >
              {loading ? "⏳ Updating..." : "💾 Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
