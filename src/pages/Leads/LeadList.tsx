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
import { convertLeadToStudentRequest } from "@/client/endpoints/student/leadService";

import {
  listLeadRequest,
  deleteLeadRequest,
  TLead,
} from "@/client/endpoints/student";

export default function LeadList() {
  const [data, setData] = useState<TLead[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const navigate = useNavigate();
  const toggleLoader = useGlobalLoader((state) => state.setShowLoader);

  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const statusOptions = ["new", "in_progress", "converted", "lost"];

  // ----- Export PDF -----
  const exportPDF = useCallback(() => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("Lead List", 10, 10);

    let y = 20;
    data.forEach((lead) => {
      const line = `${lead.firstName} ${lead.middleName ?? ""} ${
        lead.lastName
      } | ${lead.email ?? ""} | ${lead.phone ?? ""} | ${lead.status ?? ""}`;
      doc.text(line, 10, y);
      y += 10;
    });

    doc.save("Leads.pdf");
  }, [data]);

  // ----- Export Excel -----
  const exportExcel = useCallback(() => {
    const wsData = [
      ["First Name", "Middle Name", "Last Name", "Email", "Phone", "Status"],
      ...data.map((lead) => [
        lead.firstName,
        lead.middleName ?? "",
        lead.lastName,
        lead.email ?? "",
        lead.phone ?? "",
        lead.status ?? "",
      ]),
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, "Leads");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([wbout], { type: "application/octet-stream" }),
      "Leads.xlsx"
    );
  }, [data]);

  // ----- Sort Options -----
  const sortOptions = [
    { label: "Recently", value: "recent" },
    { label: "Ascending", value: "asc" },
    { label: "Descending", value: "desc" },
  ];
  const [sortBy, setSortBy] = useState<string>("recent");

  // ----- Fetch Leads -----
  const fetchLeads = useCallback(async () => {
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

      const res = await listLeadRequest({
        skip: pagination.pageIndex * pagination.pageSize,
        size: pagination.pageSize,
        search: globalFilter,
        sort: sortParam,
        status: statusFilter ?? undefined,
      });

      setData(res.data?.data ?? []);
      setTotalCount(res.data?.total ?? res.data?.data?.length ?? 0);
    } catch (err) {
      console.error("Fetch Leads error:", err);
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
    fetchLeads();
  }, [fetchLeads]);

  const convertSelected = useCallback(async () => {
    const selectedIds = Object.keys(rowSelection)
      .map((key) => data[+key]?.id)
      .filter(Boolean) as string[];

    if (!selectedIds.length) return;

    const result = await Swal.fire({
      title: `Convert ${selectedIds.length} Lead to Student? 🎓`,
      text: "These leads will be converted into students.",
      showCancelButton: true,
      confirmButtonText: "Yes, convert them! ✅",
      cancelButtonText: "No, keep them 🙂",
    });

    if (result.isConfirmed) {
      await convertLeadToStudentRequest(selectedIds);
      setRowSelection({});
      Swal.fire(
        "Converted! 🎓",
        "Selected leads have been converted.",
        "success"
      );
      fetchLeads();
    }
  }, [rowSelection, data, fetchLeads]);

  // ----- Delete Functions -----
  const deleteLead = useCallback(
    async (id: string) => {
      const result = await Swal.fire({
        title: "Are you sure? 😅",
        text: "This Lead will be permanently deleted!",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it! 🗑️",
        cancelButtonText: "No, keep it 🙂",
      });

      if (result.isConfirmed) {
        await deleteLeadRequest([id]);
        Swal.fire("Deleted! 🗑️", "Lead has been deleted.", "success");
        fetchLeads();
      }
    },
    [fetchLeads]
  );

  const deleteSelected = useCallback(async () => {
    const selectedIds = Object.keys(rowSelection)
      .map((key) => data[+key]?.id)
      .filter(Boolean) as string[];

    if (!selectedIds.length) return;

    const result = await Swal.fire({
      title: `Delete ${selectedIds.length} selected Lead(s)? 😅`,
      text: "These leads will be permanently deleted!",
      showCancelButton: true,
      confirmButtonText: "Yes, delete them! 🗑️",
      cancelButtonText: "No, keep them 🙂",
    });

    if (result.isConfirmed) {
      await deleteLeadRequest(selectedIds);
      setRowSelection({});
      Swal.fire("Deleted! 🗑️", "Selected leads deleted.", "success");
      fetchLeads();
    }
  }, [rowSelection, data, fetchLeads]);

  // ----- Debounce Search -----
  const handleSearch = useMemo(() => {
    let timeout: ReturnType<typeof setTimeout>;
    return (val: string) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => setGlobalFilter(val), 300);
    };
  }, []);

  // ----- Columns -----
  const columns = useMemo<ColumnDef<TLead>[]>(
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
      { accessorKey: "phone", header: "Phone" },
      { accessorKey: "status", header: "Status" },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="action-icon d-inline-flex gap-2">
            <a onClick={() => navigate(`/leads/view/${row.original.id}`)}>
              <Eye size={18} />
            </a>
            <a onClick={() => navigate(`/leads/edit/${row.original.id}`)}>
              <Pencil size={18} />
            </a>
            <a onClick={() => row.original.id && deleteLead(row.original.id)}>
              <Trash size={18} />
            </a>
          </div>
        ),
      },
    ],
    [navigate, deleteLead]
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
      "Status",
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
          s.status ?? "",
        ].join(",")
      ),
    ];
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Leads.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  }, [data]);

  return (
    <>
      <TableActions
        createBtn="Create Lead"
        title="📋 Lead List | Dashboard"
        description="Manage and view all leads in one place"
        pageTitle="Lead List"
        downloadCSV={downloadCSV}
        exportPDF={exportPDF}
        exportExcel={exportExcel}
        deleteSelected={deleteSelected}
        convertSelected={convertSelected}
        rowSelectionCount={Object.keys(rowSelection).length}
        onCreate={() => navigate("/leads/create")}
      />

      <div className="card relative">
        <FilterSortBar
          title="Lead List"
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
