"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getJoueursByUser } from "@/lib/data";

// Importez depuis lib/data

export default async function Page() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  if (!userId) {
    redirect("/sign-in");
  }
  const joueurs = await getJoueursByUser(userId);
  return (
    <div className="flex items-center justify-center flex-col">
      <div className="mx-auto text-center ml-4">
        <h1 className="text-2xl font-bold">Inscriptions</h1>
        <p className="text-gray-500">Liste des inscrits</p>
        <div className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-gray-500 text-center">
                  Dossard
                </TableHead>
                <TableHead className="text-gray-500 text-center">
                  Licence
                </TableHead>
                <TableHead className="text-gray-500 text-center">Nom</TableHead>
                <TableHead className="text-gray-500 text-center">
                  Prénom
                </TableHead>
                <TableHead className="text-gray-500 text-center">
                  Club
                </TableHead>
                <TableHead className="text-gray-500 text-center">
                  Engagements
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {joueurs.map((joueur) => (
                <TableRow key={joueur.id}>
                  <TableCell>
                    <Badge variant="outline">{joueur.dossard}</Badge>
                  </TableCell>
                  <TableCell>{joueur.numeroLicence}</TableCell>
                  <TableCell>{joueur.nom}</TableCell>
                  <TableCell>{joueur.prenom}</TableCell>
                  <TableCell>
                    <code className="relative rounded  px-[0.3rem] py-[0.2rem] font-mono text-xs ">
                      {joueur.club}
                    </code>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      {joueur.Engagement.map((engagement) => (
                        <span
                          key={engagement.id}
                          className="bg-primary-foreground text-primary p-1 rounded-full text-sm"
                        >
                          {engagement.event.tableau}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {joueurs.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="border border-gray-200 p-2 text-center"
                  >
                    Aucun joueur trouvé
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
