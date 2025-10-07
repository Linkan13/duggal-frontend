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
import Pagination from "@/components/common/Pagination";
import TableActions from "@/components/common/TableActions";
import FilterSortBar from "@/components/common/FilterSortBar";
import TableControls from "@/components/common/TableControls";
import DataTableLatest from "@/components/common/DataTableLatest";
import {
  listRoomRequest,
  deleteRoomRequest,
} from "@/client/endpoints/student/roomService";
import { TRoom } from "../../types";
import { useGlobalLoader } from "@/hooks";

import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function RoomList() {
  const [data, setData] = useState<TRoom[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const navigate = useNavigate();
  const toggleLoader = useGlobalLoader((state) => state.setShowLoader);

  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const statusOptions = ["Available", "Occupied", "Under Maintenance"];

  // ----- Export PDF -----
  const exportPDF = useCallback(() => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("Room List", 10, 10);

    let y = 20;
    data.forEach((room) => {
      const line = `${room.roomName} | ${room.roomCode} | ${room.location} | ${
        room.capacity ?? "-"
      } | ${room.description ?? ""}`;
      doc.text(line, 10, y);
      y += 10;
    });

    doc.save("Rooms.pdf");
  }, [data]);

  // ----- Export Excel -----
  const exportExcel = useCallback(() => {
    const wsData = [
      ["Room Name", "Room Code", "Location", "Capacity", "Description"],
      ...data.map((room) => [
        room.roomName,
        room.roomCode,
        room.location,
        room.capacity ?? "",
        room.description ?? "",
      ]),
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, "Rooms");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([wbout], { type: "application/octet-stream" }),
      "Rooms.xlsx"
    );
  }, [data]);

  // ----- Sort Options -----
  const sortOptions = [
    { label: "Recently", value: "recent" },
    { label: "Ascending", value: "asc" },
    { label: "Descending", value: "desc" },
  ];
  const [sortBy, setSortBy] = useState<string>("recent");

  // ----- Fetch Rooms -----
  const fetchRooms = useCallback(async () => {
    toggleLoader(true);
    try {
      let sortParam = "createdAt DESC";
      switch (sortBy) {
        case "asc":
          sortParam = "roomName ASC";
          break;
        case "desc":
          sortParam = "roomName DESC";
          break;
        default:
          sortParam = "createdAt DESC";
      }

      const res = await listRoomRequest({
        skip: pagination.pageIndex * pagination.pageSize,
        size: pagination.pageSize,
        search: globalFilter,
        sort: sortParam,
        status: statusFilter ?? undefined,
      });

      setData(res.data?.data ?? []);
      setTotalCount(res.data?.total ?? res.data?.data?.length ?? 0);
    } catch (err) {
      console.error("Fetch Rooms error:", err);
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
    fetchRooms();
  }, [fetchRooms]);

  // ----- Delete Functions -----
  const deleteRoom = useCallback(
    async (id: string) => {
      const result = await Swal.fire({
        title: "Are you sure? 😅",
        text: "This Room will be permanently deleted!",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it! 🗑️",
        cancelButtonText: "No, keep it 🙂",
      });

      if (result.isConfirmed) {
        await deleteRoomRequest([id]);
        Swal.fire("Deleted! 🗑️", "Room has been deleted.", "success");
        fetchRooms();
      }
    },
    [fetchRooms]
  );

  const deleteSelected = useCallback(async () => {
    const selectedIds = Object.keys(rowSelection)
      .map((key) => data[+key]?.id)
      .filter(Boolean) as string[];

    if (!selectedIds.length) return;

    const result = await Swal.fire({
      title: `Delete ${selectedIds.length} selected Room(s)? 😅`,
      text: "These Rooms will be permanently deleted!",
      showCancelButton: true,
      confirmButtonText: "Yes, delete them! 🗑️",
      cancelButtonText: "No, keep them 🙂",
    });

    if (result.isConfirmed) {
      await deleteRoomRequest(selectedIds);
      setRowSelection({});
      Swal.fire("Deleted! 🗑️", "Selected Rooms deleted.", "success");
      fetchRooms();
    }
  }, [rowSelection, data, fetchRooms]);

  // ----- Debounce Search -----
  const handleSearch = useMemo(() => {
    let timeout: ReturnType<typeof setTimeout>;
    return (val: string) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => setGlobalFilter(val), 300);
    };
  }, []);

  // ----- Columns -----
  const columns = useMemo<ColumnDef<TRoom>[]>(
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
      { accessorKey: "roomName", header: "Room Name" },
      { accessorKey: "roomCode", header: "Room Code" },
      { accessorKey: "location", header: "Location" },
      { accessorKey: "capacity", header: "Capacity" },
      { accessorKey: "description", header: "Description" },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="action-icon d-inline-flex gap-2">
            <a onClick={() => navigate(`/rooms/view/${row.original.id}`)}>
              <Eye size={18} />
            </a>
            <a onClick={() => navigate(`/rooms/edit/${row.original.id}`)}>
              <Pencil size={18} />
            </a>
            <a onClick={() => row.original.id && deleteRoom(row.original.id!)}>
              <Trash size={18} />
            </a>
          </div>
        ),
      },
    ],
    [navigate, deleteRoom]
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
      "Room Name",
      "Room Code",
      "Location",
      "Capacity",
      "Description",
    ];
    const csvRows = [
      headers.join(","),
      ...data.map((r) =>
        [
          r.roomName,
          r.roomCode,
          r.location,
          r.capacity ?? "",
          r.description ?? "",
        ].join(",")
      ),
    ];
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Rooms.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  }, [data]);

  return (
    <>
      <TableActions
        title="🏠 Room List | Dashboard"
        createBtn="Create Room"
        description="Manage and view all rooms in one place"
        pageTitle="Room List"
        downloadCSV={downloadCSV}
        exportPDF={exportPDF}
        exportExcel={exportExcel}
        deleteSelected={deleteSelected}
        rowSelectionCount={Object.keys(rowSelection).length}
        onCreate={() => navigate("/rooms/create")}
      />

      <div className="card relative">
        <FilterSortBar
          title="Room List"
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
                noDataMessage="No rooms found"
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
