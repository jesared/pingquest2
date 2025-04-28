import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Joueur {
  id: number;
  dossard: string;
  numeroLicence: string;
  nom: string;
  prenom: string;
  club: string;
  pointsOfficiel: number;
  engagement: {
    id: string;
    event: {
      tableau: string;
      id: string;
    };
  }[];
}

interface CardJoueurProps {
  joueur: Joueur;
}

export default function CardJoueur({ joueur }: CardJoueurProps) {
  return (
    <Card className="w-[280px] hover:bg-muted transition-all duration-300 hover:shadow-xl hover:scale-[1.002]">
      <CardHeader className="p-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base">
              {joueur.prenom} {joueur.nom}
            </CardTitle>
            <CardDescription className="text-xs mt-1">
              {joueur.club}
            </CardDescription>
          </div>
          <Badge variant="outline" className="ml-2">
            #{joueur.pointsOfficiel}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
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
      </CardContent>
      <CardFooter className="flex justify-end text-xs text-muted-foreground">
        <code>{joueur.numeroLicence}</code>
      </CardFooter>
    </Card>
  );
}
