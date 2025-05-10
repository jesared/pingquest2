// app/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { SignInButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Hero } from "./components/Hero";

export default function Home() {
  const { isSignedIn } = useUser();

  return (
    <main className="  flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl text-center space-y-8">
        <Hero />

        <div className="flex gap-4 justify-center mt-8">
          {isSignedIn ? (
            <Link href="/dashboard">
              <Button className="cursor-pointer">Votre tableau de bord</Button>
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
