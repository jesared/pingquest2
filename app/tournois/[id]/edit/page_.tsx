import EditTournoiForm from "@/app/components/EditTournoiForm";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { getPrismaClient } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { EtatEvent } from "@prisma/client";
import { Binoculars } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function EditTournoi({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const tournoiId = Number(id);
  const { userId } = await auth();
  const prisma = getPrismaClient();

  const user = await prisma.user.findUnique({
    where: {
      clerkUserId: userId ?? undefined,
    },
    include: {
      role: true,
    },
  });

  const tournoi = await prisma.tournoi.findUnique({
    where: { id: tournoiId },
    include: {
      events: true, // Ensure the 'event' data is fetched
    },
  });

  const isOwner = tournoi?.userId === user?.id;
  const isAdmin = user?.role?.name === "admin";

  if (!tournoi || (!isOwner && !isAdmin)) {
    return notFound();
  }

  if (!tournoi.nom || !tournoi.lieu || !tournoi.description) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <h1 className="text-2xl font-bold">Modifier votre tournoi</h1>
            <div className="justify-end">
              <Link href={`/tournois/${tournoiId}`}>
                <Button size={"icon"} className="rounded-full cursor-pointer">
                  <Binoculars />
                </Button>
              </Link>
            </div>
          </div>
        </CardHeader>

        <EditTournoiForm
          tournoiId={tournoiId}
          initialData={{
            nom: tournoi.nom,
            lieu: tournoi.lieu ?? "",
            afficheUrl: tournoi.afficheUrl ?? "",
            description: tournoi.description ?? "",
            responsableNom: tournoi.responsableNom ?? "",
            responsableEmail: tournoi.responsableEmail ?? "",
            responsableTelephone: tournoi.responsableTelephone ?? "",
            epreuves:
              (tournoi.events as {
                // Faites un cast explicite si nécessaire
                id: number;
                nom: string;
                date: Date;
                jour: string;
                heure: string;
                tableau: string;
                categorie: string | null;
                minPoints: number | null;
                maxPoints: number | null;
                prixAnticipe: number;
                prixSurPlace: number;
                placesMax: number | null;
                etat: EtatEvent;
                tournoiId: number;
              }[]) ?? [],
            startDate: tournoi.debut ? tournoi.debut.toISOString() : "",
            endDate: tournoi.fin ? tournoi.fin.toISOString() : "",
            statut: tournoi.statut ?? "",
          }}
        />
      </Card>
    </div>
  );
}
