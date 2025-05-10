export default function GenererJoursTournoi(
  dateDebut: Date,
  dateFin: Date
): string[] {
  const joursSemaine = [
    "dimanche",
    "lundi",
    "mardi",
    "mercredi",
    "jeudi",
    "vendredi",
    "samedi",
  ];
  const joursTournoi: string[] = [];
  const dateCourante = new Date(dateDebut); // Crée une nouvelle date pour ne pas modifier l'originale

  while (dateCourante <= dateFin) {
    const jourIndex = dateCourante.getDay(); // 0 pour dimanche, 1 pour lundi, etc.
    joursTournoi.push(joursSemaine[jourIndex]);

    // Ajouter un jour à la date courante
    dateCourante.setDate(dateCourante.getDate() + 1);
  }

  return joursTournoi;
}

// N'oubliez pas d'appeler votre fonction avec l'ID du tournoi
// votreFonctionAvecTournoi(7);
