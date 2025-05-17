import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Binoculars, EditIcon } from "lucide-react";
import Link from "next/link";

type Tournoi = {
  id: string;
  nom: string;
  lieu: string;
  startDate: string;
  endDate: string;
  userId: string;
};

export default function ListTournois({
  tournois,
  title,
  userTournoi,
}: {
  tournois: Tournoi[];
  title: string;
  userTournoi: string;
}) {
  if (!tournois.length) {
    return <p className="mt-4 text-sm text-gray-500">Aucun tournoi trouvé.</p>;
  }

  return (
    <div className="max-w-3xl p-4 mx-auto bg-gray-50 rounded-t-xl dark:border-gray-600">
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-3">
        {tournois.map((tournoi) => (
          <Card
            key={tournoi.id}
            className="flex flex-col justify-between h-full"
          >
            <CardHeader className="flex-1">
              <CardTitle>{tournoi.nom}</CardTitle>
              <CardDescription className="truncate text-xs">
                {tournoi.lieu}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <CardDescription>
                <Badge variant={"outline"} className="text-sm text-gray-500">
                  {new Date(tournoi.startDate).toLocaleDateString("fr-FR")}
                  {new Date(tournoi.startDate).toDateString() ===
                  new Date(tournoi.endDate).toDateString()
                    ? " — sur la journée"
                    : ` au ${new Date(tournoi.endDate).toLocaleDateString(
                        "fr-FR"
                      )}`}
                </Badge>
              </CardDescription>
            </CardContent>
            <CardFooter>
              <div className="mt-auto flex space-x-2">
                <Link href={`/tournois/${tournoi.id}`}>
                  <Button variant={"secondary"} className=" cursor-pointer">
                    <Binoculars />
                    Voir
                  </Button>
                </Link>
                {userTournoi === tournoi.userId && (
                  <Link href={`/tournois/${tournoi.id}/edit`}>
                    <Button className="cursor-pointer">
                      <EditIcon />
                      je modifie !
                    </Button>
                  </Link>
                )}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
