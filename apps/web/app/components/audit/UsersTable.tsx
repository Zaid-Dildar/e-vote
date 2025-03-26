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

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  password: string;
  department: string;
  biometricRegistered?: boolean;
  updatedAt: Date;
}

interface Props {
  users: User[];
  searchTerm: string;
}

export default function UsersTable({ users, searchTerm }: Props) {
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

  // Define table columns
  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: (info) => highlightText(info.getValue() as string, searchTerm),
      size: 200, // Set initial width for the "Name" column
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: (info) => highlightText(info.getValue() as string, searchTerm),
      size: 250, // Set initial width for the "Email" column
    },
    {
      accessorKey: "department",
      header: "Department",
      cell: (info) => highlightText(info.getValue() as string, searchTerm),
      size: 100, // Set smaller width for the "Department" column
    },
    {
      accessorKey: "biometricRegistered",
      header: "Biometrics",
      cell: (info) => (
        <span
          className={`px-2 py-1 rounded ${
            (info.getValue() as boolean)
              ? "bg-green-200 text-green-800"
              : "bg-yellow-200 text-yellow-800"
          }`}
        >
          {(info.getValue() as boolean) ? "Registered" : "Unregistered"}
        </span>
      ),
      size: 100, // Set smaller width for the "Biometrics" column
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: (info) => info.getValue() as string,
      size: 100, // Set initial width for the "Role" column
    },
  ];

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return users;

    return users.filter((user) => {
      return (
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.department.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [users, searchTerm]);

  // Create the table instance
  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      pagination, // Pass pagination state
    },
    onPaginationChange: setPagination, // Update pagination state
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(), // Enable pagination
    manualPagination: false, // Use client-side pagination
    columnResizeMode,
  });

  return (
    <>
      <div className="w-full max-w- overflow-x-auto relative rounded-lg shadow-lg border-2 border-gray-400">
        <table className="w-max min-w-full">
          <thead>
            <tr className="group bg-[#112B4F] text-white">
              {table.getHeaderGroups().map((headerGroup) =>
                headerGroup.headers.map((header, index) => (
                  <th
                    key={header.id}
                    className="py-3 px-3 text-center relative"
                    style={{ width: header.getSize() }} // Set column width
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {index !== headerGroup.headers.length - 1 && (
                      <div
                        onMouseDown={header.getResizeHandler()} // Add resize handler
                        onTouchStart={header.getResizeHandler()} // Add resize handler
                        className={`resizer ${
                          header.column.getIsResizing() ? "isResizing" : ""
                        }`}
                        style={{
                          transform:
                            columnResizeMode === "onEnd" &&
                            header.column.getIsResizing()
                              ? `translateX(${
                                  table.getState().columnSizingInfo.deltaOffset
                                }px)`
                              : "",
                        }}
                      />
                    )}
                  </th>
                ))
              )}
            </tr>
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => {
              return (
                <tr
                  key={row.original._id}
                  className={`relative group transition-all border-t-2 border-t-gray-300 bg-gray-100 hover:bg-gray-200`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="py-3 px-2 w-1/4 max-md:min-w-[120px] last-of-type:border-r-0  border-r-2 border-r-gray-300 text-center text-gray-700"
                      style={{ width: cell.column.getSize() }} // Set column width
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
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
