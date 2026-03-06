import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { guestId, confirmed, plusOneName, notes, attendees } = data;

    if (!guestId) {
      return NextResponse.json({ error: "Guest ID is required" }, { status: 400 });
    }

    // Upsert RSVP
    const rsvp = await prisma.rsvp.upsert({
      where: { guestId: parseInt(guestId) },
      update: { confirmed, plusOneName, notes },
      create: { guestId: parseInt(guestId), confirmed, plusOneName, notes },
    });

    // Update or create attendees
    if (attendees && Array.isArray(attendees)) {
      for (const att of attendees) {
        if (att.id) {
          await prisma.attendee.update({
            where: { id: att.id },
            data: { dietaryNeeds: att.dietaryNeeds, name: att.name },
          });
        } else {
          await prisma.attendee.create({
            data: { guestId: parseInt(guestId), dietaryNeeds: att.dietaryNeeds, name: att.name },
          });
        }
      }
    }

    return NextResponse.json({ success: true, rsvp });
  } catch (error) {
    console.error("RSVP Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") || searchParams.get("email");

  if (!query) {
    return NextResponse.json({ error: "Query é obrigatória (email ou telefone)" }, { status: 400 });
  }

  try {
    const guest = await prisma.guest.findFirst({
      where: {
        OR: [
          { email: query },
          { phone: query }
        ]
      },
      include: { attendees: true, rsvp: true },
    });

    if (!guest) {
      return NextResponse.json({ error: "Guest not found" }, { status: 404 });
    }

    return NextResponse.json({ guest });
  } catch (error) {
    console.error("Fetch Guest Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
