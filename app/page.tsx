"use client"

import { useState } from "react"
import Header from "@/components/header"
import FileUpload from "@/components/file-upload"
import DocumentTypeSelector from "@/components/document-type-selector"
import ExtractedData from "@/components/extracted-data"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

const animationStyles = `
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-2px); }
  }
  @keyframes lightning-bolt {
    0% {
      background-position: 0% 50%;
      opacity: 0;
    }
    10% {
      opacity: 1;
    }
    15% {
      background-position: 25% 50%;
    }
    20% {
      background-position: 50% 50%;
    }
    25% {
      opacity: 0.7;
    }
    30% {
      background-position: 75% 50%;
    }
    35% {
      background-position: 100% 50%;
      opacity: 0;
    }
    100% {
      background-position: 100% 50%;
      opacity: 0;
    }
  }
  @keyframes lightning-glow {
    0%, 100% {
      box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.3), inset 0 0 0 2px rgba(236, 72, 153, 0.3);
    }
    50% {
      box-shadow: 0 0 20px 4px rgba(59, 130, 246, 0.6), inset 0 0 10px 0 rgba(236, 72, 153, 0.5);
    }
  }
  .animate-float {
    animation: float 3s ease-in-out infinite;
  }
  .lightning-border-button {
    position: relative;
    background: linear-gradient(90deg, rgb(37, 99, 235), rgb(139, 92, 246), rgb(236, 72, 153));
    border: 2px solid transparent;
    background-clip: padding-box;
    animation: lightning-glow 2s ease-in-out infinite;
  }
  .lightning-border-button::before {
    content: "";
    position: absolute;
    inset: -2px;
    background: linear-gradient(90deg, transparent, rgb(59, 130, 246), rgb(236, 72, 153), rgb(59, 130, 246), transparent);
    border-radius: inherit;
    background-size: 200% 100%;
    animation: lightning-bolt 3s ease-in-out infinite;
    pointer-events: none;
  }
  .lightning-border-button::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: linear-gradient(90deg, rgb(37, 99, 235), rgb(139, 92, 246), rgb(236, 72, 153));
    z-index: 1;
    pointer-events: none;
  }
  .lightning-border-button > * {
    position: relative;
    z-index: 2;
  }
`

async function extractDataFromImage(file: File, documentType: string) {
  try {
    const formData = new FormData()
    formData.append("image", file)
    formData.append("documentType", documentType)

    const response = await fetch("/api/scan", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error extracting data:", error)
    throw error
  }
}

export default function Home() {
  const [documentType, setDocumentType] = useState("KTP")
  const [hasFile, setHasFile] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [extractedData, setExtractedData] = useState<Record<string, string>>({})

  const handleFileUpload = (file: File) => {
    setSelectedFile(file)
    setHasFile(true)
  }

  const handleStartScan = async () => {
    if (!selectedFile) return

    setIsScanning(true)
    try {
      const data = await extractDataFromImage(selectedFile, documentType)
      setExtractedData(data.data || data)
      setIsScanning(false)
      setShowResults(true)
    } catch (error) {
      console.error("Scanning failed:", error)
      setIsScanning(false)
      alert("Failed to extract data from image. Please try again.")
    }
  }

  const handleNewScan = () => {
    setShowResults(false)
    setHasFile(false)
    setSelectedFile(null)
    setDocumentType("KTP")
  }

  return (
    <div className="min-h-screen bg-background dark:bg-background">
      <style>{animationStyles}</style>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-300 dark:bg-orange-600 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-blue-300 dark:bg-blue-600 rounded-full blur-3xl opacity-15"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-orange-400 dark:bg-orange-700 rounded-full blur-3xl opacity-15"></div>
        <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-blue-400 dark:bg-blue-700 rounded-full blur-3xl opacity-10"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <Header />
          <main className="max-w-2xl mx-auto space-y-8 py-8">
            {/* Upload Section */}
            
            <section>
              <h2 className="text-3xl font-bold mb-2 text-foreground">Upload Your Document</h2>
              <p className="text-muted-foreground mb-6">Supports KTP, Kartu Keluarga, and STNK formats (JPG, PNG).</p>
              <FileUpload onFileSelected={handleFileUpload} selectedFile={selectedFile} />
            </section>

            {/* Document Type Selector */}
            {hasFile && (
              <section>
                <h2 className="text-2xl font-bold mb-4 text-foreground">Select Document Type</h2>
                <DocumentTypeSelector selected={documentType} onSelect={setDocumentType} />
                <div className="relative group mt-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl blur-lg opacity-50 group-hover:opacity-100 transition duration-500 animate-glow-pulse"></div>
                  <Button
                    onClick={handleStartScan}
                    disabled={isScanning}
                    className="hover:cursor-pointer relative w-full h-13 text-base bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 text-white font-bold transition-all duration-300 shadow-xl group-hover:shadow-2xl group-hover:scale-110 rounded-xl overflow-hidden animate-lightning-border"
                  >
                    <div className="relative flex items-center justify-center">
                      {isScanning ? (
                        <>
                          <Spinner className="w-5 h-5 animate-spin" />
                          <span className="ml-2">Scanning...</span>
                        </>
                      ) : (
                        <>
                          <span className="text-xl mr-2 animate-float"><Sparkles className="size-5"/></span>
                          <span>Start Scan</span>
                        </>
                      )}
                    </div>
                  </Button>
                </div>
              </section>
            )}

            {/* Extracted Data Section */}
            {showResults && <ExtractedData data={extractedData} onNewScan={handleNewScan} />}
          </main>

          {/* Footer */}
          <footer className="mt-16 text-center text-muted-foreground text-sm border-t pt-6 border-border">
            © 2025 AI Document Scanner. All rights reserved.
          </footer>
        </div>
      </div>
    </div>
  )
}
