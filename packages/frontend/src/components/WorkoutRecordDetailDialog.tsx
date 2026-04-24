import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import type { WorkoutRecord } from "shared"

interface WorkoutRecordDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  record: WorkoutRecord | null
}

export function WorkoutRecordDetailDialog({
  open,
  onOpenChange,
  record,
}: WorkoutRecordDetailDialogProps) {
  if (!record) return null

  const detailRows = [
    { label: "운동기록 ID", value: record.WOR_ID },
    { label: "표시 ID", value: record.WOR_ID_VIEW },
    { label: "운동일자", value: format(new Date(record.WOR_DT), "yyyy-MM-dd") },
    { label: "운동명", value: record.WOO_NAME },
    { label: "반복횟수/초", value: record.WOD_TARGET_REPS },
    { label: "세트수", value: record.WOD_TARGET_SETS },
    { label: "계획 횟수/초", value: record.WOD_COUNT_P },
    { label: "수행 횟수/초", value: record.WOD_COUNT },
    { label: "획득포인트", value: record.WOD_POINT },
    { label: "운동내역", value: record.WOR_DESC || "-" },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-160">
        <DialogHeader>
          <DialogTitle>운동 상세 정보</DialogTitle>
          <DialogDescription>
            선택한 운동 기록의 상세 내용입니다.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-3 py-2 sm:grid-cols-2">
          {detailRows.map((item) => (
            <div
              key={item.label}
              className="rounded-md border bg-muted/30 px-4 py-3"
            >
              <div className="text-sm text-muted-foreground">{item.label}</div>
              <div className="mt-1 font-medium break-all">
                {String(item.value)}
              </div>
            </div>
          ))}
        </div>

        <DialogFooter className="gap-2 sm:justify-end">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            닫기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}