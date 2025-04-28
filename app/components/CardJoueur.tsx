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
    <Card className="w-[350px] hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>
              {joueur.prenom} {joueur.nom}
            </CardTitle>
            <CardDescription>{joueur.club}</CardDescription>
          </div>
          <Badge variant="outline" className="ml-2">
            #{joueur.dossard}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {joueur.engagement.length > 0 ? (
          <div className="space-y-2">
            <h4 className="text-xs text-gray-400 text-left font-medium">
              Engagements :
            </h4>
            <div className="flex flex-wrap gap-2">
              {joueur.engagement.map((eng) => (
                <Badge key={eng.id} variant="secondary">
                  {eng.event.tableau}
                </Badge>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Aucun engagement</p>
        )}
      </CardContent>
      <CardFooter className="flex justify-between text-sm">
        <span>Licence: {joueur.numeroLicence}</span>
      </CardFooter>
    </Card>
  );
}
