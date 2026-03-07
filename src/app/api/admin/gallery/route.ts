import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - List all gallery photos
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

// POST - Add photo to gallery
export async function POST(req: Request) {
  try {
    const data = await req.json();

    const photo = await prisma.galleryPhoto.create({
      data: {
        url: data.url,
        caption: data.caption || null,
        category: data.category || "geral",
        width: data.width || 0,
        height: data.height || 0,
        featured: data.featured || false,
        order: data.order || 0,
      },
    });

    return NextResponse.json(photo);
  } catch (error) {
    console.error("Failed to add gallery photo:", error);
    return NextResponse.json({ error: "Failed to add photo" }, { status: 500 });
  }
}

// DELETE - Remove photo from gallery
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID obrigatório" }, { status: 400 });
    }

    await prisma.galleryPhoto.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete gallery photo:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}

// PATCH - Update photo details
export async function PATCH(req: Request) {
  try {
    const data = await req.json();
    const { id, ...updates } = data;

    if (!id) {
      return NextResponse.json({ error: "ID obrigatório" }, { status: 400 });
    }

    const photo = await prisma.galleryPhoto.update({
      where: { id: parseInt(id) },
      data: updates,
    });

    return NextResponse.json(photo);
  } catch (error) {
    console.error("Failed to update gallery photo:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
