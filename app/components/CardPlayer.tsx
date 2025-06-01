import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import { Separator } from "@/components/ui/separator";
import { Joueur } from "@/types/joueur";
import { Edit } from "lucide-react";

interface CardJoueurProps {
  joueur: Joueur;
  onDeleteJoueur?: (id: number) => void;
  currentUserId?: string | null;
}
interface CardJoueurProps {
  joueur: Joueur;
  onDeleteJoueur?: (id: number) => void;
  currentUserId?: string | null;
  onEditJoueur?: (joueur: Joueur) => void; // <= nouveau
}

export default function CardPlayer({
  joueur,
  currentUserId,
  onEditJoueur,
}: CardJoueurProps) {
  const isOwner = currentUserId === joueur.userId;

  // const handleSupprimerJoueur = (id: number) => {
  //   if (onDeleteJoueur) {
  //     onDeleteJoueur(id);
  //   } else {
  //     console.warn(
  //       "Fonction onDeleteJoueur non passée au composant CardPlayer"
  //     );
  //   }
  // };

  return (
    <Card className="w-full max-w-xs hover:bg-muted transition-all duration-300 hover:shadow-xl hover:scale-[1.02] rounded-xl py-2">
      <CardContent className="flex flex-col items-center gap-2 p-4 relative">
        {isOwner && (
          <button
            type="button"
            onClick={() => onEditJoueur?.(joueur)}
            className="absolute top-3 right-3 p-1 bg-white/80 hover:bg-primary hover:text-white rounded-full shadow"
            title="Modifier"
          >
            <Edit />
          </button>
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
            <span>
              engagé
              {new Set(joueur.engagement.map((eng) => eng.event.tournoi?.id))
                .size > 1
                ? "s"
                : ""}{" "}
              dans{" "}
              <b>
                {
                  new Set(joueur.engagement.map((eng) => eng.event.tournoi?.id))
                    .size
                }
              </b>{" "}
              tournoi
              {new Set(joueur.engagement.map((eng) => eng.event.tournoi?.id))
                .size > 1
                ? "s"
                : ""}
            </span>
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
