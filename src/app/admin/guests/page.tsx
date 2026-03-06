import { prisma } from "@/lib/prisma";
import GuestTable from "./GuestTable";

export default async function GuestsPage() {
  const guests = await prisma.guest.findMany({
    include: {
      rsvp: true,
      attendees: true,
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="flex flex-col gap-8">
      <GuestTable initialGuests={guests} />
    </div>
  );
}
