import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  Pagination,
  Selection,
  ChipProps,
  SortDescriptor,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { ChevronDownIcon } from "./Icons/ChevronDownIcon";
import { SearchIcon } from "./Icons/SearchIcon";
import { VerticalDotsIcon } from "./Icons/VerticalDotsIcon";
import { capitalize } from "./utils";

const statusColorMap: Record<string, ChipProps["color"]> = {
  active: "success",
  failed: "danger",
  paused: "warning",
};

const columns = [
  { name: "ID", uid: "id", sortable: false },
  { name: "Chip", uid: "chip", sortable: true },
  { name: "Created At", uid: "created_at", sortable: true },
  { name: "Status", uid: "status", sortable: true },
  { name: "Actions", uid: "actions" },
];

type TestData = {
  id: string;
  chip: string;
  created_at: string;
  status: string;
};

interface HistoryTableProps {
  data: TestData[];
}

export default function HistoryTable({ data }: HistoryTableProps) {
  const router = useRouter();
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set([]),
  );
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "created_at",
    direction: "ascending",
  });
  const [page, setPage] = React.useState(1);

  const pages = Math.ceil(data.length / rowsPerPage);

  const headerColumns = React.useMemo(() => columns, []);

  const filteredItems = React.useMemo(() => {
    return data.filter(
      (item) =>
        item.id.toLowerCase().includes(filterValue.toLowerCase()) ||
        item.chip.toLowerCase().includes(filterValue.toLowerCase()),
    );
  }, [data, filterValue]);

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

  const renderCell = React.useCallback(
    (item: TestData, columnKey: React.Key) => {
      const cellValue = item[columnKey as keyof TestData];

      switch (columnKey) {
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
            <div className="relative flex justify-end items-center gap-2">
              <Dropdown className="bg-background border-1 border-default-200">
                <DropdownTrigger>
                  <Button isIconOnly radius="full" size="sm" variant="light">
                    <VerticalDotsIcon className="text-default-400" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownItem onClick={() => handleViewEdit(item.id)}>
                    View/Edit
                  </DropdownItem>
                  <DropdownItem>Delete</DropdownItem>
                </DropdownMenu>
              </Dropdown>
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
      <div className="flex justify-between gap-3 items-end">
        <Input
          isClearable
          classNames={{
            base: "w-full sm:max-w-[44%]",
            inputWrapper: "border-1",
          }}
          placeholder="Search by UUID or Chip..."
          size="sm"
          startContent={<SearchIcon className="text-default-300" />}
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
