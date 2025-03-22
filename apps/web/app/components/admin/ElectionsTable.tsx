"use client";

import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  flexRender,
  getPaginationRowModel,
  ColumnResizeMode,
} from "@tanstack/react-table";
import { Edit, Trash2 } from "lucide-react";
import Link from "next/link";

interface Election {
  _id: string;
  name: string;
  department: string;
  position: string;
  startTime: Date;
  endTime: Date;
  status: "scheduled" | "started" | "completed";
}

interface Props {
  elections: Election[];
  searchTerm: string;
}

export default function ElectionsTable({ elections, searchTerm }: Props) {
  // Pagination state
  const [pagination, setPagination] = useState({
    pageIndex: 0, // Page index (zero-based)
    pageSize: 10, // Number of rows per page
  });
  const [columnResizeMode] = useState<ColumnResizeMode>("onChange");

  // Highlight matching text
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

  const getElectionStatus = (startTime: Date, endTime: Date) => {
    const now = new Date();
    if (now < new Date(startTime)) {
      return "scheduled";
    } else if (now >= new Date(startTime) && now <= new Date(endTime)) {
      return "started";
    } else {
      return "completed";
    }
  };

  // Define table columns
  const columns: ColumnDef<Election>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: (info) => highlightText(info.getValue() as string, searchTerm),
      size: 200, // Set initial width for the "Name" column
    },
    {
      accessorKey: "position",
      header: "Position",
      cell: (info) => highlightText(info.getValue() as string, searchTerm),
      size: 100, // Set initial width for the "Position" column
    },
    {
      accessorKey: "department",
      header: "Department",
      cell: (info) => highlightText(info.getValue() as string, searchTerm),
      size: 100, // Set smaller width for the "Department" column
    },
    {
      accessorKey: "startTime",
      header: "Start Time",
      cell: (info) => new Date(info.getValue() as string).toLocaleString(),
      size: 150, // Set initial width for the "Start Time" column
    },
    {
      accessorKey: "endTime",
      header: "End Time",
      cell: (info) => new Date(info.getValue() as string).toLocaleString(),
      size: 150, // Set initial width for the "End Time" column
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: (info) => {
        const startTime = info.row.original.startTime; // Get startTime from the row data
        const endTime = info.row.original.endTime; // Get endTime from the row data
        const status = getElectionStatus(startTime, endTime); // Calculate the status

        return (
          <span
            className={`px-2 py-1 rounded ${
              status === "scheduled"
                ? "bg-yellow-200 text-yellow-800"
                : status === "started"
                  ? "bg-blue-200 text-blue-800"
                  : "bg-green-200 text-green-800"
            }`}
          >
            {status}
          </span>
        );
      },
      size: 100, // Set smaller width for the "Status" column
    },
    {
      id: "auditLogs",
      header: "Audit Logs",
      cell: (info) => (
        <Link
          href={`/admin/elections/${info.row.original._id}/audit-logs`}
          className="text-blue-500 hover:text-blue-700"
        >
          View Logs
        </Link>
      ),
      size: 100,
    },
    {
      id: "edit",
      header: "Edit",
      cell: (info) => (
        <button
          className="cursor-pointer pt-1 text-blue-500 hover:text-blue-700"
          onClick={() => console.log("Editing election", info.row.original._id)}
        >
          <Edit size={18} />
        </button>
      ),
      size: 70, // Set smaller width for the "Edit" column
    },
    {
      id: "delete",
      header: "Delete",
      cell: (info) => (
        <button
          className="cursor-pointer text-red-500 hover:text-red-700"
          onClick={() =>
            console.log("Deleting election", info.row.original._id)
          }
        >
          <Trash2 size={18} />
        </button>
      ),
      size: 70, // Set smaller width for the "Delete" column
    },
  ];

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return elections;

    return elections.filter((election) => {
      return (
        election.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        election.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        election.position.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [elections, searchTerm]);

  // Create the table instance
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
    columnResizeMode,
  });

  return (
    <>
      <div className="w-full overflow-x-auto relative rounded">
        <table className="w-max min-w-full border-collapse border">
          <thead>
            <tr className="group bg-[#112B4F] text-white">
              {table.getHeaderGroups().map((headerGroup) =>
                headerGroup.headers.map((header, index) => (
                  <th
                    key={header.id}
                    className="py-3 px-3 text-center border-2 border-gray-900 relative"
                    style={{ width: header.getSize() }}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {index !== headerGroup.headers.length - 1 && (
                      <div
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        className={`resizer ${
                          header.column.getIsResizing() ? "isResizing" : ""
                        }`}
                      />
                    )}
                  </th>
                ))
              )}
            </tr>
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.original._id}
                className="relative group transition-all bg-gray-100 hover:bg-gray-300"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="py-3 px-2 w-1/4 max-md:min-w-[120px] border-2 border-gray-900 text-center"
                    style={{ width: cell.column.getSize() }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination Controls (same as UsersTable) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 w-full">
        {/* Previous & Next Buttons */}
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

        {/* Page Number & Page Size Selector */}
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
