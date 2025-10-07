// pages/Leads/EditRoomForm.tsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { showMessage, MESSAGE_TYPE } from "@/utils/notify";
import { setAlertMessage } from "@/utils/alertService";
import {
  getRoomRequest,
  updateRoomRequest,
} from "@/client/endpoints/student/roomService";
import { TRoom } from "../../types";
import { showToast } from "@/utils/showToast";

export default function EditRoomForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [roomData, setRoomData] = useState<TRoom>({
    roomName: "",
    roomCode: "",
    capacity: undefined,
    location: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  // Fetch room details
  useEffect(() => {
    const fetchRoom = async () => {
      if (!id) return;
      try {
        const res = await getRoomRequest(id);
        if (res?.data) {
          setRoomData({
            roomName: res.data.roomName ?? "",
            roomCode: res.data.roomCode ?? "",
            capacity: res.data.capacity ?? undefined,
            location: res.data.location ?? "",
            description: res.data.description ?? "",
          });
        }
      } catch {
        showMessage("Failed to load room details", MESSAGE_TYPE.ERROR);
      } finally {
        setFetching(false);
      }
    };
    fetchRoom();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof TRoom
  ) => {
    const value =
      e.target.type === "number" ? Number(e.target.value) : e.target.value;
    setRoomData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    if (!roomData.roomName) {
      const msg = "Room Name is required.";
      setError(msg);
      showMessage(msg, MESSAGE_TYPE.ERROR);
      showToast(msg, "error");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await updateRoomRequest(id, roomData);

      setAlertMessage("Room updated successfully!");
      showMessage("Room updated successfully!", MESSAGE_TYPE.SUCCESS);
      showToast("Room updated successfully!", "success");

      navigate("/rooms");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      setError(msg);
      showMessage(msg, MESSAGE_TYPE.ERROR);
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center text-gray-500">
        ⏳ Loading room details...
      </div>
    );
  }

  const isSubmitDisabled = !roomData.roomName || loading;

  return (
    <div className="card shadow-sm">
      <div className="card-header d-flex justify-content-between align-items-center">
        <PageBreadcrumb
          pageTitle={`✏️ Edit Batch - ${roomData.roomName || ""}`}
        />
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => navigate("/rooms")}
        >
          ← Back
        </button>
      </div>

      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="roomName" className="form-label">
                Room Name *
              </label>
              <input
                type="text"
                id="roomName"
                className="form-control"
                value={roomData.roomName}
                onChange={(e) => handleChange(e, "roomName")}
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="roomCode" className="form-label">
                Room Code
              </label>
              <input
                type="text"
                id="roomCode"
                className="form-control"
                value={roomData.roomCode ?? ""}
                onChange={(e) => handleChange(e, "roomCode")}
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="capacity" className="form-label">
                Capacity
              </label>
              <input
                type="number"
                id="capacity"
                className="form-control"
                value={roomData.capacity ?? ""}
                onChange={(e) => handleChange(e, "capacity")}
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="location" className="form-label">
                Location
              </label>
              <input
                type="text"
                id="location"
                className="form-control"
                value={roomData.location ?? ""}
                onChange={(e) => handleChange(e, "location")}
              />
            </div>

            <div className="col-md-12">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea
                id="description"
                className="form-control"
                value={roomData.description ?? ""}
                onChange={(e) => handleChange(e, "description")}
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
