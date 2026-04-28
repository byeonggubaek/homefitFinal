import * as React from "react"
import MDEditor from "@uiw/react-md-editor"
import rehypeSanitize from "rehype-sanitize"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type UploadResponse = {
  url: string
  fileName: string
}

const HistoryQandAMain = () =>  {
  const [title, setTitle] = React.useState("새 문서")
  const [markdown, setMarkdown] = React.useState<string>(
`# 안녕하세요

이곳에 **Markdown** 문서를 작성하세요.

## 기능
- 실시간 편집
- 미리보기
- .md 파일 업로드
- 서버로 저장`
  )

  const [selectedFile, setSelectedFile] = React.useState<File | null>(null)
  const [isUploading, setIsUploading] = React.useState(false)
  const [uploaded, setUploaded] = React.useState<UploadResponse | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setSelectedFile(file)

    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result
      if (typeof text === "string") {
        setMarkdown(text)
        setTitle(file.name.replace(/\.md$/i, ""))
      }
    }
    reader.readAsText(file, "utf-8")
  }

  const handleUpload = async () => {
    try {
      setIsUploading(true)

      const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" })
      const file = new File([blob], `${title || "document"}.md`, {
        type: "text/markdown",
      })

      const formData = new FormData()
      formData.append("file", file)
      formData.append("title", title)

      const response = await fetch("/api/markdown/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("업로드 실패")
      }

      const data: UploadResponse = await response.json()
      setUploaded(data)
    } catch (error) {
      console.error(error)
      alert("문서 업로드 중 오류가 발생했습니다.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${title || "document"}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="container mx-auto max-w-6xl p-4 md:p-8">
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="space-y-4">
          <div className="space-y-2">
            <CardTitle>Markdown 문서 작성기</CardTitle>
            <CardDescription>
              문서를 작성하거나 .md 파일을 불러온 뒤 서버로 업로드할 수 있습니다.
            </CardDescription>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">문서 제목</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="문서 제목 입력"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="markdown-file">Markdown 파일 불러오기</Label>
              <Input
                id="markdown-file"
                type="file"
                accept=".md,.markdown,text/markdown"
                onChange={handleFileChange}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="write" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="write">작성</TabsTrigger>
              <TabsTrigger value="preview">미리보기</TabsTrigger>
              <TabsTrigger value="split">분할 보기</TabsTrigger>
            </TabsList>

            <TabsContent value="write" className="mt-4">
              <div data-color-mode="light">
                <MDEditor
                  value={markdown}
                  onChange={(value) => setMarkdown(value || "")}
                  preview="edit"
                  height={500}
                  visibleDragbar={false}
                  textareaProps={{
                    placeholder: "Markdown을 입력하세요...",
                  }}
                />
              </div>
            </TabsContent>

            <TabsContent value="preview" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>{title}</CardTitle>
                  <CardDescription>렌더링된 Markdown 결과</CardDescription>
                </CardHeader>
                <CardContent>
                  <div
                    data-color-mode="light"
                    className="rounded-md border p-4"
                  >
                    <MDEditor.Markdown
                      source={markdown}
                      style={{ whiteSpace: "pre-wrap" }}
                      rehypePlugins={[rehypeSanitize]}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="split" className="mt-4">
              <div data-color-mode="light">
                <MDEditor
                  value={markdown}
                  onChange={(value) => setMarkdown(value || "")}
                  preview="live"
                  height={500}
                  visibleDragbar={false}
                  previewOptions={{
                    rehypePlugins: [[rehypeSanitize]],
                  }}
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter className="flex flex-col items-stretch gap-3 md:flex-row md:justify-between">
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="secondary" onClick={handleDownload}>
              .md 다운로드
            </Button>

            <Button
              type="button"
              onClick={handleUpload}
              disabled={isUploading}
            >
              {isUploading ? "업로드 중..." : "서버 업로드"}
            </Button>
          </div>

          <div className="text-sm text-muted-foreground">
            {selectedFile && <span>불러온 파일: {selectedFile.name}</span>}
            {uploaded && (
              <span className="block md:inline md:ml-4">
                업로드 완료: {uploaded.fileName}
              </span>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
export default HistoryQandAMain