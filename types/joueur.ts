import { Engagement, EngagementParTournoi } from "./engagement";

// Pour la BDD / API
export interface Joueur {
  id: number;
  userId: string;
  dossard: string;
  numeroLicence: string;
  nom: string;
  prenom: string;
  sexe?: string;
  club: string;
  photoUrl?: string;
  pointsOfficiel: number | undefined;
  engagement: Engagement[];
}

// Pour l’édition côté UI
export interface JoueurEdit {
  id: number;
  nom: string;
  prenom: string;
  club: string;
  dossard: string;
  licence: string;
  points: number;
  sexe?: string;
  engagements: EngagementParTournoi[];
}
