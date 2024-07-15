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
import {MoreHorizontal} from 'lucide-react';
import axios from "axios";
import ShareModal from './shareModal';
import {Link} from "react-router-dom";


export const recentTestsColumns: ColumnDef<any>[] = [
    {
        id: 'select',
        header: ({table}) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && 'indeterminate')
                }
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
    },
    {
        accessorKey: 'id',
        header: 'ID',
    },
    {
        accessorKey: 'title',
        header: 'Title',
    },
    {
        accessorKey: 'DUT',
        header: 'DUT',
    },
    {
        accessorKey: 'status',
        header: 'Status',
    },
    {
        accessorKey: 'duration',
        header: 'Duration',
    },
    {
        accessorKey: 'actions',
        header: 'Action',
        cell: ({row}) => {
            const handleDelete = async () => {
                const confirmDelete = window.confirm("Are you sure you want to delete this test?");
                if (confirmDelete) {
                    try {
                        await axios.delete(`http://localhost:3001/tests/${row.original.id}`);
                        // Implement a way to refresh the table data after deletion
                    } catch (error) {
                        console.error('Error deleting test:', error);
                    }
                }
            };

            const handleShare = async (newUser) => {
                try {
                    await axios.post(`http://localhost:3001/tests/${row.original.id}/share`, {username: newUser});
                    // Implement a way to refresh the table data after sharing
                } catch (error) {
                    console.error('Error sharing test:', error);
                }
            };

            const handleRemoveAccess = async (userToRemove) => {
                try {
                    await axios.post(`http://localhost:3001/tests/${row.original.id}/remove-access`, {username: userToRemove});
                    // Implement a way to refresh the table data after removing access
                } catch (error) {
                    console.error('Error removing access:', error);
                }
            };

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
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(row.getValue('id'))}>
                            Copy ID
                        </DropdownMenuItem>
                        <ShareModal
                            testId={row.original.id}
                            accessibleTo={row.original.accessible_to}
                            onShare={handleShare}
                            onRemove={handleRemoveAccess}
                        />
                        <DropdownMenuItem asChild>
                            <Link to={`/view/${row.original.id}`}>View Details</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];