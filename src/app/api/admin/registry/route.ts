import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST - Create gift
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
      },
    });
    return NextResponse.json(gift);
  } catch (error) {
    console.error("Failed to save gift:", error);
    return NextResponse.json({ error: "Failed to save gift" }, { status: 500 });
  }
}

// PUT - Update gift
export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID obrigatório" }, { status: 400 });

    const data = await req.json();
    const gift = await prisma.giftItem.update({
      where: { id: parseInt(id) },
      data: {
        title: data.title,
        price: data.price,
        imageUrl: data.imageUrl ?? null,
        category: data.category,
        externalUrl: data.externalUrl ?? null,
        isGroupGift: data.isGroupGift ?? false,
        targetAmount: data.isGroupGift ? (data.targetAmount || undefined) : null,
      },
    });
    return NextResponse.json(gift);
  } catch (error) {
    console.error("Failed to update gift:", error);
    return NextResponse.json({ error: "Failed to update gift" }, { status: 500 });
  }
}

// PATCH - Toggle hidden
export async function PATCH(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID obrigatório" }, { status: 400 });

    const { hidden } = await req.json();
    const gift = await prisma.giftItem.update({
      where: { id: parseInt(id) },
      data: { hidden: Boolean(hidden) },
    });
    return NextResponse.json(gift);
  } catch (error) {
    console.error("Failed to toggle hidden:", error);
    return NextResponse.json({ error: "Failed to toggle hidden" }, { status: 500 });
  }
}

// DELETE - Remove gift
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID obrigatório" }, { status: 400 });

    await prisma.giftItem.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete gift:", error);
    return NextResponse.json({ error: "Failed to delete gift" }, { status: 500 });
  }
}
