import { useEffect, useState } from "react"
import { endOfMonth, format, startOfMonth } from "date-fns";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useUser } from "@/hooks/UserContext";
import { apiGet } from "@/lib/auth";
import { MoreHorizontal } from "lucide-react";

import type { ColDesc, WorkoutRecord } from "shared"
import type { DateRange } from "react-day-picker";

import WdogTableData from "@/components/WdogTableData";
import { WorkoutRecordDetailDialog } from "@/components/WorkoutRecordDetailDialog";

export default function HistoryContentMain() {
  const { member } = useUser();  // Context에서 공유
  //================================================================================================================
  // 기준 데이터
  //================================================================================================================
  const today = new Date();
  // 날짜 범위 상태 (초기값: 오늘 기준 7일전부터 오늘까지)
  const [dateRange] = useState<DateRange>({
    from: startOfMonth(today),
    to: endOfMonth(today),  // 이번 달의 마지막 날
  });
  const [data, setData] = useState<WorkoutRecord[]>([]);
  const [column, setColumn] = useState<ColDesc[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<WorkoutRecord | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)  
  useEffect(() => {
    if (!member?.MEM_ID || !dateRange.from || !dateRange.to) return;

    const memId = member.MEM_ID;
    const startDt = format(dateRange.from, 'yyyy-MM-dd');
    const endDt = format(dateRange.to, 'yyyy-MM-dd');

    const params = {
      mem_id: memId,
      from_dt: startDt,
      to_dt: endDt,
    };   
    apiGet('/api/getColDesc', { table: 'WorkoutRecord' })
      .then(data => {
        const nextColumns = data.data.map((col: any) => {
          if (col.COL_TYPE === 'act') {
            return {
              ...col,
              cellRenderer: (row: any) => (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleView(row)}>상세 보기</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEdit(row)}>수정</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(row)}>삭제</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ),
            };
          }
          return col;
        });

        setColumn(nextColumns);
      });      
    apiGet('/api/workout/getWorkoutRecords', params)
      .then(data => {
        setData(data.data);  
      });
  }, [member?.MEM_ID, dateRange.from?.toISOString(), dateRange.to?.toISOString()]);    
  function handleView(row: any): void {
    setSelectedRecord(row);
    setDetailOpen(true);
  }
  function handleEdit(row: any): void {
    console.log("Edit action for row:", row.WOR_ID_VIEW);
  }
  function handleDelete(row: any): void {
    console.log("Delete action for row:", row.WOR_ID_VIEW);
  }
  return (
    <div className="w-full">
      <WdogTableData column={column} data={data} caption={`운동내역상세 (${dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : ''} ~ ${dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : ''})`} />
      {selectedRecord && (
        <WorkoutRecordDetailDialog
                open={detailOpen}
                onOpenChange={setDetailOpen}
                record={selectedRecord}
              />
      )}
    </div>
  )
}