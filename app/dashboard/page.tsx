import { prisma } from "@/lib/prisma";
import { addUserToDatabase, getRole } from "@/services/dbActions";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import CardProfil from "../components/CardProfil";
import FormUpdate from "../components/FormUpdate";
import GetInscriptions from "../components/GetInscriptions";
import ListTournois from "../components/ListTounois";
import ListUsers from "../components/ListUsers";
export default async function DashBoardUser() {
  const { userId } = await auth();
  if (!userId) return redirect("/");

  const user = await currentUser();
  if (!user) return redirect("/");

  const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`;
  const email = user.emailAddresses[0]?.emailAddress ?? "";
  const image = user.imageUrl ?? "";
  // 💡 Ne fais l'ajout que si c'est nécessaire
  await addUserToDatabase(userId, fullName, email, image);

  const userRole = await getRole(userId as string);
  const tournoisData = await prisma.tournoi.findMany({
    where: {
      statut: {
        not: "BROUILLON",
      },
    },
    orderBy: { debut: "desc" },
    include: { events: true },
  });

  const title = "Vos tournois";
  const userTournoi = userRole?.id;

  const tournois = tournoisData.map((tournoi) => ({
    id: tournoi.id.toString(),
    nom: tournoi.nom.toString(),
    lieu: tournoi.lieu?.toString() || "Lieu non spécifié",
    startDate: tournoi.debut.toISOString(),
    endDate: tournoi.fin.toISOString(),
    userId: tournoi.userId.toString(), // Assuming 'debut' is the desired date field
  }));
  return (
    <>
      <div className="max-w-3xl p-4 mx-auto bg-gray-50 rounded-t-xl dark:border-gray-600">
        <CardProfil userId={userId as string} />
        <FormUpdate userId={userId} />

        {userRole?.role?.name === "admin" && <ListUsers />}
        <div className="mt-4">
          <div className="text-center mb-4">
            <h1 className="text-2xl font-bold">Vos inscriptions</h1>
          </div>
          <div className="mt-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3">
            <GetInscriptions />
          </div>
        </div>
      </div>
      <ListTournois
        tournois={tournois}
        title={title}
        userTournoi={userTournoi || ""}
      />
    </>
  );
}
