import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { getStudentDetailsByIdRequest } from "@/client/endpoints/student";
import { showToast } from "@/utils/showToast";
import { TStudentEnrollment } from "@/types";

export default function ViewStudentEnrollment() {
  const { id } = useParams<{ id: string }>();

  const [studentData, setStudentData] = useState<TStudentEnrollment | null>(
    null
  );

  /** Copy to clipboard */
  const handleCopy = async (text: string | null | undefined, label: string) => {
    if (!text) {
      showToast(`${label} is empty ❌`, "error");
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      showToast(`${label} copied to clipboard`, "success");
    } catch (err) {
      console.error("Copy failed", err);
      showToast("Failed to copy", "error");
    }
  };

  /** --- Fetch student --- */
  useEffect(() => {
    const fetchStudent = async () => {
      if (!id) return;
      try {
        const res = await getStudentDetailsByIdRequest(id);
        setStudentData(res.data);
      } catch (err) {
        console.log(err);
        showToast("Failed to load student data.", "error");
      }
    };
    fetchStudent();
  }, [id]);

  if (!studentData)
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "200px" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );

  return (
    <div className="row">
      <div className="col-xl-4 theiaStickySidebar">
        <div className="card card-bg-1 sticky-class">
          <div className="card-body p-0">
            {/* Avatar */}
            <span className="avatar avatar-xl avatar-rounded border border-2 border-white m-auto d-flex mb-2">
              <img
                className="w-auto h-auto"
                alt="Profile"
                src={"/react/template/src/assets/img/profiles/avatar-19.jpg"}
              />
            </span>

            {/* Name */}
            <div className="text-center px-3 pb-3 border-bottom">
              <h5 className="d-flex align-items-center justify-content-center mb-1">
                {studentData.firstName} {studentData.middleName}{" "}
                {studentData.lastName}
              </h5>
              <p className="text-dark mb-1">{studentData.nationality || "—"}</p>
            </div>

            {/* Basic Information */}
            <div className="p-3 border-bottom">
              <h6 className="mb-2">Basic information</h6>

              <div className="d-flex align-items-center justify-content-between mb-2">
                <span>📞 Phone</span>
                <p className="text-dark">{studentData.phone || "—"}</p>
              </div>
              <div className="d-flex align-items-center justify-content-end mb-2">
                <button
                  type="button"
                  className="btn btn-sm btn-light border-0"
                  onClick={() => handleCopy(studentData.phone, "Phone")}
                >
                  📋 copy
                </button>
              </div>
              {/* Email with Copy */}
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span>📧 Email</span>

                <a className="text-info" href={`mailto:${studentData.email}`}>
                  {studentData.email || "—"}
                </a>
              </div>
              <div className="d-flex align-items-center justify-content-end mb-2">
                {studentData.email && (
                  <button
                    type="button"
                    className="btn btn-sm btn-light border-0"
                    onClick={() => handleCopy(studentData.email, "Email")}
                  >
                    📋 copy
                  </button>
                )}
              </div>
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span>⚧ Gender</span>
                <p className="text-dark">{studentData.gender || "—"}</p>
              </div>

              <div className="d-flex align-items-center justify-content-between mb-2">
                <span>🎂 Birthday</span>
                <p className="text-dark">
                  {studentData.dob
                    ? new Date(studentData.dob).toLocaleDateString()
                    : "—"}
                </p>
              </div>

              {/* Address with Copy */}
              <div className="d-flex align-items-start justify-content-between">
                <span>📍 Address</span>
                <div className="text-end d-flex flex-column align-items-end">
                  <p className="text-dark mb-1">{studentData.address || "—"}</p>
                  {studentData.address && (
                    <button
                      type="button"
                      className="btn btn-sm btn-light border-0"
                      onClick={() => handleCopy(studentData.address, "Address")}
                    >
                      📋 Copy
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Other Info */}
            <div className="p-3 border-bottom">
              <h6>Other Information</h6>
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span>🛂 Nationality</span>
                <p className="text-dark">{studentData.nationality || "—"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-xl-8">
        <div>
          <div className="bg-white rounded">
            <ul
              className="nav nav-tabs nav-tabs-bottom nav-justified flex-wrap mb-3"
              role="tablist"
            >
              <li className="nav-item" role="presentation">
                <a
                  className="nav-link active fw-medium d-flex align-items-center justify-content-center"
                  data-bs-toggle="tab"
                  aria-selected="false"
                  role="tab"
                  href="#tab1"
                >
                  📚 Courses & Enrollments
                </a>
              </li>
              <li className="nav-item" role="presentation">
                <a
                  className="nav-link fw-medium d-flex align-items-center justify-content-center"
                  data-bs-toggle="tab"
                  aria-selected="false"
                  role="tab"
                  href="#tab2"
                >
                  💰 Payment
                </a>
              </li>
            </ul>
          </div>
          <div className="tab-content">
            {/* Courses Tab */}
            <div className="tab-pane active show" id="tab1" role="tabpanel">
              {studentData.courses && studentData.courses.length > 0 ? (
                studentData.courses.map((c, index) => (
                  <div
                    key={index}
                    className="card shadow-sm border-0 rounded-4 mb-4"
                  >
                    <div className="card-header  d-flex justify-content-between align-items-center rounded-top-4">
                      <h6 className="fw-bold text-dark mb-0">
                        Enrollment #{index + 1}
                      </h6>
                      {(c.startDate || c.endDate) && (
                        <small className="text-muted">
                          {c.startDate
                            ? new Date(c.startDate).toLocaleDateString()
                            : "—"}{" "}
                          -{" "}
                          {c.endDate
                            ? new Date(c.endDate).toLocaleDateString()
                            : "—"}
                        </small>
                      )}
                    </div>

                    <div className="card-body">
                      <div className="row g-3">
                        {/* --- Course Card --- */}
                        {c.course && (
                          <div className="col-md-6 col-lg-3">
                            <div className="h-100 card shadow-sm rounded-4 border-0 p-3  bg-opacity-10">
                              <h6 className="fw-bold text-primary mb-2">
                                📚 {c.course.courseName}
                              </h6>
                              {c.course.courseCode && (
                                <p className="mb-1 text-muted">
                                  <strong>Code:</strong> {c.course.courseCode}
                                </p>
                              )}
                              {c.course.description && (
                                <p className="mb-0 text-muted small">
                                  {c.course.description}
                                </p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* --- Offer Card --- */}
                        {c.offer && (
                          <div className="col-md-6 col-lg-3">
                            <div className="h-100 card shadow-sm rounded-4 border-0 p-3 position-relative">
                              {c.offer.featured && (
                                <span className="position-absolute top-0 end-0 badge bg-warning text-dark m-2">
                                  ⭐
                                </span>
                              )}
                              <h6 className="fw-bold text-primary mb-2">
                                🎯 {c.offer.offerName}
                              </h6>
                              {c.offer.courseDays && (
                                <p className="mb-1 text-muted small">
                                  📅 {c.offer.courseDays} Days
                                </p>
                              )}
                              <p className="mb-1 text-success small">
                                💰 ₹{c.offer.amount}
                              </p>
                              <p className="mb-0 text-danger small">
                                🎉 {c.offer.discount}% off
                              </p>
                            </div>
                          </div>
                        )}

                        {/* --- Batch Card --- */}
                        {c.batch && (
                          <div className="col-md-6 col-lg-3">
                            <div className="h-100 card shadow-sm rounded-4 border-0 p-3 ">
                              <h6 className="fw-bold text-primary mb-2">
                                🏷️ {c.batch.batchName}
                              </h6>
                              <p className="mb-1 text-muted small">
                                ⏰ {c.batch.startTime} - {c.batch.endTime}
                              </p>
                              <p className="mb-0 text-muted small">
                                👥 Max {c.batch.maxStudents}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* --- Room Card --- */}
                        {c.room && (
                          <div className="col-md-6 col-lg-3">
                            <div className="h-100 card shadow-sm rounded-4 border-0 p-3 ">
                              <h6 className="fw-bold text-primary mb-2">
                                🏠 {c.room.roomName}
                              </h6>
                              <p className="mb-1 text-muted small">
                                🔢 {c.room.roomCode}
                              </p>
                              <p className="mb-1 text-muted small">
                                👥 {c.room.capacity} Seats
                              </p>
                              <p className="mb-0 text-muted small">
                                📍 {c.room.location}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="card border-0">
                  <div className="card-header">
                    <h5>📚 Courses & Enrollments</h5>
                  </div>
                  <div className="card-body">
                    <p>No courses enrolled.</p>
                  </div>
                </div>
              )}
            </div>

            <div className="tab-pane" id="tab2" role="tabpanel">
              <div className="card border-0">
                <div className="card-header">
                  <h5>💰 Payment</h5>
                </div>
                <div className="card-body">
                  {studentData.payment ? (
                    <>
                      <p>
                        <strong>Total Fees:</strong> ₹
                        {studentData.payment.totalFees.toLocaleString("en-IN")}
                      </p>
                      <p>
                        <strong>Total Amount:</strong> ₹
                        {studentData.payment.totalAmount}
                      </p>

                      <h6>Installments</h6>
                      {studentData.payment.installments.length > 0 ? (
                        <ul className="list-group list-group-flush">
                          {studentData.payment.installments.map((inst, i) => (
                            <li className="list-group-item" key={i}>
                              <p>
                                <strong>Installment {i + 1}</strong>
                              </p>
                              <p>Amount: ₹{inst.amount}</p>
                              <p>
                                Due Date:{" "}
                                {new Date(inst.dueDate).toLocaleDateString()}
                              </p>
                              <p>
                                Status: {inst.paid ? "✅ Paid" : "❌ Pending"}
                              </p>
                              {inst.paymentDate && (
                                <p>
                                  Paid On:{" "}
                                  {new Date(
                                    inst.paymentDate
                                  ).toLocaleDateString()}
                                </p>
                              )}
                              {inst.paymentMethod && (
                                <p>Method: {inst.paymentMethod}</p>
                              )}
                              {inst.comment && <p>Comment: {inst.comment}</p>}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>No installments available.</p>
                      )}
                    </>
                  ) : (
                    <p>No payment details available.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
