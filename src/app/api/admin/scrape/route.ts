import * as cheerio from "cheerio";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Fetch the HTML content
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
      }
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch page");
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract Open Graph Data
    const title = $('meta[property="og:title"]').attr('content') || $('title').text() || "";
    const description = $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content') || "";
    const image = $('meta[property="og:image"]').attr('content') || "";

    // Rudimentary Attempt to find price via common schema or meta
    const priceStr = $('meta[property="product:price:amount"]').attr('content') 
                  || $('meta[property="og:price:amount"]').attr('content') 
                  || "0";
    const price = parseFloat(priceStr) || 0;

    return NextResponse.json({
      title: title.trim(),
      description: description.trim(),
      imageUrl: image.trim(),
      price: price
    });
  } catch (error) {
    console.error("Scraping Error:", error);
    return NextResponse.json({ error: "Failed to scrape URL" }, { status: 500 });
  }
}
