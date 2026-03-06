import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const timeline = await prisma.storyTimeline.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(timeline);
  } catch (error) {
    console.error("Erro ao buscar timeline:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { year, title, description, order } = await req.json();

    if (!year || !title || !description) {
      return NextResponse.json(
        { error: "Ano, título e descrição são obrigatórios." },
        { status: 400 }
      );
    }

    const newItem = await prisma.storyTimeline.create({
      data: {
        year,
        title,
        description,
        order: order || 0,
      },
    });

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error("Erro ao adicionar evento na timeline:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor ao adicionar item." },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const { id, year, title, description, order } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "ID é obrigatório para atualização." },
        { status: 400 }
      );
    }

    const updatedItem = await prisma.storyTimeline.update({
      where: { id },
      data: {
        ...(year && { year }),
        ...(title && { title }),
        ...(description && { description }),
        ...(order !== undefined && { order }),
      },
    });

    return NextResponse.json(updatedItem, { status: 200 });
  } catch (error) {
    console.error("Erro ao atualizar evento na timeline:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor ao atualizar item." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID é obrigatório para deleção." },
        { status: 400 }
      );
    }

    await prisma.storyTimeline.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Erro ao deletar evento da timeline:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor ao deletar item." },
      { status: 500 }
    );
  }
}
