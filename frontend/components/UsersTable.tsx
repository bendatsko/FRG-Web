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
import axios from "axios";

const statusColorMap: Record<string, ChipProps["color"]> = {
    finished: "success",
    failed: "danger",
    paused: "default",
    running: "primary",
    queued: "warning",
};

const columns = [
    { name: "Name", uid: "name", sortable: false },
    { name: "Email", uid: "email", sortable: false },
    { name: "Role", uid: "role", sortable: true },
    { name: "Last Online", uid: "last_online", sortable: true },
    { name: "", uid: "actions" },
];

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    last_online: string;
}

export default function HistoryTable() {
    const router = useRouter();
    const [filterValue, setFilterValue] = useState("");
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
        column: "last_online",
        direction: "ascending",
    });
    const [page, setPage] = useState(1);
    const [data, setData] = useState<User[]>([]);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [newUserEmail, setNewUserEmail] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get("http://localhost:5000/users");
            if (response.data.status === "success") {
                setData(response.data.users);
            } else {
                console.error("Failed to fetch data:", response.data);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const addUser = async () => {
        try {
            const response = await axios.post("http://localhost:5000/adduser", { email: newUserEmail });
            if (response.data.status === "success") {
                fetchData();
                setNewUserEmail("");
                onOpenChange();
            } else {
                console.error("Failed to add user:", response.data);
            }
        } catch (error) {
            console.error("Error adding user:", error);
        }
    };

    const deleteUser = async (id: string) => {
        try {
            const response = await axios.delete(`http://localhost:5000/deleteuser/${id}`);
            if (response.data.status === "success") {
                fetchData();
            } else {
                console.error("Failed to delete user:", response.data);
            }
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    const pages = Math.ceil(data.length / rowsPerPage);

    const headerColumns = React.useMemo(() => columns, []);

    const filteredItems = React.useMemo(() => {
        return data.filter(
            (item) =>
                item.name.toLowerCase().includes(filterValue.toLowerCase()) ||
                item.email.toLowerCase().includes(filterValue.toLowerCase()),
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
        deleteUser(id);
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
                default:
                    return cellValue;
            }
        },
        [router],
    );

    const topContent = React.useMemo(() => {
        return (
            <div className="flex justify-center gap-3 items-end">
                <div>
                    <Button onPress={onOpen} color="primary" size="sm">New User</Button>
                </div>
                <Input
                    isClearable
                    classNames={{
                        base: "w-full sm:max-w-[44%]",
                        inputWrapper: "border-1",
                    }}
                    placeholder="Search by name or email..."
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
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement="top-center"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Add New User</ModalHeader>
                            <ModalBody>
                                <Input
                                    autoFocus
                                    label="User's Email"
                                    placeholder="foo@umich.edu"
                                    variant="bordered"
                                    value={newUserEmail}
                                    onChange={(e) => setNewUserEmail(e.target.value)}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="primary" onPress={addUser}>
                                    Submit
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

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
