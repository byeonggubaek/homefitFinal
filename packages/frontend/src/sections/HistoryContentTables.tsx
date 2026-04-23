import {
  type ColumnDef,
  type ColumnPinningState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { getCommonPinningStyles } from "@/lib/utils"
import { TableProperties } from 'lucide-react';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[],
  caption: string;
  colors?: string[]; // 색상 배열
}

export function DataTable<TData, TValue>({
  columns,
  data,
  caption = '',
  colors = ['bg-table-1', 'bg-table-2', 'bg-table-3', 'bg-table-4', 'bg-table-5'],
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState("")
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({
    left: ["SELECT", "ACTIONS"], // 실제 컬럼 id로 바꾸세요. 예: ["select", "name"]
    right: [], // 예: ["actions"]
  })
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
      columnVisibility,
      rowSelection,
      columnPinning,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onColumnPinningChange: setColumnPinning,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    defaultColumn: {
      size: 100,
      minSize: 80,
      maxSize: 300,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 py-4">
        <div className="flex items-center gap-2">
          <TableProperties className="text-primary" />
          <span>{caption}</span>
        </div>
        <div className="ml-auto flex justify-end gap-2">
          <Input
            placeholder="조건 검색..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="min-w-min"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                컬럼 설정
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault()
                  table.toggleAllColumnsVisible(true)
                }}
              >
                전체 컬럼 표시
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onSelect={(e) => e.preventDefault()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {(column.columnDef.meta as { label?: string } | undefined)
                      ?.label ?? column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="w-full overflow-x-auto rounded-md border">
        <Table className="w-max min-w-full border-separate border-spacing-0">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="bg-gray-100"
              >
                {headerGroup.headers.map((header) => {
                  const { column } = header
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      style={getCommonPinningStyles(column)}
                      className="whitespace-nowrap border-b"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => {
                    const { column } = cell
                    return (
                      <TableCell
                        key={cell.id}
                        style={getCommonPinningStyles(column)}
                        className="whitespace-nowrap"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getVisibleLeafColumns().length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>

          <TableFooter>
            {table.getFooterGroups().map((footerGroup) => (
              <TableRow key={footerGroup.id}>
                {footerGroup.headers.map((header) => {
                  const { column } = header
                  return (
                    <TableCell
                      key={header.id}
                      colSpan={header.colSpan}
                      style={getCommonPinningStyles(column)}
                      className="border-t"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            column.columnDef.footer,
                            header.getContext()
                          )}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))}
          </TableFooter>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} / {table.getFilteredRowModel().rows.length} 항목이 선택되었습니다.
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          이전
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          다음
        </Button>
      </div>
    </div>
  )
}