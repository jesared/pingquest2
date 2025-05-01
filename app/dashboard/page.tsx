import { addUserToDatabase, getRole } from "@/services/dbActions";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import CardProfil from "../components/CardProfil";
import FormUpdate from "../components/FormUpdate";
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

  return (
    <div className="max-w-2xl p-4 mx-auto bg-gray-50 rounded-t-xl dark:border-gray-600">
      <CardProfil userId={userId as string} />
      <FormUpdate userId={userId} />
      {userRole?.role?.name === "admin" && <ListUsers />}
    </div>
  );
}
