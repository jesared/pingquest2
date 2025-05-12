// app/components/JourEpreuvesSelector.tsx
"use client";

import { Input } from "@/components/ui/input";
import { UseFormRegister } from "react-hook-form";

type Epreuve = {
  id: string;
  jour: string;
  tableau: string;
  categorie: string;
};

type Props = {
  jours: string[];
  epreuves: Epreuve[];
  register: UseFormRegister<any>;
};

export default function JourEpreuvesSelector({
  jours,
  epreuves,
  register,
}: Props) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {jours.map((jour, i) => {
        const jourNorm = jour.toLowerCase();
        const epreuvesDuJour = epreuves.filter(
          (e) => e.jour.toLowerCase() === jourNorm
        );

        return (
          <div key={`${jour}-${i}`}>
            <h3 className="text-lg font-semibold mb-2">{jour}</h3>
            <div className="flex flex-col gap-1">
              {epreuvesDuJour.map((e) => (
                <label
                  key={e.id}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <Input
                    type="checkbox"
                    value={e.id}
                    {...register("epreuves")}
                    className="sr-only peer"
                  />
                  <span className="ml-2 px-2 py-1 rounded-md border transition peer-checked:border-accent peer-checked:bg-accent">
                    {e.tableau} ({e.categorie})
                  </span>
                </label>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
