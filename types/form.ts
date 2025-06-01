export interface FormData {
  numeroLicence: string;
  dossard?: string;
  nom: string;
  prenom: string;
  club: string;
  pointsOfficiel: string;
  epreuves?: string[];
  sexe?: string;
}

export const jobOptions = [
  { value: "frontend", label: "Développeur Front-end" },
  { value: "backend", label: "Développeur Back-end" },
  { value: "fullstack", label: "Développeur Full-stack" },
];

export const techOptions = [
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "javascript", label: "JavaScript" },
  { value: "php", label: "PHP" },
  { value: "sql", label: "SQL" },
  { value: "go", label: "Go" },
  { value: "python", label: "Python" },
];
