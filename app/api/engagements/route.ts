// pages/api/engagements.ts

import { getPrismaClient } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const prisma = getPrismaClient();

  try {
    const data = await req.json();
    const { joueurId, engagements } = data;
    console.log("data", data);
    if (!joueurId || !Array.isArray(engagements)) {
      return NextResponse.json(
        { error: "Données manquantes ou invalides" },
        { status: 400 }
      );
    }

    try {
      const engagementsData = engagements
        .filter((e: any) => e.eventId)
        .map((e: { eventId: number }) => ({
          joueurId,
          eventId: e.eventId,
        }));
      const result = await prisma.engagement.createMany({
        data: engagementsData,
        skipDuplicates: true,
      });

      console.log("[API] Résultat createMany :", result);

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("[API] ERREUR createMany :", error);

      return NextResponse.json(
        {
          error: "Erreur lors de la création des engagements",
          details: error instanceof Error ? error.message : String(error),
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("[ENGAGEMENT_POST_ERROR]", error);
    return NextResponse.json(
      {
        error: "Erreur lors de la création des engagements",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
