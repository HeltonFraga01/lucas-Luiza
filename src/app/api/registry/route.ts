import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const gifts = await prisma.giftItem.findMany({
      include: { contributions: true },
      orderBy: [
        { isMostWanted: "desc" },
        { price: "asc" },
      ],
    });
    return NextResponse.json(gifts);
  } catch (error) {
    console.error("Failed to fetch gifts:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { giftItemId, contributorName, contributorEmail, amount, paymentMethod } = data;

    if (!giftItemId || !contributorName || !contributorEmail || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Create contribution
    const contribution = await prisma.giftContribution.create({
      data: {
        giftItemId: parseInt(giftItemId),
        contributorName,
        contributorEmail,
        amount: parseFloat(amount),
        paymentMethod: paymentMethod || "pix",
      },
    });

    // Update raised amount for group gifts
    const gift = await prisma.giftItem.findUnique({ where: { id: parseInt(giftItemId) } });
    if (gift) {
      const newRaised = gift.raisedAmount + parseFloat(amount);
      const updates: Record<string, unknown> = { raisedAmount: newRaised };

      // Auto-mark as purchased if fully funded or exact price match
      if (
        (gift.isGroupGift && gift.targetAmount && newRaised >= gift.targetAmount) ||
        (!gift.isGroupGift && newRaised >= gift.price)
      ) {
        updates.isPurchased = true;
      }

      await prisma.giftItem.update({
        where: { id: parseInt(giftItemId) },
        data: updates,
      });
    }

    return NextResponse.json({ success: true, contribution }, { status: 201 });
  } catch (error) {
    console.error("Contribution error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
