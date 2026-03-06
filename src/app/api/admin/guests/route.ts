import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const guest = await prisma.guest.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        group: data.group || null,
        isVip: data.isVip || false,
        plusOneAllowed: data.plusOneAllowed || false,
      }
    });

    return NextResponse.json(guest);
  } catch (error) {
    console.error("Failed to save guest:", error);
    return NextResponse.json({ error: "Failed to save guest" }, { status: 500 });
  }
}
