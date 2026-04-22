import type { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ArrowUpDown } from "lucide-react"
import type { WorkoutRecord } from "shared"
import { formatDate, formatNumber } from "@/lib/utils"

export const columns: ColumnDef<WorkoutRecord>[] = [
  {
    accessorKey: 'SELECT',    
    id: "SELECT",
    size: 60,
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="전체 선택"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="행 선택"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },  
  {
    accessorKey: 'ACTIONS',        
    id: "ACTIONS",
    size: 60,
    meta: {label: '메뉴',},    
    header: "메뉴",    
    cell: ({ row }) => {
      const workout = row.original
 
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>메뉴</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(workout.id)}
            >
              운동번호 복사
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>고객 보기</DropdownMenuItem>
            <DropdownMenuItem>지불상세 보기</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
    enableSorting: false,
    enableHiding: false,    
  },    
  {
    accessorKey: "WOR_ID_VIEW",
    id: "WOR_ID_VIEW",    
    size: 100,    
    meta: {label: '운동번호',},
    header: "운동번호",
  },
  {
    accessorKey: "WOR_DT",
    id: "WOR_DT",        
    size: 80,       
    meta: {label: '운동일',},
    header: ({ column }) => (
      <div className="flex items-center">
        <div>운동일</div>
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      const formatted = formatDate(row.getValue("WOR_DT"))      
      return <div className="font-medium">{formatted}</div>
    }
  },
  {
    accessorKey: "WOO_NAME",
    id: "WOO_NAME",    
    size: 100,       
    meta: {label: '운동명',},    
    header: "운동명",
  },    
  {
    accessorKey: "WOD_TARGET_REPS",
    id: "WOD_TARGET_REPS",    
    size: 80,       
    meta: {label: '반복횟수/초',},        
    header: () => {
      return <div className="text-right font-medium">반복횟수/초</div>
    },    
    cell: ({ row }) => {
      const targetReps = parseFloat(row.getValue("WOD_TARGET_REPS"))
      const formatted = formatNumber(targetReps);
 
      return <div className="text-right font-medium">{formatted}</div>
    },
    footer: ({ table }) => {
      const total = table
        .getFilteredRowModel()
        .rows
        .reduce((sum, row) => sum + Number(row.getValue("WOD_TARGET_REPS")), 0)

      return (
        <div className="text-right font-bold">
          {formatNumber(total)}
        </div>
      )
    },
  },
  {
    accessorKey: "WOD_TARGET_SETS",
    id: "WOD_TARGET_SETS",    
    size: 80,       
    meta: {label: '세트수',},
    header: () => {
      return <div className="text-right font-medium">세트수</div>
    },      
    cell: ({ row }) => {
      const targetSets = parseFloat(row.getValue("WOD_TARGET_SETS"))
      const formatted = formatNumber(targetSets);
 
      return <div className="text-right font-medium">{formatted}</div>
    },
    footer: ({ table }) => {
      const total = table
        .getFilteredRowModel()
        .rows
        .reduce((sum, row) => sum + Number(row.getValue("WOD_TARGET_SETS")), 0)

      return (
        <div className="text-right font-bold">
          {formatNumber(total)}
        </div>
      )
    },
  },  
  {
    accessorKey: "WOD_COUNT",
    id: "WOD_COUNT",    
    size: 80,       
    meta: {label: '실행횟수/초',},
    header: () => {
      return <div className="text-right font-medium">실행횟수/초</div>
    },        
    cell: ({ row }) => {
      const count = parseFloat(row.getValue("WOD_COUNT"))
      const formatted = formatNumber(count);
 
      return <div className="text-right font-medium">{formatted}</div>
    },
    footer: ({ table }) => {
      const total = table
        .getFilteredRowModel()
        .rows
        .reduce((sum, row) => sum + Number(row.getValue("WOD_COUNT")), 0)

      return (
        <div className="text-right font-bold">
          {formatNumber(total)}
        </div>
      )
    },
  },
  {
    accessorKey: "WOD_POINT",
    id: "WOD_POINT",    
    size: 80,       
    meta: {label: '획득포인트',},
    header: () => {
      return <div className="text-right font-medium">획득포인트</div>
    },        
    cell: ({ row }) => {
      const point = parseFloat(row.getValue("WOD_POINT"))
      const formatted = formatNumber(point);
 
      return <div className="text-right font-medium">{formatted}</div>
    },
    footer: ({ table }) => {
      const total = table
        .getFilteredRowModel()
        .rows
        .reduce((sum, row) => sum + Number(row.getValue("WOD_POINT")), 0)

      return (
        <div className="text-right font-bold">
          {formatNumber(total)}
        </div>
      )
    },
  },
  {
    accessorKey: "WOR_DESC",
    id: "WOR_DESC",    
    size: 300,       
    meta: {label: '운동내역',},
    header: "운동내역",
  },      
]