"use client";

import { useEffect, useState } from "react";
import CardPlayer from "./CardPlayer";

interface Joueur {
  id: number;
  userId: string;
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

export default function ClientParticipants() {
  const [joueurs, setJoueurs] = useState<Joueur[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleDeleteJoueur = (id: number) => {
    setJoueurs((prev) => prev.filter((joueur) => joueur.id !== id));
  };
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCurrentUserId() {
      try {
        const res = await fetch("/api/getUser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        });

        const data = await res.json();

        if (!res.ok) {
          console.error(
            "Erreur lors de la récupération du currentUserId",
            data
          );
          setError("Erreur serveur");
          return;
        }

        if (data.id) {
          setCurrentUserId(data.id);
        } else {
          setError("UserId introuvable");
        }
      } catch (err) {
        console.error("Erreur lors de la récupération du currentUserId", err);
      }
    }

    fetchCurrentUserId();
  }, []);

  useEffect(() => {
    async function fetchJoueurs() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SITE_URL}/api/participants`,
          {
            cache: "no-store",
          }
        );
        const data = await res.json();

        if (!res.ok) {
          throw new Error("Erreur lors de la récupération des joueurs");
        }

        setJoueurs(data);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      } finally {
        setIsLoading(false);
      }
    }
    fetchJoueurs();
  }, []);

  if (isLoading) {
    return (
      <div className="mt-6 flex justify-center items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary" />
        <span className="ml-4 text-sm text-muted-foreground">
          Chargement...
        </span>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-sm mt-4">{error}</p>;
  }

  if (joueurs.length === 0) {
    return (
      <p className="text-muted-foreground mt-4">Aucun participant trouvé.</p>
    );
  }

  return (
    <>
      {joueurs.map((joueur) => (
        <CardPlayer
          key={joueur.id}
          joueur={joueur}
          onDeleteJoueur={handleDeleteJoueur}
          currentUserId={currentUserId}
        />
      ))}
    </>
  );
}
