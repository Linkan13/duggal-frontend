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
import { Eye, Pencil, Trash } from "tabler-icons-react";

import TableActions from "@/components/common/TableActions";
import FilterSortBar from "@/components/common/FilterSortBar";
import TableControls from "@/components/common/TableControls";
import DataTableLatest from "@/components/common/DataTableLatest";
import Pagination from "@/components/common/Pagination";

import {
  listBatchRequest,
  deleteBatchRequest,
  TBatch,
} from "@/client/endpoints/student/batchService";
import { useGlobalLoader } from "@/hooks";

import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function BatchList() {
  const [data, setData] = useState<TBatch[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [sortBy, setSortBy] = useState<string>("recent");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const navigate = useNavigate();
  const toggleLoader = useGlobalLoader((state) => state.setShowLoader);

  const statusOptions = ["Active", "Inactive"];
  const sortOptions = [
    { label: "Recently", value: "recent" },
    { label: "Ascending", value: "asc" },
    { label: "Descending", value: "desc" },
    { label: "Last 7 Days", value: "last7Days" },
    { label: "Last Month", value: "lastMonth" },
  ];

  // ----- Export PDF -----
  const exportPDF = useCallback(() => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("Batch List", 10, 10);

    let y = 20;
    data.forEach((b) => {
      const rooms = Array.isArray(b.rooms) ? b.rooms.join(", ") : b.rooms ?? "";
      const line = `${b.batchName} | ${b.startTime ?? ""} | ${
        b.endTime ?? ""
      } | ${b.maxStudents ?? ""} | ${rooms}`;
      doc.text(line, 10, y);
      y += 8;
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save("Batches.pdf");
  }, [data]);

  // ----- Export Excel -----
  const exportExcel = useCallback(() => {
    const wsData = [
      ["Batch Name", "Start Time", "End Time", "Max Students", "Rooms"],
      ...data.map((b) => [
        b.batchName,
        b.startTime ?? "",
        b.endTime ?? "",
        b.maxStudents ?? "",
        Array.isArray(b.rooms) ? b.rooms.join("; ") : b.rooms ?? "",
      ]),
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, "Batches");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([wbout], { type: "application/octet-stream" }),
      "Batches.xlsx"
    );
  }, [data]);

  // ----- Fetch Batches -----
  const fetchBatches = useCallback(async () => {
    toggleLoader(true);
    try {
      let sortParam = "createdAt DESC";
      switch (sortBy) {
        case "recent":
          sortParam = "createdAt DESC";
          break;
        case "asc":
          sortParam = "batchName ASC";
          break;
        case "desc":
          sortParam = "batchName DESC";
          break;
        case "last7Days":
          sortParam = "createdAt DESC";
          break;
        case "lastMonth":
          sortParam = "createdAt DESC";
          break;
      }

      const res = await listBatchRequest({
        skip: pagination.pageIndex * pagination.pageSize,
        size: pagination.pageSize,
        search: globalFilter,
        sort: sortParam,
        status: statusFilter ?? undefined,
      });

      setData(res.data?.data ?? []);
      setTotalCount(res.data?.total ?? res.data?.data?.length ?? 0);
    } catch (err) {
      console.error("Fetch Batches error:", err);
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
    fetchBatches();
  }, [fetchBatches]);

  // ----- Delete single batch -----
  const deleteBatch = useCallback(
    async (id: string) => {
      const result = await Swal.fire({
        title: "Are you sure? 😅",
        text: "This batch will be permanently deleted!",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it! 🗑️",
        cancelButtonText: "No, keep it 🙂",
      });

      if (result.isConfirmed) {
        await deleteBatchRequest([id]);
        Swal.fire("Deleted! 🗑️", "Batch has been deleted.", "success");
        fetchBatches();
      }
    },
    [fetchBatches]
  );

  // ----- Delete selected batches -----
  const deleteSelected = useCallback(async () => {
    const selectedIds = Object.keys(rowSelection)
      .map((key) => data[+key]?.id)
      .filter(Boolean) as string[];

    if (!selectedIds.length) return;

    const result = await Swal.fire({
      title: `Delete ${selectedIds.length} selected batch(es)? 😅`,
      text: "These batches will be permanently deleted!",
      showCancelButton: true,
      confirmButtonText: "Yes, delete them! 🗑️",
      cancelButtonText: "No, keep them 🙂",
    });

    if (result.isConfirmed) {
      await deleteBatchRequest(selectedIds);
      setRowSelection({});
      Swal.fire("Deleted! 🗑️", "Selected batches deleted.", "success");
      fetchBatches();
    }
  }, [rowSelection, data, fetchBatches]);

  // ----- Debounce Search -----
  const handleSearch = useMemo(() => {
    let timeout: ReturnType<typeof setTimeout>;
    return (val: string) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => setGlobalFilter(val), 300);
    };
  }, []);

  // ----- Columns (kept exactly as requested) -----
  const columns = useMemo<ColumnDef<TBatch>[]>(
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
      { accessorKey: "batchName", header: "Batch Name" },
      { accessorKey: "startTime", header: "Start Time" },
      { accessorKey: "endTime", header: "End Time" },
      { accessorKey: "maxStudents", header: "Max Students" },
      {
        accessorKey: "rooms",
        header: "Rooms",
        cell: (info) => {
          const val = info.getValue();
          if (!val) return "-";

          if (Array.isArray(val)) {
            return val.length
              ? val
                  .map((room) => {
                    if (
                      room &&
                      typeof room === "object" &&
                      "roomName" in room
                    ) {
                      return (room as { roomName: string }).roomName;
                    }
                    return "";
                  })
                  .filter(Boolean)
                  .join(", ")
              : "-";
          }

          return String(val);
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="action-icon d-inline-flex gap-2">
            <a onClick={() => navigate(`/batches/view/${row.original.id}`)}>
              <Eye size={18} />
            </a>
            <a onClick={() => navigate(`/batches/edit/${row.original.id}`)}>
              <Pencil size={18} />
            </a>
            <a onClick={() => row.original.id && deleteBatch(row.original.id!)}>
              <Trash size={18} />
            </a>
          </div>
        ),
      },
    ],
    [navigate, deleteBatch]
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
    const header = [
      "Batch Name",
      "Start Time",
      "End Time",
      "Max Students",
      "Rooms",
    ];
    const csvRows = [
      header.join(","),
      ...data.map((b) =>
        [
          b.batchName,
          b.startTime ?? "",
          b.endTime ?? "",
          b.maxStudents ?? "",
          Array.isArray(b.rooms) ? b.rooms.join("; ") : b.rooms ?? "",
        ].join(",")
      ),
    ];
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Batches.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  }, [data]);

  return (
    <>
      <TableActions
        title="📚 Batch List | Dashboard"
        createBtn="Create Batch"
        description="Manage and view all batches in one place"
        pageTitle="Batch List"
        downloadCSV={downloadCSV}
        exportPDF={exportPDF}
        exportExcel={exportExcel}
        deleteSelected={deleteSelected}
        rowSelectionCount={Object.keys(rowSelection).length}
        onCreate={() => navigate("/batches/create")}
      />

      <div className="card relative">
        <FilterSortBar
          title="Batch List"
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
                noDataMessage="No batches found"
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
