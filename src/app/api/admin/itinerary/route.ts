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
