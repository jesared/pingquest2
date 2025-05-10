import ListTournois from "@/app/components/ListTounois";
import { getTournoisByOrganisateur, getUserId } from "@/services/dbActions";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function page() {
  const { userId } = await auth();
  if (!userId) return redirect("/");

  const user = await getUserId(userId as string);
  const tournoisData = await getTournoisByOrganisateur(userId as string);

  const userTournoi = user?.id;
  const title = "Mes tournois";
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
