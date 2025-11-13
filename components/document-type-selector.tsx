"use client"

interface DocumentTypeSelectorProps {
  selected: string
  onSelect: (type: string) => void
}

const DOCUMENT_TYPES = ["KTP", "Kartu Keluarga", "STNK"]

export default function DocumentTypeSelector({ selected, onSelect }: DocumentTypeSelectorProps) {
  return (
    <div className="flex gap-4 mb-6 border-b border-gray-200 pb-4">
      {DOCUMENT_TYPES.map((type) => (
        <button
          key={type}
          onClick={() => onSelect(type)}
          className={`px-6 py-3 font-semibold transition-all duration-200 ${
            selected === type ? "border-b-2 border-orange-500 text-gray-900" : "text-gray-600 hover:text-gray-900"
          }`}
        >
          {type}
        </button>
      ))}
    </div>
  )
}
