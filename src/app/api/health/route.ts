import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const start = Date.now();

  try {
    // Test database connection
    await prisma.$queryRawUnsafe("SELECT 1");

    return NextResponse.json(
      {
        status: "healthy",
        version: process.env.APP_VERSION || "0.0.1",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        database: "connected",
        responseTime: `${Date.now() - start}ms`,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        version: process.env.APP_VERSION || "0.0.1",
        timestamp: new Date().toISOString(),
        database: "disconnected",
        error: error instanceof Error ? error.message : "Unknown error",
        responseTime: `${Date.now() - start}ms`,
      },
      { status: 503 }
    );
  }
}
