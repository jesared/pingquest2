import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import { Separator } from "@/components/ui/separator";
import { PopoverCard } from "./PoppoverCard";

interface Joueur {
  id: number;
  userId: string;
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

interface CardJoueurProps {
  joueur: Joueur;
  onDeleteJoueur?: (id: number) => void;
  currentUserId?: string | null;
}

export default function CardPlayer({
  joueur,
  onDeleteJoueur,
  currentUserId,
}: CardJoueurProps) {
  const isOwner = currentUserId === joueur.userId;

  const handleSupprimerJoueur = (id: number) => {
    if (onDeleteJoueur) {
      onDeleteJoueur(id);
    } else {
      console.warn(
        "Fonction onDeleteJoueur non passée au composant CardPlayer"
      );
    }
  };
  return (
    <Card className="w-full max-w-xs hover:bg-muted transition-all duration-300 hover:shadow-xl hover:scale-[1.02] rounded-xl py-2">
      <CardContent className="flex flex-col items-center gap-2 p-4 relative">
        {isOwner && (
          <PopoverCard joueur={joueur} onDelete={handleSupprimerJoueur} />
        )}
        <Avatar className="w-16 h-16">
          <AvatarImage
            src={joueur.photoUrl || "https://github.com/shadcn.png"}
            alt={`${joueur.prenom} ${joueur.nom}`}
          />
          <AvatarFallback>
            {joueur.prenom.charAt(0)}
            {joueur.nom.charAt(0)}
          </AvatarFallback>
        </Avatar>

        {/* Nom + Club */}
        <div className="text-left">
          <p className="text-sm font-semibold">
            {joueur.prenom} {joueur.nom}
          </p>
          <p className="text-[11px] text-secondary font-semibold">
            {joueur.club}
          </p>
        </div>
        {joueur.engagement.length > 0 ? (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-1">
              {joueur.engagement.map((eng) => (
                <Badge
                  key={eng.id}
                  variant="outline"
                  className="text-xs px-2 py-1"
                >
                  {eng.event.tableau}
                </Badge>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Aucun engagement</p>
        )}
        {/* Points + Licence alignés à droite */}
        <Separator />
        <div className="w-full flex">
          <div className="flex flex-col items-end text-xs text-gray-500 gap-1">
            <div className="justify-center space-x-2">
              <Badge
                variant={"outline"}
                className="text-primary font-bold text-sm"
              >
                #{joueur.pointsOfficiel ?? "--"}
              </Badge>
              <Badge className="font-bold text-sm">
                {joueur.numeroLicence ?? "N/A"}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
