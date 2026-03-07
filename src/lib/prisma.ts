import { PrismaClient } from "@/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";

// Resolve the db path to an absolute path so better-sqlite3 always
// opens the correct file regardless of the process CWD at runtime.
function resolveDbUrl(url: string): string {
  const filePath = url.replace(/^file:/, "");
  if (path.isAbsolute(filePath)) return filePath;
  return path.resolve(process.cwd(), filePath);
}

const dbUrl = process.env.DATABASE_URL ?? "file:./dev.db";
const dbPath = resolveDbUrl(dbUrl);

const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
