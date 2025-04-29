import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getPrismaClient } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await currentUser();
  const prisma = getPrismaClient();

  // Récupérer les joueurs associés à l'utilisateur
  const joueurs = await prisma.joueur.findMany({
    where: {
      userClerkId: userId,
    },
    include: {
      engagement: {
        include: {
          event: true,
        },
      },
    },
  });

  // Calculer le nombre total d'inscriptions et les épreuves associées
  const totalInscriptions = joueurs.length;

  return (
    <div className="w-full p-4  bg-gray-50 rounded-t-xl dark:border-gray-600">
      <div className="text-center space-y-4">
        <div className="mx-auto rounded-full border border-gray-300 p-1 w-fit shadow">
          <Avatar className="w-16 h-16 mx-auto">
            <AvatarImage
              src={user?.imageUrl || "https://github.com/shadcn.png"}
              alt={`${user?.firstName} ${user?.lastName}`}
            />
          </Avatar>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 ">
          Bonjour {user?.firstName ?? "Utilisateur"}
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          {totalInscriptions === 0 ? (
            <>
              Bienvenue sur votre Dashboard. <br />
              Vous n&apos;avez encore inscrit aucun joueur.
            </>
          ) : (
            <>
              Bienvenue sur votre Dashboard. <br /> Vous avez inscrit{" "}
              {totalInscriptions}{" "}
              {totalInscriptions === 1 ? "joueur" : "joueurs"}.
            </>
          )}
        </p>
        <div className="flex justify-center gap-4 mt-6">
          <Link href="/dashboard/ajout">
            <Button className="cursor-pointer">Ajouter un joueur</Button>
          </Link>
          {totalInscriptions > 0 && (
            <Link href="/dashboard/inscriptions">
              <Button variant={"outline"} className="cursor-pointer">
                Mes inscriptions
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
