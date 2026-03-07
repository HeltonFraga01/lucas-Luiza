import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const photos = await prisma.galleryPhoto.findMany({
      orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
    });
    return NextResponse.json(photos);
  } catch (error) {
    console.error("Failed to list gallery:", error);
    return NextResponse.json({ error: "Failed to list gallery" }, { status: 500 });
  }
}
