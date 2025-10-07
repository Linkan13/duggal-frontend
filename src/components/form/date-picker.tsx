import { useEffect } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import Label from "./Label";
import { CalenderIcon } from "../../icons";
import Hook = flatpickr.Options.Hook;
import DateOption = flatpickr.Options.DateOption;

type PropsType = {
  id: string;
  mode?: "single" | "multiple" | "range" | "time";
  onChange?: Hook | Hook[];
  defaultDate?: DateOption;
  value?: DateOption | DateOption[];
  label?: string;
  placeholder?: string;
  className?: string;
};

export default function DatePicker({
  id,
  mode = "single",
  onChange,
  defaultDate,
  value,
  label,
  placeholder,
  className = "",
}: PropsType) {
  useEffect(() => {
    const fp = flatpickr(`#${id}`, {
      mode,
      dateFormat: "d-m-Y",
      defaultDate: value || defaultDate,
      onChange,
      position: "above",
      static: true,
      monthSelectorType: "static",
      appendTo: document.body,
    });

    return () => {
      if (!Array.isArray(fp)) fp.destroy();
    };
  }, [id, mode, onChange, value, defaultDate]);

  return (
    <div>
      {label && <Label htmlFor={id}>{label}</Label>}
      <div className="position-relative">
        {label && <Label htmlFor={id}>{label}</Label>}

        <div className="input-group">
          <input
            id={id}
            placeholder={placeholder}
            className={`form-control ${className}`}
            style={{ height: "40px" }}
            readOnly
          />
          <span
            className="input-group-text bg-white border-start rounded-end"
            style={{ borderRadius: 0 }}
          >
            <CalenderIcon className="size-5 text-muted" />
          </span>
        </div>
      </div>
    </div>
  );
}
