import ComponentCard from "../../components/common/ComponentCard";
import Input from "../../components/form/input/InputField";
import { TStudent } from "../../types/StudentTypes";
import DatePicker from "../../components/form/date-picker";

interface AdditionalInfoSectionProps {
  studentData: TStudent;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof TStudent
  ) => void;
  handleDateChange: (date: Date | null, field: keyof TStudent) => void;
}

export default function AdditionalInfoSection({
  studentData,
  handleChange,
  handleDateChange,
}: AdditionalInfoSectionProps) {
  return (
    <ComponentCard title="📌 Additional Info">
      <div className="row g-3">
        {/* Student Mobile */}
        <div className="col-md-6">
          <label className="form-label">Mobile</label>
          <Input
            type="text"
            value={studentData.mobileOther ?? ""}
            onChange={(e) => handleChange(e, "mobileOther")}
            className="form-control"
          />
        </div>

        {/* Student Email */}
        <div className="col-md-6">
          <label className="form-label">Email</label>
          <Input
            type="email"
            value={studentData.emailOther ?? ""}
            onChange={(e) => handleChange(e, "emailOther")}
            className="form-control"
          />
        </div>

        {/* Joined on */}
        <div className="col-md-6">
          <label className="form-label">Joined on</label>
          <DatePicker
            id="joinedDate"
            label=""
            placeholder="Joined on"
            value={studentData.joinedDate ?? undefined}
            onChange={(dates) =>
              handleDateChange(dates?.[0] || null, "joinedDate")
            }
            className="form-control rounded-start rounded-0"
          />
        </div>
      </div>
    </ComponentCard>
  );
}
