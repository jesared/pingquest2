"use client";
import { useState } from "react";
import { EditJoueurForm } from "../components/EditJoueurForm";

const joueurTest = {
  id: 1,
  nom: "Dupont",
  prenom: "Jean",
  club: "US Reims",
  dossard: "45",
  licence: "123456",
  points: 1234,
  sexe: "M",
  engagements: [
    {
      id: 1, // ✅ Ajoute l'ID du tournoi
      tournoi: "Tournoi de Paris",
      epreuves: [
        { tableau: "A", id: 101 },
        { tableau: "B", id: 102, categorie: "Dames" },
      ],
    },
  ],
};

export default function TestModal() {
  const [open, setOpen] = useState(true);
  return (
    <EditJoueurForm
      joueur={joueurTest}
      open={open}
      onSave={() => setOpen(false)}
      onClose={() => setOpen(false)}
      tournoiId={0}
      allTournois={[]}
    />
  );
}
