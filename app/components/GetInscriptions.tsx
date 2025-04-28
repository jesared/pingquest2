"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import CardPlayer from "./CardPlayer";

interface Engagement {
  id: string;
  event: {
    tableau: string;
    id: string;
  };
}

interface Joueur {
  id: number;
  dossard: string;
  numeroLicence: string;
  nom: string;
  prenom: string;
  club: string;
  pointsOfficiel: number;
  engagement: Engagement[];
}

interface ApiResponse {
  joueurs: Joueur[];
}

function GetInscriptions() {
  const [players, setPlayers] = useState<Joueur[]>([]);
  const { user } = useUser();

  useEffect(() => {
    async function fetchPlayers() {
      if (user) {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_SITE_URL}/api/joueurs?userClerkId=${user.id}`
          );
          if (!res.ok) {
            console.error(
              `Erreur lors de la récupération des joueurs: ${res.status}`
            );
            return;
          }
          const data: ApiResponse = await res.json();
          setPlayers(data.joueurs || []);
        } catch (error) {
          console.error("Erreur lors de la requête:", error);
        }
      }
    }

    fetchPlayers();
  }, [user]);

  // Dans GetInscriptions.tsx
  return (
    <>
      {players.map((joueur) => (
        <CardPlayer key={joueur.id} joueur={joueur} />
      ))}
    </>
  );
}

export default GetInscriptions;
