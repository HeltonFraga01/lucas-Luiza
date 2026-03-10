import * as cheerio from "cheerio";
import { NextResponse } from "next/server";

// Headers that mimic a real browser to bypass basic bot detection
const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8",
  "Accept-Encoding": "gzip, deflate, br",
  "Cache-Control": "no-cache",
};

function detectSource(url: string): "airbnb" | "booking" | "generic" {
  if (url.includes("airbnb.")) return "airbnb";
  if (url.includes("booking.com")) return "booking";
  return "generic";
}

function extractJsonLd(html: string, $: ReturnType<typeof cheerio.load>) {
  try {
    const scripts = $('script[type="application/ld+json"]');
    let result: Record<string, unknown> = {};
    scripts.each((_, el) => {
      try {
        const parsed = JSON.parse($(el).html() || "{}");
        if (parsed["@type"] === "LodgingBusiness" || parsed["@type"] === "Hotel" || parsed.name) {
          result = parsed;
        }
      } catch { /* ignore */ }
    });
    return result;
  } catch {
    return {};
  }
}

function extractPrice(html: string, $: ReturnType<typeof cheerio.load>, source: string): number | null {
  // Booking.com price selectors
  if (source === "booking") {
    const priceText =
      $('[data-testid="price-and-discounted-price"]').first().text() ||
      $(".bui-price-display__value").first().text() ||
      $('[class*="price"]').first().text();
    const match = priceText.match(/[\d.,]+/);
    if (match) {
      const val = parseFloat(match[0].replace(",", "."));
      if (!isNaN(val) && val > 0) return val;
    }
  }
  // Generic og:price
  const ogPrice =
    $('meta[property="product:price:amount"]').attr("content") ||
    $('meta[property="og:price:amount"]').attr("content");
  if (ogPrice) {
    const val = parseFloat(ogPrice);
    if (!isNaN(val) && val > 0) return val;
  }
  // JSON-LD priceRange
  const ld = extractJsonLd(html, $);
  if (ld.priceRange) {
    const match = String(ld.priceRange).match(/[\d.,]+/);
    if (match) return parseFloat(match[0].replace(",", ".")) || null;
  }
  return null;
}

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: "URL obrigatória" }, { status: 400 });

    const source = detectSource(url);

    const response = await fetch(url, { headers: HEADERS });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const html = await response.text();
    const $ = cheerio.load(html);

    // — Open Graph (works for both Airbnb & Booking) —
    const title =
      $('meta[property="og:title"]').attr("content") ||
      $('meta[name="twitter:title"]').attr("content") ||
      $("title").text() ||
      "";

    const description =
      $('meta[property="og:description"]').attr("content") ||
      $('meta[name="description"]').attr("content") ||
      "";

    const imageUrl =
      $('meta[property="og:image"]').attr("content") ||
      $('meta[name="twitter:image"]').attr("content") ||
      "";

    // — City / location —
    const ld = extractJsonLd(html, $);
    const addressObj = ld.address as Record<string, string> | undefined;
    const city =
      (addressObj?.addressLocality) ||
      $('meta[property="og:locality"]').attr("content") ||
      $('meta[name="locality"]').attr("content") ||
      "";

    // — Category detection —
    let category = "hotel";
    const lowerUrl = url.toLowerCase();
    const lowerTitle = title.toLowerCase();
    if (lowerUrl.includes("airbnb") || lowerTitle.includes("airbnb")) category = "airbnb";
    else if (lowerTitle.includes("pousada")) category = "pousada";
    else if (lowerTitle.includes("hostel") || lowerTitle.includes("hotel")) category = "hotel";

    const pricePerNight = extractPrice(html, $, source);

    return NextResponse.json({
      name: title.trim(),
      description: description.trim(),
      imageUrl: imageUrl.trim(),
      city: city.trim(),
      category,
      pricePerNight,
      externalUrl: url,
    });
  } catch (error) {
    console.error("Accommodation scrape error:", error);
    return NextResponse.json({ error: "Falha ao extrair dados" }, { status: 500 });
  }
}
