"use client";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { EditJoueur, EngagementParTournoi } from "@/types/engagement";
import { Joueur, JoueurEdit } from "@/types/joueur";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import CardPlayer from "./CardPlayer";
import { EditJoueurForm } from "./EditJoueurForm";

export interface ApiResponse {
  joueurs: Joueur[];
}

/** Mapping vers édition */
export function mapJoueurToEdit(joueur: Joueur): JoueurEdit {
  const engagementsParTournoi: Record<number, EngagementParTournoi> = {};

  joueur.engagement.forEach((eng) => {
    const tournoiId = eng.event.tournoi?.id ?? -1;
    const tournoiNom = eng.event.tournoi?.nom ?? "Tournoi inconnu";
    if (!engagementsParTournoi[tournoiId]) {
      engagementsParTournoi[tournoiId] = {
        id: tournoiId,
        tournoi: tournoiNom,
        epreuves: [],
      };
    }
    engagementsParTournoi[tournoiId].epreuves.push({
      tableau: eng.event.tableau,
      categorie: eng.event.categorie,
      id: eng.event.id,
    });
  });

  return {
    id: joueur.id,
    nom: joueur.nom,
    prenom: joueur.prenom,
    club: joueur.club,
    dossard: joueur.dossard ?? "",
    licence: joueur.numeroLicence ?? "",
    points: joueur.pointsOfficiel ?? 0,
    engagements: Object.values(engagementsParTournoi),
  };
}

/** Mapping retour vers Joueur (ne modifie que les champs autorisés) */
function mapEditToJoueur(
  editJoueur: JoueurEdit,
  joueurOriginal: Joueur
): Joueur {
  return {
    ...joueurOriginal,
    dossard: editJoueur.dossard, // toujours string
    // pointsOfficiel: editJoueur.points, // décommente si tu veux éditer
    // Ne touche pas aux engagements, tu peux ajouter la logique si besoin
  };
}

function GetInscriptions() {
  const [players, setPlayers] = useState<Joueur[]>([]);
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const currentUserId = useCurrentUser();

  // 🟢 State pour l’édition
  const [editJoueur, setEditJoueur] = useState<JoueurEdit | null>(null);
  const [selectedTournoiId, setSelectedTournoiId] = useState<number | null>(
    null
  );
  const [allTournois, setAllTournois] = useState<{ id: number; nom: string }[]>(
    []
  );
  useEffect(() => {
    fetch("/api/tournois")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setAllTournois(data);
        else if (Array.isArray(data.tournois)) setAllTournois(data.tournois);
        else setAllTournois([]);
      });
  }, []);

  console.log("allTournois", allTournois);
  // Fonction suppression inchangée
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
        toast.error(errorMessage);
        return;
      }

      setPlayers((prevPlayers) =>
        prevPlayers.filter((player) => player.id !== idToDelete)
      );
      toast.success("Joueur supprimé avec succès !");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Erreur serveur lors de la suppression.");
    }
  };

  // 1. Déclare fetchPlayers hors du useEffect pour qu’elle soit réutilisable partout
  const fetchPlayers = async () => {
    if (user) {
      setIsLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SITE_URL}/api/joueurs`
        );
        if (!res.ok) {
          toast.error("Erreur lors de la récupération des joueurs.");
          return;
        }
        const data: ApiResponse = await res.json();
        setPlayers(data.joueurs || []);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast.error("Erreur lors de la récupération des joueurs.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  // 2. Utilise fetchPlayers au montage
  useEffect(() => {
    fetchPlayers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Fonction pour ouvrir la modale d’édition
  const handleEditJoueur = (joueur: Joueur) => {
    const editJoueur = mapJoueurToEdit(joueur);
    if (editJoueur.engagements.length > 0) {
      setSelectedTournoiId(editJoueur.engagements[0].id);
    } else {
      setSelectedTournoiId(null);
    }
    setEditJoueur(editJoueur);
  };

  const handleSaveEdit = async (updated: EditJoueur) => {
    // Extrait les engagements (eventId)
    const tournoiEngagement = updated.engagements.find(
      (e) => e.id === selectedTournoiId
    );
    const eventIds = tournoiEngagement
      ? tournoiEngagement.epreuves.map((ep) => ep.id)
      : [];

    // Appel API pour update les engagements (à adapter à ta route backend)
    await fetch("/api/engagements", {
      method: "POST", // ou PATCH/PUT selon ce que tu veux
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tournoiId: selectedTournoiId,
        joueurId: updated.id,
        eventIds, // attention à l’id réel de l’event/épreuve
      }),
    });

    // Puis update le state local
    setPlayers((prev) =>
      prev.map((j) => (j.id === updated.id ? mapEditToJoueur(updated, j) : j))
    );
    await fetchPlayers();
    setEditJoueur(null);
    toast.success("Modification enregistrée !");
  };

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
        <>
          {players.map((joueur) => (
            <CardPlayer
              key={joueur.id}
              joueur={joueur}
              onDeleteJoueur={handleDeletePlayer}
              onEditJoueur={handleEditJoueur}
              currentUserId={currentUserId}
            />
          ))}

          {/* Modale édition */}
          {editJoueur && (
            <EditJoueurForm
              joueur={editJoueur}
              open={true}
              onSave={handleSaveEdit}
              onClose={() => setEditJoueur(null)}
              tournoiId={selectedTournoiId || 0}
              setSelectedTournoiId={setSelectedTournoiId}
              allTournois={allTournois}
            />
          )}
        </>
      ) : (
        <p className="text-sm text-muted-foreground">Aucune inscription</p>
      )}
    </>
  );
}

export default GetInscriptions;
