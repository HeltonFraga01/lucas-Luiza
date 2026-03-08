'use strict';
/**
 * init-db.js — Inicialização segura do banco SQLite
 *
 * Garante que todas as tabelas do schema existam, usando CREATE TABLE IF NOT EXISTS.
 * Seguro para rodar em qualquer estado do banco (novo, velho, migrado parcialmente).
 * Usa better-sqlite3 diretamente — sem dependência do Prisma CLI.
 */

const path = require('path');
const fs   = require('fs');

// ── Localização do banco ──────────────────────────────────────────────────────
const rawUrl = process.env.DATABASE_URL || 'file:/app/data/lucaseluiza.db';
const dbPath = rawUrl.replace(/^file:/, '');
const absPath = path.isAbsolute(dbPath)
  ? dbPath
  : path.resolve(__dirname, '..', dbPath);

console.log('[init-db] Database:', absPath);
fs.mkdirSync(path.dirname(absPath), { recursive: true });

const Database = require('better-sqlite3');
const db = new Database(absPath);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// ── Tabelas ───────────────────────────────────────────────────────────────────
const statements = [
  // Guest
  `CREATE TABLE IF NOT EXISTS "Guest" (
    "id"             INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name"           TEXT    NOT NULL,
    "email"          TEXT    NOT NULL,
    "phone"          TEXT,
    "group"          TEXT,
    "isVip"          BOOLEAN NOT NULL DEFAULT false,
    "plusOneAllowed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt"      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "Guest_email_key" ON "Guest"("email")`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "Guest_phone_key" ON "Guest"("phone")`,

  // Rsvp
  `CREATE TABLE IF NOT EXISTS "Rsvp" (
    "id"          INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "guestId"     INTEGER NOT NULL,
    "confirmed"   BOOLEAN NOT NULL,
    "plusOneName" TEXT,
    "notes"       TEXT,
    "submittedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Rsvp_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "Guest"("id")
      ON DELETE RESTRICT ON UPDATE CASCADE
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "Rsvp_guestId_key" ON "Rsvp"("guestId")`,

  // Attendee
  `CREATE TABLE IF NOT EXISTS "Attendee" (
    "id"           INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "guestId"      INTEGER NOT NULL,
    "name"         TEXT    NOT NULL,
    "dietaryNeeds" TEXT,
    CONSTRAINT "Attendee_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "Guest"("id")
      ON DELETE RESTRICT ON UPDATE CASCADE
  )`,

  // GiftItem
  `CREATE TABLE IF NOT EXISTS "GiftItem" (
    "id"           INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title"        TEXT    NOT NULL,
    "description"  TEXT,
    "imageUrl"     TEXT,
    "externalUrl"  TEXT,
    "price"        REAL    NOT NULL,
    "category"     TEXT    NOT NULL,
    "isMostWanted" BOOLEAN NOT NULL DEFAULT false,
    "isGroupGift"  BOOLEAN NOT NULL DEFAULT false,
    "targetAmount" REAL,
    "raisedAmount" REAL    NOT NULL DEFAULT 0,
    "isPurchased"  BOOLEAN NOT NULL DEFAULT false,
    "createdAt"    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,

  // GiftContribution
  `CREATE TABLE IF NOT EXISTS "GiftContribution" (
    "id"               INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "giftItemId"       INTEGER NOT NULL,
    "contributorName"  TEXT    NOT NULL,
    "contributorEmail" TEXT    NOT NULL,
    "amount"           REAL    NOT NULL,
    "paymentMethod"    TEXT    NOT NULL,
    "confirmedAt"      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "GiftContribution_giftItemId_fkey"
      FOREIGN KEY ("giftItemId") REFERENCES "GiftItem"("id")
      ON DELETE RESTRICT ON UPDATE CASCADE
  )`,

  // Event
  `CREATE TABLE IF NOT EXISTS "Event" (
    "id"          INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title"       TEXT    NOT NULL,
    "description" TEXT,
    "location"    TEXT,
    "datetime"    DATETIME NOT NULL,
    "isVipOnly"   BOOLEAN  NOT NULL DEFAULT false,
    "order"       INTEGER  NOT NULL DEFAULT 0
  )`,

  // SiteSettings — singleton (id = 1 fixo)
  `CREATE TABLE IF NOT EXISTS "SiteSettings" (
    "id"                INTEGER  NOT NULL PRIMARY KEY DEFAULT 1,
    "heroImage"         TEXT     NOT NULL DEFAULT '/hero-bg.jpg',
    "heroImages"        TEXT     NOT NULL DEFAULT '["/hero-bg.jpg"]',
    "heroTitle"         TEXT     NOT NULL DEFAULT 'Lucas & Luiza',
    "heroSubtitle"      TEXT     NOT NULL DEFAULT '15 de Novembro de 2026',
    "weddingDate"       DATETIME NOT NULL DEFAULT '2026-11-15T16:00:00.000Z',
    "storyText"         TEXT     NOT NULL DEFAULT 'Nossa historia em detalhes...',
    "storyImage"        TEXT     NOT NULL DEFAULT '/story.jpg',
    "primaryColor"      TEXT     NOT NULL DEFAULT '#6a8cb8',
    "secondaryColor"    TEXT     NOT NULL DEFAULT '#eaf2fa',
    "secretMessage"     TEXT     NOT NULL DEFAULT 'Obrigado por estar nessa jornada com a gente!',
    "pixKey"            TEXT     NOT NULL DEFAULT '',
    "footerText"        TEXT     NOT NULL DEFAULT 'Feito com amor',
    "itineraryTitle"    TEXT     NOT NULL DEFAULT 'Programacao do Dia',
    "itinerarySubtitle" TEXT     NOT NULL DEFAULT 'Cada momento foi pensado com carinho.',
    "updatedAt"         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,

  // StoryTimeline
  `CREATE TABLE IF NOT EXISTS "StoryTimeline" (
    "id"          INTEGER  NOT NULL PRIMARY KEY AUTOINCREMENT,
    "year"        TEXT     NOT NULL,
    "title"       TEXT     NOT NULL,
    "description" TEXT     NOT NULL,
    "order"       INTEGER  NOT NULL DEFAULT 0,
    "createdAt"   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,

  // GalleryPhoto
  `CREATE TABLE IF NOT EXISTS "GalleryPhoto" (
    "id"        INTEGER  NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url"       TEXT     NOT NULL,
    "caption"   TEXT,
    "category"  TEXT     NOT NULL DEFAULT 'geral',
    "width"     INTEGER  NOT NULL DEFAULT 0,
    "height"    INTEGER  NOT NULL DEFAULT 0,
    "order"     INTEGER  NOT NULL DEFAULT 0,
    "featured"  BOOLEAN  NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
];

// ── Colunas ausentes em bancos antigos ────────────────────────────────────────
const columnMigrations = [
  { table: 'Guest',    column: 'phone',       definition: 'TEXT' },
  { table: 'Guest',    column: 'checkedIn',   definition: 'BOOLEAN NOT NULL DEFAULT false' },
  { table: 'Guest',    column: 'checkedInAt', definition: 'DATETIME' },
  { table: 'GiftItem', column: 'hidden',      definition: 'BOOLEAN NOT NULL DEFAULT false' },
];

// ── Executar ──────────────────────────────────────────────────────────────────
let ok = 0;
for (const sql of statements) {
  try {
    db.exec(sql);
    ok++;
  } catch (err) {
    console.error('[init-db] Erro:', err.message);
  }
}

for (const { table, column, definition } of columnMigrations) {
  try {
    const cols = db.pragma(`table_info(${table})`);
    const exists = cols.some((c) => c.name === column);
    if (!exists) {
      db.exec(`ALTER TABLE "${table}" ADD COLUMN "${column}" ${definition}`);
      console.log('[init-db] Coluna adicionada:', table + '.' + column);
    }
  } catch (err) {
    console.error('[init-db] Erro ao adicionar coluna:', err.message);
  }
}

db.close();
console.log('[init-db] Concluido. ' + ok + '/' + statements.length + ' statements OK.');
