"use client";

import MultiStepForm from "@/app/components/MultiFormSteps";
import { useState } from "react";

type InscriptionClientProps = {
  tournoi: {
    id: number;
    nom: string;
  };
  jours: string[];
};

export default function InscriptionClient({
  tournoi,
  jours,
}: InscriptionClientProps) {
  const [joueurFTT, setJoueurFTT] = useState<{
    nom: string;
    prenom: string;
  } | null>(null);

  return (
    <div className="max-w-2xl mx-auto p-4 border border-gray-200 bg-gray-50 rounded-t-xl px-4">
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold">Ajout au tournoi</h1>
        <span>{tournoi.nom}</span>
        <p className="text-gray-500">Inscrire un joueur</p>
        {joueurFTT && (
          <div className="text-sm text-gray-700 font-medium">
            {joueurFTT.prenom} {joueurFTT.nom}
          </div>
        )}
      </div>

      <MultiStepForm
        tournoiId={tournoi.id}
        jours={jours}
        onFfttJoueurDetecte={setJoueurFTT}
      />
    </div>
  );
}
