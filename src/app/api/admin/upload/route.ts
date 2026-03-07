import { NextResponse } from "next/server";
import sharp from "sharp";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

// Image size presets for different contexts
const PRESETS: Record<string, { width: number; height: number; fit: "cover" | "inside" }> = {
  hero: { width: 1920, height: 1080, fit: "cover" },
  story: { width: 800, height: 600, fit: "cover" },
  general: { width: 1200, height: 900, fit: "inside" },
};

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const preset = (formData.get("preset") as string) || "general";

    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Formato inválido. Use: JPG, PNG, WebP, AVIF ou GIF" },
        { status: 400 }
      );
    }

    // Max 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Arquivo muito grande. Máximo: 10MB" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const config = PRESETS[preset] || PRESETS.general;

    // Process with sharp: resize + convert to WebP for optimal size
    const processed = await sharp(buffer)
      .resize(config.width, config.height, {
        fit: config.fit,
        withoutEnlargement: true,
        position: "center",
      })
      .webp({ quality: 85 })
      .toBuffer();

    // Generate unique filename
    const hash = crypto.randomBytes(8).toString("hex");
    const timestamp = Date.now();
    const filename = `${preset}-${timestamp}-${hash}.webp`;

    // Ensure uploads dir exists
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    // Write file
    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, processed);

    // Get metadata for response
    const metadata = await sharp(processed).metadata();

    return NextResponse.json({
      url: `/uploads/${filename}`,
      width: metadata.width,
      height: metadata.height,
      size: processed.length,
      originalName: file.name,
      originalSize: file.size,
    });
  } catch (error) {
    console.error("Upload failed:", error);
    return NextResponse.json(
      { error: "Erro ao processar imagem" },
      { status: 500 }
    );
  }
}
