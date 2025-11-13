"use client"

import type React from "react"

import { useRef, useState } from "react"

interface FileUploadProps {
  onFileSelected: (file: File) => void
  selectedFile: File | null
}

export default function FileUpload({ onFileSelected, selectedFile }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      onFileSelected(files[0])
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelected(e.target.files[0])
    }
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={!selectedFile ? handleClick : undefined}
      className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 cursor-pointer ${
        isDragging
          ? "border-orange-500 bg-orange-50 shadow-md"
          : selectedFile
            ? "border-gray-300 bg-white"
            : "border-gray-300 bg-gray-50 hover:border-gray-400"
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        accept=".jpg,.jpeg,.png,.pdf"
        className="hidden"
      />

      {!selectedFile ? (
        <>
          <div className="mb-4 flex justify-center">
            <div className="text-5xl text-gray-400">📄</div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-1">Drag & Drop File Here</h3>
          <p className="text-gray-600 mb-4">Or click to browse your files</p>
          <button
            type="button"
            onClick={handleClick}
            className="inline-block px-6 py-2 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
          >
            Browse Files
          </button>
        </>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <div className="text-5xl">✓</div>
          <div>
            <p className="font-semibold text-gray-900">{selectedFile.name}</p>
            <p className="text-sm text-gray-600">({(selectedFile.size / 1024).toFixed(2)} KB)</p>
          </div>
          <button
            type="button"
            onClick={handleClick}
            className="mt-2 px-6 py-2 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors text-sm"
          >
            Change File
          </button>
        </div>
      )}
    </div>
  )
}
