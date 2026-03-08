import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - List all guests with their RSVP and attendees
export async function GET() {
  try {
    const guests = await prisma.guest.findMany({
      include: {
        rsvp: { select: { confirmed: true, submittedAt: true, notes: true, plusOneName: true } },
        attendees: { select: { id: true, name: true, dietaryNeeds: true } },
      },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(guests);
  } catch (error) {
    console.error("Failed to list guests:", error);
    return NextResponse.json({ error: "Failed to list guests" }, { status: 500 });
  }
}

// POST - Create guest
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
      },
    });
    return NextResponse.json(guest);
  } catch (error) {
    console.error("Failed to create guest:", error);
    return NextResponse.json({ error: "Failed to save guest" }, { status: 500 });
  }
}

// PUT - Update guest
export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID obrigatório" }, { status: 400 });

    const data = await req.json();
    const guest = await prisma.guest.update({
      where: { id: parseInt(id) },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        group: data.group || null,
        isVip: data.isVip ?? false,
        plusOneAllowed: data.plusOneAllowed ?? false,
      },
    });
    return NextResponse.json(guest);
  } catch (error) {
    console.error("Failed to update guest:", error);
    return NextResponse.json({ error: "Failed to update guest" }, { status: 500 });
  }
}

// PATCH - Toggle check-in status
export async function PATCH(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID obrigatório" }, { status: 400 });

    const { checkedIn } = await req.json();
    const guest = await prisma.guest.update({
      where: { id: parseInt(id) },
      data: {
        checkedIn: Boolean(checkedIn),
        checkedInAt: checkedIn ? new Date() : null,
      },
    });
    return NextResponse.json(guest);
  } catch (error) {
    console.error("Failed to update check-in:", error);
    return NextResponse.json({ error: "Failed to update check-in" }, { status: 500 });
  }
}

// DELETE - Remove guest
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID obrigatório" }, { status: 400 });

    await prisma.guest.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete guest:", error);
    return NextResponse.json({ error: "Failed to delete guest" }, { status: 500 });
  }
}
