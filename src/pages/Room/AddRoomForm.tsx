// pages/Leads/AddRoomForm.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { showMessage, MESSAGE_TYPE } from "@/utils/notify";
import { setAlertMessage } from "@/utils/alertService";
import { createRoomRequest } from "@/client/endpoints/student/roomService"; 
import { TRoom } from "../../types";
import { showToast } from "@/utils/showToast";

export default function AddRoomForm() {
  const navigate = useNavigate();

  const [roomData, setRoomData] = useState<TRoom>({
    roomName: "",
    roomCode: "",
    capacity: undefined,
    location: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    setError("");

    if (!roomData.roomName) {
      const msg = "Room Name is required.";
      setError(msg);
      showMessage(msg, MESSAGE_TYPE.ERROR);
      showToast(msg, "error");
      return;
    }

    setLoading(true);
    try {
      await createRoomRequest(roomData);
      setAlertMessage("Room added successfully!");
      showMessage("Room added successfully!", MESSAGE_TYPE.SUCCESS);

      setRoomData({
        roomName: "",
        roomCode: "",
        capacity: undefined,
        location: "",
        description: "",
      });
      showToast("Room added successfully!", "success");

      navigate("/rooms");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      setError(msg);
      showToast(msg, "error");
      showMessage(msg, MESSAGE_TYPE.ERROR);
    } finally {
      setLoading(false);
    }
  };

  const isSubmitDisabled = !roomData.roomName || loading;

  return (
    <div className="card shadow-sm">
      <div className="card-header d-flex justify-content-between align-items-center">
        <PageBreadcrumb pageTitle="🏠 Add New Room" />
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
                name="roomName"
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
                name="roomCode"
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
                name="capacity"
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
                name="location"
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
                name="description"
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
              className="btn btn-primary px-5"
              disabled={isSubmitDisabled}
            >
              {loading ? "⏳ Saving..." : "➕ Add Room"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
