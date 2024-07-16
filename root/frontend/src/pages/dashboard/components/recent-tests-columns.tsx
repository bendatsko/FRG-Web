import React from 'react';
import {ColumnDef} from '@tanstack/react-table';
import {Checkbox} from '@/components/ui/checkbox';
import {Button} from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {ArrowUpDown, Eye, MoreHorizontal, Share2, Trash} from 'lucide-react';
import {Badge} from '@/components/ui/badge';
import {Link} from "react-router-dom";

export const recentTestsColumns: ColumnDef<any>[] = [
    {
        id: 'select',
        header: ({table}) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected()}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({row}) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'id',
        header: 'ID',
        cell: ({row}) => <div className="w-[80px]">{row.getValue('id')}</div>,
    },
    {
        accessorKey: 'title',
        header: ({column}) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Title
                    <ArrowUpDown className="ml-2 h-4 w-4"/>
                </Button>
            )
        },
        cell: ({row}) => <div>{row.getValue('title')}</div>,
    },
    {
        accessorKey: 'DUT',
        header: 'DUT',
        cell: ({row}) => <div>{row.getValue('DUT')}</div>,
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({row}) => {
            const status = row.getValue('status')
            return (
                <Badge variant={status === 'Failed' ? 'destructive' : status === 'Queued' ? 'secondary' : 'default'}>
                    {status}
                </Badge>
            )
        },
    },
    {
        accessorKey: 'duration',
        header: ({column}) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Duration
                    <ArrowUpDown className="ml-2 h-4 w-4"/>
                </Button>
            )
        },
        cell: ({row}) => <div>{row.getValue('duration')}</div>,
    },
    {
        id: 'actions',
        cell: ({row}) => {
            const test = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4"/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(test.id)}>
                            Copy test ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem asChild>
                            <Link to={`/view/${test.id}`}>
                                <Eye className="mr-2 h-4 w-4"/>
                                View details
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Share2 className="mr-2 h-4 w-4"/>
                            Share
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Trash className="mr-2 h-4 w-4"/>
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
];