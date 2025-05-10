/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SignOutButton } from "@clerk/nextjs";
import { LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import UploadAvatar from "../dashboard/profile/_components/UploadAvatar";

export default function CardProfil({ userId }: { userId: string }) {
  interface UserData {
    image?: string;
    name?: string;
    role?: string;
  }

  const [data, setData] = useState<UserData | null>(null);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch("/api/getUser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }), // Passe directement l'userId
        });

        if (!res.ok) {
          const errorText = await res.text(); // Récupère la réponse brute pour affichage
          console.error("Erreur de l'API :", errorText);
          throw new Error("Erreur lors du chargement des données utilisateur");
        }

        const userData = await res.json();
        setData(userData);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error("Erreur lors de la récupération des données", err);
        setError(err.message || "Erreur inconnue");
        toast.error(err.message || "Erreur inconnue");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  // Affichage strict du loader uniquement pendant le chargement
  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-6 mt-6">
        <Skeleton className="w-[150px] h-[150px] rounded-full" />
        <div className="space-y-2 text-center">
          <Skeleton className="w-48 h-6 mx-auto" />
          <Skeleton className="w-32 h-5 mx-auto" />
        </div>
      </div>
    );
  }

  // Ne rien afficher si les données sont absentes après le chargement
  if (!data) return null;

  // Affichage du profil uniquement si le chargement est terminé et les données sont présentes
  return (
    <div className="mx-auto">
      <div className="flex justify-center items-center">
        <UploadAvatar />
      </div>
      <div className="text-center mb-4">
        <h1 className="text-2xl uppercase font-black text-gray-500">
          Tableau de bord
        </h1>
        <h3 className="text-xl uppercase font-black text-primary">
          {data.name}
        </h3>
        <p>Rôle : {data.role}</p>
      </div>
      <div className="flex justify-center">
        <SignOutButton>
          <Button
            variant={"outline"}
            size={"sm"}
            className="cursor-pointer mb-2"
          >
            <LogOut />
            <span className="ml-2 truncate">Se déconnecter</span>
          </Button>
        </SignOutButton>
      </div>
    </div>
  );
}
