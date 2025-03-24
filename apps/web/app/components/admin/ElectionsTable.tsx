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

interface Candidate {
  name: string;
  picture: string;
}

interface Election {
  _id: string;
  name: string;
  department: string;
  position: string;
  startTime: Date;
  endTime: Date;
  status: "scheduled" | "started" | "completed";
  updatedAt: Date;
  candidates: Candidate[];
}

interface Props {
  elections: Election[];
  searchTerm: string;
  onEditElectionAction: (election: Election) => void;
  onDeleteElectionAction: (electionId: string) => void;
}

export default function ElectionsTable({
  elections,
  searchTerm,
  onEditElectionAction,
  onDeleteElectionAction,
}: Props) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [columnResizeMode] = useState<ColumnResizeMode>("onChange");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false); // State for delete modal
  const [electionToDelete, setElectionToDelete] = useState<string | null>(null); // Store election ID to delete

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
      size: 200,
    },
    {
      accessorKey: "position",
      header: "Position",
      cell: (info) => highlightText(info.getValue() as string, searchTerm),
      size: 100,
    },
    {
      accessorKey: "department",
      header: "Department",
      cell: (info) => highlightText(info.getValue() as string, searchTerm),
      size: 100,
    },
    {
      accessorKey: "startTime",
      header: "Start Time",
      cell: (info) => new Date(info.getValue() as string).toLocaleString(),
      size: 170,
    },
    {
      accessorKey: "endTime",
      header: "End Time",
      cell: (info) => new Date(info.getValue() as string).toLocaleString(),
      size: 170,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: (info) => {
        const startTime = info.row.original.startTime;
        const endTime = info.row.original.endTime;
        const status = getElectionStatus(startTime, endTime);

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
      size: 100,
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
      size: 110,
    },
    {
      id: "edit",
      header: "Edit",
      cell: (info) => (
        <button
          className="cursor-pointer pt-1 text-blue-500 hover:text-blue-700"
          onClick={() => onEditElectionAction(info.row.original)}
        >
          <Edit size={18} />
        </button>
      ),
      size: 60,
    },
    {
      id: "delete",
      header: "Delete",
      cell: (info) => (
        <button
          className="cursor-pointer text-red-500 hover:text-red-700"
          onClick={() => {
            setElectionToDelete(info.row.original._id); // Set election ID to delete
            setDeleteModalOpen(true); // Open the delete confirmation modal
          }}
        >
          <Trash2 size={18} />
        </button>
      ),
      size: 60,
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

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    if (electionToDelete) {
      onDeleteElectionAction(electionToDelete); // Trigger the delete action
      setDeleteModalOpen(false); // Close the modal
      setElectionToDelete(null); // Reset the election to delete
    }
  };

  return (
    <>
      <div className="w-full overflow-x-auto shadow-lg relative border-2 border-gray-400 rounded-lg">
        <table className="w-max min-w-full">
          <thead>
            <tr className="group bg-[#112B4F] text-white">
              {table.getHeaderGroups().map((headerGroup) =>
                headerGroup.headers.map((header, index) => (
                  <th
                    key={header.id}
                    className="py-3 px-3 text-center relative"
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
                className="relative group transition-all border-t-2 border-t-gray-300 bg-gray-100 hover:bg-gray-200"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="py-3 px-2 w-1/4 max-md:min-w-[120px] last-of-type:border-r-0  border-r-2 border-r-gray-300 text-center text-gray-700"
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

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/70 bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <h2 className="text-white py-4 rounded-t text-xl text-center bg-[#112B4F] font-bold mb-4">
              Confirm Deletion
            </h2>
            <div className="p-6 pt-1">
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete this election?
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setDeleteModalOpen(false)}
                  className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 cursor-pointer group relative overflow-hidden shadow-md"
                >
                  <span className="max-sm:hidden group-disabled:hidden absolute -top-10 w-8 h-30 bg-white opacity-10 rotate-6 translate-x-30 group-hover:-translate-x-30 transition-all duration-1000 ease" />
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 cursor-pointer group relative overflow-hidden shadow-md"
                >
                  <span className="max-sm:hidden group-disabled:hidden absolute -top-10 w-8 h-30 bg-white opacity-10 rotate-6 translate-x-30 group-hover:-translate-x-30 transition-all duration-1000 ease" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
