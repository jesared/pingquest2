// lib/fftt.ts
import crypto from "crypto";

/** Génère le timestamp au format demandé */
export function generateTimestamp(): string {
  const date = new Date();
  const YYYY = date.getFullYear();
  const MM = String(date.getMonth() + 1).padStart(2, "0");
  const DD = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");
  const nn = "01"; // ou "00"
  return `${YYYY}${MM}${DD}${hh}${mm}${ss}${nn}`;
}

/** Génère le TMC (SHA1 de : serie + id + pass + tm) */
export function generateTmc(
  serie: string,
  id: string,
  pass: string,
  tm: string
) {
  const str = `${serie}${id}${pass}${tm}`;
  return crypto.createHash("sha1").update(str).digest("hex");
}
