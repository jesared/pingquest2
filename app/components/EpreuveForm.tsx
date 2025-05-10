// EpreuveForm.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash } from "lucide-react";
import React from "react";

interface EpreuveFormProps {
  epreuve: {
    id: number;
    nom: string;
    jour: string;
    heure: string;
    categorie?: string;
    minPoints?: number;
    maxPoints?: number;
    tempId?: string;
  };
  index: number;
  onChange: (index: number, e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove?: (index: number) => void; // Prop optionnelle pour la suppression
}

const EpreuveForm: React.FC<EpreuveFormProps> = ({
  epreuve,
  index,
  onChange,
  onRemove,
}) => {
  return (
    <div className="grid grid-cols-3 gap-4 mb-4 p-4 border rounded">
      <div className="flex flex-col space-y-2">
        <Label htmlFor={`epreuve-nom-${index}`}>Nom</Label>
        <Input
          type="text"
          name="nom"
          id={`epreuve-nom-${index}`}
          value={epreuve.nom}
          onChange={(e) => onChange(index, e)}
        />
      </div>
      <div className="flex flex-col space-y-2">
        <Label htmlFor={`epreuve-categorie`}>Catégorie</Label>
        <Input
          type="text"
          name="categorie"
          id={`epreuve-nom-${index}`}
          value={epreuve.categorie}
          onChange={(e) => onChange(index, e)}
        />
      </div>
      <div className="flex flex-col space-y-2">
        <Label htmlFor={`epreuve-jour-${index}`}>Jour</Label>
        <Input
          type="text"
          name="jour"
          id={`epreuve-jour-${index}`}
          value={epreuve.jour}
          onChange={(e) => onChange(index, e)}
        />
      </div>
      <div className="flex flex-col space-y-2">
        <Label htmlFor={`epreuve-heure-${index}`}>Heure</Label>
        <Input
          id={`epreuve-heure-${index}`}
          type="time"
          value={epreuve.heure}
          name="heure"
          onChange={(e) => {
            const value = e.target.value;
            const [hours, minutes] = value.split(":");

            if (hours && minutes) {
              const minutesInt = parseInt(minutes, 10);
              const closestMinute = Math.round(minutesInt / 15) * 15;
              const adjustedMinutes =
                closestMinute === 60
                  ? "00"
                  : closestMinute.toString().padStart(2, "0");
              const newTime = `${hours}:${adjustedMinutes}`;

              // Créer un nouvel événement synthétique pour propager la valeur ajustée
              const syntheticEvent = {
                target: { name: "heure", value: newTime },
              } as React.ChangeEvent<HTMLInputElement>;
              onChange(index, syntheticEvent);
            }
          }}
          className="h-10 text-sm min-w-[120px]"
          step="900"
          min="00:00"
          max="23:45"
        />
      </div>
      <div className="flex flex-col space-y-2">
        <Label htmlFor={`epreuve-minPts-${index}`}>Min. Points</Label>
        <Input
          id={`epreuve-minPts-${index}`}
          type="number"
          name="minPoints"
          placeholder="Min pts"
          value={epreuve.minPoints ?? ""}
          onChange={(e) => onChange(index, e)}
        />
      </div>
      <div className="flex flex-col space-y-2">
        <Label htmlFor={`epreuve-maxPts-${index}`}>Max. Points</Label>
        <Input
          id={`epreuve-maxPts-${index}`}
          type="number"
          name="maxPoints"
          placeholder="Max pts"
          value={epreuve.maxPoints}
          onChange={(e) => onChange(index, e)}
        />
      </div>
      {onRemove && (
        <div className="col-span-3 mt-2 flex justify-end">
          <Button
            type="button"
            size={"icon"}
            onClick={() => onRemove(index)}
            variant={"destructive"}
            className="rounded-full cursor-pointer "
          >
            <Trash />
          </Button>
        </div>
      )}
    </div>
  );
};

export default EpreuveForm;
