import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { showMessage, MESSAGE_TYPE } from "@/utils/notify";
import { setAlertMessage } from "@/utils/alertService";
import {
  createCourseRequest,
  listOfferRequest,
} from "@/client/endpoints/student";
import { TOfferList } from "@/types";

interface CourseData {
  courseName: string;
  courseCode: string;
  description: string;
  offers: string[];
}

export default function AddCourseForm() {
  const navigate = useNavigate();

  const [courseData, setCourseData] = useState<CourseData>({
    courseName: "",
    courseCode: "",
    description: "",
    offers: [],
  });

  const [offersList, setOffersList] = useState<TOfferList[]>([]);
  const [offersLoading, setOffersLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // --- Fetch offers ---
  useEffect(() => {
    let isFetched = false;
    const fetchOffers = async () => {
      if (isFetched) return;
      isFetched = true;
      setOffersLoading(true);
      try {
        const res = await listOfferRequest({ skip: 0, size: 100 });
        const offersArray = Array.isArray(res?.data?.data) ? res.data.data : [];
        setOffersList(offersArray);
      } catch (err) {
        console.error("Failed to fetch offers:", err);
        setOffersList([]);
      } finally {
        setOffersLoading(false);
      }
    };
    fetchOffers();
  }, []);

  // --- Handle input change ---
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof CourseData
  ) => {
    const value =
      e.target.type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : e.target.value;
    setCourseData((prev) => ({ ...prev, [field]: value }));
  };

  // --- Toggle offer selection ---
  const toggleOffer = (offerId: string) => {
    setCourseData((prev) => {
      const isSelected = prev.offers.includes(offerId);
      return {
        ...prev,
        offers: isSelected
          ? prev.offers.filter((id) => id !== offerId)
          : [...prev.offers, offerId],
      };
    });
  };

  // --- Submit form ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!courseData.courseName) {
      const msg = "Course Name is required.";
      setError(msg);
      showMessage(msg, MESSAGE_TYPE.ERROR);
      return;
    }

    setLoading(true);
    try {
      await createCourseRequest(courseData);
      setAlertMessage("Course added successfully!");
      showMessage("Course added successfully!", MESSAGE_TYPE.SUCCESS);

      setCourseData({
        courseName: "",
        courseCode: "",
        description: "",
        offers: [],
      });

      navigate("/course");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      setError(msg);
      showMessage(msg, MESSAGE_TYPE.ERROR);
    } finally {
      setLoading(false);
    }
  };

  const filteredOffers = offersList.filter((offer) =>
    offer.offerName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isSubmitDisabled = !courseData.courseName || loading;

  return (
    <div className="card shadow-sm">
      <div className="card-header d-flex justify-content-between align-items-center">
        <PageBreadcrumb pageTitle="📚 Add New Course" />
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => navigate("/course")}
        >
          ← Back
        </button>
      </div>

      <div className="card-body">
        {error && (
          <div className="alert alert-danger mb-4 text-center">{error}</div>
        )}

        <form onSubmit={handleSubmit} autoComplete="off">
          {/* Course Name & Code */}
          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label htmlFor="courseName" className="form-label fw-semibold">
                Course Name *
              </label>
              <input
                type="text"
                id="courseName"
                name="courseName"
                className="form-control"
                value={courseData.courseName}
                onChange={(e) => handleChange(e, "courseName")}
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="courseCode" className="form-label fw-semibold">
                Course Code
              </label>
              <input
                type="text"
                id="courseCode"
                name="courseCode"
                className="form-control"
                value={courseData.courseCode}
                onChange={(e) => handleChange(e, "courseCode")}
              />
            </div>
          </div>

          {/* Description */}
          <div className="mb-3">
            <label htmlFor="description" className="form-label fw-semibold">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              className="form-control"
              value={courseData.description}
              onChange={(e) => handleChange(e, "description")}
              rows={3}
            />
          </div>

          <label className="form-label fw-semibold">Search Offers</label>
          {/* Offers Selection */}
          <div className="mb-4">
            {offersLoading ? (
              <>
                <p className="text-center text-muted">⏳ Loading offers...</p>
              </>
            ) : filteredOffers.length === 0 ? (
              <p className="text-center text-muted">❌ No offers found</p>
            ) : (
              <div className="row g-3">
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Search offers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {filteredOffers.map((offer) => {
                  if (!offer.id || !offer.offerName) return null;
                  const isSelected = courseData.offers.includes(offer.id);

                  return (
                    <div key={offer.id} className="col-12 col-md-6 col-lg-4">
                      <div
                        onClick={() => toggleOffer(offer.id)}
                        className={`p-2 border rounded cursor-pointer position-relative shadow-sm
                      ${
                        isSelected
                          ? "border-primary bg-light"
                          : "border-secondary bg-white"
                      }
                      ${offer.featured ? "border-warning" : ""}`}
                      >
                        <div className="mb-1 position-relative p-0">
                          {offer.featured && (
                            <span className="position-absolute top-0 end-0 badge bg-warning text-dark m-1">
                              ⭐ Featured
                            </span>
                          )}
                          <h5 className="mb-1">{offer.offerName}</h5>
                          {offer.courseDays && (
                            <h6 className="small mb-1">
                              📅 {offer.courseDays} Days
                            </h6>
                          )}
                        </div>
                        <p className="mb-1 text-sm">💰 {offer.amount}</p>
                        {offer.discount && (
                          <p className="mb-0 text-sm text-success">
                            🎉 {offer.discount}% OFF
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="d-flex justify-content-center mt-4">
            <button
              type="submit"
              className="btn btn-primary btn-lg px-5"
              disabled={isSubmitDisabled}
            >
              {loading ? "⏳ Saving..." : "➕ Add Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
