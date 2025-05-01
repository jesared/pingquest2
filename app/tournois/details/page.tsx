import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import Image from "next/image";
import Link from "next/link";

export default function page() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Section de la photo de couverture */}
        <section className="mb-8">
          <Image
            width={1200} // Définissez la largeur souhaitée
            height={400} // Définissez la hauteur souhaitée
            src="/affiche.jpeg" // Remplacez par l'URL de votre image
            alt="Photo de couverture du tournoi"
            className="w-full h-auto max-h-96 object-cover rounded-lg"
          />
        </section>

        {/* Section d'en-tête */}
        <section className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Tournoi de Pâques, Châlons TT
          </h1>
          <p className="text-lg text-gray-600">
            Rejoignez-nous pour une compétition de tennis de table passionnante
            !
          </p>
          <div className="mt-6">
            <Link href={"/dashboard/ajout"}>
              <Button variant={"default"} className="cursor-pointer">
                S&apos;inscrire au tournoi
              </Button>
            </Link>
            <Link href={"/epreuves"}>
              <Button variant="outline" className="ml-4 cursor-pointer">
                Voir le règlement
              </Button>
            </Link>
          </div>
        </section>

        {/* Section des informations clés */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Date et Heure</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 font-semibold">
                [Date de début] - [Date de fin]
              </p>
              <p className="text-gray-500">[Heure de début] - [Heure de fin]</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lieu</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 font-semibold">[Nom de la salle]</p>
              <p className="text-gray-500">[Adresse complète]</p>
            </CardContent>
          </Card>
          <HoverCard>
            <HoverCardTrigger asChild>
              <Card className="md:col-span-2 lg:col-span-1">
                {/* Section de l'affiche du tournoi */}

                <Image
                  width={1200} // Définissez la largeur souhaitée
                  height={400} // Définissez la hauteur souhaitée
                  src="/affiche.jpeg" // URL de l'image générée
                  alt="Affiche du tournoi"
                  className="w-full h-auto object-contain rounded-lg p-2"
                />
              </Card>
            </HoverCardTrigger>
            <HoverCardContent className="w-100">
              <Image
                width={1200}
                height={400}
                src="/affiche.jpeg"
                alt="Affiche du tournoi en grand"
                className="rounded-md shadow-md"
              />
            </HoverCardContent>
          </HoverCard>
        </section>

        {/* Section de la présentation du tournoi */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            À propos du tournoi
          </h2>
          <p className="text-gray-700 leading-relaxed">
            [Description détaillée de votre tournoi. Parlez de l&apos;ambiance,
            du niveau attendu, des éventuels prix, etc. Vous pouvez ajouter
            plusieurs paragraphes pour bien informer les participants
            potentiels.]
          </p>
        </section>

        {/* Section contact et informations supplémentaires */}
        <section className="py-8 text-center text-gray-600">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Contactez-nous
          </h2>
          <p>Pour toute question, veuillez contacter :</p>
          <p className="font-semibold">[Nom de l&apos;organisateur]</p>
          <p>[Email de contact]</p>
          <p>[Numéro de téléphone (facultatif)]</p>
        </section>
      </div>
    </div>
  );
}
