import MultiStepForm from "@/app/components/MultiFormSteps";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Page() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="flex items-center justify-center flex-col">
      <div className="mx-auto text-center ml-4">
        <h1 className="text-2xl font-bold">Ajout</h1>
        <p className="text-gray-500">Inscrire un joueur</p>
        <MultiStepForm />
      </div>
    </div>
  );
}
