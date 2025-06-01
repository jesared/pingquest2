import { prisma } from "@/lib/prisma";
import { getUserId } from "@/services/dbActions";
import { auth } from "@clerk/nextjs/server";
import ListTournois from "../components/ListTounois";

export default async function Tournois() {
  const { userId } = await auth();
  const user = await getUserId(userId as string);

  const tournoisData = await prisma.tournoi.findMany({
    where: {
      statut: {
        not: "BROUILLON",
      },
    },
    orderBy: { debut: "desc" },
    include: { events: true },
  });

  const title = "Tous les tournois";
  const userTournoi = user?.id;
  const tournois = tournoisData.map((tournoi) => ({
    id: tournoi.id.toString(),
    nom: tournoi.nom.toString(),
    lieu: tournoi.lieu?.toString() || "Lieu non spécifié",
    startDate: tournoi.debut.toISOString(),
    endDate: tournoi.fin.toISOString(),
    userId: tournoi.userId.toString(), // Assuming 'debut' is the desired date field
  }));
  return (
    <ListTournois
      tournois={tournois}
      title={title}
      userTournoi={userTournoi || ""}
    />
  );
}
