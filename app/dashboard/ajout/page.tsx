import MultiStepForm from "@/app/components/MultiFormSteps";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Page() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="max-w-2xl mx-auto p-4 border border-gray-200 bg-gray-50 rounded-t-xl px-4">
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold">
          Ajout au tournoi [nom du tournoi]
        </h1>
        <p className="text-gray-500">Inscrire un joueur</p>
      </div>{" "}
      {/* Conteneur pour centrer MultiStepForm */}
      <MultiStepForm />
    </div>
  );
}
