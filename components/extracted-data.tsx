"use client"

import { useState } from "react"

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
      <h2 className="text-2xl font-bold mb-6">Extracted Data</h2>

      {/* Format Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 pb-4">
        {(["json", "text", "pdf"] as const).map((fmt) => (
          <button
            key={fmt}
            onClick={() => setFormat(fmt)}
            className={`px-6 py-2 font-semibold transition-all duration-200 text-sm ${
              format === fmt ? "border-b-2 border-orange-500 text-gray-900" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {fmt.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="bg-gray-50 rounded-lg p-6 mb-6 font-mono text-sm max-h-96 overflow-y-auto border border-gray-200 shadow-sm">
        <pre className="text-gray-700 whitespace-pre-wrap break-words">{getFormattedData()}</pre>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {format === "json" && (
          <button
            onClick={handleDownload}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <span>⬇️</span>
            Download JSON
          </button>
        )}
        <button
          onClick={handleCopyToClipboard}
          className={`bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${format === "json" ? "" : "md:col-span-2"}`}
        >
          <span>📋</span>
          {copyStatus === "copied" ? "Copied!" : "Copy to Clipboard"}
        </button>
      </div>

      <button
        onClick={onNewScan}
        className="w-full border-2 border-gray-300 hover:border-gray-400 text-gray-900 font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 hover:bg-gray-50"
      >
        <span>🔄</span>
        Start New Scan
      </button>
    </section>
  )
}
