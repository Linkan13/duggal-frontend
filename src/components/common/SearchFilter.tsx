// components/common/SearchFilter.tsx
interface SearchFilterProps {
    placeholder?: string;
    value: string;
    onChange: (val: string) => void;
  }
  
  export default function SearchFilter({ placeholder, value, onChange }: SearchFilterProps) {
    return (
      <div className="dataTables_filter">
        <label>
          <input
            type="text"
            placeholder={placeholder || "Search..."}
            className="form-control form-control-sm"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        </label>
      </div>
    );
  }
  