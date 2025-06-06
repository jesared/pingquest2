export interface CustomUser {
  id: string;
  firstname: string;
  lasName: string;
  emailAdresses: Array<[emailAdress: string]>;
  imageUrl: string;
}
export interface UserTypeData {
  id: string;
  clerkUserId: string;
  name: string;
  email?: string;
  image?: string;
  role?: {
    name: string;
  };
}
// Par exemple dans types/event.ts
export type EtatEvent = "OUVERT" | "COMPLET" | "ANNULÉ";
