"use client"

import * as React from "react"
import {
  ImagePlus,
  ClipboardPaste,
  Table2,
  X,
  Search,
  FileImage,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type RefImage = {
  id: string
  file: File
  url: string
  name: string
  size: number
  source: "upload" | "paste"
}

type RefRow = {
  id: string
  name: string
  category: string
  owner: string
  updatedAt: string
}

const SAMPLE_ROWS: RefRow[] = [
  { id: "TB-001", name: "회원 통계", category: "지표", owner: "admin", updatedAt: "2026-04-20" },
  { id: "TB-002", name: "상품 매출", category: "매출", owner: "sales", updatedAt: "2026-04-22" },
  { id: "TB-003", name: "운동 기록", category: "헬스", owner: "coach", updatedAt: "2026-04-24" },
  { id: "TB-004", name: "문의 내역", category: "CS", owner: "support", updatedAt: "2026-04-25" },
]

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const HistoryQandAMain = () => {
  const [question, setQuestion] = React.useState("")
  const [images, setImages] = React.useState<RefImage[]>([])
  const [rows, setRows] = React.useState<RefRow[]>(SAMPLE_ROWS)
  const [selectedRowIds, setSelectedRowIds] = React.useState<string[]>([])
  const [tableKeyword, setTableKeyword] = React.useState("")
  const fileInputRef = React.useRef<HTMLInputElement | null>(null)

  const filteredRows = React.useMemo(() => {
    const q = tableKeyword.trim().toLowerCase()
    if (!q) return rows
    return rows.filter((row) =>
      [row.id, row.name, row.category, row.owner, row.updatedAt]
        .join(" ")
        .toLowerCase()
        .includes(q)
    )
  }, [rows, tableKeyword])

  const selectedRows = React.useMemo(() => {
    return rows.filter((row) => selectedRowIds.includes(row.id))
  }, [rows, selectedRowIds])

  const addFiles = React.useCallback((fileList: File[], source: "upload" | "paste") => {
    const next = fileList
      .filter((file) => file.type.startsWith("image/"))
      .map((file) => ({
        id: crypto.randomUUID(),
        file,
        url: URL.createObjectURL(file),
        name: file.name || `image-${Date.now()}.png`,
        size: file.size,
        source,
      }))

    setImages((prev) => [...prev, ...next])
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    addFiles(files, "upload")
    e.target.value = ""
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const items = e.clipboardData?.items
    if (!items) return

    const pastedImages: File[] = []

    Array.from(items).forEach((item) => {
      if (item.kind === "file" && item.type.startsWith("image/")) {
        const file = item.getAsFile()
        if (file) pastedImages.push(file)
      }
    })

    if (pastedImages.length > 0) {
      addFiles(pastedImages, "paste")
      e.preventDefault()
    }
  }

  const removeImage = (id: string) => {
    setImages((prev) => {
      const target = prev.find((img) => img.id === id)
      if (target) URL.revokeObjectURL(target.url)
      return prev.filter((img) => img.id !== id)
    })
  }

  const toggleRow = (id: string) => {
    setSelectedRowIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const handleSubmit = () => {
    const payload = {
      question,
      imageRefs: images.map((img) => ({
        name: img.name,
        size: img.size,
        source: img.source,
        file: img.file,
      })),
      tableRefs: selectedRows,
    }

    console.log("질의 payload", payload)
    alert("콘솔에 payload를 출력했습니다.")
  }

  React.useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.url))
    }
  }, [images])

  return (
    <div className="mx-auto w-full max-w-7xl p-4 md:p-6">
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="space-y-2">
          <CardTitle className="text-xl">질의 작성 페이지</CardTitle>
          <CardDescription>
            질문 본문에 사진 참조와 테이블 참조를 함께 첨부할 수 있습니다.
            이미지 파일 선택과 클립보드 붙여넣기를 모두 지원합니다.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div
            className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]"
            onPaste={handlePaste}
          >
            <div className="space-y-6">
              <Card className="border-border/60">
                <CardHeader>
                  <CardTitle className="text-base">질문 입력</CardTitle>
                  <CardDescription>
                    질문 내용과 필요한 맥락을 자세히 적어주세요.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="예: 첨부한 사진과 선택한 테이블 데이터를 참고해서 월별 이상치를 설명해줘"
                    className="min-h-40 resize-y"
                  />

                  <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                    <Badge variant="secondary">텍스트 입력</Badge>
                    <Badge variant="outline">사진 참조 {images.length}개</Badge>
                    <Badge variant="outline">테이블 참조 {selectedRows.length}개</Badge>
                  </div>
                </CardContent>
              </Card>

              <Tabs defaultValue="images" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="images" className="gap-2">
                    <ImagePlus className="h-4 w-4" />
                    사진 참조
                  </TabsTrigger>
                  <TabsTrigger value="tables" className="gap-2">
                    <Table2 className="h-4 w-4" />
                    테이블 참조
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="images" className="mt-4">
                  <Card className="border-border/60">
                    <CardHeader>
                      <CardTitle className="text-base">사진 참조 첨부</CardTitle>
                      <CardDescription>
                        파일 업로드 또는 Ctrl/Cmd+V로 이미지를 붙여넣을 수 있습니다.
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={handleFileChange}
                        />

                        <Button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="gap-2"
                        >
                          <FileImage className="h-4 w-4" />
                          이미지 선택
                        </Button>

                        <Button type="button" variant="outline" className="gap-2">
                          <ClipboardPaste className="h-4 w-4" />
                          붙여넣기 가능 영역 활성화
                        </Button>
                      </div>

                      <div className="rounded-xl border border-dashed border-border bg-muted/30 p-4 text-sm text-muted-foreground">
                        이 영역 안에서 Ctrl+V 또는 Cmd+V를 누르면 클립보드 이미지가 자동으로 추가됩니다.
                      </div>

                      {images.length === 0 ? (
                        <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                          아직 첨부된 이미지가 없습니다.
                        </div>
                      ) : (
                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                          {images.map((img) => (
                            <div
                              key={img.id}
                              className="overflow-hidden rounded-xl border bg-background"
                            >
                              <div className="aspect-video bg-muted">
                                <img
                                  src={img.url}
                                  alt={img.name}
                                  className="h-full w-full object-contain"
                                />
                              </div>

                              <div className="space-y-2 p-3">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="min-w-0">
                                    <p className="truncate text-sm font-medium">{img.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {formatBytes(img.size)}
                                    </p>
                                  </div>

                                  <Button
                                    type="button"
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => removeImage(img.id)}
                                    aria-label="이미지 제거"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>

                                <Badge variant={img.source === "paste" ? "default" : "secondary"}>
                                  {img.source === "paste" ? "클립보드" : "업로드"}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="tables" className="mt-4">
                  <Card className="border-border/60">
                    <CardHeader>
                      <CardTitle className="text-base">테이블 참조 선택</CardTitle>
                      <CardDescription>
                        참조할 테이블 또는 데이터셋 행을 선택하세요.
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="relative">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          value={tableKeyword}
                          onChange={(e) => setTableKeyword(e.target.value)}
                          placeholder="테이블명, 카테고리, 담당자 검색"
                          className="pl-9"
                        />
                      </div>

                      <div className="rounded-xl border">
                        <ScrollArea className="max-h-80">
                          <Table>
                            <TableHeader className="sticky top-0 z-10 bg-background">
                              <TableRow>
                                <TableHead className="w-12">선택</TableHead>
                                <TableHead>ID</TableHead>
                                <TableHead>이름</TableHead>
                                <TableHead>카테고리</TableHead>
                                <TableHead>담당자</TableHead>
                                <TableHead>수정일</TableHead>
                              </TableRow>
                            </TableHeader>

                            <TableBody>
                              {filteredRows.length === 0 ? (
                                <TableRow>
                                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                    검색 결과가 없습니다.
                                  </TableCell>
                                </TableRow>
                              ) : (
                                filteredRows.map((row) => {
                                  const checked = selectedRowIds.includes(row.id)

                                  return (
                                    <TableRow
                                      key={row.id}
                                      data-state={checked ? "selected" : undefined}
                                      className="cursor-pointer"
                                      onClick={() => toggleRow(row.id)}
                                    >
                                      <TableCell onClick={(e) => e.stopPropagation()}>
                                        <Checkbox
                                          checked={checked}
                                          onCheckedChange={() => toggleRow(row.id)}
                                          aria-label={`${row.name} 선택`}
                                        />
                                      </TableCell>
                                      <TableCell className="font-mono text-xs">{row.id}</TableCell>
                                      <TableCell className="font-medium">{row.name}</TableCell>
                                      <TableCell>{row.category}</TableCell>
                                      <TableCell>{row.owner}</TableCell>
                                      <TableCell>{row.updatedAt}</TableCell>
                                    </TableRow>
                                  )
                                })
                              )}
                            </TableBody>
                          </Table>
                        </ScrollArea>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-6">
              <Card className="border-border/60">
                <CardHeader>
                  <CardTitle className="text-base">참조 요약</CardTitle>
                  <CardDescription>
                    현재 질문에 포함될 참조 데이터를 확인합니다.
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-lg border p-3">
                      <div className="text-xs text-muted-foreground">질문 길이</div>
                      <div className="mt-1 text-lg font-semibold">{question.length}</div>
                    </div>
                    <div className="rounded-lg border p-3">
                      <div className="text-xs text-muted-foreground">사진 수</div>
                      <div className="mt-1 text-lg font-semibold">{images.length}</div>
                    </div>
                    <div className="rounded-lg border p-3">
                      <div className="text-xs text-muted-foreground">테이블 수</div>
                      <div className="mt-1 text-lg font-semibold">{selectedRows.length}</div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">선택된 테이블</h4>
                    {selectedRows.length === 0 ? (
                      <p className="text-sm text-muted-foreground">선택된 테이블이 없습니다.</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {selectedRows.map((row) => (
                          <Badge key={row.id} variant="secondary">
                            {row.name}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">첨부된 사진</h4>
                    {images.length === 0 ? (
                      <p className="text-sm text-muted-foreground">첨부된 사진이 없습니다.</p>
                    ) : (
                      <div className="space-y-2">
                        {images.map((img) => (
                          <div
                            key={img.id}
                            className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm"
                          >
                            <span className="truncate">{img.name}</span>
                            <Badge variant="outline">{img.source}</Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <Button
                    type="button"
                    className="w-full"
                    onClick={handleSubmit}
                    disabled={!question.trim()}
                  >
                    질의 생성
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default HistoryQandAMain