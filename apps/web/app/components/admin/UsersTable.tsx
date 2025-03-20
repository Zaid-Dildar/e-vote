"use client";

import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  flexRender,
  getPaginationRowModel, // Add this import
} from "@tanstack/react-table";
import { Checkbox } from "@components/UI/Checkbox";
import { Edit, Trash2 } from "lucide-react";
import { useMediaQuery } from "@lib/useMeidaQuery"; // Custom hook for media queries

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  biometricRegistered?: boolean;
}

interface Props {
  users: User[];
  searchTerm: string;
}

export default function UsersTable({ users, searchTerm }: Props) {
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const isMobile = useMediaQuery("(max-width: 991px)"); // Detect mobile screens

  // Pagination state
  const [pagination, setPagination] = useState({
    pageIndex: 0, // Page index (zero-based)
    pageSize: 10, // Number of rows per page
  });

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

  // Handle row selection
  const toggleRowSelection = (userId: string) => {
    setSelectedUsers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  // Handle select all
  const toggleSelectAll = () => {
    if (selectedUsers.size === users.length) {
      setSelectedUsers(new Set());
    } else {
      const allUserIds = new Set(users.map((user) => user._id));
      setSelectedUsers(allUserIds);
    }
  };

  // Define table columns
  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: (info) => highlightText(info.getValue() as string, searchTerm),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: (info) => highlightText(info.getValue() as string, searchTerm),
    },
    {
      accessorKey: "department",
      header: "Department",
      cell: (info) => highlightText(info.getValue() as string, searchTerm),
    },
    {
      accessorKey: "biometricRegistered",
      header: "Biometrics",
      cell: (info) => ((info.getValue() as boolean) ? "✅" : "❌"),
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: (info) => info.getValue() as string,
    },
    {
      id: "edit",
      header: "Edit",
      cell: () => (
        <button className="text-blue-500 hover:text-blue-700">
          <Edit size={18} />
        </button>
      ),
    },
    {
      id: "delete",
      header: "Delete",
      cell: (info) => (
        <button
          className="text-red-500 hover:text-red-700"
          onClick={() => console.log("Deleting user", info.row.original._id)}
        >
          <Trash2 size={18} />
        </button>
      ),
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
  });

  return (
    <>
      <div className="w-full overflow-x-auto relative">
        <table className="w-max min-w-full border-collapse">
          <thead>
            <tr className="group bg-gray-900 text-white">
              {/* Add a hidden column for the checkbox */}
              {!isMobile && (
                <th className="bg-white">
                  <div
                    className={`relative p-1 ${
                      selectedUsers.size === users.length
                        ? "opacity-100"
                        : "opacity-0"
                    } group-hover:opacity-100`}
                  >
                    <Checkbox
                      checked={selectedUsers.size === users.length}
                      onClick={toggleSelectAll}
                    />
                  </div>
                </th>
              )}
              {table.getHeaderGroups().map((headerGroup) =>
                headerGroup.headers.map((header) => (
                  <th key={header.id} className="p-4 text-left">
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
            {table.getRowModel().rows.map((row) => {
              const isSelected = selectedUsers.has(row.original._id);

              return (
                <tr
                  key={row.original._id}
                  className={`relative group transition-all ${
                    isSelected ? "bg-[#bcbdbf]" : "bg-gray-300"
                  } hover:bg-gray-400`}
                >
                  {/* Floating Checkbox (Left-aligned & appears on hover) */}
                  {!isMobile && (
                    <td className="p-1 bg-white">
                      <div
                        className={`absolute left-1 top-1/2 transform -translate-y-1/2 ${
                          isSelected ? "opacity-100" : "opacity-0"
                        } group-hover:opacity-100 transition-opacity`}
                      >
                        <Checkbox
                          checked={isSelected}
                          onClick={() => toggleRowSelection(row.original._id)}
                        />
                      </div>
                    </td>
                  )}
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="p-4 w-1/4 max-md:min-w-[120px]"
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
        <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start lg:ml-7">
          <button
            className="group relative overflow-hidden cursor-pointer shadow-md px-4 py-2 rounded bg-gray-900 hover:bg-gray-800 text-white transition-all ease-out duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="group-disabled:hidden absolute -top-10 w-5 h-30 bg-white opacity-10 rotate-6 translate-x-20 group-hover:-translate-x-20 transition-all duration-1500 ease" />
            Previous
          </button>
          <button
            className="group relative overflow-hidden cursor-pointer shadow-md px-4 py-2 rounded bg-gray-900 hover:bg-gray-800 text-white transition-all ease-out duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="group-disabled:hidden absolute -top-10 w-5 h-30 bg-white opacity-10 rotate-6 translate-x-20 group-hover:-translate-x-20 transition-all duration-1500 ease" />
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
            className="cursor-pointer px-3 py-2 border rounded text-white bg-gray-900 w-full sm:w-auto"
          >
            {[10, 20, 30, 40, 50].map((size) => (
              <option
                key={size}
                value={size}
                className="bg-gray-900 text-white"
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
