import { useEffect, useState } from "react"
import { columns } from "./HistoryContentColumns"
import { DataTable } from "./HistoryContentTables"
import { useUser } from "@/hooks/UserContext";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { apiGet } from "@/lib/utils";
import type { WorkoutRecord } from "shared"
import type { DateRange } from "react-day-picker";

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
  const [records, setRecords] = useState<WorkoutRecord[]>([]);
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
    apiGet('/api/workout/getWorkoutRecords', params)
      .then(data => {
        setRecords(data.data);  
      });
  }, [member?.MEM_ID, dateRange.from, dateRange.to]);    

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={records} caption={`운동 상세 내역 (${dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : ''} ~ ${dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : ''})`} />
    </div>
  )
}