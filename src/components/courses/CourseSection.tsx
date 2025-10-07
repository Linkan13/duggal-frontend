import { useState, useEffect, useRef, useCallback } from "react";
import DatePicker from "../../components/form/date-picker";
import { Installment, TCourse, TOffer, TBatch, TRoom } from "@/types";
import ComponentCard from "../../components/common/ComponentCard";
import CourseCard from "../../components/courses/CourseCard";
import OfferCard from "../../components/courses/OfferCard";
import CourseModal from "../../components/courses/CourseModal";
import OfferModal from "../../components/courses/OfferModal";
import {
  listCourseRequest,
  listBatchRequest,
} from "@/client/endpoints/student";
import BatchCard from "../../components/courses/BatchCard";
import BatchModal from "../../components/courses/BatchModal";
import RoomModal from "../../components/courses/RoomModal";
import RoomCard from "../../components/courses/RoomCard";

interface CourseSectionProps {
  course: string | null;
  offer: string | null;
  batch: string | null;
  room: string | null;
  onChange: (
    field: "course" | "offer" | "batch" | "room",
    value: string | null
  ) => void;
  onDatesChange?: (start: Date | null, end: Date | null) => void;
  onPaymentsChange?: (totalFees: number, installments: Installment[]) => void;
}

export default function CourseSection({
  course,
  offer,
  onChange,
  onDatesChange,
  onPaymentsChange,
}: CourseSectionProps) {
  const [batches, setBatches] = useState<TBatch[]>([]);
  const [courses, setCourses] = useState<TCourse[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<TCourse | null>(null);
  const [offers, setOffers] = useState<TOffer[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<TOffer | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [totalFees, setTotalFees] = useState(0);
  const [installments, setInstallments] = useState<Installment[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<TRoom | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<TBatch | null>(null);

  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [batchModalOpen, setBatchModalOpen] = useState(false);
  const [roomModalOpen, setRoomModalOpen] = useState(false);

  const [paymentEnabled, setPaymentEnabled] = useState(false);

  const coursesRef = useRef<TCourse[]>([]);
  const fetchedCoursesRef = useRef(false);
  const fetchedBatchesRef = useRef(false);

  // Fetch courses
  useEffect(() => {
    if (!fetchedCoursesRef.current) {
      fetchedCoursesRef.current = true;
      fetchCourses();
    }
  }, []);

  const fetchCourses = async () => {
    if (coursesRef.current.length > 0) {
      setCourses(coursesRef.current);
      return;
    }
    try {
      const res = await listCourseRequest({ skip: 0, size: 100 });
      if (res?.data?.data && Array.isArray(res.data.data)) {
        coursesRef.current = res.data.data;
        setCourses(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  // Fetch batches
  useEffect(() => {
    if (fetchedBatchesRef.current) return;
    fetchedBatchesRef.current = true;

    const fetchBatches = async () => {
      try {
        const res = await listBatchRequest({ skip: 0, size: 100 });
        if (res?.data?.data && Array.isArray(res.data.data)) {
          setBatches(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching batches:", err);
      }
    };
    fetchBatches();
  }, []);

  // ==== Handlers wrapped in useCallback for stability ====
  const handleClearOffer = useCallback(() => {
    setSelectedOffer(null);
    onChange("offer", null);
    setTotalFees(0);
    setInstallments([]);
    setStartDate(null);
    setEndDate(null);
    setPaymentEnabled(false);
    setSelectedBatch(null);
    setSelectedRoom(null);
    onChange("batch", null);
    onChange("room", null);
  }, [onChange]);

  const handleClearBatch = useCallback(() => {
    setSelectedBatch(null);
    setSelectedRoom(null);
    onChange("batch", null);
    onChange("room", null);
  }, [onChange]);

  const handleClearRoom = useCallback(() => {
    setSelectedRoom(null);
    onChange("room", null);
  }, [onChange]);

  const handleClearCourse = useCallback(() => {
    setSelectedCourse(null);
    onChange("course", null);
    handleClearOffer();
  }, [onChange, handleClearOffer]);

  // ==== Sync selected course and offer safely ====
  useEffect(() => {
    const selCourse = courses.find((c) => c.id === course) || null;
    if (selCourse && selCourse.id !== selectedCourse?.id) {
      setSelectedCourse(selCourse);
    }

    if (!selCourse) {
      handleClearOffer();
      return;
    }

    const courseOffers = selCourse.offers ?? [];
    setOffers(courseOffers);

    const selOffer = courseOffers.find((o) => o.id === offer) || null;
    if (selOffer && selOffer.id !== selectedOffer?.id) {
      setSelectedOffer(selOffer);
    }

    if (selOffer) {
      const today = new Date();

      setTotalFees(selOffer.amount ?? 0);
      setStartDate(today);
      if (selOffer.courseDays) {
        const end = new Date(today);
        end.setDate(today.getDate() + selOffer.courseDays);
        setEndDate(end);
      }
    } else {
      setTotalFees(0);
      setStartDate(null);
      setEndDate(null);
      setInstallments([]);
    }
  }, [course, offer, courses]);

  // Enable payment only if room is selected
  useEffect(() => {
    setPaymentEnabled(Boolean(selectedRoom));
  }, [selectedRoom]);

  // Notify parent about dates
  useEffect(() => {
    onDatesChange?.(startDate, endDate);
  }, [startDate, endDate, onDatesChange]);

  // Notify parent about payments
  useEffect(() => {
    onPaymentsChange?.(totalFees, installments);
  }, [totalFees, installments, onPaymentsChange]);

  // ==== Selection handlers ====
  const handleSelectCourse = (c: TCourse) => {
    setSelectedCourse(c);
    onChange("course", c.id ?? null);
    handleClearOffer();
    setCourseModalOpen(false);
  };

  const handleSelectOffer = (o: TOffer) => {
    setSelectedOffer(o);
    onChange("offer", o.id ?? null);
    setTotalFees(o.amount ?? 0);

    const today = new Date();
    setStartDate(today);
    if (o.courseDays) {
      const end = new Date(today);
      end.setDate(today.getDate() + o.courseDays);
      setEndDate(end);
    }

    setPaymentEnabled(false);
    setOfferModalOpen(false);
  };

  const handleSelectBatch = (b: TBatch) => {
    setSelectedBatch(b);
    setSelectedRoom(null);
    onChange("batch", b.id ?? null);
    onChange("room", null);
    setBatchModalOpen(false);
  };

  const handleSelectRoom = (r: TRoom) => {
    setSelectedRoom(r);
    onChange("room", r.id ?? null);
    setRoomModalOpen(false);
  };

  return (
    <>
      <ComponentCard title="📚 Course Selection">
        <div className="row g-3">
          <div className="col-12 col-md-3">
            <CourseCard
              selectedCourse={selectedCourse}
              onSelectCourse={() => setCourseModalOpen(true)}
              onClearCourse={handleClearCourse}
            />
          </div>

          <div className="col-12 col-md-3">
            <OfferCard
              selectedCourse={selectedCourse}
              selectedOffer={selectedOffer}
              onSelectOffer={() => setOfferModalOpen(true)}
              onClearOffer={handleClearOffer}
            />
          </div>

          <div className="col-12 col-md-3">
            <BatchCard
              selectedOffer={selectedOffer}
              selectedBatch={selectedBatch}
              onSelectBatch={() => setBatchModalOpen(true)}
              onClearBatch={handleClearBatch}
            />
          </div>

          <div className="col-12 col-md-3">
            <RoomCard
              selectedBatch={selectedBatch}
              selectedRoom={selectedRoom}
              onSelectRoom={() => setRoomModalOpen(true)}
              onClearRoom={handleClearRoom}
            />
          </div>
        </div>
      </ComponentCard>


      {paymentEnabled && selectedOffer && (
        <ComponentCard title="💰 Payment & Installments" className="">
          <div className="row g-3 mb-3">
            <div className="col-md-3">
              <label htmlFor="startdate" className="form-label">
                Start Date
              </label>
              <DatePicker
                id="startdate"
                value={startDate ? [startDate] : []}
                onChange={(val) =>
                  setStartDate(
                    Array.isArray(val) ? (val[0] as Date) : (val as Date)
                  )
                }
                className="form-control"
              />
            </div>
            <div className="col-md-3">
              <label htmlFor="enddate" className="form-label">
                End Date
              </label>
              <DatePicker
                id="enddate"
                value={endDate ? [endDate] : []}
                onChange={(val) =>
                  setEndDate(
                    Array.isArray(val) ? (val[0] as Date) : (val as Date)
                  )
                }
                className="form-control"
              />
            </div>
          </div>

        </ComponentCard>
      )}

      <CourseModal
        open={courseModalOpen}
        courses={courses}
        selectedCourse={selectedCourse}
        searchQuery=""
        setSearchQuery={() => {}}
        onSelectCourse={handleSelectCourse}
        onClose={() => setCourseModalOpen(false)}
      />

      <OfferModal
        open={offerModalOpen}
        offers={offers}
        selectedOffer={selectedOffer}
        course={selectedCourse}
        searchQuery=""
        setSearchQuery={() => {}}
        onSelectOffer={handleSelectOffer}
        onCloseOffer={() => setOfferModalOpen(false)}
      />

      <BatchModal
        open={batchModalOpen}
        batches={batches}
        selectedBatch={selectedBatch}
        onSelectBatch={handleSelectBatch}
        onClose={() => setBatchModalOpen(false)}
      />

      <RoomModal
        open={roomModalOpen}
        batch={selectedBatch}
        selectedRoom={selectedRoom}
        onSelectRoom={handleSelectRoom}
        onClose={() => setRoomModalOpen(false)}
      />
    </>
  );
}
