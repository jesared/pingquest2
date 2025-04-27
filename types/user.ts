export type User = {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  description: string;
  url_github: string | undefined | null;
  url_youtube: string | undefined | null;
  url_site: string | undefined | null;
  job: string;
  technologies: string;
  createdAt: Date;
  updatedAt: Date;
};
