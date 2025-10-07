// components/common/Pagination.tsx
import { ChevronLeft, ChevronRight } from "tabler-icons-react";

interface PaginationProps {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  setPagination: (pagination: { pageIndex: number; pageSize: number }) => void;
  siblingCount?: number; // optional, default 1
}

export default function Pagination({
  pageIndex,
  pageSize,
  totalCount,
  setPagination,
  siblingCount = 1,
}: PaginationProps) {
  const pageCount = Math.ceil(totalCount / pageSize);

  const handlePrevious = () => {
    if (pageIndex > 0) setPagination({ pageIndex: pageIndex - 1, pageSize });
  };

  const handleNext = () => {
    if (pageIndex < pageCount - 1)
      setPagination({ pageIndex: pageIndex + 1, pageSize });
  };

  const handlePageClick = (page: number) => {
    setPagination({ pageIndex: page - 1, pageSize });
  };

  // Smart page numbers
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const startPage = Math.max(0, pageIndex - siblingCount);
    const endPage = Math.min(pageCount - 1, pageIndex + siblingCount);

    if (startPage > 0) {
      pages.push(1);
      if (startPage > 1) pages.push("...");
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i + 1);
    }

    if (endPage < pageCount - 1) {
      if (endPage < pageCount - 2) pages.push("...");
      pages.push(pageCount);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="container">
      <div className="row">
        <div className="col-sm-12 col-md-5">
          <div className="dataTables_info" role="status" aria-live="polite">
            Showing {pageIndex * pageSize + 1} to{" "}
            {Math.min((pageIndex + 1) * pageSize, totalCount)} of {totalCount}{" "}
            entries
          </div>
        </div>
        <div className="col-sm-12 col-md-7">
          <div className="dataTables_paginate paging_simple_numbers">
            <ul className="pagination">
              {/* Previous */}
              <li
                className={`paginate_button page-item ${
                  pageIndex === 0 ? "disabled" : ""
                }`}
              >
                <button
                  className="page-link rounded-circle text-center p-1"
                  style={{
                    width: "30px",
                    height: "30px",
                    lineHeight: "17px",
                    fontSize: "13px",
                  }}
                  onClick={handlePrevious}
                  disabled={pageIndex === 0}
                >
                  <ChevronLeft size={16} />
                </button>
              </li>

              {/* Page Numbers */}
              {pageNumbers.map((page, idx) =>
                page === "..." ? (
                  <li key={idx} className="paginate_button page-item disabled">
                    <button
                      className="page-link rounded-circle text-center p-1"
                      style={{
                        width: "30px",
                        height: "30px",
                        lineHeight: "17px",
                        fontSize: "13px",
                      }}
                      disabled
                    >
                      ...
                    </button>
                  </li>
                ) : (
                  <li
                    key={idx}
                    className={`paginate_button page-item ${
                      pageIndex + 1 === page ? "active" : ""
                    }`}
                  >
                    <button
                      className="page-link rounded-circle text-center p-1"
                      style={{
                        width: "30px",
                        height: "30px",
                        lineHeight: "17px",
                        fontSize: "13px",
                      }}
                      onClick={() => handlePageClick(page as number)}
                    >
                      {page}
                    </button>
                  </li>
                )
              )}

              {/* Next */}
              <li
                className={`paginate_button page-item ${
                  pageIndex >= pageCount - 1 ? "disabled" : ""
                }`}
              >
                <button
                  className="page-link rounded-circle text-center p-1"
                  onClick={handleNext}
                  style={{
                    width: "30px",
                    height: "30px",
                    lineHeight: "17px",
                    fontSize: "13px",
                  }}
                  disabled={pageIndex >= pageCount - 1}
                >
                  <ChevronRight size={16} />
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
