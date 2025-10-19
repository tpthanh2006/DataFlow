import type { Form } from "@shared/types/formTypes";
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import { FormTypeBadge } from "./FormTypeBadge";
import {
  MoreHorizontal,
  Trash,
  Eye,
  SquarePen,
  ArrowUpDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { AccessManagementButton } from "./AccessManagementButton";

const columnHelper = createColumnHelper<Form>();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const columns: ColumnDef<Form, any>[] = [
  columnHelper.accessor("name", {
    header: "Name",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("base.name", {
    header: "Base",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("targetTable.name", {
    header: "Target Table",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("type", {
    header: "Type",
    cell: (info) => <FormTypeBadge variant={info.getValue()} />,
  }),
  // TODO: Fix updatedAt and createdAt helpers
  columnHelper.accessor("updatedAt", {
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Last updated
        <ArrowUpDown />
      </Button>
    ),
    cell: (info) =>
      new Date(info.getValue()).toLocaleDateString("en-UK", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
  }),
  columnHelper.display({
    header: "Access",
    id: "access",
    cell: ({ row }) => {
      const form = row.original;
      return <AccessManagementButton form={form} />;
    },
  }),
  columnHelper.display({
    // header: "Actions",
    id: "actions",
    cell: (/* { row }*/) => {
      // TODO: Make these actions actual work-- may need to use the below object :)
      // const form = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <SquarePen /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Eye /> Preview
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <Trash className="text-inherit" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  }),
];
