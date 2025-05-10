// app/epreuves/page.tsx

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";

// Fonction pour récupérer les épreuves depuis ton API
async function fetchEpreuves(tournoiId: number) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/epreuves?tournoiId=${tournoiId}`,
    {
      next: { revalidate: 60 }, // Cache pendant 60 secondes
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
    <Table>
      <TableCaption>
        <Link href="#" title="Pdf du réglement">
          Pdf règlement du tournoi
        </Link>
      </TableCaption>
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
            <TableCell>{epreuve.prixAnticipe} €</TableCell>
            <TableCell>{epreuve.prixSurPlace} €</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default GetEpreuves;
