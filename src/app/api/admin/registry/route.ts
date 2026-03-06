import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const gift = await prisma.giftItem.create({
      data: {
        title: data.title,
        price: data.price,
        imageUrl: data.imageUrl,
        category: data.category,
        externalUrl: data.externalUrl,
        isGroupGift: data.isGroupGift,
        targetAmount: data.targetAmount || undefined,
        raisedAmount: 0,
      }
    });

    return NextResponse.json(gift);
  } catch (error) {
    console.error("Failed to save gift:", error);
    return NextResponse.json({ error: "Failed to save gift" }, { status: 500 });
  }
}
