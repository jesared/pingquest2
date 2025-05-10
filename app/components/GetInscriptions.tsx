"use client";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { toast } from "sonner";
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
  userId: string;
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
  const currentUserId = useCurrentUser();

  // Fonction de suppression de joueur
  const handleDeletePlayer = async (idToDelete: number) => {
    const confirm = window.confirm(
      "Es-tu sûr de vouloir supprimer ce joueur ? Cette action est irréversible."
    );
    if (!confirm) return;

    try {
      const url = `${process.env.NEXT_PUBLIC_SITE_URL}/api/joueur/${idToDelete}`;
      const res = await fetch(url, { method: "DELETE" });

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
        toast.error(errorMessage);
        return;
      }

      // Met à jour l'état local après suppression
      setPlayers((prevPlayers) =>
        prevPlayers.filter((player) => player.id !== idToDelete)
      );

      toast.success("Joueur supprimé avec succès !");
    } catch (error) {
      console.error("Erreur lors de la suppression du joueur:", error);
      toast.error("Erreur serveur lors de la suppression.");
    }
  };

  useEffect(() => {
    async function fetchPlayers() {
      if (user) {
        setIsLoading(true);
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_SITE_URL}/api/joueurs`
          );
          if (!res.ok) {
            console.error(
              `Erreur lors de la récupération des joueurs: ${res.status}`
            );
            toast.error("Erreur lors de la récupération des joueurs.");
            return;
          }
          const data: ApiResponse = await res.json();
          setPlayers(data.joueurs || []);
        } catch (error) {
          console.error("Erreur lors de la requête:", error);
          toast.error("Erreur lors de la récupération des joueurs.");
        } finally {
          setIsLoading(false); // Fin du chargement
        }
      }
    }

    fetchPlayers();
  }, [user]);

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
            currentUserId={currentUserId}
          />
        ))
      ) : (
        <p className="text-sm text-muted-foreground">Aucune inscription</p>
      )}
    </>
  );
}

export default GetInscriptions;
