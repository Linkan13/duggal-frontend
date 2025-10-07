import Input from "../../components/form/input/InputField";
import { TCourse } from "@/types";

interface CourseModalProps {
  open: boolean;
  courses: TCourse[];
  selectedCourse: TCourse | null;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  onSelectCourse: (course: TCourse) => void;
  onClose: () => void;
}

export default function CourseModal({
  open,
  courses,
  selectedCourse,
  searchQuery,
  setSearchQuery,
  onSelectCourse,
  onClose,
}: CourseModalProps) {
  if (!open) return null;

  const filteredCourses = courses.filter((c) =>
    c.courseName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="modal fade show d-block">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content rounded-3 shadow-sm border-0">
            <div className="modal-header">
              <div className="row col-12">
                <div className="col-12 col-md-6">
                  <h5 className="modal-title mb-1">📚 Select a Course</h5>
                </div>
                <div className="col-12 col-md-6">
                  <Input
                    placeholder="Search courses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="form-control"
                  />
                </div>
              </div>
            </div>
            <div
              className="modal-body"
              style={{ maxHeight: "400px", overflowY: "auto" }}
            >
              <div className="row gx-3 gy-3">
                {filteredCourses.map((c) => (
                  <div key={c.id} className="col-12 col-sm-6">
                    <button
                      type="button"
                      className={`w-100 text-start p-3 mb-2 rounded-2 border shadow-sm ${
                        selectedCourse?.id === c.id
                          ? "border-primary bg-primary-transparent shadow"
                          : "border-light bg-white"
                      }`}
                      onClick={() => {
                        onSelectCourse(c);
                        onClose();
                      }}
                    >
                      <h5 className="mb-1">{c.courseName}</h5>
                      {c.courseCode && (
                        <p className="small text-muted mb-0">
                          Code: {c.courseCode}
                        </p>
                      )}
                      {c.description && (
                        <p className="small text-muted fst-italic mb-0">
                          {c.description}
                        </p>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-footer bg-light">
              <button
                type="button"
                className="btn text-black border-black btn-soft-danger btn-md"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" onClick={onClose}></div>
    </>
  );
}
