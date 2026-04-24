import {
  type ColumnDef,
  type ColumnPinningState,
  type SortingState,
  type VisibilityState,
  type PaginationState,  // <- 이것 추가  
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
import { useEffect, useMemo, useState } from "react"
import { formatDate, formatNumber, formatTime, getCommonPinningStyles } from "@/lib/utils"
import { ArrowUpDown, MoreHorizontal, TableProperties } from 'lucide-react';
import { Checkbox } from "./ui/checkbox"

interface DataTableProps {
  column: (any & { cellRenderer?: (row: any) => React.ReactNode })[]  // cellRenderer 추가
  data: any[]
  caption: string
  rowsPerPage?: number  // <- 페이지당 행 수 prop 추가 (기본 10)  
}

const WdogTableData = ({
  column,
  data,
  caption = '',
  rowsPerPage = 10,  // <- prop 받기
}: DataTableProps) => {
  const columnActual = useMemo<ColumnDef<any>[]>(() => {
    const dynamicColumns = column.map((col) => ({
      accessorKey: col.COL_ID,
      id: col.COL_ID,
      meta: { label: col.COL_NAME },
      size: col.COL_WIDTH === 0 ? undefined : col.COL_WIDTH,
      minSize: column.indexOf(col) === column.length - 1 ? 0 : col.COL_WIDTH,
      enableSorting: col.COL_SORT === "Y",
      enableHiding: col.COL_ID.endsWith("_COLOR") || col.COL_HIDDEN === "N",
      header: ({ table, column }: any) => {
        switch (col.COL_TYPE) {
          case "chk":
            return (
              <Checkbox
                checked={
                  table.getIsAllPageRowsSelected() ||
                  (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="전체 선택"
              />
            )
          case "act":
            return <div>메뉴</div>
          case "qty":
          case "prc":
          case "amt":
            return (
              col.COL_SORT === "Y" ? (
                <div className="text-right">
                  <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                  >
                    <ArrowUpDown className="h-4 w-4" />
                  </Button> 
                  <span>{col.COL_NAME}</span>
                </div>
              ) : (
                <div className="text-right">{col.COL_NAME}</div>
              )
            )                       
          case "dat":
          case "tim":
            return (
              col.COL_SORT === "Y" ? (
                <div className="text-center">
                  <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                  >
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                  <span>{col.COL_NAME}</span> 
                </div>
              ) : (
                <div className="text-center">{col.COL_NAME}</div>
              )
            )   
          default:
            return (
              col.COL_SORT === "Y" ? (
                <div>
                  <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                  >
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>                
                  <span>{col.COL_NAME}</span>
                </div>
              ) : (
                <div>{col.COL_NAME}</div>
              )
            )
        }        
      },
      cell: ({ row }: any) => {
        const value = row.getValue(col.COL_ID)

        switch (col.COL_TYPE) {
          case "chk":
            return (
              <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="행 선택"
              />
            )
          case "act":
            if (col.cellRenderer) {
              return col.cellRenderer(row.original);
            }            
            return  (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>상세 보기</DropdownMenuItem>
                  <DropdownMenuItem>수정</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )
          case "key":
            return <div className="font-medium">{String(value ?? "")}</div>
          case "qty":
          case "prc":
          case "amt":
            return <div className="text-right">{formatNumber(Number(value ?? 0))}</div>
          case "dat":
            return <div className="text-center">{formatDate(value)}</div>
          case "tim":
            return <div className="text-center">{formatTime(value)}</div>
          case "lst": {
            const listValue = row.getValue(col.COL_ID + "_COLOR");
            const colorClass = listValue
              ? `rounded px-2 py-1 bg-table-${(parseInt(listValue, 10) % 5)}`
              : ""
            return <div className={colorClass}>{value}</div>
          }
          default:
            return <div>{String(value ?? "")}</div>
        }
      },
      footer: ({ table } : any) => {
        switch(col.COL_SUM) {
          case "cnt":
            const count = table.getFilteredRowModel().rows.length
            return (
              <div className="text-right font-bold">
                <span>건수 : </span>
                {formatNumber(count)}
              </div>)
          case "sum":
            const total = table
              .getFilteredRowModel()
              .rows
              .reduce((sum: number, row: { getValue: (arg0: string) => any; }) => sum + Number(row.getValue(col.COL_ID)), 0)

            return (
              <div className="text-right font-bold">
                {formatNumber(total)}
              </div>
            )
          case "max":
            const max = table
              .getFilteredRowModel()
              .rows
              .reduce((max: number, row: { getValue: (arg0: string) => any; }) => Math.max(max, Number(row.getValue(col.COL_ID))), 0)

            return (
              <div className="text-right font-bold">
                <span>최대 : </span>{formatNumber(max)}
              </div>
            )
          case "min":
            const min = table              
              .getFilteredRowModel()
              .rows
              .reduce((min: number, row: { getValue: (arg0: string) => any; }) => Math.min(min, Number(row.getValue(col.COL_ID))), Number.POSITIVE_INFINITY)  
            return (
              <div className="text-right font-bold">
                <span>최소 : </span>{formatNumber(min)}
              </div>
            )  
          case "avg":
              const avg = table
                .getFilteredRowModel()
                .rows
                .reduce((sum: number, row: { getValue: (arg0: string) => any; }) => sum + Number(row.getValue(col.COL_ID)), 0) / table.getFilteredRowModel().rows.length
            return (
              <div className="text-right font-bold">
                <span>평균 : </span>{formatNumber(avg)}
              </div>
            ) 
          default:
            return null
        }
      },      
    }))
    return [...dynamicColumns]
  }, [column])

  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState("")
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: rowsPerPage,
  })  
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({ left: [], right: [] })  
  useEffect(() => {
    const nextVisibility: VisibilityState = {}

    column.forEach((col) => {
      if (col.COL_ID.endsWith("_COLOR")) {
        nextVisibility[col.COL_ID] = false
      }
    })
    setColumnVisibility(nextVisibility)

    const nextPinning: ColumnPinningState = {
      left: [],
      right: [],
    }
    column.forEach((col) => {
      if (col.COL_PIN === "L") {
        nextPinning.left!.push(col.COL_ID)
      } else if (col.COL_PIN === "R") {
        nextPinning.right!.push(col.COL_ID)
      }
    })    

    setColumnPinning(nextPinning)
  }, [column])
  
  const [rowSelection, setRowSelection] = useState({})
  const table = useReactTable({
    data,
    columns: columnActual,
    state: {
      sorting,
      globalFilter,
      columnVisibility,
      rowSelection,
      columnPinning,
      pagination,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onColumnPinningChange: setColumnPinning,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    defaultColumn: {
      size: 150,  // 기본 크기 조정 (기존 100에서 증가)
      minSize: 30,
      maxSize: 500,  // 최대 크기 증가
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
                  column.id.endsWith("_COLOR") ? null : (
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
                  )
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="w-full overflow-x-auto rounded-md border">
        <Table 
          className="min-w-full border-separate border-spacing-0 table-layout: auto"
          style={{ width: table.getTotalSize() }}  // ← 추가
        >
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
                      style={{
                        ...getCommonPinningStyles(column, "header"),
                        width: header.getSize(),
                        minWidth: column.columnDef.minSize,
                      }}
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
                        style={{
                          ...getCommonPinningStyles(column),
                          width: cell.column.getSize(),
                          minWidth: column.columnDef.minSize,
                        }}
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
                      style={{
                        ...getCommonPinningStyles(column),
                        width: header.getSize(),
                        minWidth: column.columnDef.minSize,
                      }}
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
        <span className="text-sm text-muted-foreground">
          {table.getState().pagination.pageIndex + 1} / {Math.ceil(table.getPageCount())} 페이지
        </span>
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

export default WdogTableData;

