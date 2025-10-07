import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import DatePicker from "../../components/form/date-picker";

import BatchCard from "../../components/courses/BatchCard";
import BatchModal from "../../components/courses/BatchModal";
import RoomModal from "../../components/courses/RoomModal";
import RoomCard from "../../components/courses/RoomCard";

import CourseCard from "../../components/courses/CourseCard";
import OfferCard from "../../components/courses/OfferCard";
import CourseModal from "../../components/courses/CourseModal";
import OfferModal from "../../components/courses/OfferModal";

import PersonalInfoSection from "../../components/courses/PersonalInfoSection";
import GuardianInfoSection from "../../components/courses/GuardianInfoSection";
import AdditionalInfoSection from "../../components/courses/AdditionalInfoSection";
import IdAndProfileSectionEdit from "../../components/courses/IdAndProfileSectionEdit";

import PaymentSection from "../../components/courses/PaymentSection";
import ComponentCard from "../../components/common/ComponentCard";

import {
  getStudentByIdRequest,
  updateStudentRequest,
} from "@/client/endpoints/student";
import {
  listCourseRequest,
  listRoomRequest,
  listBatchRequest,
} from "@/client/endpoints/student";
import { showMessage, MESSAGE_TYPE } from "@/utils/notify";
import { setAlertMessage } from "@/utils/alertService";
import { showToast } from "@/utils/showToast";
import { AxiosError } from "axios";
import { TStudent, TCourse, TOffer, TBatch, TRoom, Installment } from "@/types";

