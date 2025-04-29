import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Edit, Trash } from "lucide-react";
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
export const PopoverCard = ({ joueur, onDelete }: PopoverCardProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"ghost"}
          className="cursor-pointer absolute -top-2 right-0 hover:bg-white rounded-full"
        >
          <Edit />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">
              {joueur.prenom} {joueur.nom}
            </h4>
            <p className="text-sm text-muted-foreground">
              je sais pas quoi mettre
            </p>
          </div>
          <div className="grid gap-2">
            <p className="text-sm text-muted-foreground">Club: {joueur.club}</p>
            <p className="text-sm text-muted-foreground">
              Dossard: {joueur.dossard}
            </p>
            <p className="text-sm text-muted-foreground">
              Licence: {joueur.numeroLicence}
            </p>
            {joueur.pointsOfficiel !== undefined && (
              <p className="text-sm text-muted-foreground">
                Points: {joueur.pointsOfficiel}
              </p>
            )}
            {joueur.engagement.length > 0 && (
              <div>
                <h4 className="mt-2 font-semibold">Engagements:</h4>
                <ul>
                  {joueur.engagement.map((eng) => (
                    <li key={eng.id} className="text-sm">
                      Tableau: {eng.event.tableau} (ID: {eng.event.id})
                    </li>
                  ))}
                </ul>
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
      </PopoverContent>
    </Popover>
  );
};
