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
  listStaffRequest,
  deleteStaffRequest,
  TStaff,
  staffSignupRequest,
} from "@/client/endpoints/student";

export default function StaffList() {
  const [data, setData] = useState<TStaff[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const navigate = useNavigate();
  const toggleLoader = useGlobalLoader((state) => state.setShowLoader);

  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const statusOptions = ["Active", "Inactive"];

  // ----- Export PDF -----
  const exportPDF = useCallback(() => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("Staff List", 10, 10);

    let y = 20;
    data.forEach((staff) => {
      const line = `${staff.firstName} ${staff.middleName ?? ""} ${
        staff.lastName
      } | ${staff.email ?? ""} | ${staff.phoneNumber ?? ""}`;
      doc.text(line, 10, y);
      y += 10;
    });

    doc.save("Staff.pdf");
  }, [data]);

  // ----- Export Excel -----
  const exportExcel = useCallback(() => {
    const wsData = [
      ["First Name", "Middle Name", "Last Name", "Email", "Phone"],
      ...data.map((staff) => [
        staff.firstName,
        staff.middleName ?? "",
        staff.lastName,
        staff.email,
        staff.phoneNumber ?? "",
      ]),
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, "Staff");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([wbout], { type: "application/octet-stream" }),
      "Staff.xlsx"
    );
  }, [data]);

  // ----- Sort Options -----
  const sortOptions = [
    { label: "Recently", value: "recent" },
    { label: "Ascending", value: "asc" },
    { label: "Descending", value: "desc" },
  ];
  const [sortBy, setSortBy] = useState<string>("recent");

  // ----- Fetch Staff -----
  const fetchStaff = useCallback(async () => {
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
      }

      const res = await listStaffRequest({
        skip: pagination.pageIndex * pagination.pageSize,
        size: pagination.pageSize,
        search: globalFilter,
        sort: sortParam,
        status: statusFilter ?? undefined,
      });

      setData(res.data?.data ?? []);
      setTotalCount(res.data?.total ?? res.data?.data?.length ?? 0);
    } catch (err) {
      console.error("Fetch Staff error:", err);
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

  const signupSelected = useCallback(async () => {
    const selectedIds = Object.keys(rowSelection)
      .map((key) => data[+key]?.id)
      .filter(Boolean) as string[];

    if (!selectedIds.length) {
      Swal.fire(
        "⚠️ No Staff Selected",
        "Please select staff members first.",
        "warning"
      );
      return;
    }

    const result = await Swal.fire({
      title: `Create signup for ${selectedIds.length} staff(s)? 👥`,
      text: "This will generate accounts for the selected staff.",
      showCancelButton: true,
      confirmButtonText: "Yes, create signups ✅",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await staffSignupRequest(selectedIds);
        Swal.fire(
          "🎉 Success",
          "Signup accounts created successfully.",
          "success"
        );
        setRowSelection({});
        fetchStaff();
      } catch (err) {
        console.log(err);
        Swal.fire("❌ Error", "Failed to create signup accounts.", "error");
      }
    }
  }, [rowSelection, data, fetchStaff]);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  // ----- Delete Functions -----
  const deleteStaff = useCallback(
    async (id: string) => {
      const result = await Swal.fire({
        title: "Are you sure? 😅",
        text: "This Staff member will be permanently deleted!",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it! 🗑️",
        cancelButtonText: "No, keep it 🙂",
      });

      if (result.isConfirmed) {
        await deleteStaffRequest([id]);
        Swal.fire("Deleted! 🗑️", "Staff has been deleted.", "success");
        fetchStaff();
      }
    },
    [fetchStaff]
  );

  const deleteSelected = useCallback(async () => {
    const selectedIds = Object.keys(rowSelection)
      .map((key) => data[+key]?.id)
      .filter(Boolean) as string[];

    if (!selectedIds.length) return;

    const result = await Swal.fire({
      title: `Delete ${selectedIds.length} selected Staff(s)? 😅`,
      text: "These staff members will be permanently deleted!",
      showCancelButton: true,
      confirmButtonText: "Yes, delete them! 🗑️",
      cancelButtonText: "No, keep them 🙂",
    });

    if (result.isConfirmed) {
      await deleteStaffRequest(selectedIds);
      setRowSelection({});
      Swal.fire("Deleted! 🗑️", "Selected staff deleted.", "success");
      fetchStaff();
    }
  }, [rowSelection, data, fetchStaff]);

  // ----- Debounce Search -----
  const handleSearch = useMemo(() => {
    let timeout: ReturnType<typeof setTimeout>;
    return (val: string) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => setGlobalFilter(val), 300);
    };
  }, []);

  // ----- Columns -----
  const columns = useMemo<ColumnDef<TStaff>[]>(
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
      { accessorKey: "middleName", header: "Middle Name" },
      { accessorKey: "lastName", header: "Last Name" },
      { accessorKey: "email", header: "Email" },
      { accessorKey: "phoneNumber", header: "Phone" },

      // ✅ New status column
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.status?.toLowerCase();
          let badgeClass = "bg-secondary"; // default

          if (status === "active") badgeClass = "bg-primary";
          else if (status === "inactive") badgeClass = "bg-warning";
          else if (status === "converted") badgeClass = "bg-success";
          else if (status === "deleted") badgeClass = "bg-danger";

          return (
            <span className={`badge ${badgeClass} text-uppercase`}>
              {row.original.status}
            </span>
          );
        },
      },

      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="action-icon d-inline-flex gap-2">
            <a onClick={() => navigate(`/staff/view/${row.original.id}`)}>
              <Eye size={18} />
            </a>
            <a onClick={() => navigate(`/staff/edit/${row.original.id}`)}>
              <Pencil size={18} />
            </a>
            <a onClick={() => row.original.id && deleteStaff(row.original.id)}>
              <Trash size={18} />
            </a>
          </div>
        ),
      },
    ],
    [navigate, deleteStaff]
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
      "Middle Name",
      "Last Name",
      "Email",
      "Phone",
    ];
    const csvRows = [
      headers.join(","),
      ...data.map((s) =>
        [
          s.firstName,
          s.middleName ?? "",
          s.lastName,
          s.email,
          s.phoneNumber ?? "",
        ].join(",")
      ),
    ];
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Staff.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  }, [data]);

  return (
    <>
      <TableActions
        createBtn="Create Staff"
        title="👥 Staff List | Dashboard"
        description="Manage and view all staff members in one place"
        pageTitle="Staff List"
        downloadCSV={downloadCSV}
        exportPDF={exportPDF}
        exportExcel={exportExcel}
        deleteSelected={deleteSelected}
        rowSelectionCount={Object.keys(rowSelection).length}
        onCreate={() => navigate("/staff/create")}
        signupSelected={signupSelected}
      />

      <div className="card relative">
        <FilterSortBar
          title="Staff List"
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
