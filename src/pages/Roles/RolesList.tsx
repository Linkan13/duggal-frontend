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
  listRoleRequest,
  deleteRoleRequest,
  TRole,
} from "@/client/endpoints/roleService";

export default function RoleList() {
  const [data, setData] = useState<TRole[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const navigate = useNavigate();
  const toggleLoader = useGlobalLoader((state) => state.setShowLoader);

  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const statusOptions = ["active", "inactive"];

  // ----- Export PDF -----
  const exportPDF = useCallback(() => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("Role List", 10, 10);

    let y = 20;
    data.forEach((role) => {
      const line = `${role.name} | ${
        role.description ?? ""
      } | Active: ${role.active ? "Yes" : "No"}`;
      doc.text(line, 10, y);
      y += 10;
    });

    doc.save("Roles.pdf");
  }, [data]);

  // ----- Export Excel -----
  const exportExcel = useCallback(() => {
    const wsData = [
      ["Name", "Description", "Active", "Updated By"],
      ...data.map((role) => [
        role.name,
        role.description ?? "",
        role.active ? "Yes" : "No",
        role.updatedBy ?? "",
      ]),
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, "Roles");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([wbout], { type: "application/octet-stream" }),
      "Roles.xlsx"
    );
  }, [data]);

  // ----- Sort Options -----
  const sortOptions = [
    { label: "Recently", value: "recent" },
    { label: "Ascending", value: "asc" },
    { label: "Descending", value: "desc" },
  ];
  const [sortBy, setSortBy] = useState<string>("recent");

  // ----- Fetch Roles -----
  const fetchRoles = useCallback(async () => {
    toggleLoader(true);
    try {
      let sortParam = "createdAt DESC";
      switch (sortBy) {
        case "recent":
          sortParam = "createdAt DESC";
          break;
        case "asc":
          sortParam = "name ASC";
          break;
        case "desc":
          sortParam = "name DESC";
          break;
      }

      const res = await listRoleRequest({
        skip: pagination.pageIndex * pagination.pageSize,
        size: pagination.pageSize,
        search: globalFilter,
        sort: sortParam,
        active: statusFilter ? statusFilter === "active" : undefined,
      });

      setData(res.data?.data ?? []);
      setTotalCount(res.data?.total ?? res.data?.data?.length ?? 0);
    } catch (err) {
      console.error("Fetch Roles error:", err);
    } finally {
      toggleLoader(false);
    }
  }, [pagination, globalFilter, sortBy, statusFilter, toggleLoader]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  // ----- Delete Single Role -----
  const deleteRole = useCallback(
    async (id: string) => {
      const result = await Swal.fire({
        title: "Are you sure? 😅",
        text: "This Role will be permanently deleted!",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it! 🗑️",
        cancelButtonText: "No, keep it 🙂",
      });

      if (result.isConfirmed) {
        await deleteRoleRequest([id]);
        Swal.fire("Deleted! 🗑️", "Role has been deleted.", "success");
        fetchRoles();
      }
    },
    [fetchRoles]
  );

  // ----- Delete Selected -----
  const deleteSelected = useCallback(async () => {
    const selectedIds = Object.keys(rowSelection)
      .map((key) => data[+key]?.id?.toString())
      .filter(Boolean) as string[];

    if (!selectedIds.length) return;

    const result = await Swal.fire({
      title: `Delete ${selectedIds.length} selected Role(s)? 😅`,
      text: "These roles will be permanently deleted!",
      showCancelButton: true,
      confirmButtonText: "Yes, delete them! 🗑️",
      cancelButtonText: "No, keep them 🙂",
    });

    if (result.isConfirmed) {
      await deleteRoleRequest(selectedIds);
      setRowSelection({});
      Swal.fire("Deleted! 🗑️", "Selected roles deleted.", "success");
      fetchRoles();
    }
  }, [rowSelection, data, fetchRoles]);

  // ----- Debounce Search -----
  const handleSearch = useMemo(() => {
    let timeout: ReturnType<typeof setTimeout>;
    return (val: string) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => setGlobalFilter(val), 300);
    };
  }, []);

  // ----- Columns -----
  const columns = useMemo<ColumnDef<TRole>[]>(() => [
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
    { accessorKey: "name", header: "Role Name" },
    { accessorKey: "description", header: "Description" },
    {
      accessorKey: "active",
      header: "Active",
      cell: ({ row }) => (row.original.active ? "Yes" : "No"),
    },
    { accessorKey: "updatedBy", header: "Updated By" },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="action-icon d-inline-flex gap-2">
          <a onClick={() => navigate(`/roles/view/${row.original.id}`)}>
            <Eye size={18} />
          </a>
          <a onClick={() => navigate(`/roles/edit/${row.original.id}`)}>
            <Pencil size={18} />
          </a>
          <a onClick={() => row.original.id && deleteRole(row.original.id.toString())}>
            <Trash size={18} />
          </a>
        </div>
      ),
    },
  ], [navigate, deleteRole]);

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
    const headers = ["Name", "Description", "Active", "Updated By"];
    const csvRows = [
      headers.join(","),
      ...data.map((r) =>
        [r.name, r.description ?? "", r.active ? "Yes" : "No", r.updatedBy ?? ""].join(",")
      ),
    ];
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Roles.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  }, [data]);

  return (
    <>
      <TableActions
        createBtn="Create Role"
        title="👥 Role List | Dashboard"
        description="Manage and view all roles in one place"
        pageTitle="Role List"
        downloadCSV={downloadCSV}
        exportPDF={exportPDF}
        exportExcel={exportExcel}
        deleteSelected={deleteSelected}
        rowSelectionCount={Object.keys(rowSelection).length}
        onCreate={() => navigate("/roles/create")}
      />

      <div className="card relative">
        <FilterSortBar
          title="Role List"
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
                noDataMessage="No roles found"
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
