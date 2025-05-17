// app/epreuves/page.tsx

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Fonction pour récupérer les épreuves depuis ton API
async function fetchEpreuves(tournoiId: number) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/epreuves?tournoiId=${tournoiId}`,
    {
      cache: "no-store", // ✅ Ne jamais utiliser de cache
    }
  );
  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des épreuves");
  }
  return response.json();
}

interface Epreuve {
  id: number;
  jour: string;
  heure: string;
  tableau: string;
  categorie: string;
  prixAnticipe: number;
  prixSurPlace: number;
}
interface GetEpreuvesProps {
  tournoiId: number;
}
const GetEpreuves = async ({ tournoiId }: GetEpreuvesProps) => {
  let epreuves: Epreuve[] = [];

  try {
    epreuves = await fetchEpreuves(tournoiId);
  } catch (error) {
    console.error("Erreur lors de la récupération des épreuves:", error);
  }
  return (
    <section className="mb-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">
        Les épreuves :
      </h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Jour</TableHead>
            <TableHead>Heure</TableHead>
            <TableHead>Tableau</TableHead>
            <TableHead>Catégorie</TableHead>
            <TableHead>Prix anticipé</TableHead>
            <TableHead>Prix sur place</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {epreuves.map((epreuve) => (
            <TableRow key={epreuve.id}>
              <TableCell>{epreuve.jour}</TableCell>
              <TableCell>{epreuve.heure}</TableCell>
              <TableCell>{epreuve.tableau}</TableCell>
              <TableCell>{epreuve.categorie}</TableCell>
              <TableCell>
                {epreuve.prixAnticipe === 0
                  ? "Gratuit"
                  : `${epreuve.prixAnticipe.toFixed(2)} €`}
              </TableCell>
              <TableCell>
                {epreuve.prixSurPlace === 0
                  ? "Gratuit"
                  : `${epreuve.prixSurPlace.toFixed(2)} €`}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
};

export default GetEpreuves;
