import { useMemo, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Swal from "sweetalert2";
import Pagination from "@/components/common/Pagination";
import TableActions from "@/components/common/TableActions";
import FilterSortBar from "@/components/common/FilterSortBar";
import TableControls from "@/components/common/TableControls";
import DataTableLatest from "@/components/common/DataTableLatest";
import { useGlobalLoader } from "@/hooks";
import { Eye, Pencil, Trash } from "tabler-icons-react";

import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import {
  listCourseRequest,
  deleteCourseRequest,
  TCourse,
} from "@/client/endpoints/student";

export default function CourseList() {
  const [data, setData] = useState<TCourse[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const navigate = useNavigate();
  const toggleLoader = useGlobalLoader((state) => state.setShowLoader);

  // ----- Export PDF -----
  const exportPDF = useCallback(() => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("Course List", 10, 10);

    let y = 20;
    data.forEach((course) => {
      const line = `${course.courseName} | ${course.courseCode ?? ""} | ${
        course.description ?? ""
      }`;
      doc.text(line, 10, y);
      y += 10;
    });

    doc.save("Courses.pdf");
  }, [data]);

  // ----- Export Excel -----
  const exportExcel = useCallback(() => {
    const wsData = [
      ["Course Name", "Course Code", "Description"],
      ...data.map((course) => [
        course.courseName,
        course.courseCode ?? "",
        course.description ?? "",
      ]),
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, "Courses");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([wbout], { type: "application/octet-stream" }),
      "Courses.xlsx"
    );
  }, [data]);

  // ----- Sort Options -----
  const sortOptions = [
    { label: "Recently", value: "recent" },
    { label: "Ascending", value: "asc" },
    { label: "Descending", value: "desc" },
  ];
  const [sortBy, setSortBy] = useState<string>("recent");

  // ----- Fetch Courses -----
  const fetchCourses = useCallback(async () => {
    toggleLoader(true);
    try {
      let sortParam = "createdAt DESC";
      switch (sortBy) {
        case "recent":
          sortParam = "createdAt DESC";
          break;
        case "asc":
          sortParam = "courseName ASC";
          break;
        case "desc":
          sortParam = "courseName DESC";
          break;
      }

      const res = await listCourseRequest({
        skip: pagination.pageIndex * pagination.pageSize,
        size: pagination.pageSize,
        search: globalFilter,
        sort: sortParam,
      });

      setData(res.data?.data ?? []);
      setTotalCount(res.data?.total ?? res.data?.data?.length ?? 0);
    } catch (err) {
      console.error("Fetch Courses error:", err);
    } finally {
      toggleLoader(false);
    }
  }, [
    pagination.pageIndex,
    pagination.pageSize,
    globalFilter,
    sortBy,
    toggleLoader,
  ]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // ----- Delete Functions -----
  const deleteCourse = useCallback(
    async (id: string) => {
      const result = await Swal.fire({
        title: "Are you sure? 😅",
        text: "This Course will be permanently deleted!",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it! 🗑️",
        cancelButtonText: "No, keep it 🙂",
      });

      if (result.isConfirmed) {
        await deleteCourseRequest([id]);
        Swal.fire("Deleted! 🗑️", "Course has been deleted.", "success");
        fetchCourses();
      }
    },
    [fetchCourses]
  );

  const deleteSelected = useCallback(async () => {
    const selectedIds = Object.keys(rowSelection)
      .map((key) => data[+key]?.id)
      .filter(Boolean) as string[];

    if (!selectedIds.length) return;

    const result = await Swal.fire({
      title: `Delete ${selectedIds.length} selected Course(s)? 😅`,
      text: "These Courses will be permanently deleted!",
      showCancelButton: true,
      confirmButtonText: "Yes, delete them! 🗑️",
      cancelButtonText: "No, keep them 🙂",
    });

    if (result.isConfirmed) {
      await deleteCourseRequest(selectedIds);
      setRowSelection({});
      Swal.fire("Deleted! 🗑️", "Selected Courses deleted.", "success");
      fetchCourses();
    }
  }, [rowSelection, data, fetchCourses]);

  // ----- Debounce Search -----
  const handleSearch = useMemo(() => {
    let timeout: ReturnType<typeof setTimeout>;
    return (val: string) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => setGlobalFilter(val), 300);
    };
  }, []);

  // ----- Columns -----
  const columns = useMemo<ColumnDef<TCourse>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <div className="form-check form-check-md">
            <input
              className="form-check-input"
              type="checkbox"
              checked={table.getIsAllPageRowsSelected()}
              onChange={table.getToggleAllPageRowsSelectedHandler()}
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="form-check form-check-md">
            <input
              type="checkbox"
              className="form-check-input"
              checked={row.getIsSelected()}
              onChange={row.getToggleSelectedHandler()}
            />
          </div>
        ),
      },
      { accessorKey: "courseName", header: "Course Name" },
      { accessorKey: "courseCode", header: "Course Code" },
      { accessorKey: "description", header: "Description" },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="action-icon d-inline-flex gap-2">
            <a onClick={() => navigate(`/course/view/${row.original.id}`)}>
              <Eye size={18} />
            </a>
            <a onClick={() => navigate(`/course/edit/${row.original.id}`)}>
              <Pencil size={18} />
            </a>
            <a onClick={() => row.original.id && deleteCourse(row.original.id)}>
              <Trash size={18} />
            </a>
          </div>
        ),
      },
    ],
    [navigate, deleteCourse]
  );

  // ----- Table Instance -----
  const table = useReactTable({
    data,
    columns,
    state: { globalFilter, rowSelection },
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    enableRowSelection: true,
  });

  // ----- Download CSV -----
  const downloadCSV = useCallback(() => {
    const headers = ["Course Name", "Course Code", "Description"];
    const csvRows = [
      headers.join(","),
      ...data.map((c) =>
        [c.courseName, c.courseCode ?? "", c.description ?? ""].join(",")
      ),
    ];
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Courses.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  }, [data]);

  return (
    <>
      <TableActions
        createBtn="Create Course"
        title="📚 Course List | Dashboard"
        description="Manage and view all courses in one place"
        pageTitle="Course List"
        downloadCSV={downloadCSV}
        exportPDF={exportPDF}
        exportExcel={exportExcel}
        deleteSelected={deleteSelected}
        rowSelectionCount={Object.keys(rowSelection).length}
        onCreate={() => navigate("/course/create")}
      />

      <div className="card relative">
        <FilterSortBar
          title="Course List"
          statusFilter={null}
          setStatusFilter={() => {}}
          statusOptions={[]}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOptions={sortOptions}
        />
        <div className="card-body p-0">
          <div className="custom-datatable-filter">
            <div className="dataTables_wrapper dt-bootstrap5 no-footer">
              <TableControls
                pagination={pagination}
                setPagination={setPagination}
                handleSearch={handleSearch}
              />
              <DataTableLatest
                table={table}
                data={data}
                noDataMessage="No records found"
              />
              <Pagination
                pageIndex={pagination.pageIndex}
                pageSize={pagination.pageSize}
                totalCount={totalCount}
                setPagination={setPagination}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
