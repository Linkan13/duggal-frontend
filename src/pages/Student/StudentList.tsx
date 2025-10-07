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
import {
  listStudentRequest,
  deleteStudentRequest,
  TStudent,
} from "@/client/endpoints/student/studentService";
import { useGlobalLoader } from "@/hooks";
import { Eye, Pencil, Trash } from "tabler-icons-react";

import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function StudentList() {
  const [data, setData] = useState<TStudent[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const navigate = useNavigate();
  const toggleLoader = useGlobalLoader((state) => state.setShowLoader);

  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const statusOptions = ["Accepted", "Sent", "Expired", "Declined"];

  // ----- Export PDF -----
  const exportPDF = useCallback(() => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("Student List", 10, 10);

    let y = 20;
    data.forEach((student) => {
      const line = `${student.firstName} ${student.middleName ?? ""} ${
        student.lastName
      } | ${student.email ?? ""} | ${student.phone ?? ""}`;
      doc.text(line, 10, y);
      y += 10;
    });

    doc.save("Students.pdf");
  }, [data]);

  // ----- Export Excel -----
  const exportExcel = useCallback(() => {
    const wsData = [
      ["First Name", "Last Name", "Email", "Phone"],
      ...data.map((student) => [
        student.firstName,
        student.middleName ?? "",
        student.lastName,
        student.email ?? "",
        student.phone ?? "",
      ]),
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, "Students");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([wbout], { type: "application/octet-stream" }),
      "Students.xlsx"
    );
  }, [data]);

  // ----- Sort Options -----
  const sortOptions = [
    { label: "Recently", value: "recent" },
    { label: "Ascending", value: "asc" },
    { label: "Descending", value: "desc" },
    { label: "Last 7 Days", value: "last7Days" },
    { label: "Last Month", value: "lastMonth" },
  ];
  const [sortBy, setSortBy] = useState<string>("recent");

  // ----- Fetch Students -----
  const fetchStudents = useCallback(async () => {
    toggleLoader(true);
    try {
      let sortParam = "createdAt DESC";
      switch (sortBy) {
        case "recent":
          sortParam = "createdAt DESC";
          break;
        case "asc":
          sortParam = "firstName ASC";
          break;
        case "desc":
          sortParam = "firstName DESC";
          break;
        case "last7Days":
          sortParam = "createdAt DESC";
          break;
        case "lastMonth":
          sortParam = "createdAt DESC";
          break;
      }

      const res = await listStudentRequest({
        skip: pagination.pageIndex * pagination.pageSize,
        size: pagination.pageSize,
        search: globalFilter,
        sort: sortParam,
        status: statusFilter ?? undefined,
      });

      setData(res.data?.data ?? []);
      setTotalCount(res.data?.total ?? res.data?.data?.length ?? 0);
    } catch (err) {
      console.error("Fetch Students error:", err);
    } finally {
      toggleLoader(false);
    }
  }, [
    pagination.pageIndex,
    pagination.pageSize,
    globalFilter,
    sortBy,
    statusFilter,
    toggleLoader,
  ]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // ----- Delete Functions -----
  const deleteStudent = useCallback(
    async (id: string) => {
      const result = await Swal.fire({
        title: "Are you sure? 😅",
        text: "This Student will be permanently deleted!",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it! 🗑️",
        cancelButtonText: "No, keep it 🙂",
      });

      if (result.isConfirmed) {
        await deleteStudentRequest([id]);
        Swal.fire("Deleted! 🗑️", "Student has been deleted.", "success");
        fetchStudents();
      }
    },
    [fetchStudents]
  );

  const deleteSelected = useCallback(async () => {
    const selectedIds = Object.keys(rowSelection)
      .map((key) => data[+key]?.id)
      .filter(Boolean) as string[];

    if (!selectedIds.length) return;

    const result = await Swal.fire({
      title: `Delete ${selectedIds.length} selected Student(s)? 😅`,
      text: "This Students will be permanently deleted!",
      showCancelButton: true,
      confirmButtonText: "Yes, delete them! 🗑️",
      cancelButtonText: "No, keep them 🙂",
    });

    if (result.isConfirmed) {
      await deleteStudentRequest(selectedIds);
      setRowSelection({});
      Swal.fire("Deleted! 🗑️", "Selected Students deleted.", "success");
      fetchStudents();
    }
  }, [rowSelection, data, fetchStudents]);

  // ----- Debounce Search -----
  const handleSearch = useMemo(() => {
    let timeout: ReturnType<typeof setTimeout>;
    return (val: string) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => setGlobalFilter(val), 300);
    };
  }, []);

  // ----- Columns -----
  const columns = useMemo<ColumnDef<TStudent>[]>(
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
      { accessorKey: "firstName", header: "First Name" },
      { accessorKey: "lastName", header: "Last Name" },
      { accessorKey: "email", header: "Email" },
      { accessorKey: "phone", header: "Phone" },
      { accessorKey: "joinedDate", header: "Joined on" },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="action-icon d-inline-flex gap-2">
            <a onClick={() => navigate(`/student/view/${row.original.id}`)}>
              <Eye size={18} />
            </a>
            <a onClick={() => navigate(`/student/edit/${row.original.id}`)}>
              <Pencil size={18} />
            </a>
            <a
              onClick={() => row.original.id && deleteStudent(row.original.id)}
            >
              <Trash size={18} />
            </a>
          </div>
        ),
      },
    ],
    [navigate, deleteStudent]
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
    const headers = [
      "First Name",
      "Last Name",
      "Email",
      "Phone",
      "Joined on",
    ];
    const csvRows = [
      headers.join(","),
      ...data.map((s) =>
        [
          s.firstName,
          s.middleName ?? "",
          s.lastName,
          s.email ?? "",
          s.phone ?? "",
        ].join(",")
      ),
    ];
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Students.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  }, [data]);

  return (
    <>
      <TableActions
        createBtn="Create Student"
        title="🎓 Student List | Dashboard"
        description="Manage and view all students in one place"
        pageTitle="Student List"
        downloadCSV={downloadCSV}
        exportPDF={exportPDF}
        exportExcel={exportExcel}
        deleteSelected={deleteSelected}
        rowSelectionCount={Object.keys(rowSelection).length}
        onCreate={() => navigate("/student/create")}
      />

      <div className="card relative">
        <FilterSortBar
          title="Student List"
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          statusOptions={statusOptions}
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
