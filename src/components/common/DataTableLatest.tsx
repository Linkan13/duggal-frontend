// components/common/DataTable.tsx
import { flexRender, Table } from "@tanstack/react-table";

interface DataTableLatestProps<T> {
  table: Table<T>;
  data: T[];
  noDataMessage?: string;
}

const DataTableLatest = <T,>({
  table,
  data,
  noDataMessage = "No records found",
}: DataTableLatestProps<T>) => {
  return (
    <div className="row dt-row">
      <div className="col-sm-12 table-responsive">
        {data.length === 0 ? (
          <div className="text-center py-6">{noDataMessage}</div>
        ) : (
          <table className="table datatable dataTable no-footer">
            <thead className="thead-light">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      className="no-sort sorting sorting_asc"
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
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="odd">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="sorting_1">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DataTableLatest;
