import { useState } from "react";
import Tesseract from "tesseract.js";
import ComponentCard from "../../components/common/ComponentCard";
import CameraCapture from "../../components/common/CameraCapture"; // ✅ import
import { TStudent } from "@/types";

type CameraTarget = "profile" | "front" | "back" | null;

export default function IdAndProfileSection({
  studentData,
  setStudentData,
}: {
  studentData: TStudent;
  setStudentData: React.Dispatch<React.SetStateAction<TStudent>>;
}) {
  const [frontPreview, setFrontPreview] = useState<string | null>(null);
  const [backPreview, setBackPreview] = useState<string | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [cameraTarget, setCameraTarget] = useState<CameraTarget>(null); // ✅ state

  const handleIdProofUpload = async (files: File[], side: "front" | "back") => {
    if (!files.length) return;
    const file = files[0];
    const preview = URL.createObjectURL(file);

    if (side === "front") setFrontPreview(preview);
    else setBackPreview(preview);

    setLoading(true);
    try {
      const result = await Tesseract.recognize(file, "eng");
      const rawText = result.data.text;
      const text = rawText.replace(/\s+/g, " ").trim();

      if (side === "front") {
        const dobMatch = text.match(/\d{2}[/-]\d{2}[/-]\d{4}/);
        const dob = dobMatch ? dobMatch[0] : "";
        const aadhaarMatch = text.match(/\b\d{4}\s?\d{4}\s?\d{4}\b/);
        const idProofNumber = aadhaarMatch
          ? aadhaarMatch[0].replace(/\s/g, "")
          : "";

        setStudentData({
          ...studentData,
          frontIdFile: file,
          frontIdText: `DOB: ${dob}\nAadhaar: ${idProofNumber}`,
          idProofNumber,
        });
      } else {
        setStudentData({ ...studentData, backIdFile: file, backIdText: text });
      }
    } catch (err) {
      console.error("OCR failed:", err);
      alert("Could not extract text from ID.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ComponentCard title="🆔 Aadhaar Card & Profile Picture">
      {/* Profile Section */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        {profilePreview ? (
          <img
            src={profilePreview}
            alt="Profile Preview"
            className="border shadow-sm"
            style={{ width: "7rem", height: "7rem", objectFit: "cover" }}
          />
        ) : (
          <div
            className="d-flex align-items-center justify-content-center border bg-light text-muted shadow-sm"
            style={{ width: "7rem", height: "7rem", fontSize: "0.85rem" }}
          >
            No Image
          </div>
        )}

        <div className="d-flex flex-column gap-2 ms-3">
          <label className="btn btn-outline-primary btn-sm">
            <i className="bi bi-upload me-1"></i> Choose File
            <input
              type="file"
              accept="image/*"
              className="d-none"
              onChange={(e) => {
                if (!e.target.files?.length) return;
                const file = e.target.files[0];
                setStudentData({ ...studentData, profilePicture: file });
                setProfilePreview(URL.createObjectURL(file));
              }}
            />
          </label>

          <button
            type="button"
            className="btn btn-outline-success btn-sm"
            onClick={() => setCameraTarget("profile")}
          >
            <i className="bi bi-camera me-1"></i> Open Camera
          </button>
        </div>
      </div>

      {/* Aadhaar Front/Back */}
      <div className="row g-4">
        {["front", "back"].map((side) => {
          const preview = side === "front" ? frontPreview : backPreview;
          const text =
            side === "front" ? studentData.frontIdText : studentData.backIdText;
          const labelText = side === "front" ? "Front Side" : "Back Side";

          return (
            <div key={side} className="col-md-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center">
                  <h6 className="fw-semibold mb-3">{labelText}</h6>

                  {preview ? (
                    <img
                      src={preview}
                      alt={`${labelText} Preview`}
                      className="img-fluid border rounded mb-3"
                      style={{ maxHeight: "6rem", objectFit: "contain" }}
                    />
                  ) : (
                    <div
                      className="d-flex align-items-center justify-content-center bg-light text-muted border rounded mb-3"
                      style={{ height: "6rem", fontSize: "0.85rem" }}
                    >
                      No Image
                    </div>
                  )}

                  <div className="d-flex flex-column gap-2">
                    <label className="btn btn-outline-primary btn-sm w-100">
                      <i className="bi bi-upload me-1"></i> Choose {labelText}
                      <input
                        type="file"
                        accept="image/*"
                        className="d-none"
                        onChange={(e) => {
                          if (!e.target.files?.length) return;
                          handleIdProofUpload(
                            [e.target.files[0]],
                            side as "front" | "back"
                          );
                        }}
                      />
                    </label>

                    <button
                      className="btn btn-outline-success btn-sm w-100"
                      onClick={() => setCameraTarget(side as "front" | "back")}
                    >
                      <i className="bi bi-camera me-1"></i> Capture {labelText}
                    </button>
                  </div>

                  {text && (
                    <div
                      className="mt-3 p-3 bg-light border rounded text-start shadow-sm"
                      style={{
                        maxHeight: "12rem",
                        overflowY: "auto",
                        fontSize: "0.9rem",
                        whiteSpace: "pre-line",
                      }}
                    >
                      {text}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {loading && (
        <p className="text-primary text-center mt-4 small fw-medium">
          <i className="spinner-border spinner-border-sm me-2"></i>
          Extracting text...
        </p>
      )}

      {/* Camera Modal */}
      {cameraTarget && (
        <CameraCapture
          onCapture={(file) => {
            if (cameraTarget === "profile") {
              setStudentData({ ...studentData, profilePicture: file });
              setProfilePreview(URL.createObjectURL(file));
            } else {
              handleIdProofUpload([file], cameraTarget);
            }
          }}
          onClose={() => setCameraTarget(null)}
        />
      )}
    </ComponentCard>
  );
}
