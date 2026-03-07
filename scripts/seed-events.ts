import { prisma } from "../src/lib/prisma";

async function seed() {
  const count = await prisma.event.count();
  if (count > 0) {
    console.log(`Já existem ${count} eventos no banco. Pulando seed.`);
    return;
  }

  const events = [
    {
      title: "Cerimônia",
      description: "O momento em que diremos sim, diante de Deus e das pessoas que mais amamos.",
      location: "Igreja — endereço a confirmar",
      datetime: new Date("2026-05-16T16:00:00"),
      isVipOnly: false,
      order: 1,
    },
    {
      title: "Coquetel de Boas-Vindas",
      description: "Recepção com drinks, canapés e muita alegria. O momento perfeito para reencontros.",
      location: "Salão de Festas — endereço a confirmar",
      datetime: new Date("2026-05-16T17:30:00"),
      isVipOnly: false,
      order: 2,
    },
    {
      title: "Festa",
      description: "Jantar, música ao vivo, pista de dança e muita celebração até altas horas.",
      location: "Salão de Festas — endereço a confirmar",
      datetime: new Date("2026-05-16T19:00:00"),
      isVipOnly: false,
      order: 3,
    },
  ];

  for (const e of events) {
    await prisma.event.create({ data: e });
    console.log(`Criado: ${e.title}`);
  }
  console.log("Seed concluído!");
}

seed().catch(console.error).finally(() => prisma.$disconnect());
