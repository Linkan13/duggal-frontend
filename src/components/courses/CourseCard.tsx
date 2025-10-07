import { TCourse } from "@/types";

interface CourseCardProps {
  selectedCourse: TCourse | null;
  onSelectCourse: () => void;
  onClearCourse: () => void;
}

export default function CourseCard({
  selectedCourse,
  onSelectCourse,
  onClearCourse,
}: CourseCardProps) {
  return (
    <div className="card shadow-sm rounded-4 p-3 m-0">
      <h6 className="fw-bold text-secondary mb-3">📚 Course</h6>

      {selectedCourse ? (
        <div className="border rounded-3 p-3 bg-primary bg-opacity-10 mb-3">
          <h5 className="fw-bold text-primary mb-2">
            📚 {selectedCourse.courseName}
          </h5>

          {selectedCourse.courseCode && (
            <p className="mb-1 text-muted">
              <strong>Code: </strong>
              <span className="fw-semibold">{selectedCourse.courseCode}</span>
            </p>
          )}

          {selectedCourse.description && (
            <p className="mb-0 text-muted">
              <strong>Details:</strong> {selectedCourse.description}
            </p>
          )}
        </div>
      ) : (
        <></>
        // <p className="text-muted mb-3">⚠️ No course selected</p>
      )}

      <div className="d-flex gap-2">
        {selectedCourse ? (
          <button
            type="button"
            className="btn btn-outline-danger flex-grow-1"
            onClick={onClearCourse}
          >
            ❌ Clear
          </button>
        ) : (
          <button
            type="button"
            className="btn flex-grow-1 btn-success text-white"
            onClick={onSelectCourse}
          >
            ➕ Select Course 📚
          </button>
        )}
      </div>
    </div>
  );
}
