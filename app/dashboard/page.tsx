import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Page() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="flex items-center justify-center flex-col">
      <div className="mx-auto text-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-500"></p>
      </div>
    </div>
  );
}
