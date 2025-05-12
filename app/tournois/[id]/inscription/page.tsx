// app/(inscription)/inscription/page.tsx
import GenererJoursTournoi from "@/app/components/GenererJoursTournoi";
import InscriptionClient from "@/app/components/InscriptionClient";
import { getPrismaClient } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

// interface InscriptionProps {
//   searchParams?: { [key: string]: string | string[] | undefined };
//   tournoiId?: string | string[]; // Add tournoiId property
// }

export default async function Page(props: any) {
  const { searchParams } = props;
  const tournoiId = Number(searchParams?.tournoiId);

  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const prisma = getPrismaClient();
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
