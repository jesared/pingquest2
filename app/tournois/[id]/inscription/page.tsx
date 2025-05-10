import GenererJoursTournoi from "@/app/components/GenererJoursTournoi";
import MultiStepForm from "@/app/components/MultiFormSteps";
import { getPrismaClient } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface InscriptionProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Inscription({ searchParams }: InscriptionProps) {
  const search = searchParams ? await searchParams : {};
  console.log("searchParams.tournoiId:", search);

  const tournoiId = Number(search);

  const { userId } = await auth();
  const prisma = getPrismaClient();

  if (!userId) {
    redirect("/sign-in");
  }

  const tournoi = tournoiId
    ? await prisma.tournoi.findUnique({
        where: { id: tournoiId },
        include: {
          events: true,
        },
      })
    : null;
  const jours = GenererJoursTournoi(
    tournoi?.debut ?? new Date(),
    tournoi?.fin ?? new Date()
  );

  return (
    <div className="max-w-2xl mx-auto p-4 border border-gray-200 bg-gray-50 rounded-t-xl px-4">
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold">Ajout au tournoi</h1>
        <span>{tournoi?.nom || "Nom non défini"}</span>
        <p className="text-gray-500">Inscrire un joueur</p>
      </div>{" "}
      {tournoiId !== null && (
        <MultiStepForm tournoiId={tournoiId} jours={jours} />
      )}
    </div>
  );
}
