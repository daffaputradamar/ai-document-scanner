"use client"

import { useState } from "react"
import Header from "@/components/header"
import FileUpload from "@/components/file-upload"
import DocumentTypeSelector from "@/components/document-type-selector"
import ExtractedData from "@/components/extracted-data"
import { Spinner } from "@/components/ui/spinner"

const MOCK_EXTRACTED_DATA = {
  nik: "3171234567890001",
  nama: "BUDI SANTOSO",
  tempat_lahir: "JAKARTA",
  tanggal_lahir: "17-08-1985",
  jenis_kelamin: "LAKI-LAKI",
  gol_darah: "0",
  alamat: "JL. MERDEKA NO. 1",
  rt_rw: "001/001",
  kel_desa: "GAMBIR",
  kecamatan: "GAMBIR",
  agama: "ISLAM",
  status_perkawinan: "KAWIN",
  pekerjaan: "KARYAWAN SWASTA",
  kewarganegaraan: "WNI",
  berlaku_hingga: "SEUMUR HIDUP",
}

export default function Home() {
  const [documentType, setDocumentType] = useState("KTP")
  const [hasFile, setHasFile] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFileUpload = (file: File) => {
    setSelectedFile(file)
    setHasFile(true)
  }

  const handleStartScan = () => {
    setIsScanning(true)
    // Simulate scanning delay
    setTimeout(() => {
      setIsScanning(false)
      setShowResults(true)
    }, 2000)
  }

  const handleNewScan = () => {
    setShowResults(false)
    setHasFile(false)
    setSelectedFile(null)
    setDocumentType("KTP")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-orange-100 to-transparent rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-yellow-100 to-transparent rounded-full blur-3xl opacity-30"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <Header />

          <main className="max-w-2xl mx-auto space-y-8 py-8">
            {/* Upload Section */}
            {!showResults && (
              <>
                <section>
                  <h2 className="text-3xl font-bold mb-2">Upload Your Document</h2>
                  <p className="text-gray-600 mb-6">Supports KTP, Kartu Keluarga, and STNK formats (JPG, PNG).</p>
                  <FileUpload onFileSelected={handleFileUpload} selectedFile={selectedFile} />
                </section>

                {/* Document Type Selector */}
                {hasFile && (
                  <section>
                    <h2 className="text-2xl font-bold mb-4">Select Document Type</h2>
                    <DocumentTypeSelector selected={documentType} onSelect={setDocumentType} />

                    <button
                      onClick={handleStartScan}
                      disabled={isScanning}
                      className="w-full mt-6 bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
                    >
                      {isScanning ? (
                        <>
                          <Spinner className="w-5 h-5" />
                          Scanning...
                        </>
                      ) : (
                        <>
                          <span>✨</span>
                          Start Scan
                        </>
                      )}
                    </button>
                  </section>
                )}
              </>
            )}

            {/* Extracted Data Section */}
            {showResults && <ExtractedData data={MOCK_EXTRACTED_DATA} onNewScan={handleNewScan} />}
          </main>

          {/* Footer */}
          <footer className="mt-16 text-center text-gray-500 text-sm">
            © 2025 AI Document Scanner. All rights reserved.
          </footer>
        </div>
      </div>
    </div>
  )
}
