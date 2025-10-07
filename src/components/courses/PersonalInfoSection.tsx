import ComponentCard from "../../components/common/ComponentCard";
import Input from "../../components/form/input/InputField";
import DatePicker from "../../components/form/date-picker";
import { TStudent } from "@/types";

interface PersonalInfoSectionProps {
  studentData: TStudent;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof TStudent
  ) => void;
  handleDateChange: (date: Date | null, field: keyof TStudent) => void;
  errors: Record<string, string>; // ✅ added
}

export default function PersonalInfoSection({
  studentData,
  handleChange,
  handleDateChange,
  errors,
}: PersonalInfoSectionProps) {
  return (
    <ComponentCard title="👤 Personal Info">
      <div className="row g-3">
        {/* First Name */}
        <div className="col-md-6">
          <label className="form-label">First Name *</label>
          <Input
            type="text"
            value={studentData.firstName || ""}
            onChange={(e) => handleChange(e, "firstName")}
            className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
          />
          {errors.firstName && (
            <div className="invalid-feedback d-block">{errors.firstName}</div>
          )}
        </div>

        {/* Middle Name */}
        <div className="col-md-6">
          <label className="form-label">Middle Name</label>
          <Input
            type="text"
            value={studentData.middleName || ""}
            onChange={(e) => handleChange(e, "middleName")}
            className="form-control"
          />
        </div>

        {/* Last Name */}
        <div className="col-md-6">
          <label className="form-label">Last Name *</label>
          <Input
            type="text"
            value={studentData.lastName || ""}
            onChange={(e) => handleChange(e, "lastName")}
            className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
          />
          {errors.lastName && (
            <div className="invalid-feedback d-block">{errors.lastName}</div>
          )}
        </div>

        <div className="col-md-6">
          <label className="form-label">Gender</label>
          <div className="btn-group w-100" role="group">
            <div className="btn-group w-100" role="group">
              {["Male", "Female"].map((g) => {
                const isActive = studentData.gender === g;

                const classes = `
      btn
      rounded
      px-4
      py-2
      me-2   /* spacing between buttons */
      fw-normal  /* lighter text */
      ${
        g === "Male"
          ? isActive
            ? "male-selected"
            : "male-default"
          : isActive
          ? "female-selected"
          : "female-default"
      }
    `;

                return (
                  <label key={g} className={classes.trim()}>
                    <input
                      type="radio"
                      name="gender"
                      value={g}
                      checked={isActive}
                      onChange={(e) => handleChange(e, "gender")}
                      className="d-none"
                    />
                    {g}
                  </label>
                );
              })}
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <label className="form-label">DOB *</label>
          <DatePicker
            id="dob"
            label=""
            placeholder="Select DOB"
            value={studentData.dob ?? undefined}
            onChange={(dates) => handleDateChange(dates?.[0] || null, "dob")}
            className={`form-control rounded-start rounded-0 ${
              errors.dob ? "is-invalid" : ""
            }`}
          />
          {errors.dob && (
            <div className="invalid-feedback d-block">{errors.dob}</div>
          )}
        </div>

        {/* Phone */}
        <div className="col-md-6">
          <label className="form-label">Phone *</label>
          <Input
            type="text"
            value={studentData.phone || ""}
            onChange={(e) => handleChange(e, "phone")}
            className={`form-control ${errors.phone ? "is-invalid" : ""}`}
          />
          {errors.phone && (
            <div className="invalid-feedback d-block">{errors.phone}</div>
          )}
        </div>

        {/* Email */}
        <div className="col-md-6">
          <label className="form-label">Email *</label>
          <Input
            type="email"
            value={studentData.email || ""}
            onChange={(e) => handleChange(e, "email")}
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
          />
          {errors.email && (
            <div className="invalid-feedback d-block">{errors.email}</div>
          )}
        </div>

        {/* Nationality */}
        <div className="col-md-6">
          <label className="form-label">Nationality</label>
          <Input
            type="text"
            value={studentData.nationality || ""}
            onChange={(e) => handleChange(e, "nationality")}
            className="form-control"
          />
        </div>

        {/* Address */}
        <div className="col-12">
          <label className="form-label">Address</label>
          <textarea
            value={studentData.address || ""}
            onChange={(e) => handleChange(e, "address")}
            className="form-control"
            rows={3}
          />
        </div>
      </div>
    </ComponentCard>
  );
}
