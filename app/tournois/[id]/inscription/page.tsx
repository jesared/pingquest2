// app/(inscription)/inscription/page.tsx
import GenererJoursTournoi from "@/app/components/GenererJoursTournoi";
import InscriptionClient from "@/app/components/InscriptionClient";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Page(props: PageProps) {
  const searchParams = await props.searchParams;
  const tournoiId = Number(searchParams?.tournoiId);

  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const tournoi = await prisma.tournoi.findUnique({
    where: { id: tournoiId },
    include: { events: true },
  });

  if (!tournoi) {
    return <p>Tournoi introuvable.</p>;
  }

  const jours = GenererJoursTournoi(tournoi.debut, tournoi.fin);

  return <InscriptionClient tournoi={tournoi} jours={jours} />;
}
