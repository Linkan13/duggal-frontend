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
  listOfferRequest,
  deleteOfferRequest,
} from "@/client/endpoints/student";
import { useGlobalLoader } from "@/hooks";
import { Eye, Pencil, Trash } from "tabler-icons-react";

import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { TOffer } from "@/types";

export default function OfferList() {
  const [data, setData] = useState<TOffer[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const navigate = useNavigate();
  const toggleLoader = useGlobalLoader((state) => state.setShowLoader);

  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const statusOptions = ["Featured", "Normal"];

  const [sortBy, setSortBy] = useState<string>("recent");
  const sortOptions = [
    { label: "Recently", value: "recent" },
    { label: "Ascending", value: "asc" },
    { label: "Descending", value: "desc" },
  ];

  // ----- Export PDF -----
  const exportPDF = useCallback(() => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("Offer List", 10, 10);

    let y = 20;
    data.forEach((offer) => {
      const line = `${offer.offerName} | ${offer.courseDays} days | ${
        offer.amount ?? "-"
      } | ${offer.discount ?? 0}%`;
      doc.text(line, 10, y);
      y += 10;
    });

    doc.save("Offers.pdf");
  }, [data]);

  // ----- Export Excel -----
  const exportExcel = useCallback(() => {
    const wsData = [
      ["Offer Name", "Course Days", "Amount", "Discount", "Additional Info", "Featured"],
      ...data.map((offer) => [
        offer.offerName,
        offer.courseDays,
        offer.amount ?? "",
        offer.discount ?? "",
        offer.additionalInfo ?? "",
        offer.featured ? "Yes" : "No",
      ]),
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, "Offers");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), "Offers.xlsx");
  }, [data]);

  // ----- Fetch Offers -----
  const fetchOffers = useCallback(async () => {
    toggleLoader(true);
    try {
      let sortParam = "createdAt DESC";
      switch (sortBy) {
        case "recent":
          sortParam = "createdAt DESC";
          break;
        case "asc":
          sortParam = "offerName ASC";
          break;
        case "desc":
          sortParam = "offerName DESC";
          break;
      }

      const res = await listOfferRequest({
        skip: pagination.pageIndex * pagination.pageSize,
        size: pagination.pageSize,
        search: globalFilter,
        sort: sortParam,
      });

      setData(res.data?.data ?? []);
      setTotalCount(res.data?.total ?? res.data?.data?.length ?? 0);
    } catch (err) {
      console.error("Fetch Offers error:", err);
    } finally {
      toggleLoader(false);
    }
  }, [pagination.pageIndex, pagination.pageSize, globalFilter, sortBy, toggleLoader]);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  // ----- Delete Functions -----
  const deleteOffer = useCallback(
    async (id: string) => {
      const result = await Swal.fire({
        title: "Are you sure? 😅",
        text: "This Offer will be permanently deleted!",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it! 🗑️",
        cancelButtonText: "No, keep it 🙂",
      });

      if (result.isConfirmed) {
        await deleteOfferRequest([id]);
        Swal.fire("Deleted! 🗑️", "Offer has been deleted.", "success");
        fetchOffers();
      }
    },
    [fetchOffers]
  );

  const deleteSelected = useCallback(async () => {
    const selectedIds = Object.keys(rowSelection)
      .map((key) => data[+key]?.id)
      .filter(Boolean) as string[];

    if (!selectedIds.length) return;

    const result = await Swal.fire({
      title: `Delete ${selectedIds.length} selected Offer(s)? 😅`,
      text: "These Offers will be permanently deleted!",
      showCancelButton: true,
      confirmButtonText: "Yes, delete them! 🗑️",
      cancelButtonText: "No, keep them 🙂",
    });

    if (result.isConfirmed) {
      await deleteOfferRequest(selectedIds);
      setRowSelection({});
      Swal.fire("Deleted! 🗑️", "Selected Offers deleted.", "success");
      fetchOffers();
    }
  }, [rowSelection, data, fetchOffers]);

  // ----- Debounce Search -----
  const handleSearch = useMemo(() => {
    let timeout: ReturnType<typeof setTimeout>;
    return (val: string) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => setGlobalFilter(val), 300);
    };
  }, []);

  // ----- Columns -----
  const columns = useMemo<ColumnDef<TOffer>[]>(() => [
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
    { accessorKey: "offerName", header: "Offer Name" },
    { accessorKey: "courseDays", header: "Course Days" },
    { accessorKey: "amount", header: "Amount" },
    { accessorKey: "discount", header: "Discount (%)" },
    { accessorKey: "additionalInfo", header: "Additional Info" },
    { accessorKey: "featured", header: "Featured" },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="action-icon d-inline-flex gap-2">
          <a onClick={() => navigate(`/offers/view/${row.original.id}`)}>
            <Eye size={18} />
          </a>
          <a onClick={() => navigate(`/offers/edit/${row.original.id}`)}>
            <Pencil size={18} />
          </a>
          <a onClick={() => row.original.id && deleteOffer(row.original.id)}>
            <Trash size={18} />
          </a>
        </div>
      ),
    },
  ], [navigate, deleteOffer]);

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
    const headers = ["Offer Name", "Course Days", "Amount", "Discount", "Additional Info", "Featured"];
    const csvRows = [
      headers.join(","),
      ...data.map((offer) =>
        [
          offer.offerName,
          offer.courseDays,
          offer.amount ?? "",
          offer.discount ?? "",
          offer.additionalInfo ?? "",
          offer.featured ? "Yes" : "No",
        ].join(",")
      ),
    ];
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Offers.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  }, [data]);

  return (
    <>
      <TableActions
        createBtn="Create Offer"
        title="🏷️ Offer List | Dashboard"
        description="Manage and view all offers in one place"
        pageTitle="Offer List"
        downloadCSV={downloadCSV}
        exportPDF={exportPDF}
        exportExcel={exportExcel}
        deleteSelected={deleteSelected}
        rowSelectionCount={Object.keys(rowSelection).length}
        onCreate={() => navigate("/offers/create")}
      />

      <div className="card relative">
        <FilterSortBar
          title="Offer List"
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
                noDataMessage="No offers found"
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
