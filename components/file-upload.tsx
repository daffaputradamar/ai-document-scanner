"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTitle,
} from "@/components/ui/dialog"
import { FileUp } from "lucide-react"

interface FileUploadProps {
  onFileSelected: (file: File) => void
  selectedFile: File | null
}

export default function FileUpload({ onFileSelected, selectedFile }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [showFullscreen, setShowFullscreen] = useState(false)

  useEffect(() => {
    if (selectedFile) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
    } else {
      setPreview(null)
    }
  }, [selectedFile])

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
          ? "border-orange-500 bg-orange-50 dark:bg-orange-950 shadow-md"
          : selectedFile
            ? "border-border bg-card"
            : "border-border bg-secondary hover:border-foreground dark:hover:border-foreground"
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
            <FileUp className="text-muted-foreground w-16 h-16" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-1">Drag & Drop File Here</h3>
          <p className="text-muted-foreground mb-4">Or click to browse your files</p>
          <Button
            variant={'outline'}
          >
            Browse Files
          </Button>
        </>
      ) : (
        <div className="flex flex-col items-center gap-4">
          {preview && (
            <div className="mb-4 max-w-sm">
              <img
                src={preview}
                alt="Preview"
                onClick={() => setShowFullscreen(true)}
                className="w-full h-auto rounded-lg shadow-md object-contain max-h-64 cursor-pointer hover:opacity-80 transition-opacity"
              />
            </div>
          )}
          <div>
            <p className="font-semibold text-foreground">{selectedFile.name}</p>
            <p className="text-sm text-muted-foreground">({(selectedFile.size / 1024).toFixed(2)} KB)</p>
          </div>
          <Button
            onClick={handleClick}
            variant="outline"
            size="sm"
            className="mt-2"
          >
            Change File
          </Button>
        </div>
      )}

      {/* Fullscreen Modal */}
      {preview && (
        <Dialog open={showFullscreen} onOpenChange={setShowFullscreen}>
          <DialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-4xl max-h-screen bg-black dark:bg-background border-0 p-0 flex items-center justify-center rounded-none" showCloseButton={false}>
            <DialogTitle className="sr-only">Image Preview</DialogTitle>
            <img
              src={preview}
              alt="Fullscreen Preview"
              className="w-full h-full object-contain"
            />
            <button
              onClick={() => setShowFullscreen(false)}
              className="absolute top-4 right-4 bg-white dark:bg-card text-black dark:text-foreground rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-secondary transition-colors"
              aria-label="Close"
            >
              ✕
            </button>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
