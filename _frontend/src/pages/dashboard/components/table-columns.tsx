// tableColumns.tsx

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, Trash2, ArrowUpDown } from "lucide-react";
import { Link } from "react-router-dom";
import StatusBadge from "@/components/ui/statusbadge";
import { useSelector } from "react-redux";
import { selectUser } from "@/store/slice/auth";
import { Button } from "@/components/ui/button";

// Base URL for API calls
const baseUrl = import.meta.env.VITE_API_URL;

// Define the structure of a test item
interface TestItem {
  id: string;
  title: string;
  DUT: string;
  status: string;
  start_time: string;
  duration: number | null;
}

// Helper function to format date
const formatDate = (dateString: string): string =>
    new Date(dateString).toLocaleString();

// Helper function for date sorting
const sortDates = (a: string, b: string): number =>
    new Date(b).getTime() - new Date(a).getTime();

// Define the columns for the recent tests table
export const tableColumns = (handleDeleteTest) => {
  const columns: ColumnDef<TestItem>[] = [
    // Select column
    {
      id: "select",
      header: ({ table }) => (
          <div className="flex items-center justify-center ">
            <Checkbox
                checked={table.getIsAllPageRowsSelected()}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
          </div>
      ),
      cell: ({ row }) => (
          <div className="flex items-center justify-center">
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
          </div>
      ),
      enableSorting: false,
      enableHiding: false,
      size: 50,
    },
    // Title column
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => row.getValue("title"),
    },
    // DUT column
    {
      accessorKey: "DUT",
      header: "DUT",
      cell: ({ row }) => row.getValue("DUT"),
    },
    // Status column
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
    },
    // Start Time column
    {
      accessorKey: "start_time",
      header: ({ column }) => (
          <div className={"items-center flex items-center "}>
            Start time
            <Button
                   variant="ghost"
                   onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                   className=""
               >

            <ArrowUpDown className=" h-4 w-4" />
          </Button>

          </div>

      ),
      cell: ({ row }) => formatDate(row.getValue("start_time")),
      sortingFn: (rowA, rowB, columnId) =>
          sortDates(rowA.getValue(columnId), rowB.getValue(columnId)),
      sortDescFirst: true,
    },
      {
          id: "actions",
          header: () => <div className="text-center">Actions</div>,
          cell: ({ row }) => <ActionsCell test={row.original} />,
          size: 100, // Increased size to accommodate the new button
      },
  ];

  return columns;
};

const ActionsCell = ({ test }) => {
    return (
        <div className="flex items-center justify-center w-full">
            <Link to={`/view/${test.id}`} className="w-full">
                <Button
                    variant="default"
                    size="sm"
                    className="bg-black text-white hover:bg-gray-800 w-full"
                >
                    <Eye className="h-3 w-3 mr-1" />
                    <span className="text-xs">View</span>
                </Button>
            </Link>
        </div>
    );
};
