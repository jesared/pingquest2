// pages/api/joueurs/existe.ts

import { getPrismaClient } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const prisma = getPrismaClient();
  const { searchParams } = new URL(req.url);
  const numeroLicence = searchParams.get("licence");

  if (!numeroLicence) {
    return NextResponse.json({ error: "Licence manquante" }, { status: 400 });
  }

  const joueur = await prisma.joueur.findUnique({
    where: { numeroLicence },
  });

  if (joueur) {
    return NextResponse.json({ id: joueur.id });
  } else {
    return NextResponse.json({ id: null });
  }
}
