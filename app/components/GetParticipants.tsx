interface Joueur {
  id: number;
  dossard: string;
  numeroLicence: string;
  nom: string;
  prenom: string;
  club: string;
  pointsOfficiel: number;
  engagement: {
    id: string;
    event: {
      tableau: string;
      id: string;
    };
  }[];
}

async function GetParticipants(): Promise<Joueur[]> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/participants`,
    {
      cache: "no-store", // Cache pendant 60 secondes
    }
  );
  const data = await response.json();

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des joueurs");
  }

  return data;
}
export default GetParticipants;
