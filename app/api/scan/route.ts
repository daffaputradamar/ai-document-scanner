import { NextRequest, NextResponse } from "next/server"

const API_CONFIG = {
  apiKey: process.env.API_KEY || "",
  secretKey: process.env.API_SECRET_KEY || "",
  baseUrl: process.env.API_BASE_URL || "",
  templates: {
    KTP: process.env.KTP_TEMPLATE_ID || "",
    "Kartu Keluarga": process.env.KARTU_KELUARGA_TEMPLATE_ID || "",
    STNK: process.env.STNK_TEMPLATE_ID || "",
  },
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("image") as File
    const documentType = formData.get("documentType") as string

    if (!file) {
      return NextResponse.json(
        { error: "No image file provided" },
        { status: 400 }
      )
    }

    if (!documentType) {
      return NextResponse.json(
        { error: "Document type not specified" },
        { status: 400 }
      )
    }

    // Create form data for external API
    const externalFormData = new FormData()
    externalFormData.append("apiKey", API_CONFIG.apiKey)
    externalFormData.append("secretKey", API_CONFIG.secretKey)
    externalFormData.append(
      "templateId",
      API_CONFIG.templates[documentType as keyof typeof API_CONFIG.templates]
    )
    externalFormData.append("image", file)

    // Call external API
    const response = await fetch(API_CONFIG.baseUrl, {
      method: "POST",
      body: externalFormData,
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: `External API error: ${response.statusText}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error processing scan request:", error)
    return NextResponse.json(
      { error: "Failed to process image" },
      { status: 500 }
    )
  }
}
