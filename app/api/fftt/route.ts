import { NextRequest, NextResponse } from "next/server";
import { parseStringPromise } from "xml2js";

const API_ID = process.env.FFTT_ID!;
const API_PASSWORD = process.env.FFTT_PASSWORD!;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const licence = searchParams.get("licence");

  if (!licence) {
    return NextResponse.json({ error: "Licence manquante" }, { status: 400 });
  }
  // const prisma = getPrismaClient();
  try {
    // 🔥 Vérification BDD d'abord
    // const joueurExistant = await prisma.joueur.findUnique({
    //   where: {
    //     numeroLicence: licence,
    //   },
    // });

    // if (joueurExistant) {
    //   // ⚡ Si trouvé -> renvoyer une réponse d'erreur immédiate
    //   return NextResponse.json(
    //     { error: "Ce joueur est déjà inscrit dans la base." },
    //     { status: 400 }
    //   );
    // }

    const url = `https://apiv2.fftt.com/mobile/pxml/xml_joueur.php?licence=${licence}&id=${API_ID}&pass=${API_PASSWORD}`;

    const res = await fetch(url);

    const xml = await res.text();

    const result = await parseStringPromise(xml, { explicitArray: false });

    const joueur = result.liste.joueur;

    if (!joueur) {
      return NextResponse.json(
        { error: "Joueur introuvable" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      nom: joueur.nom,
      prenom: joueur.prenom,
      club: joueur.club,
      pointsOfficiel: joueur.valcla,
    });
  } catch (err) {
    console.error("Erreur FFTT:", err);
    return NextResponse.json(
      { error: "Erreur lors de l'appel FFTT" },
      { status: 500 }
    );
  }
}
