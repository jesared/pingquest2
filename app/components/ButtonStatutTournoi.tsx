"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";

interface ButtonGroupProps {
  tournoiId: string;
  currentStatut: "Publié" | "Brouillon";
}

export function ButtonGroup({ tournoiId, currentStatut }: ButtonGroupProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [statut, setStatut] = useState<"Publié" | "Brouillon">(currentStatut);

  const handleStatutChange = async (newStatut: string) => {
    const newStatutPut = newStatut === "Publié" ? "PUBLIE" : "BROUILLON";
    setIsLoading(true);
    try {
      await fetch(`/api/tournois/${tournoiId}`, {
        method: "PUT",
        body: JSON.stringify({ statut: newStatutPut }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      setStatut(newStatut as "Publié" | "Brouillon");
      toast.success("Mise à jour du statut !");
    } catch (err) {
      console.error("Erreur lors de la mise à jour du tournoi", err);
      toast.error("Erreur lors de la mise à jour !");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <Select
        value={statut}
        onValueChange={handleStatutChange}
        disabled={isLoading}
      >
        <SelectTrigger className="w-[120px] ml-4">
          <SelectValue placeholder="Statut du tournoi" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Publié">Publié</SelectItem>
          <SelectItem value="Brouillon">Brouillon</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
