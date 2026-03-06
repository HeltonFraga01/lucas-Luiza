import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    let settings = await prisma.siteSettings.findFirst();
    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {}
      });
    }
    return NextResponse.json(settings);
  } catch (error) {
    console.error("Erro ao buscar configurações:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const settings = await prisma.siteSettings.upsert({
      where: { id: 1 },
      update: {
        heroImage: data.heroImage,
        heroTitle: data.heroTitle,
        heroSubtitle: data.heroSubtitle,
        storyText: data.storyText,
        storyImage: data.storyImage,
        primaryColor: data.primaryColor,
        secondaryColor: data.secondaryColor,
      },
      create: {
        id: 1,
        heroImage: data.heroImage,
        heroTitle: data.heroTitle,
        heroSubtitle: data.heroSubtitle,
        storyText: data.storyText,
        storyImage: data.storyImage,
        primaryColor: data.primaryColor,
        secondaryColor: data.secondaryColor,
      }
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Erro ao atualizar configurações:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
