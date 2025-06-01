// app/api/fftt/route.ts
import { generateTimestamp, generateTmc } from "@/lib/fftt";
import { NextRequest, NextResponse } from "next/server";
import { parseStringPromise } from "xml2js";

const API_ID = process.env.FFTT_ID!;
const API_PASSWORD = process.env.FFTT_PASSWORD!;
const API_SERIE = process.env.FFTT_SERIE!;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const licence = searchParams.get("licence");

  if (!licence) {
    return NextResponse.json({ error: "Licence manquante" }, { status: 400 });
  }

  // Génère les paramètres sécurité FFTT
  const tm = generateTimestamp();
  const tmc = generateTmc(API_SERIE, API_ID, API_PASSWORD, tm);

  try {
    // Ajoute les paramètres sécurité dans les URLs
    const baseParams = `serie=${API_SERIE}&id=${API_ID}&tm=${tm}&tmc=${tmc}&licence=${licence}`;

    // const url_joueur = `https://www.fftt.com/mobile/pxml/xml_joueur.php?${baseParams}`;
    const url_licence_b = `https://www.fftt.com/mobile/pxml/xml_licence_b.php?${baseParams}`;

    // const res_joueur = await fetch(url_joueur);
    const res_licence_b = await fetch(url_licence_b);

    // const xml_joueur = await res_joueur.text();
    const xml_licence_b = await res_licence_b.text();

    // const result_joueur = await parseStringPromise(xml_joueur, {
    //   explicitArray: false,
    // });
    const result_licence_b = await parseStringPromise(xml_licence_b, {
      explicitArray: false,
    });

    const joueur = result_licence_b?.liste?.licence || null;

    if (!joueur) {
      return NextResponse.json(
        { error: "Joueur introuvable" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      nom: joueur.nom,
      prenom: joueur.prenom,
      club: joueur.nomclub,
      pointsOfficiel: joueur.point,
      sexe: joueur.sexe,
    });
  } catch (err) {
    console.error("Erreur FFTT:", err);
    return NextResponse.json(
      { error: "Erreur lors de l'appel FFTT", details: String(err) },
      { status: 500 }
    );
  }
}
