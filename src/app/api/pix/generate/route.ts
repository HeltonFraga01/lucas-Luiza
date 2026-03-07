import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { QrCodePix } from "qrcode-pix";

/**
 * Sanitize a string for BRCode EMV spec (BACEN):
 * - Remove accents (normalize NFD + strip combining marks)
 * - Remove non-alphanumeric characters (keep spaces)
 * - Collapse multiple spaces into one
 * - Convert to UPPERCASE (BACEN recommendation for max compatibility)
 * - Trim and limit length
 */
function sanitizeForBrcode(text: string, maxLen: number): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")   // strip accents: é→e, ã→a, ç→c
    .replace(/[^a-zA-Z0-9 ]/g, "")     // only alphanumeric + spaces
    .replace(/\s+/g, " ")              // collapse double/triple spaces
    .toUpperCase()                      // BACEN recommends uppercase
    .trim()
    .substring(0, maxLen);
}

export async function POST(req: Request) {
  try {
    const { amount, giftTitle, transactionId } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Valor inválido" },
        { status: 400 }
      );
    }

    // Fetch PIX settings from database
    const settings = await prisma.siteSettings.findFirst();
    if (!settings?.pixKey) {
      return NextResponse.json(
        { error: "Chave PIX não configurada. Configure no painel admin." },
        { status: 400 }
      );
    }

    const pixKey = settings.pixKey.trim();

    // Merchant name — UPPERCASE, ASCII only (max 25 chars per EMV spec)
    const merchantName = sanitizeForBrcode(
      settings.heroTitle || "Lucas e Luiza",
      25
    );

    // Gift description — UPPERCASE, ASCII (max 30 chars for wider bank compatibility)
    const message = giftTitle
      ? sanitizeForBrcode(giftTitle, 30)
      : undefined;

    // Transaction ID — UPPERCASE alphanumeric only (max 25 chars per spec)
    const txId = (transactionId || `GIFT${Date.now()}`)
      .replace(/[^a-zA-Z0-9]/g, "")
      .toUpperCase()
      .substring(0, 25);

    // Build the PIX payload (BRCode EMV standard)
    const qrCodePix = QrCodePix({
      version: "01",
      key: pixKey,
      name: merchantName,
      city: "SAO PAULO",
      transactionId: txId,
      message,
      value: parseFloat(amount.toFixed(2)),
    });

    // Generate payload (copia e cola) and base64 QR code image
    const payload = qrCodePix.payload();
    const qrCodeBase64 = await qrCodePix.base64();

    return NextResponse.json({
      payload,              // PIX copia e cola string
      qrCodeBase64,         // data:image/png;base64,... for <img src>
      pixKey,               // For display
      amount: parseFloat(amount.toFixed(2)),
    });
  } catch (error) {
    console.error("Failed to generate PIX:", error);
    return NextResponse.json(
      { error: "Erro ao gerar PIX. Tente novamente." },
      { status: 500 }
    );
  }
}

