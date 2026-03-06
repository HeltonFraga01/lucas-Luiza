import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const gifts = await prisma.giftItem.findMany({
      orderBy: { price: 'asc' }
    });
    return NextResponse.json(gifts);
  } catch (error) {
    console.error("Failed to fetch gifts:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
