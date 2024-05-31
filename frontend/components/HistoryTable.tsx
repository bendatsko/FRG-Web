import React, { useEffect, useState } from "react";
import {
  Button,
  Chip,
  ChipProps,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Pagination,
  Selection,
  SortDescriptor,
  User, Tooltip,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";

import { useRouter } from "next/navigation";
import { VerticalDotsIcon } from "./Icons/VerticalDotsIcon";
import { capitalize } from "./utils";
import { EditIcon } from "./Icons/EditIcon";
import { DeleteIcon } from "./Icons/DeleteIcon";
import { EyeIcon } from "./Icons/EyeIcon";
import axios from "axios";

const statusColorMap: Record<string, ChipProps["color"]> = {
  finished: "success",
  failed: "danger",
  paused: "default",
  running: "primary",
  queued: "warning",
};

const columns = [
  // { name: "ID", uid: "id", sortable: false },
  { name: "Created By", uid: "created_by", sortable: false },
  { name: "Chip", uid: "chip", sortable: true },
  { name: "Date", uid: "date", sortable: true },
  { name: "Start Time", uid: "start_time", sortable: true },
  { name: "End Time", uid: "end_time", sortable: true },
  { name: "Status", uid: "status", sortable: true },
  { name: "", uid: "actions" },
];

type TestData = {
  id: string;
  user_name: string;
  user_email: string;
  chip: string;
  snr: number;
  num_tests: number;
  date: string;
  start_time: string;
  end_time: string;
  status: string;
};

export default function HistoryTable({userEmail}) {
  const router = useRouter();
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "date",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);
  const [data, setData] = useState<TestData[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/tests");
      if (response.data.status === "success") {
        setData(response.data.tests);
      } else {
        console.error("Failed to fetch data:", response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const deleteTest = async (id: string) => {
    try {
      const response = await axios.delete(`http://localhost:5000/tests/${id}`);
      if (response.data.status === "success") {
        setData(data.filter(test => test.id !== id));
        setTimeout(() => {
          fetchData();
        }, 1000);
      } else {
        console.error("Failed to delete test:", response.data);
      }
    } catch (error) {
      console.error("Error deleting test:", error);
    }
  };

  const pages = Math.ceil(data.length / rowsPerPage);

  const headerColumns = React.useMemo(() => columns, []);

  const filteredItems = React.useMemo(() => {
    return data.filter(
        (item) =>
            item.user_email === userEmail &&
            (item.id.toLowerCase().includes(filterValue.toLowerCase()) ||
                item.chip.toLowerCase().includes(filterValue.toLowerCase()))
    );
  }, [data, filterValue, userEmail]);

  const sortedItems = React.useMemo(() => {
    return [...filteredItems].sort((a: TestData, b: TestData) => {
      const first = a[sortDescriptor.column as keyof TestData];
      const second = b[sortDescriptor.column as keyof TestData];
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
    deleteTest(id);
  };

  const renderCell = React.useCallback(
    (item: TestData, columnKey: React.Key) => {
      const cellValue = item[columnKey as keyof TestData];

      switch (columnKey) {
        case "created_by":
          return (
            <User
              description={item.user_email}
              name={item.user_name}
            >
            </User>
          );
        case "status":
          return (
            <Chip
              className="capitalize border-none gap-1 text-default-600"
              color={statusColorMap[item.status]}
              size="sm"
              variant="dot"
            >
              {capitalize(cellValue as string)}
            </Chip>
          );
        case "actions":
          return (
            <div className="relative flex items-center gap-2">
              <Tooltip content="View Detailed Results">
                <span
                  className="text-lg text-default-400 cursor-pointer active:opacity-50"
                  onClick={() => handleViewEdit(item.id)}
                >
                  <EyeIcon />
                </span>
              </Tooltip>
              <Tooltip content="Manage Access">
                <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                  <EditIcon />
                </span>
              </Tooltip>
              <Tooltip color="danger" content="Delete">
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
        <Input
          isClearable
          classNames={{
            base: "w-full sm:max-w-[44%]",
            inputWrapper: "border-1",
          }}
          // placeholder="Search by UUID or Chip..."
            placeholder="Search your tests"
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
      <TableBody emptyContent={"No tests found"} items={sortedItems}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
