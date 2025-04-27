// Types générés par Prisma pour User, Joueur, Event et Engagement

import { Prisma } from "@prisma/client";

export type User = Prisma.UserGetPayload<{
  include: {
    joueurs: true; // Inclure les joueurs associés à l'utilisateur
  };
}>;

export type Joueur = Prisma.JoueurGetPayload<{
  include: {
    engagements: true; // Inclure les engagements associés au joueur
  };
}>;

export type Event = Prisma.EventGetPayload<{
  include: {
    engagements: true; // Inclure les engagements associés à l'événement
  };
}>;

export type Engagement = Prisma.EngagementGetPayload<{
  include: {
    joueur: true; // Inclure le joueur associé à l'engagement
    event: true; // Inclure l'événement associé à l'engagement
  };
}>;

// Exemples de types pour des manipulations plus précises si nécessaire

export type CreateJoueurData = {
  numeroLicence: string;
  nom: string;
  prenom: string;
  email: string;
  mobile: string;
  club: string;
  pointsOfficiel: number;
  userId: string; // L'ID de l'utilisateur qui crée ce joueur
};

export type CreateEventData = {
  nom: string;
  date: Date;
  heure: string;
  tableau: string;
  categorie?: string;
  minPoints?: number;
  maxPoints?: number;
  prixAnticipe: number;
  prixSurPlace: number;
};

export type CreateEngagementData = {
  joueurId: number;
  eventId: number;
  modePaiement?: string; // Anticipé ou Sur place
};

// Type d'un joueur avec son engagement (par exemple pour un retour d'API)
export type JoueurWithEngagements = {
  id: number;
  numeroLicence: string;
  nom: string;
  prenom: string;
  numeroDossard: number;
  email: string;
  mobile: string;
  club: string;
  pointsOfficiel: number;
  engagements: {
    id: number;
    dateEngagement: Date;
    modePaiement?: string;
    event: {
      id: number;
      nom: string;
      date: Date;
      heure: string;
      tableau: string;
    };
  }[];
};
