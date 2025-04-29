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
  const [isLoading, setIsLoading] = useState(true);

  const handleDeletePlayer = async (idToDelete: number) => {
    try {
      const url = `${process.env.NEXT_PUBLIC_SITE_URL}/api/joueur/${idToDelete}`; // Affiche l'URL
      console.log("URL de suppression appelée :", url);
      const res = await fetch(url, {
        method: "DELETE",
      });
      console.log("res", res);
      if (!res.ok) {
        let errorMessage = `Erreur HTTP ${res.status}`;
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await res.json();
          errorMessage = errorData.message || errorMessage;
        }

        console.error(
          "Erreur lors de la suppression du joueur :",
          errorMessage
        );
        alert(errorMessage);
        return;
      }

      console.log(`Joueur avec l'ID ${idToDelete} supprimé avec succès`);
      setPlayers(players.filter((player) => player.id !== idToDelete));
    } catch (error) {
      console.error("Erreur lors de la suppression du joueur:", error);
      alert(
        "Erreur serveur lors de la suppression du joueur. Consultez la console pour plus de détails."
      );
    }
  };

  useEffect(() => {
    async function fetchPlayers() {
      if (user) {
        setIsLoading(true);
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_SITE_URL}/api/joueurs`
          ); // Appel direct sans paramètre
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
        } finally {
          setIsLoading(false); // Fin du chargement dans tous les cas
        }
      }
    }

    fetchPlayers();
  }, [user]);

  // Dans GetInscriptions.tsx
  return (
    <>
      {isLoading ? (
        <div className="mt-6 flex justify-center items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary" />
          <span className="ml-4 text-sm text-muted-foreground">
            Chargement...
          </span>
        </div>
      ) : players && players.length > 0 ? (
        players.map((joueur) => (
          <CardPlayer
            key={joueur.id}
            joueur={joueur}
            onDeleteJoueur={handleDeletePlayer}
          />
        ))
      ) : (
        <p className="text-sm text-muted-foreground">Aucune inscription</p>
      )}
    </>
  );
}

export default GetInscriptions;
