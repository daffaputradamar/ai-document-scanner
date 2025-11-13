"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface DocumentTypeSelectorProps {
  selected: string
  onSelect: (type: string) => void
}

const DOCUMENT_TYPES = ["KTP", "Kartu Keluarga", "STNK"]

export default function DocumentTypeSelector({ selected, onSelect }: DocumentTypeSelectorProps) {
  return (
    <Tabs value={selected} onValueChange={onSelect} className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-6">
        {DOCUMENT_TYPES.map((type) => (
          <TabsTrigger key={type} value={type}>
            {type}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
