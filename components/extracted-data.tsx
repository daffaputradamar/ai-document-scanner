"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Copy, Download, RefreshCcw } from "lucide-react"
import { Card, CardContent } from "./ui/card"

interface ExtractedDataProps {
  data: Record<string, string>
  onNewScan: () => void
}

type DataFormat = "json" | "text" | "pdf"

export default function ExtractedData({ data, onNewScan }: ExtractedDataProps) {
  const [format, setFormat] = useState<DataFormat>("json")
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied">("idle")

  const getFormattedData = () => {
    switch (format) {
      case "json":
        return JSON.stringify(data, null, 2)
      case "text":
        return Object.entries(data)
          .map(([key, value]) => `${key.replace(/_/g, " ")}: ${value}`)
          .join("\n")
      case "pdf":
        return "PDF Export - Document data formatted as PDF"
      default:
        return JSON.stringify(data, null, 2)
    }
  }

  const handleDownload = () => {
    const filename = `document-data.${format === "json" ? "json" : format === "text" ? "txt" : "pdf"}`
    const content = getFormattedData()

    const element = document.createElement("a")
    element.setAttribute("href", `data:text/plain;charset=utf-8,${encodeURIComponent(content)}`)
    element.setAttribute("download", filename)
    element.style.display = "none"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(getFormattedData()).then(() => {
      setCopyStatus("copied")
      setTimeout(() => setCopyStatus("idle"), 2000)
    })
  }

  return (
    <section>
      <h2 className="text-2xl font-bold mb-6 text-foreground">Extracted Data</h2>
      
      <Card className="pt-2">
        <CardContent className="px-0">
          {/* Format Tabs */}
          <Tabs value={format} onValueChange={(value) => setFormat(value as DataFormat)} className="w-full">
            <TabsList className="grid w-full grid-cols-3 h-12 bg-card px-6">
              <TabsTrigger className="h-10 data-[state=active]:bg-background" value="json">JSON</TabsTrigger>
              <TabsTrigger className="h-10 data-[state=active]:bg-background" value="text">TEXT</TabsTrigger>
              <TabsTrigger className="h-10 data-[state=active]:bg-background" value="pdf">PDF</TabsTrigger>
            </TabsList>

            <hr className="mb-4 border-border" />

            <TabsContent value={format} className="px-6">
              <ScrollArea className="bg-secondary dark:bg-secondary rounded-lg p-6 mb-6 border border-border shadow-sm h-96 px-6">
                <pre className="text-foreground font-mono text-sm whitespace-pre-wrap break-words">{getFormattedData()}</pre>
              </ScrollArea>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 px-6">
            {format === "json" && (
              <Button
                onClick={handleDownload}
                className="bg-orange-500 hover:bg-orange-600"
                size="lg"
              >
                <Download />
                Download JSON
              </Button>
            )}
            <Button
              onClick={handleCopyToClipboard}
              variant="secondary"
              size="lg"
              className={format === "json" ? "" : "md:col-span-2"}
            >
              <Copy />
              {copyStatus === "copied" ? "Copied!" : "Copy to Clipboard"}
            </Button>
          </div>

          <div className="px-6">
            <Button
              onClick={onNewScan}
              variant="outline"
              size="lg"
              className="w-full"
            >
              <RefreshCcw/>
              Start New Scan
            </Button>
          </div>
        </CardContent>
      </Card>

    </section>
  )
}
