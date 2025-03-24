"use client";

import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  flexRender,
  getPaginationRowModel,
} from "@tanstack/react-table";

interface AuditLog {
  action: string;
  user: {
    _id: string;
    name: string;
  };
  timestamp: Date;
}

interface Props {
  auditLogs: AuditLog[];
  searchTerm: string;
}

export default function AuditLogsTable({ auditLogs, searchTerm }: Props) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const highlightText = (text: string, searchTerm: string) => {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, "gi");
    return text.split(regex).map((part, index) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <span key={index} className="bg-yellow-300 px-0.3">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const columns: ColumnDef<AuditLog>[] = [
    {
      id: "log",
      header: "Audit Logs",
      cell: (info) => {
        const log = info.row.original;
        const formattedTimestamp = new Date(log.timestamp).toLocaleString();
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-1">
              <span className="text-gray-700 text-lg">
                {highlightText(log.action, searchTerm)}
              </span>
            </div>
            <div className="col-span-1 md:text-center">
              <span className="text-sm text-gray-500">
                By{" "}
                <span className="font-semibold text-lg">
                  {highlightText(log.user.name, searchTerm)}
                </span>
              </span>
            </div>
            <div className="col-span-1 md:text-right">
              <span className="text-sm text-gray-500">
                On{" "}
                <span className="font-semibold text-lg">
                  {highlightText(formattedTimestamp, searchTerm)}
                </span>
              </span>
            </div>
          </div>
        );
      },
    },
  ];

  const filteredData = useMemo(() => {
    if (!searchTerm) return auditLogs;

    return auditLogs.filter((log) => {
      return (
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        new Date(log.timestamp)
          .toLocaleString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        log.user.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [auditLogs, searchTerm]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: false,
  });

  return (
    <>
      <div className="w-full overflow-x-auto relative rounded-lg shadow-lg border-2 border-gray-400">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#112B4F] text-white">
              {table.getHeaderGroups().map((headerGroup) =>
                headerGroup.headers.map((header) => (
                  <th key={header.id} className="py-3 px-4 text-center">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))
              )}
            </tr>
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="transition-all bg-gray-100 hover:bg-gray-200"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="py-3 px-4 border-t border-gray-300"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {filteredData.length === 0 && (
          <div className="py-4 text-center text-gray-500">
            No audit logs found.
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 w-full">
        <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
          <button
            className="group relative overflow-hidden cursor-pointer shadow-md px-6 py-2 rounded bg-gray-900 hover:bg-gray-800 text-white transition-all ease-out duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="group-disabled:hidden absolute -top-10 w-5 h-30 bg-white opacity-10 rotate-6 translate-x-20 group-hover:-translate-x-20 transition-all duration-1000 ease" />
            Back
          </button>
          <button
            className="group relative overflow-hidden cursor-pointer shadow-md px-6 py-2 rounded bg-gray-900 hover:bg-gray-800 text-white transition-all ease-out duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="group-disabled:hidden absolute -top-10 w-5 h-30 bg-white opacity-10 rotate-6 translate-x-20 group-hover:-translate-x-20 transition-all duration-1000 ease" />
            Next
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto text-sm sm:text-base">
          <span className="text-gray-800">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="cursor-pointer px-4 shadow-md py-2 rounded text-white bg-[#112B4F] w-full sm:w-auto"
          >
            {[10, 20, 30, 40, 50].map((size) => (
              <option
                key={size}
                value={size}
                className="bg-[#112B4F] text-white"
              >
                Show {size}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
}
