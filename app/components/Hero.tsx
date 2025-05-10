"use client";

// this is a client component

import { Plus } from "lucide-react";
import Link from "next/link";

import Image from "next/image";

export const Hero = () => {
  // const talkAbout = ["Rejoignez", "Participez", "Découvrez", "Partagez"];

  return (
    <main className="overflow-hidden">
      <section id="home">
        <div className="absolute inset-0 max-md:hidden top-[400px] -z-10 h-[400px] w-full bg-transparent bg-[linear-gradient(to_right,#57534e_1px,transparent_1px),linear-gradient(to_bottom,#57534e_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-20 [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] dark:bg-[linear-gradient(to_right,#a8a29e_1px,transparent_1px),linear-gradient(to_bottom,#a8a29e_1px,transparent_1px)]"></div>
        <div className="flex flex-col items-center justify-center px-6 text-center">
          <div className="mb-6 mt-10 sm:justify-center md:mb-4 md:mt-40">
            <div className="relative flex items-center rounded-full border bg-popover px-3 py-1 text-xs text-primary/60">
              <Link
                href="/tournois"
                rel="noreferrer"
                className="ml-1 flex items-center font-semibold"
              >
                <div
                  className="absolute inset-0 hover:font-semibold hover:text-ali flex"
                  aria-hidden="true"
                />
                Découvre les tournois en ligne. <span aria-hidden="true"></span>
              </Link>
            </div>
          </div>

          <div className="mx-auto max-w-5xl">
            <div className="border-text-red-500 relative mx-auto h-full bg-background border py-12 p-6 [mask-image:radial-gradient(800rem_96rem_at_center,white,transparent)]">
              <h1 className="flex flex-col text-center text-5xl font-semibold leading-none tracking-tight md:flex-col md:text-8xl lg:flex-row lg:text-8xl">
                <Plus
                  strokeWidth={4}
                  className="text-text-red-500 absolute -left-5 -top-5 h-10 w-10"
                />
                <Plus
                  strokeWidth={4}
                  className="text-text-red-500 absolute -bottom-5 -left-5 h-10 w-10"
                />
                <Plus
                  strokeWidth={4}
                  className="text-text-red-500 absolute -right-5 -top-5 h-10 w-10"
                />
                <Plus
                  strokeWidth={4}
                  className="text-text-red-500 absolute -bottom-5 -right-5 h-10 w-10"
                />
                <span>
                  🏓<span className="text-accent">PingQuest.</span>
                </span>
              </h1>
              <div className="flex items-center mt-4 justify-center gap-1">
                <span className="relative flex h-3 w-3 items-center justify-center">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-500 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-purple-500"></span>
                </span>
                <p className="text-xs text-purple-500">
                  Disponible Prochainement
                </p>
              </div>
            </div>

            <h1 className="mt-8">
              Prêt à organiser votre prochain tournoi de tennis de table ? Vous
              êtes au bon endroit !
            </h1>

            <p className="text-primary/60 py-4">
              L&apos;aventure ultime du tennis de table : inscrivez-vous, défiez
              vos limites, et vivez l&apos;expérience !{" "}
              <span className="text-blue-500 font-semibold">Rejoignez</span>
              avec PingQuest, le frisson de la compétition à portée de clic.
            </p>
          </div>
        </div>
        <canvas
          className="pointer-events-none absolute inset-0 mx-auto"
          id="canvas"
        ></canvas>
      </section>
      <Image
        width={1512}
        height={550}
        className="absolute left-1/2 top-0 -z-10 -translate-x-1/2"
        src="/paques25.jpg"
        alt=""
        role="presentation"
        priority
      />
    </main>
  );
};
