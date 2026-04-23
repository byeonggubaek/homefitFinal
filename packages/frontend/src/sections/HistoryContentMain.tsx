import { useEffect, useState } from "react"
import { useUser } from "@/hooks/UserContext";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { apiGet } from "@/lib/utils";
import type { ColDesc, WorkoutRecord } from "shared"
import type { DateRange } from "react-day-picker";
import WdogTableData from "@/components/WdogTableData";

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
  const [columnTest, setColumnTest] = useState<ColDesc[]>([]);
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
        setColumnTest(data.data);
      });      
    apiGet('/api/workout/getWorkoutRecords', params)
      .then(data => {
        setData(data.data);  
      });
  }, [member?.MEM_ID, dateRange.from?.toISOString(), dateRange.to?.toISOString()]);    

  return (
    <div className="w-full">
      <WdogTableData column={columnTest} data={data} caption={`운동 상세 내역 (${dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : ''} ~ ${dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : ''})`} />
    </div>
  )
}