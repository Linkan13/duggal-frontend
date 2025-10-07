// components/common/FilterSortBar.tsx
import React from "react";

interface FilterSortBarProps {
  statusFilter: string | null;
  setStatusFilter: (status: string | null) => void;
  statusOptions: string[];
  sortBy: string;
  title: string;
  setSortBy: (sort: string) => void;
  sortOptions: { label: string; value: string }[];
}

const FilterSortBar: React.FC<FilterSortBarProps> = ({
  statusFilter,
  title,
  setStatusFilter,
  statusOptions,
  sortBy,
  setSortBy,
  sortOptions,
}) => {
  return (
    <>
      <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
        <h5>{title}</h5>
        <div className="d-flex my-xl-auto right-content align-items-center flex-wrap row-gap-3">
          <div className="dropdown me-3">
            <a
              href="javascript:void(0);"
              className="dropdown-toggle btn btn-white text-black border border-black d-inline-flex align-items-center"
              data-bs-toggle="dropdown"
            >
              {statusFilter ? `Status: ${statusFilter}` : "Select Status"}
            </a>
            <ul className="dropdown-menu dropdown-menu-end p-3">
              <li key="none">
                <a
                  href="javascript:void(0);"
                  className={`dropdown-item rounded-1 ${
                    !statusFilter ? "active" : ""
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    setStatusFilter(null); // Clear status filter
                  }}
                >
                  None
                </a>
              </li>
              {statusOptions.map((status) => (
                <li key={status}>
                  <a
                    href="javascript:void(0);"
                    className={`dropdown-item rounded-1 ${
                      statusFilter === status ? "active" : ""
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      setStatusFilter(status);
                    }}
                  >
                    {status}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Sort Dropdown */}
          <div className="dropdown">
            <a
              href="javascript:void(0);"
              className="dropdown-toggle btn btn-white text-black border border-black d-inline-flex align-items-center"
              data-bs-toggle="dropdown"
            >
              Sort By: {sortOptions.find((o) => o.value === sortBy)?.label}
            </a>
            <ul className="dropdown-menu dropdown-menu-end p-3">
              {sortOptions.map((option) => (
                <li key={option.value}>
                  <a
                    href="javascript:void(0);"
                    className={`dropdown-item rounded-1 ${
                      sortBy === option.value ? "active" : ""
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      setSortBy(option.value);
                    }}
                  >
                    {option.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterSortBar;
