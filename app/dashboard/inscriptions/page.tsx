"use client";

import { DeleteJoueurButton } from "@/app/components/DeletedJoueurButton";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useUser } from "@clerk/nextjs";
import { Trash } from "lucide-react";
import { useEffect, useState } from "react";

export default function Page() {
  const { user } = useUser();
  interface Joueur {
    id: number;
    dossard: string;
    numeroLicence: string;
    nom: string;
    prenom: string;
    club: string;
    engagement: {
      id: string;
      event: {
        tableau: string;
        id: string;
      };
    }[];
  }

  const [players, setPlayers] = useState<Joueur[]>([]);

  useEffect(() => {
    async function fetchPlayers() {
      if (user) {
        const res = await fetch(`/api/joueurs?userClerkId=${user.id}`);
        const data = await res.json();
        setPlayers(data.joueurs || []);
      }
    }
    fetchPlayers();
  }, [user]);

  // Fonction qui met à jour le tableau en supprimant le joueur localement
  const handleDelete = (id: number) => {
    setPlayers((prev) => prev.filter((player) => player.id !== id));
  };

  return (
    <div className="flex items-center justify-center flex-col">
      <div className="mx-auto text-center ml-4">
        <h1 className="text-2xl font-bold">Inscriptions</h1>
        <p className="text-gray-500">Liste des inscrits</p>
        <div className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-gray-500">
                  <Trash className="h-4 w-4 text-center" />
                </TableHead>
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
              {players.map((joueur) => (
                <TableRow key={joueur.id}>
                  <TableCell>
                    <DeleteJoueurButton
                      joueurId={joueur.id}
                      onDelete={handleDelete}
                    />
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{joueur.dossard}</Badge>
                  </TableCell>
                  <TableCell>{joueur.numeroLicence}</TableCell>
                  <TableCell>{joueur.nom}</TableCell>
                  <TableCell>{joueur.prenom}</TableCell>
                  <TableCell>
                    <code className="relative rounded px-[0.3rem] py-[0.2rem] font-mono text-xs">
                      {joueur.club}
                    </code>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      {joueur.engagement.map((engagement) => (
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
              {players.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
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
