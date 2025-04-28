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
async function fetchEpreuves() {
  const response = await fetch("http://localhost:3000/api/epreuves"); // Change l'URL si besoin
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

const Page = async () => {
  let epreuves: Epreuve[] = [];

  try {
    epreuves = await fetchEpreuves();
  } catch (error) {
    console.error("Erreur lors de la récupération des épreuves:", error);
  }
  return (
    <div className="w-full p-4 border border-gray-200 bg-gray-50 rounded-t-xl dark:border-gray-600 dark:bg-gray-700">
      <div className="mx-auto text-center ml-4">
        <h1 className="text-2xl font-bold">Les épreuves</h1>
        <Table>
          <TableCaption>
            <Link href="">Pdf règlement du tournoi</Link>
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
      </div>
    </div>
  );
};

export default Page;