export default function EditStudentEnrollmentForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [courseSearchQuery, setCourseSearchQuery] = useState("");
  const [offerSearchQuery, setOfferSearchQuery] = useState("");
  const [rooms, setRooms] = useState<TRoom[]>([]);
  const [courses, setCourses] = useState<TCourse[]>([]);
  const [batches, setBatches] = useState<TBatch[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [showAll, setShowAll] = useState<boolean>(false);

  const steps = [
    {
      id: 1,
      label: "Step 1",
      sections: ["personal", "idProfile"],
      title: "👤 Personal Info & 🆔 Aadhaar",
    },
    {
      id: 2,
      label: "Step 2",
      sections: ["guardian", "additional"],
      title: "🧑 Guardian & 📌 Additional Info",
    },
    {
      id: 3,
      label: "Step 3",
      sections: ["courses"],
      title: "📚 Courses & 💰 Payment",
    },
  ];

  const [studentData, setStudentData] = useState<TStudent | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const [courseModalOpen, setCourseModalOpen] = useState<number | null>(null);
  const [offerModalOpen, setOfferModalOpen] = useState<number | null>(null);
  const [batchModalOpen, setBatchModalOpen] = useState<number | null>(null);
  const [roomModalOpen, setRoomModalOpen] = useState<number | null>(null);

  const [totalFees, setTotalFees] = useState<number>(0);
  const [installments, setInstallments] = useState<Installment[]>([]);

  /** --- Fetch student, courses, rooms, batches --- */
  useEffect(() => {
    const fetchStudent = async () => {
      if (!id) return;
      try {
        const res = await getStudentByIdRequest(id);
        const student = res.data;

        // Map payments
        const payment = student.payment ?? {
          totalFees: 0,
          installments: [],
        };
        console.log("student", payment.totalFees);

        // Remove courses from student object

        // Set state
        setStudentData({
          ...student,
          payment,
        });

        setTotalFees(payment.totalFees ?? 0);
        setInstallments(payment.installments ?? []);
      } catch (err) {
        console.log(err);
        showToast("Failed to load student data.", "error");
      }
    };

    const fetchCourses = async () => {
      try {
        const res = await listCourseRequest({ skip: 0, size: 100 });
        if (res?.data?.data) setCourses(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    const fetchRooms = async () => {
      try {
        const res = await listRoomRequest({ skip: 0, size: 100 });
        if (res?.data?.data) setRooms(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    const fetchBatches = async () => {
      try {
        const res = await listBatchRequest({ skip: 0, size: 100 });
        if (res?.data?.data) setBatches(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchStudent();
    fetchCourses();
    fetchRooms();
    fetchBatches();
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
    
  /** --- Utility functions --- */
  const calculateTotalFees = (coursesList: TStudent["courses"]) => {
    return coursesList.reduce((sum, c) => {
      if (!c.offer) return sum;
      const courseObj = courses.find((cr) => cr.id === c.course);
      const offerObj = courseObj?.offers?.find((o) => o.id === c.offer);
      return sum + Number(offerObj?.amount ?? 0);
    }, 0);
  };

  const updateCourseData = (
    index: number,
    field: keyof TStudent["courses"][0],
    value: unknown
  ) => {
    setStudentData((prev) => {
      if (!prev) return prev;
      const newCourses = [...prev.courses];
      newCourses[index] = {
        ...newCourses[index],
        [field]: value,
        ...(field === "course"
          ? {
              offer: null,
              batch: null,
              room: null,
              startDate: null,
              endDate: null,
            }
          : {}),
      };
      setTotalFees(calculateTotalFees(newCourses));
      return { ...prev, courses: newCourses };
    });
  };

  const handleSelectCourse = (index: number, course: TCourse) =>
    updateCourseData(index, "course", course.id);
  const handleSelectOffer = (index: number, offer: TOffer) => {
    setStudentData((prev) => {
      if (!prev) return prev;
      const newCourses = [...prev.courses];
      newCourses[index] = {
        ...newCourses[index],
        offer: offer.id ?? null,
        startDate: new Date(),
        endDate: offer.courseDays
          ? new Date(Date.now() + offer.courseDays * 24 * 60 * 60 * 1000)
          : new Date(),
      };
      setTotalFees(calculateTotalFees(newCourses));
      return { ...prev, courses: newCourses };
    });
  };
  const handleSelectBatch = (index: number, batch: TBatch) =>
    updateCourseData(index, "batch", batch.id);
  const handleSelectRoom = (index: number, room: TRoom) =>
    updateCourseData(index, "room", room.id);

  const addCourse = () => {
    setStudentData((prev) =>
      prev
        ? {
            ...prev,
            courses: [
              ...prev.courses,
              {
                course: null,
                offer: null,
                batch: null,
                room: null,
                startDate: null,
                endDate: null,
              },
            ],
          }
        : prev
    );
  };
  const removeCourse = (index: number) => {
    setStudentData((prev) => {
      if (!prev) return prev;
      const newCourses = prev.courses.filter((_, i) => i !== index);
      setTotalFees(calculateTotalFees(newCourses));
      return { ...prev, courses: newCourses };
    });
  };

  /** --- Input handlers --- */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof TStudent
  ) => {
    const value = e.target.value === "" ? null : e.target.value;
    setStudentData((prev) => (prev ? { ...prev, [field]: value } : prev));
    if (errors[field]) {
      const updated = { ...errors };
      delete updated[field];
      setErrors(updated);
    }
  };

  const handleDateChange = (date: Date | null, field: keyof TStudent) => {
    setStudentData((prev) => (prev ? { ...prev, [field]: date } : prev));
  };

  /** --- Submit --- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentData || !id) return;
    setLoading(true);
    setErrors({});

    try {
      await updateStudentRequest(id, studentData);
      showToast("Enrollment updated successfully", "success");
      showMessage("Enrollment updated successfully!", MESSAGE_TYPE.SUCCESS);
      setAlertMessage("Enrollment updated successfully!");
      navigate("/student");
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        if (err.response?.data?.data?.details) {
          const validationErrors: Record<string, string> = {};
          err.response.data.data.details.forEach(
            (d: { path: string[]; message: string }) => {
              validationErrors[d.path[0]] = d.message;
            }
          );
          setErrors(validationErrors);
        }
        const msg =
          err.response?.data?.message ||
          err.message ||
          "Failed to update enrollment.";
        showToast(msg, "error");
      } else {
        showToast("Unexpected error occurred.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  /** --- Render form --- */
  return (
    <div className="card shadow-sm">
      <div className="card-header d-flex justify-content-between align-items-center">
        <PageBreadcrumb pageTitle="✏️ Edit Student Enrollment" />
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => navigate("/student")}
        >
          ← Back
        </button>
      </div>

      <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
        <div className="d-flex gap-3 flex-wrap">
          {steps.map((step) => (
            <button
              key={step.id}
              type="button"
              onClick={() => {
                setCurrentStep(step.id);
                setShowAll(false);
              }}
              className={`btn btn-md fw-bold ${
                currentStep === step.id && !showAll
                  ? "btn-success"
                  : "btn-outline-secondary"
              }`}
            >
              {step.label}: {step.title}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="btn btn-soft-primary"
          onClick={() => setShowAll((prev) => !prev)}
        >
          {showAll ? "🔒 Exit Show All" : "👀 Show All"}
        </button>
      </div>

      <div className="card-body">
        <form onSubmit={handleSubmit}>
          {(showAll || currentStep === 1) && (
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <PersonalInfoSection
                  studentData={studentData}
                  handleChange={handleChange}
                  handleDateChange={handleDateChange}
                  errors={errors}
                />
              </div>
              <div className="col-12 col-md-6">
                <IdAndProfileSectionEdit
                  studentData={studentData}
                  setStudentData={setStudentData}
                />
              </div>
            </div>
          )}
          {(showAll || currentStep === 2) && (
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <GuardianInfoSection
                  studentData={studentData}
                  handleChange={handleChange}
                />
              </div>
              <div className="col-12 col-md-6">
                <AdditionalInfoSection
                  studentData={studentData}
                  handleChange={handleChange}
                  handleDateChange={handleDateChange}
                />
              </div>
            </div>
          )}
          {(showAll || currentStep === 3) && (
            <>
              {studentData.courses.map((c, index) => {
                const selectedCourse = c.course
                  ? courses.find((cr) => cr.id === c.course) ?? null
                  : null;
                const selectedOffer = c.offer
                  ? selectedCourse?.offers?.find((o) => o.id === c.offer) ??
                    null
                  : null;

                return (
                  <div className="card mb-3" key={index}>
                    <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
                        <span>
                          <strong>📚 Course {index + 1}</strong>
                          <br />
                          {selectedOffer && (
                            <span className="badge bg-info text-dark ms-2 mt-3">
                              ₹{selectedOffer.amount?.toLocaleString("en-IN")}
                            </span>
                          )}
                        </span>
                      <div className="d-flex align-items-center gap-2 flex-wrap">
                        <div className="d-flex gap-1 align-items-center">
                          <div>
                            <label className="form-label small">
                              📅 Start Date
                            </label>
                            <DatePicker
                              id={`startdate-${index}`}
                              value={c.startDate ? [c.startDate] : []}
                              onChange={(val) =>
                                updateCourseData(
                                  index,
                                  "startDate",
                                  Array.isArray(val) ? val[0] : val
                                )
                              }
                              className="form-control form-control-sm"
                            />
                          </div>
                          <div>
                            <label className="form-label small">
                              📅 End Date
                            </label>
                            <DatePicker
                              id={`enddate-${index}`}
                              value={c.endDate ? [c.endDate] : []}
                              onChange={(val) =>
                                updateCourseData(
                                  index,
                                  "endDate",
                                  Array.isArray(val) ? val[0] : val
                                )
                              }
                              className="form-control form-control-sm"
                            />
                          </div>
                        </div>
                      </div>
                      {studentData.courses.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeCourse(index)}
                          className="btn btn-danger btn-sm fw-bold"
                        >
                          ❌ Remove
                        </button>
                      )}
                    </div>
                    <div className="card-body">
                      <div className="row g-3">
                        <div className="col-12 col-md-3">
                          <CourseCard
                            selectedCourse={selectedCourse}
                            onSelectCourse={() => setCourseModalOpen(index)}
                            onClearCourse={() =>
                              updateCourseData(index, "course", null)
                            }
                          />
                        </div>
                        <div className="col-12 col-md-3">
                          <OfferCard
                            selectedCourse={selectedCourse}
                            selectedOffer={selectedOffer}
                            onSelectOffer={() => setOfferModalOpen(index)}
                            onClearOffer={() =>
                              updateCourseData(index, "offer", null)
                            }
                          />
                        </div>
                        <div className="col-12 col-md-3">
                          <BatchCard
                            selectedOffer={selectedOffer}
                            selectedBatch={
                              c.batch
                                ? batches.find((b) => b.id === c.batch) ?? null
                                : null
                            }
                            onSelectBatch={() => setBatchModalOpen(index)}
                            onClearBatch={() =>
                              updateCourseData(index, "batch", null)
                            }
                          />
                        </div>
                        <div className="col-12 col-md-3">
                          <RoomCard
                            selectedBatch={
                              c.batch
                                ? batches.find((b) => b.id === c.batch) ?? null
                                : null
                            }
                            selectedRoom={
                              c.room
                                ? rooms.find((r) => r.id === c.room) ?? null
                                : null
                            }
                            onSelectRoom={() => setRoomModalOpen(index)}
                            onClearRoom={() =>
                              updateCourseData(index, "room", null)
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="d-flex justify-content-start mb-3">
                <button
                  type="button"
                  onClick={addCourse}
                  className="btn btn-primary btn-sm fw-bold"
                >
                  ➕ Add Another Course
                </button>
              </div>

              <ComponentCard title="💰 Payment & Installments">
                <PaymentSection
                  totalFees={totalFees}
                  setTotalFees={(fees) => {
                    setTotalFees(fees);
                    setStudentData((prev) =>
                      prev
                        ? {
                            ...prev,
                            payment: {
                              ...prev.payment,
                              totalFees: fees,
                              installments: [
                                ...(installments ||
                                  prev.payment?.installments ||
                                  []),
                              ],
                            },
                          }
                        : prev
                    );
                  }}
                  installments={installments}
                  setInstallments={(insts) => {
                    setInstallments(insts);
                    const newInstallments =
                      typeof insts === "function" ? insts(installments) : insts;
                    setStudentData((prev) =>
                      prev
                        ? {
                            ...prev,
                            payment: {
                              ...prev.payment,
                              totalFees: totalFees,
                              installments: [...newInstallments],
                            },
                          }
                        : prev
                    );
                  }}
                />
              </ComponentCard>

              <div className="d-flex justify-content-end mt-4">
                <button
                  type="submit"
                  className={`px-5 btn ${
                    loading ? "btn-primary" : "btn-success"
                  }`}
                  disabled={loading}
                >
                  {loading ? "⏳ Submitting..." : "💾 Update Enrollment"}
                </button>
              </div>
            </>
          )}
        </form>
      </div>

      {courseModalOpen !== null && (
        <CourseModal
          open={true}
          courses={courses}
          selectedCourse={
            studentData.courses[courseModalOpen].course
              ? courses.find(
                  (cr) => cr.id === studentData.courses[courseModalOpen].course
                ) ?? null
              : null
          }
          searchQuery={courseSearchQuery}
          setSearchQuery={setCourseSearchQuery}
          onSelectCourse={(course) =>
            handleSelectCourse(courseModalOpen, course)
          }
          onClose={() => setCourseModalOpen(null)}
        />
      )}
      {offerModalOpen !== null && (
        <OfferModal
          open={true}
          course={
            offerModalOpen !== null &&
            studentData.courses[offerModalOpen].course
              ? courses.find(
                  (cr) => cr.id === studentData.courses[offerModalOpen].course
                ) ?? null
              : null
          }
          offers={
            offerModalOpen !== null &&
            studentData.courses[offerModalOpen].course
              ? courses.find(
                  (cr) => cr.id === studentData.courses[offerModalOpen].course
                )?.offers ?? []
              : []
          }
          selectedOffer={
            offerModalOpen !== null && studentData.courses[offerModalOpen].offer
              ? courses
                  .find(
                    (cr) => cr.id === studentData.courses[offerModalOpen].course
                  )
                  ?.offers?.find(
                    (o) => o.id === studentData.courses[offerModalOpen].offer
                  ) ?? null
              : null
          }
          searchQuery={offerSearchQuery}
          setSearchQuery={setOfferSearchQuery}
          onSelectOffer={(offer) => handleSelectOffer(offerModalOpen!, offer)}
          onCloseOffer={() => setOfferModalOpen(null)}
        />
      )}
      {batchModalOpen !== null && (
        <BatchModal
          open={true}
          batches={batches}
          selectedBatch={
            studentData.courses[batchModalOpen].batch
              ? batches.find(
                  (b) => b.id === studentData.courses[batchModalOpen].batch
                ) ?? null
              : null
          }
          onSelectBatch={(batch) => {
            handleSelectBatch(batchModalOpen!, batch);
            setBatchModalOpen(null);
          }}
          onClose={() => setBatchModalOpen(null)}
        />
      )}
      {roomModalOpen !== null && (
        <RoomModal
          open={true}
          selectedRoom={
            studentData.courses[roomModalOpen].room
              ? rooms.find(
                  (r) => r.id === studentData.courses[roomModalOpen].room
                ) ?? null
              : null
          }
          selectedBatch={
            studentData.courses[roomModalOpen].batch
              ? batches.find(
                  (b) => b.id === studentData.courses[roomModalOpen].batch
                ) ?? null
              : null
          }
          onSelectRoom={(room) => {
            handleSelectRoom(roomModalOpen!, room);
            setRoomModalOpen(null);
          }}
          onClose={() => setRoomModalOpen(null)}
        />
      )}
    </div>
  );
}
