// @ts-nocheck

import React, {useState} from 'react';
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
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
const baseUrl = import.meta.env.VITE_API_URL;
import { toast } from '@/components/ui/use-toast';


interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

export function DataTable<TData, TValue>({
                                             columns,
                                             data,
                                         }: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('');
    const [role, setRole] = useState('');

    const [resetUserId, setResetUserId] = useState('');
    const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
    const [isResetting, setIsResetting] = useState(false);


    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    const generateRandomPassword = (length = 12) => {
        const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
        let password = '';
        const values = new Uint32Array(length);
        window.crypto.getRandomValues(values); // Use crypto API for secure random password
        for (let i = 0; i < length; i++) {
            password += charset[values[i] % charset.length];
        }
        return password;
    };

    const handleNewUser = async () => {
        try {
            const generatedPassword = generateRandomPassword(); // Generate random password

            const response = await fetch(`${baseUrl}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password: generatedPassword, username, bio, role }),
            });

            if (response.ok) {
                console.log('User created successfully');
                setEmail('');
                setUsername('');
                setBio('');
                setRole('');
                // Optionally send the generated password to the user via email or display it somewhere
            } else {
                console.error('Error creating user');
            }
        } catch (error) {
            console.error('Error creating user:', error);
        }
    };


    const handleResetPassword = async () => {
        if (!resetUserId) {
            toast({
                title: "Error",
                description: "Email is required",
                variant: "destructive",
            });
            return;
        }

        setIsResetting(true);
        try {
            const response = await fetch(`${baseUrl}/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: resetUserId }),
            });

            const data = await response.json();

            if (response.ok) {
                toast({
                    title: "Success",
                    description: data.message,
                });
                setIsResetDialogOpen(false);
            } else {
                throw new Error(data.error || 'Failed to reset password');
            }
        } catch (error) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setIsResetting(false);
            setResetUserId('');
        }
    };

    return (
        <>
            <div className="flex items-center py-4">
                <Input
                    placeholder="Search userbase"
                    value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("email")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm border-black/20 dark:border-white/20 "
                />
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="ml-4">Add User</Button>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>New User</DialogTitle>
                            <DialogDescription>
                                Add a new user by completing the following fields.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="email" className="text-right">
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    placeholder="johndoe@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="col-span-3"
                                />
                                <Label htmlFor="password" className="text-right">
                                    Password
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="password123"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="col-span-3"
                                />
                                <Label htmlFor="username" className="text-right">
                                    Username
                                </Label>
                                <Input
                                    id="username"
                                    placeholder="johndoe"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="col-span-3"
                                />
                                <Label htmlFor="bio" className="text-right">
                                    Bio
                                </Label>
                                <Input
                                    id="bio"
                                    placeholder="A short bio..."
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    className="col-span-3"
                                />
                                <Label htmlFor="role" className="text-right">
                                    Role
                                </Label>
                                <Input
                                    id="role"
                                    placeholder="User OR Developer"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="col-span-3"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline" onClick={() => {
                                    setEmail('');
                                    setPassword('');
                                    setUsername('');
                                    setBio('');
                                    setRole('');
                                }}>
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button type="submit" onClick={handleNewUser}>
                                Submit
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>


                <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="ml-4" onClick={() => setIsResetDialogOpen(true)}>
                            Reset Password
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Reset User Password</DialogTitle>
                            <DialogDescription>
                                Enter the user's email address to reset their password. A new temporary password will be generated and sent to the user's email.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="resetEmail" className="text-right">
                                    Email
                                </Label>
                                <Input
                                    id="resetEmail"
                                    type="email"
                                    placeholder="user@example.com"
                                    value={resetUserId}
                                    onChange={(e) => setResetUserId(e.target.value)}
                                    className="col-span-3"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsResetDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleResetPassword} disabled={isResetting}>
                                {isResetting ? 'Resetting...' : 'Reset Password'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>



                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Columns
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(value)
                                        }
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                );
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div>
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="dark:border-foreground">
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className="dark:border-foreground"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <div className="flex items-center justify-end space-x-2 py-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </>
    );
}