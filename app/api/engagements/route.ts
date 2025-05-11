// pages/api/engagements.ts

import { getPrismaClient } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const prisma = getPrismaClient();
  const data = await req.json();

  const { joueurId, engagements } = data;

  if (!joueurId || !engagements || !Array.isArray(engagements)) {
    return NextResponse.json(
      { error: "Données manquantes ou invalides" },
      { status: 400 }
    );
  }

  try {
    const engagementsData = engagements.map(
      (e: { eventId: number; modePaiement?: string }) => ({
        joueurId,
        eventId: e.eventId,
        modePaiement: e.modePaiement || null,
      })
    );

    await prisma.engagement.createMany({
      data: engagementsData,
      skipDuplicates: true, // évite de dupliquer un engagement existant (grâce à @@unique)
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors de la création des engagements" },
      { status: 500 }
    );
  }
}
