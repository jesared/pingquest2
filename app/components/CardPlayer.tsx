import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

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

interface CardJoueurProps {
  joueur: Joueur;
}

export default function CardPlayer({ joueur }: CardJoueurProps) {
  return (
    <Card className="w-full max-w-xs hover:bg-muted transition-all duration-300 hover:shadow-xl hover:scale-[1.002] rounded-xl py-2">
      <CardContent className="flex flex-col items-center gap-2 p-4">
        {/* Avatar */}
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
          <p className="text-xs text-gray-400">{joueur.club}</p>
        </div>
        {joueur.engagement.length > 0 ? (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-1">
              {joueur.engagement.map((eng) => (
                <Badge
                  key={eng.id}
                  variant="outline"
                  className="text-xs px-2 py-1 rounded-full"
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
        <div className="w-full flex justify-end mt-2 text-right">
          <div className="flex flex-col items-end text-xs text-gray-500">
            <Badge
              variant={"outline"}
              className="text-primary font-bold text-sm"
            >
              #{joueur.pointsOfficiel ?? "--"}
            </Badge>
            <span>Licence: {joueur.numeroLicence ?? "N/A"}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
