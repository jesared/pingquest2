import GetEpreuves from "@/app/components/GetEpreuves";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/services/dbActions";
import { auth } from "@clerk/nextjs/server";
import { EditIcon, MapPinned, PenTool } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = await auth();

  // Utilisez getUserId et gérez le cas où l'utilisateur n'est pas authentifié
  const user = userId ? await getUserId(userId) : null;
  const userIdTournoi = user?.id;

  const { id } = await params;
  const tournoiId = Number(id);
  if (isNaN(tournoiId)) {
    notFound(); // ou throw new Error("ID de tournoi invalide.")
    return null; // Ajouter un return pour satisfaire le type
  }

  const tournoi = await prisma.tournoi.findUnique({
    where: { id: tournoiId },
    include: { events: true },
  });

  const isAdmin = user?.role?.name === "admin";
  const isOwner = tournoi && tournoi.userId === userIdTournoi;
  const canEdit = isOwner || isAdmin;

  if (!tournoi) return notFound();

  // Exclure les brouillons sauf pour le propriétaire
  if (tournoi.statut === "BROUILLON" && !isOwner) {
    return notFound();
  }
  console.log("tournoi", tournoi);
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Couverture */}
        <section className="mb-8">
          <Image
            width={1200}
            height={80}
            src={tournoi.afficheUrl || "/affiche.jpeg"}
            alt={`Affiche du tournoi ${tournoi.nom}`}
            className="w-full h-auto max-h-36 object-cover rounded-lg"
          />
        </section>

        {/* En-tête */}
        <section className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {tournoi.nom}
          </h1>
          <div className="flex justify-center ">
            <MapPinned className="items-center mr-2" />{" "}
            <span className="max-w-100 text-lg text-gray-600 items-center">
              {tournoi.lieu}
            </span>
          </div>
          <div className="mt-6 flex justify-between">
            <div className="flex justify-start">
              <Link
                href={`/tournois/${tournoi.id}/inscription?tournoiId=${tournoi.id}`}
              >
                <Button className="cursor-pointer">
                  <PenTool />
                  Je m’inscris !
                </Button>
              </Link>
              {tournoi.reglementUrl && (
                <Link href={`${tournoi.reglementUrl}`} target="_blank">
                  <Button variant="secondary" className="ml-4 cursor-pointer">
                    Voir le règlement
                  </Button>
                </Link>
              )}
            </div>
            {canEdit && (
              <div className="flex justify-end">
                <Link href={`/tournois/${tournoi.id}/edit`}>
                  <Button variant={"ghost"} className="ml-4 cursor-pointer">
                    <EditIcon />
                    je modifie !
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Infos */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Date</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-secondary">
                {new Date(tournoi.debut).toLocaleDateString("fr-FR", {
                  weekday: "long",
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
                {new Date(tournoi.debut).toDateString() !==
                new Date(tournoi.fin).toDateString()
                  ? " - " +
                    new Date(tournoi.fin).toLocaleDateString("fr-FR", {
                      weekday: "long",
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })
                  : ""}
              </p>
            </CardContent>
            <CardHeader>
              <CardTitle>Lieu</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-secondary">{tournoi.lieu}</p>
            </CardContent>
          </Card>

          <HoverCard>
            <HoverCardTrigger asChild>
              <Card className="md:col-span-2 lg:col-span-1">
                <Image
                  width={1200}
                  height={400}
                  src={tournoi.afficheUrl || "/affiche.jpeg"}
                  alt={`Affiche du tournoi ${tournoi.nom}`}
                  className="w-full h-auto object-contain rounded-lg p-2"
                />
              </Card>
            </HoverCardTrigger>
            <HoverCardContent className="w-100">
              <Image
                width={1200}
                height={400}
                src={tournoi.afficheUrl || "/affiche.jpeg"}
                alt={`Affiche du tournoi ${tournoi.nom}`}
                className="rounded-md shadow-md"
              />
            </HoverCardContent>
          </HoverCard>
        </section>

        {/* Description */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            À propos du tournoi
          </h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {tournoi.description}
          </p>
        </section>

        <GetEpreuves tournoiId={tournoiId} />

        {/* Contact */}
        <section className="py-8 text-center text-gray-600">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Contactez-nous
          </h2>
          <p>Pour toute question :</p>
          {tournoi.responsableNom ? (
            <p>Contactez {tournoi.responsableNom} </p>
          ) : (
            ""
          )}
          <p className="font-semibold">{tournoi.responsableEmail}</p>
          <p>{tournoi.responsableTelephone}</p>
        </section>
      </div>
    </div>
  );
}
