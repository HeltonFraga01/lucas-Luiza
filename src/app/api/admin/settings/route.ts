import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    let settings = await prisma.siteSettings.findFirst();
    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {}
      });
    }
    return NextResponse.json(settings);
  } catch (error) {
    console.error("Erro ao buscar configurações:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const data = await req.json();

    const updateData: Record<string, unknown> = {};

    // Only include fields that are present in the request
    const allowedFields = [
      "heroImage", "heroImages", "heroTitle", "heroSubtitle",
      "weddingDate", "storyText", "storyImage",
      "primaryColor", "secondaryColor",
      "secretMessage", "pixKey", "footerText",
      "itineraryTitle", "itinerarySubtitle",
    ];

    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        // Special handling for weddingDate — convert string to Date
        if (field === "weddingDate" && typeof data[field] === "string") {
          // Normaliza "YYYY-MM-DDTHH:mm" → "YYYY-MM-DDTHH:mm:ss" (datetime-local omite segundos)
          const raw = data[field] as string;
          const normalized = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(raw)
            ? raw + ":00"
            : raw;
          const d = new Date(normalized);
          if (isNaN(d.getTime())) {
            return NextResponse.json(
              { error: `weddingDate inválida: "${raw}"` },
              { status: 400 }
            );
          }
          updateData[field] = d;
        } else {
          updateData[field] = data[field];
        }
      }
    }

    const settings = await prisma.siteSettings.upsert({
      where: { id: 1 },
      update: updateData,
      create: { id: 1, ...updateData },
    });

    return NextResponse.json(settings);
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Erro interno do servidor";
    console.error("Erro ao atualizar configurações:", error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// Legacy support — redirect POST to PUT logic
export async function POST(req: Request) {
  return PUT(req);
}
