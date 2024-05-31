import React, { useEffect, useState } from "react";
import {
    Button,
    Chip,
    ChipProps,
    Input,
    Pagination,
    Selection,
    SortDescriptor,
    Tooltip,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { EditIcon } from "./Icons/EditIcon";
import { DeleteIcon } from "./Icons/DeleteIcon";
import { useMsalInstance } from '../contexts/MsalProvider'; // Ensure the correct path
import { AuthCodeMSALBrowserAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser';
import { Client } from '@microsoft/microsoft-graph-client';
import { InteractionType } from '@azure/msal-browser';
import { loginRequest } from '../config/authConfig'; // Ensure the correct path

const statusColorMap: Record<string, ChipProps["color"]> = {
    finished: "success",
    failed: "danger",
    paused: "default",
    running: "primary",
    queued: "warning",
};

const columns = [
    { name: "Name", uid: "displayName", sortable: false },
    { name: "Email", uid: "mail", sortable: false },
    { name: "Permissions", uid: "jobTitle", sortable: false },

];

interface User {
    id: string;
    displayName: string;
    mail: string;
    jobTitle: string;
    lastSignInDateTime: string;
}

export default function UsersTable() {
    const router = useRouter();
    const [filterValue, setFilterValue] = useState("");
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
        column: "lastSignInDateTime",
        direction: "ascending",
    });
    const [page, setPage] = useState(1);
    const [data, setData] = useState<User[]>([]);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [newUserEmail, setNewUserEmail] = useState("");
    const msalInstance = useMsalInstance();

    const fetchUsersFromB2C = async () => {
        try {
            const accounts = msalInstance.getAllAccounts();
            if (accounts.length === 0) {
                await msalInstance.loginPopup(loginRequest);
            } else {
                msalInstance.setActiveAccount(accounts[0]);
            }

            const authResult = await msalInstance.acquireTokenSilent({
                ...loginRequest,
                account: msalInstance.getActiveAccount(),
            });

            if (!authResult.account) {
                throw new Error('Could not authenticate');
            }

            const authProvider = new AuthCodeMSALBrowserAuthenticationProvider(msalInstance, {
                account: authResult.account,
                interactionType: InteractionType.Silent,
                scopes: loginRequest.scopes,
            });

            const client = Client.initWithMiddleware({ authProvider });

            const users = await client.api('/users').get();
            console.log(users); // Check the output
            setData(users.value);
        } catch (error) {
            console.error("Error fetching users from B2C:", error);
        }
    };

    useEffect(() => {
        fetchUsersFromB2C();
    }, [msalInstance]);

    const pages = Math.ceil(data.length / rowsPerPage);

    const headerColumns = React.useMemo(() => columns, []);

    const filteredItems = React.useMemo(() => {
        return data.filter(
            (item) =>
                item.displayName.toLowerCase().includes(filterValue.toLowerCase()) ||
                item.mail.toLowerCase().includes(filterValue.toLowerCase()),
        );
    }, [data, filterValue]);

    const sortedItems = React.useMemo(() => {
        return [...filteredItems].sort((a: User, b: User) => {
            const first = a[sortDescriptor.column as keyof User];
            const second = b[sortDescriptor.column as keyof User];
            const cmp = first < second ? -1 : first > second ? 1 : 0;

            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, filteredItems]);

    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return sortedItems.slice(start, end);
    }, [page, sortedItems, rowsPerPage]);

    const handleViewEdit = (id: string) => {
        router.push(`/t/${id}`);
    };

    const handleDelete = (id: string) => {
        // Implement delete user logic
    };

    const renderCell = React.useCallback(
        (item: User, columnKey: React.Key) => {
            const cellValue = item[columnKey as keyof User];

            switch (columnKey) {
                case "actions":
                    return (
                        <div className="relative flex items-center gap-2">
                            <Tooltip color="danger" content="Remove User">
                                <span
                                    className="text-lg text-danger cursor-pointer active:opacity-50"
                                    onClick={() => handleDelete(item.id)}
                                >
                                    <DeleteIcon />
                                </span>
                            </Tooltip>
                        </div>
                    );
                case "lastSignInDateTime":
                    return cellValue ? new Date(cellValue).toLocaleString() : "N/A";
                default:
                    return cellValue;
            }
        },
        [router],
    );

    const topContent = React.useMemo(() => {
        return (
            <div className="flex justify-center gap-3 items-end">

                <Input
                    isClearable
                    classNames={{
                        base: "w-full sm:max-w-[44%]",
                        inputWrapper: "border-1",
                    }}
                    placeholder="Search user by name or email..."
                    size="sm"
                    value={filterValue}
                    variant="bordered"
                    onClear={() => setFilterValue("")}
                    onValueChange={setFilterValue}
                />
            </div>
        );
    }, [filterValue]);

    const bottomContent = React.useMemo(() => {
        return (
            <div className="py-2 px-2 flex justify-between items-center">
                <Pagination
                    showControls
                    classNames={{
                        cursor: "bg-foreground text-background",
                    }}
                    color="default"
                    page={page}
                    total={pages}
                    variant="light"
                    onChange={setPage}
                />
            </div>
        );
    }, [page, pages]);

    const classNames = React.useMemo(
        () => ({
            wrapper: ["max-h-[382px]", "max-w-3xl"],
            th: ["bg-transparent", "text-default-500", "border-b", "border-divider"],
        }),
        [],
    );

    return (
        <div>


            <Table
                isCompact
                removeWrapper
                aria-label="Example table with custom cells, pagination and sorting"
                bottomContent={bottomContent}
                checkboxesProps={{
                    classNames: {
                        wrapper: "after:bg-foreground after:text-background text-background",
                    },
                }}
                classNames={classNames}
                selectedKeys={selectedKeys}
                selectionMode="none"
                sortDescriptor={sortDescriptor}
                topContent={topContent}
                onSelectionChange={setSelectedKeys}
                onSortChange={setSortDescriptor}
            >
                <TableHeader columns={headerColumns}>
                    {(column) => (
                        <TableColumn
                            key={column.uid}
                            align={column.uid === "actions" ? "center" : "start"}
                            allowsSorting={column.sortable}
                        >
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody emptyContent={"No users found"} items={items}>
                    {(item) => (
                        <TableRow key={item.id}>
                            {(columnKey) => (
                                <TableCell>{renderCell(item, columnKey)}</TableCell>
                            )}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
