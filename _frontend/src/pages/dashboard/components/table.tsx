// DataTable.tsx

import React, { useState } from "react";
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell, TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    MoreHorizontal,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

// Define the props for the DataTable component
interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    onDeleteSelected: (selectedRows: TData[]) => void;
}

export function DataTable<TData, TValue>({
                                             columns,
                                             data,
                                             onDeleteSelected,
                                         }: DataTableProps<TData, TValue>) {



    // State for sorting, filtering, column visibility, and row selection
    const [sorting, setSorting] = useState<SortingState>([
        { id: "start_time", desc: true },
    ]);


    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});

    // Initialize the table instance
    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onRowSelectionChange: setRowSelection,
    });

    // Handle deletion of selected rows
    const handleDelete = () => {
        const selectedRows = table
            .getFilteredSelectedRowModel()
            .rows.map((row) => row.original);
        onDeleteSelected(selectedRows);
    };

    // Render the table and its controls
    return (
        <div className="space-y-4">

            {/* Top Controls */}
            <div className="flex flex-row lg:flex-row items-center justify-between">
                <Input
                    placeholder="Search by name or id"
                    value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("title")?.setFilterValue(event.target.value)
                    }
                    className="border border-lightborder placeholder-lighth2 dark:placeholder-foreground text-sm w-8/12 md:w-10/12"
                />
                <TableActions table={table} handleDelete={handleDelete}/>
            </div>

            <div className="overflow-x-auto text-lighth1 rounded-lg border border-lightborder">
                <Table className="min-w-full ">


                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow
                                key={headerGroup.id}
                                className="bg-surface "
                            >
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        className="font-medium bg-light1 dark:bg-dark1 text-lighth1 text-sm uppercase tracking-wider"
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>


                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className=" hover:bg-hover transition-colors"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            className="text-sm text-lighth1 whitespace-nowrap"
                                        >
                                            {flexRender(cell.column.columnDef.cell, {
                                                ...cell.getContext(),
                                                handleDelete,
                                            })}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-lighth1 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>


                </Table>

            </div>

            <PaginationControls table={table}/>


        </div>
    );
}


// ---------------------------------------
// Table Actions component
const TableActions = ({table, handleDelete}) => (

    // This is the actions dropdown menu
    <DropdownMenu>
        {/*This is the actions button*/}
        <DropdownMenuTrigger asChild>
            <div className="flex items-center justify-center w-min">
                <Button
                    variant="outline"
                    className=" border w-full shadow-none border-lightborder text-lighth1"
                >
                    <MoreHorizontal className="mr-2 h-4 w-4"/>
                    Actions
                </Button>

            </div>

        </DropdownMenuTrigger>

        {/*This is the actions dropdown menu*/}
        <DropdownMenuContent align="end" className="w-[200px] shadow-none bg-background border-lightborder text-lighth1">

            <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
            {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                    <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize "
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                        {column.id}
                    </DropdownMenuCheckboxItem>
                ))}
            {table.getFilteredSelectedRowModel().rows.length > 0 && (
                <div>
                    <DropdownMenuLabel>Delete Selected</DropdownMenuLabel>
                    <DropdownMenuItem onClick={handleDelete}>
                        Confirm
                    </DropdownMenuItem>

                </div>
            )}
        </DropdownMenuContent>
    </DropdownMenu>
);
// ---------------------------------------


// ---------------------------------------
// Pagination Controls component
const PaginationControls = ({ table }) => (
    <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
            <p className="text-sm font-medium text-lighth1">Rows per page</p>
            <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                    table.setPageSize(Number(value));
                }}
            >
                <SelectTrigger className="h-8 w-[70px] border-lightborder text-lighth1">
                    <SelectValue placeholder={table.getState().pagination.pageSize} />
                </SelectTrigger>
                <SelectContent side="top">
                    {[10, 20, 30, 40, 50].map((pageSize) => (
                        <SelectItem key={pageSize} value={`${pageSize}`}>
                            {pageSize}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>


        <div className="flex items-center space-x-2 ">
            <PaginationButton
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
                icon={<ChevronsLeft className="h-4 w-4" />}
            />
            <PaginationButton
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                icon={<ChevronLeft className="h-4 w-4" />}
            />
            <PaginationButton
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                icon={<ChevronRight className="h-4 w-4" />}
            />
            <PaginationButton
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
                icon={<ChevronsRight className="h-4 w-4" />}
            />
        </div>
    </div>
);

// Pagination Button component
const PaginationButton = ({ onClick, disabled, icon }) => (
    <Button
        variant="outline"
        size="sm"
        onClick={onClick}
        disabled={disabled}
        className="border border-lightborder text-lighth1"
    >
        {icon}
    </Button>
);
// ---------------------------------------
