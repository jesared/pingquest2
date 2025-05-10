// app/not-found.tsx
"use client";
import { Button } from "@/components/ui/button";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 text-center">
      <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-6">
        Oups ! Cette page n&apos;existe pas.
      </p>
      <div className="w-xl">
        <DotLottieReact
          src="https://lottie.host/9a47b8f6-1abb-4358-80f7-7c5aec54cc0d/NPiylbWoSJ.lottie"
          loop
          autoplay
        />
      </div>

      <Link href="/">
        <Button>Retour à l&apos;accueil</Button>
      </Link>
    </div>
  );
}
