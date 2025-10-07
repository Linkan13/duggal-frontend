import { useMemo, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";

// --- Types ---
interface Order {
  id: string;
  user: {
    image: string;
    name: string;
    role: string;
  };
  projectName: string;
  status: string;
  budget: string;
}

// --- Dummy Data ---
const generateDummyData = (): Order[] => {
  const statuses = ["Active", "Pending", "Cancel"];
  const roles = [
    "Web Designer",
    "Project Manager",
    "Content Writer",
    "Developer",
    "Marketer",
  ];
  const projects = [
    "Agency Website",
    "Technology",
    "Blog Writing",
    "Social Media",
    "E-commerce",
    "App Development",
  ];

  return Array.from({ length: 50 }).map((_, i) => ({
    id: (i + 1).toString(),
    user: {
      image: `/images/user/user-${(i % 20) + 17}.jpg`,
      name: `User ${i + 1}`,
      role: roles[i % roles.length],
    },
    projectName: projects[i % projects.length],
    status: statuses[i % statuses.length],
    budget: `${(Math.random() * 50 + 1).toFixed(1)}K`,
  }));
};

// --- Export CSV ---
const downloadCSV = (rows: Order[]) => {
  const header = ["ID", "Name", "Role", "Project", "Status", "Budget"];
  const csvRows = [
    header.join(","),
    ...rows.map((r) =>
      [r.id, r.user.name, r.user.role, r.projectName, r.status, r.budget].join(
        ","
      )
    ),
  ];
  const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "table-data.csv";
  a.click();
  window.URL.revokeObjectURL(url);
};

export default function DataTable() {
  const [data, setData] = useState<Order[]>(() => generateDummyData());
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10, // default page size
  });

  // --- Columns ---
  const columns = useMemo<ColumnDef<Order>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <input
            type="checkbox"
            checked={table.getIsAllPageRowsSelected()}
            onChange={table.getToggleAllPageRowsSelectedHandler()}
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
          />
        ),
      },
      {
        accessorKey: "user.name",
        header: "User",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <img
              src={row.original.user.image}
              alt={row.original.user.name}
              className="w-10 h-10 rounded-full border"
            />
            <div>
              <div className="font-medium text-gray-800">
                {row.original.user.name}
              </div>
              <div className="text-gray-500 text-sm">
                {row.original.user.role}
              </div>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "projectName",
        header: "Project",
        cell: (info) => <span>{info.getValue() as string}</span>,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.status;
          const color =
            status === "Active"
              ? "bg-green-100 text-green-700"
              : status === "Pending"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700";
          return (
            <span className={`px-2 py-1 rounded text-xs font-medium ${color}`}>
              {status}
            </span>
          );
        },
      },
      {
        accessorKey: "budget",
        header: "Budget",
        cell: (info) => <span>{info.getValue() as string}</span>,
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <button
              onClick={() => alert(`Edit ${row.original.user.name}`)}
              className="text-blue-600 hover:text-blue-800"
            >
              ✏️
            </button>
            <button
              onClick={() =>
                setData((prev) => prev.filter((r) => r.id !== row.original.id))
              }
              className="text-red-600 hover:text-red-800"
            >
              🗑️
            </button>
          </div>
        ),
      },
    ],
    [setData]
  );

  // --- Table Instance ---
  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      rowSelection,
      pagination,
    },
    onPaginationChange: setPagination,   // 👈 now it’s used
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableRowSelection: true,
  });
  
  // --- Delete Selected Rows ---
  const deleteSelected = () => {
    const selectedIds = new Set(Object.keys(rowSelection));
    setData((prev) => prev.filter((row) => !selectedIds.has(row.id)));
    setRowSelection({});
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <input
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search..."
          className="px-3 py-2 border rounded w-64"
        />

        <div className="flex gap-2">
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="px-3 py-2 border rounded"
          >
            {[5, 10, 50, 100].map((size) => (
              <option key={size} value={size}>
                Show {size}
              </option>
            ))}
          </select>

          <button
            onClick={deleteSelected}
            disabled={Object.keys(rowSelection).length === 0}
            className={`px-4 py-2 rounded text-white ${
              Object.keys(rowSelection).length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            Delete Selected
          </button>
          <button
            onClick={() => downloadCSV(data)}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Download CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded-lg shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer select-none"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {{
                      asc: " ▲",
                      desc: " ▼",
                    }[header.column.getIsSorted() as string] ?? ""}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50 transition">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 text-sm text-gray-700">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
        <div className="text-gray-600 text-sm">
          Showing{" "}
          {table.getState().pagination.pageIndex *
            table.getState().pagination.pageSize +
            1}{" "}
          to{" "}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) *
              table.getState().pagination.pageSize,
            data.length
          )}{" "}
          of {data.length} entries
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          {Array.from({ length: table.getPageCount() }, (_, i) => (
            <button
              key={i}
              onClick={() => table.setPageIndex(i)}
              className={`px-3 py-1 rounded ${
                i === table.getState().pagination.pageIndex
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
