import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const event = await prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        location: data.location,
        datetime: new Date(data.datetime),
        isVipOnly: data.isVipOnly || false,
      }
    });

    return NextResponse.json(event);
  } catch (error) {
    console.error("Failed to save event:", error);
    return NextResponse.json({ error: "Failed to save event" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID obrigatório" }, { status: 400 });
    }

    await prisma.event.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete event:", error);
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 });
  }
}

