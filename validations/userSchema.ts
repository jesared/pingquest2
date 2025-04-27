import * as yup from "yup";

export const userSchema = yup.object().shape({
  numeroLicence: yup
    .string()
    .required("Le numéro de licence est requis")
    .matches(/^[0-9]+$/, "Le numéro de licence doit être composé de chiffres"),
  nom: yup.string().required("Le nom est requis"),
  prenom: yup.string().required("Le prénom est requis"),
  email: yup.string().email("Email invalide").required("L'email est requis"),
  mobile: yup
    .string()
    .required("Le numéro de mobile est requis")
    .matches(/^[0-9]{10}$/, "Le numéro de mobile doit contenir 10 chiffres"), // Ajouter une validation pour le mobile
  club: yup.string().required("Le club est requis"),
  pointsOfficiel: yup
    .number()
    .required("Les points officiels sont requis")
    .min(0, "Les points officiels doivent être un nombre positif"),
  description: yup.string().required("La description est requise"),
  url_github: yup.string().notRequired().nullable(),
  url_youtube: yup.string().notRequired().nullable(),
  url_site: yup.string().notRequired().nullable(),
  job: yup.string().required("Le poste est requis"),
  technologies: yup
    .array()
    .of(yup.string().defined())
    .required("Sélectionnez au moins une technologie")
    .min(1, "Sélectionnez au moins une technologie")
    .transform((value) => value.filter(Boolean)),
});
