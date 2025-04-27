// app/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { SignInButton, useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  const { isSignedIn } = useUser();

  return (
    <main className=" min-h-screen  flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl text-center space-y-8">
        <h1 className="text-5xl font-extrabold text-blue-900">
          🏓 Bienvenue sur <span className="text-accent">PingQuest</span>
        </h1>
        <p className="text-lg text-blue-800">
          L&apos;aventure ultime du tennis de table : inscrivez-vous, défiez vos
          limites, et vivez l&apos;expérience PingQuest !
        </p>
        <div className="flex gap-4 justify-center mt-8">
          {isSignedIn ? (
            <Link href="/dashboard/ajout">
              <Button className="cursor-pointer">Inscrire un joueur</Button>
            </Link>
          ) : (
            <SignInButton>
              <Button className="cursor-pointer">Se connecter</Button>
            </SignInButton>
          )}
        </div>
      </div>
    </main>
  );
}
