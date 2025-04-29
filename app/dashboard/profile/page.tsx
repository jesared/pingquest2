import { Button } from "@/components/ui/button";
import { SignOutButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import { LogOut } from "lucide-react";
import { redirect } from "next/navigation";
import UploadAvatar from "./_components/UploadAvatar";

export default async function UserInfoPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await currentUser();

  if (!user) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="w-full p-6">
      <div className="text-center space-y-4">
        <div className="relative mx-auto rounded-full border border-gray-300 dark:border-gray-600 p-1 w-fit shadow">
          <UploadAvatar />
        </div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          {user?.firstName} {user?.lastName}
        </h1>

        {user?.emailAddresses && user.emailAddresses.length > 0 && (
          <p className="text-gray-600 dark:text-gray-400">
            Email: {user.emailAddresses[0].emailAddress}
          </p>
        )}

        <SignOutButton>
          <Button className="cursor-pointer" variant={"outline"}>
            <LogOut /> Déconnexion
          </Button>
        </SignOutButton>
      </div>
    </div>
  );
}
