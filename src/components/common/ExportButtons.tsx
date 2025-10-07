// components/common/ExportButtons.tsx
import { FileExport, FileText, File, FileSpreadsheet } from "tabler-icons-react";

interface ExportButtonsProps {
  onCSV: () => void;
  onPDF: () => void;
  onExcel: () => void;
}

export default function ExportButtons({ onCSV, onPDF, onExcel }: ExportButtonsProps) {
  return (
    <div className="dropdown me-3">
      <button className="btn btn-white border border-black d-inline-flex align-items-center">
        <FileExport size={16} className="me-1" /> Export
      </button>
      <ul className="dropdown-menu dropdown-menu-end p-3">
        <li>
          <button className="dropdown-item" onClick={onCSV}>
            <FileText size={16} className="me-1" /> CSV
          </button>
        </li>
        <li>
          <button className="dropdown-item" onClick={onPDF}>
            <File size={16} className="me-1" /> PDF
          </button>
        </li>
        <li>
          <button className="dropdown-item" onClick={onExcel}>
            <FileSpreadsheet size={16} className="me-1" /> Excel
          </button>
        </li>
      </ul>
    </div>
  );
}
