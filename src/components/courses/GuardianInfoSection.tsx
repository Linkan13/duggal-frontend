import ComponentCard from "../../components/common/ComponentCard";
import Input from "../../components/form/input/InputField";
import { TStudent } from "@/types";

interface GuardianInfoSectionProps {
  studentData: TStudent;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof TStudent
  ) => void;
}

export default function GuardianInfoSection({
  studentData,
  handleChange,
}: GuardianInfoSectionProps) {
  return (
    <ComponentCard title="🧑 Guardian Info">
      <div className="row g-3">
        {/* Guardian Name */}
        <div className="col-md-6">
          <label className="form-label">Guardian Name</label>
          <Input
            type="text"
            value={studentData.guardianName ?? ""}
            onChange={(e) => handleChange(e, "guardianName")}
            className="form-control"
          />
        </div>

        {/* Guardian Phone */}
        <div className="col-md-6">
          <label className="form-label">Guardian Phone</label>
          <Input
            type="text"
            value={studentData.guardianPhone ?? ""}
            onChange={(e) => handleChange(e, "guardianPhone")}
            className="form-control"
          />
        </div>

        {/* Emergency Contact Name */}
        <div className="col-md-6">
          <label className="form-label">Emergency Contact Name</label>
          <Input
            type="text"
            value={studentData.emergencyContactName ?? ""}
            onChange={(e) => handleChange(e, "emergencyContactName")}
            className="form-control"
          />
        </div>

        {/* Emergency Contact Phone */}
        <div className="col-md-6">
          <label className="form-label">Emergency Contact Phone</label>
          <Input
            type="text"
            value={studentData.emergencyContactPhone ?? ""}
            onChange={(e) => handleChange(e, "emergencyContactPhone")}
            className="form-control"
          />
        </div>
      </div>
    </ComponentCard>
  );
}
