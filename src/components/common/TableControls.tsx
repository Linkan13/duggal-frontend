// components/common/TableControls.tsx
import React from "react";

interface TableControlsProps {
  pagination: { pageIndex: number; pageSize: number };
  setPagination: React.Dispatch<
    React.SetStateAction<{ pageIndex: number; pageSize: number }>
  >;
  handleSearch: (value: string) => void;
}

const TableControls: React.FC<TableControlsProps> = ({
  pagination,
  setPagination,
  handleSearch,
}) => {
  const rowSizes = [10, 25, 50, 100];

  return (
    <div className="container">
      <div className="row">
        {/* Rows per page */}
        <div className="col-sm-12 col-md-6">
          <div className="dataTables_length" id="DataTables_Table_0_length">
            <label>
              Row Per Page
              <select
                value={pagination.pageSize}
                onChange={(e) => {
                  const newSize = Number(e.target.value);
                  setPagination((prev) => ({
                    ...prev,
                    pageSize: newSize,
                    pageIndex: 0, // Reset to first page
                  }));
                }}
                className="form-select form-select-sm"
              >
                {rowSizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              Entries
            </label>
          </div>
        </div>

        {/* Search */}
        <div className="col-sm-12 col-md-6">
          <div id="DataTables_Table_0_filter" className="dataTables_filter">
            <label>
              <input
                placeholder="Search..."
                className="form-control form-control-sm"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableControls;
