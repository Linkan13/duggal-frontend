// components/common/TableActions.tsx
import React from "react";
import {
  FileExport,
  FileText,
  File,
  FileSpreadsheet,
} from "tabler-icons-react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

interface TableActionsProps {
  title: string;
  createBtn: string;
  description: string;
  pageTitle: string;
  downloadCSV: () => void;
  exportPDF: () => void;
  exportExcel: () => void;
  deleteSelected: () => void;
  rowSelectionCount: number;
  convertSelected?: () => void;
  signupSelected?: () => void;
  onCreate: () => void;
}

const TableActions: React.FC<TableActionsProps> = ({
  title,
  createBtn,
  description,
  pageTitle,
  downloadCSV,
  exportPDF,
  exportExcel,
  deleteSelected,
  rowSelectionCount,
  convertSelected,
  signupSelected,
  onCreate,
}) => {
  return (
    <>
      <PageMeta title={title} description={description} />
      <div className="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3">
        <PageBreadcrumb pageTitle={pageTitle} />
        <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
          {/* Export Dropdown */}
          <div className="dropdown me-3 mb-2">
            <a
              href="javascript:void(0);"
              className="dropdown-toggle btn btn-white text-black border border-black d-inline-flex align-items-center"
              data-bs-toggle="dropdown"
            >
              <FileExport size={16} className="me-1" />
              Export
            </a>
            <ul className="dropdown-menu dropdown-menu-end p-3">
              <li>
                <a
                  href="javascript:void(0);"
                  className="dropdown-item rounded-1"
                  onClick={(e) => {
                    e.preventDefault();
                    downloadCSV();
                  }}
                >
                  <FileText size={16} className="me-1" />
                  Export as CSV
                </a>
              </li>
              <li>
                <a
                  href="javascript:void(0);"
                  className="dropdown-item rounded-1"
                  onClick={(e) => {
                    e.preventDefault();
                    exportPDF();
                  }}
                >
                  <File size={16} className="me-1" />
                  Export as PDF
                </a>
              </li>
              <li>
                <a
                  href="javascript:void(0);"
                  className="dropdown-item rounded-1"
                  onClick={(e) => {
                    e.preventDefault();
                    exportExcel();
                  }}
                >
                  <FileSpreadsheet size={16} className="me-1" />
                  Export as Excel
                </a>
              </li>
            </ul>
          </div>
          {signupSelected && (
            <div className="mb-2">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  signupSelected();
                }}
                className={`btn btn-info me-2 ${
                  !rowSelectionCount ? "disabled" : ""
                }`}
              >
                Create Signup 👥
              </a>
            </div>
          )}

          {/* Convert Selected */}
          {convertSelected && (
            <div className="mb-2">
              <a
                href="javascript:void(0)"
                onClick={(e) => {
                  e.preventDefault();
                  convertSelected();
                }}
                className={`btn btn-success me-2 ${
                  !rowSelectionCount ? "disabled" : ""
                }`}
              >
                Convert Selected 🎓
              </a>
            </div>
          )}

          {/* Delete Selected */}
          <div className="mb-2">
            <a
              href="javascript:void(0)"
              onClick={(e) => {
                e.preventDefault();
                deleteSelected();
              }}
              className={`btn btn-danger me-2 ${
                !rowSelectionCount ? "disabled" : ""
              }`}
            >
              Delete Selected 🗑️
            </a>
          </div>

          {/* Create Button */}
          <div className="mb-2">
            <a
              href="javascript:void(0)"
              onClick={(e) => {
                e.preventDefault();
                onCreate();
              }}
              className="btn btn-primary d-flex align-items-center"
            >
              ➕ {createBtn}
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default TableActions;
