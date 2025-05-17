import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Edit, PenIcon, Trash } from "lucide-react";
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
  pointsOfficiel?: number;
  photoUrl?: string;
}
interface PopoverCardProps {
  joueur: Joueur; // Utilisez l'interface Joueur que vous avez définie
  onDelete?: (joueurId: number) => void;
}
// En haut de PopoverCard.tsx ou dans ton dossier types
export interface Engagement {
  id: string;
  event: {
    id: string;
    tableau: string;
    tournoi?: {
      id: number;
      nom: string;
    };
  };
}

function groupEngagementsByTournoi(engagements: Engagement[]) {
  const map: Record<string, { nom: string; engagements: Engagement[] }> = {};
  for (const eng of engagements) {
    const tournoi = eng.event.tournoi;
    if (!tournoi) continue;
    if (!map[tournoi.id])
      map[tournoi.id] = { nom: tournoi.nom, engagements: [] };
    map[tournoi.id].engagements.push(eng);
  }
  return map;
}

export const PopoverCard = ({ joueur, onDelete }: PopoverCardProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"ghost"}
          className="cursor-pointer absolute -top-0 right-2 hover:bg-white"
        >
          <Edit />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-120">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-semibold text-secondary leading-none">
              {joueur.prenom} {joueur.nom}
            </h4>
          </div>
          <div className="grid gap-2">
            <div className="justify-between space-x-2.5 space-y-2">
              <Badge
                variant={"outline"}
                className="text-sm text-muted-foreground"
              >
                Club: {joueur.club}
              </Badge>
              <Badge
                variant={"outline"}
                className="text-sm text-muted-foreground"
              >
                Dossard: {joueur.dossard}
              </Badge>
              <Badge
                variant={"outline"}
                className="text-sm text-muted-foreground"
              >
                Licence: {joueur.numeroLicence}
              </Badge>
              {joueur.pointsOfficiel !== undefined && (
                <Badge
                  variant={"outline"}
                  className="text-sm text-muted-foreground"
                >
                  Points: {joueur.pointsOfficiel}
                </Badge>
              )}
            </div>

            {joueur.engagement.length > 0 && (
              <div>
                {Object.entries(
                  groupEngagementsByTournoi(joueur.engagement)
                ).map(([tournoiId, { nom, engagements }]) => (
                  <div key={tournoiId} className="mb-2">
                    <div className="mb-2">{nom}</div>
                    <ul className="ml-2 text-sm flex space-x-2">
                      {engagements.map((eng) => (
                        <li key={eng.id}>
                          <Badge variant={"outline"}>{eng.event.tableau}</Badge>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {/* Bouton Supprimer */}
        {onDelete && (
          <Button
            variant={"destructive"}
            className="mt-4 w-full cursor-pointer"
            onClick={() => onDelete(joueur.id)}
          >
            <Trash className="mr-2 h-4 w-4" />
            Supprimer
          </Button>
        )}
        <Button variant={"secondary"} className="mt-4 w-full cursor-pointer">
          <PenIcon />
          Modifier
        </Button>
      </PopoverContent>
    </Popover>
  );
};
