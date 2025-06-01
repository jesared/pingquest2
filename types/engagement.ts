export interface Epreuve {
  id: number;
  categorie?: string;
  tableau: string;
  nom: string;
  jour: string;
  tournoiId: number;
  minPoints: number;
  maxPoints: number;
}
export interface Engagement {
  id: number;
  event: {
    id: number;
    tableau: string;
    categorie?: string;
    tournoi: {
      id: number;
      nom: string;
    };
  };
}

// Version "groupée" pour l'édition, 1 entrée par tournoi
export interface EngagementParTournoi {
  id: number; // tournoi id
  tournoi: string; // nom du tournoi
  epreuves: { tableau: string; categorie?: string; id: number }[];
}
export type EditJoueur = {
  id: number;
  nom: string;
  prenom: string;
  club: string;
  dossard: string;
  licence: string;
  points: number;
  sexe?: string;
  engagements: EngagementParTournoi[];
};
