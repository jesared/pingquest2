"use client";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { v4 as uuidv4 } from "uuid";

import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { EtatEvent } from "@prisma/client";
import { CalendarIcon, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ButtonGroup } from "./ButtonStatutTournoi";
import EpreuveForm from "./EpreuveForm";

interface EpreuveFormData {
  nom: string;
  categorie: string;
  jour: string;
  heure: string;
  minPoints: string;
  maxPoints: string;
  tempId?: string;
  id: number;
}
interface Epreuve {
  id: number;
  nom: string;
  date: Date;
  jour: string;
  heure: string;
  tableau: string;
  categorie?: string | null | undefined;
  minPoints?: number | null | undefined;
  maxPoints?: number | null | undefined;
  prixAnticipe: number | null | undefined;
  prixSurPlace: number | null | undefined;
  placesMax: number | null | undefined;
  etat: EtatEvent;
  tournoiId: number;
}

interface InitialData {
  nom: string;
  lieu: string;
  afficheUrl: string;
  description: string;
  responsableNom: string;
  responsableTelephone: string;
  responsableEmail: string;
  statut: string;
  startDate?: string;
  endDate?: string;
  epreuves: Epreuve[];
}

export default function EditTournoiForm({
  tournoiId,
  initialData,
}: {
  tournoiId: number;
  initialData: InitialData;
}) {
  const [formData, setFormData] = useState(initialData);
  const [startDate, setStartDate] = useState<Date | undefined>(
    initialData.startDate ? new Date(initialData.startDate) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    initialData.endDate ? new Date(initialData.endDate) : undefined
  );
  const [epreuves, setEpreuves] = useState<EpreuveFormData[]>(
    initialData.epreuves.map((ep) => ({
      nom: ep.nom,
      jour: ep.jour,
      heure: ep.heure,
      categorie: ep.categorie ?? "", // Ensure categorie is always a string
      maxPoints: ep.maxPoints?.toString() ?? "", // Convert to string
      minPoints: ep.minPoints?.toString() ?? "", // Convert to string
      id: ep.id, // Conserve l'ID pour les épreuves existantes
    }))
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEpreuveChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const updatedEpreuves = [...epreuves];
    updatedEpreuves[index] = { ...updatedEpreuves[index], [name]: value };
    setEpreuves(updatedEpreuves);
  };

  const handleAddEpreuve = () => {
    setEpreuves([
      ...epreuves,
      {
        tempId: uuidv4(),
        maxPoints: "",
        minPoints: "",
        categorie: "",
        nom: "",
        jour: "",
        heure: "",
        id: 0,
      },
    ]);
  };

  const handleRemoveEpreuve = (index: number) => {
    const updatedEpreuves = epreuves.filter((_, i) => i !== index);
    setEpreuves(updatedEpreuves);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const bodyToSend = {
      ...formData,
      startDate: startDate?.toISOString() ?? null,
      endDate: endDate?.toISOString() ?? null,
      epreuves: epreuves.map((epreuve) => {
        return { ...epreuve };
      }),
    };

    try {
      const response = await fetch(`/api/tournois/${tournoiId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyToSend),
      });

      console.log("Réponse complète de l'API:", response);

      if (response.ok) {
        console.log("Mise à jour réussie");
        toast.success("Mise à jour réussie");
      } else {
        console.error(
          "Erreur lors de la mise à jour du tournoi. Statut:",
          response.status
        );
        try {
          const errorBody = await response.json();
          console.error("Corps de l'erreur (JSON):", errorBody);
        } catch {
          try {
            const errorText = await response.text();
            console.error("Corps de l'erreur (Texte):", errorText);
          } catch {
            console.error("Impossible de lire le corps de la réponse.");
          }
        }
        toast.error("Erreur lors de la mise à jour.");
      }
    } catch (error) {
      console.error("Erreur inattendue lors de la requête:", error);
      toast.error("Une erreur inattendue s'est produite.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardContent className="space-y-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <Label htmlFor="nom">Nom du tournoi</Label>
            <Input
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              className="mt-2"
            />
          </div>
          <div className="flex-1">
            <Label>Lieu</Label>
            <Input
              type="text"
              name="lieu"
              value={formData.lieu}
              onChange={handleChange}
              className="mt-2"
            />
          </div>
        </div>
        <div className="gap-4 flex">
          <div className="flex-1">
            <div className="flex justify-between">
              <Label>
                Date de début
                {startDate && (
                  <p className="text-sm text-muted-foreground">
                    <Badge variant={"secondary"} className="text-md">
                      {format(startDate, "PPP", { locale: fr })}
                    </Badge>
                  </p>
                )}
              </Label>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal mt-2"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? (
                    format(startDate, "PPP", { locale: fr })
                  ) : (
                    <span>Sélectionner une date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  locale={fr}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex-1">
            <div className="flex justify-between">
              <Label>
                Date de fin
                {endDate && (
                  <p className="text-sm text-muted-foreground">
                    <Badge variant={"secondary"} className="text-md">
                      {format(endDate, "PPP", { locale: fr })}
                    </Badge>
                  </p>
                )}
              </Label>
            </div>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal mt-2"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? (
                    format(endDate, "PPP", { locale: fr })
                  ) : (
                    <span>Sélectionner une date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  locale={fr}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <Label htmlFor="afficheUrl">Affiche du tournoi</Label>
            <Input
              placeholder="Adresse url de l'affiche"
              className="mt-2"
              id="afficheUrl"
              name="afficheUrl"
              value={formData.afficheUrl}
              onChange={handleChange}
              type="url"
            />
          </div>
          <div className="flex-1">
            <Label htmlFor="reglement">Règlement du tournoi (PDF)</Label>
            <Input className="mt-2" id="reglement" type="file" accept=".pdf" />
          </div>
        </div>
        <div>
          <Label className="block mb-1 font-semibold">Description</Label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <Separator />
        <h2 className="font-semibold">Contact de l’organisateur</h2>
        <div className="flex gap-4">
          <div className="flex-1">
            <Label>Nom du responsable</Label>
            <Input
              type="text"
              name="responsableNom"
              value={formData.responsableNom}
              onChange={handleChange}
              className="mt-2"
            />
          </div>
          <div className="flex-1">
            <Label>Email du responsable</Label>
            <Input
              type="text"
              name="responsableEmail"
              value={formData.responsableEmail}
              onChange={handleChange}
              className="mt-2"
            />
          </div>
          <div className="flex-1">
            <Label>Telephone du responsable</Label>
            <Input
              type="text"
              name="responsableTelephone"
              value={formData.responsableTelephone}
              onChange={handleChange}
              className="mt-2"
            />
          </div>
        </div>
        {/* Edition des épreuves */}
        <div className="">
          <h2 className="font-semibold mt-4 flex items-center justify-between">
            Épreuves
          </h2>

          {epreuves.map((epreuve, index) => (
            <EpreuveForm
              key={epreuve.tempId || epreuve.id}
              epreuve={{
                ...epreuve,
                minPoints: epreuve.minPoints
                  ? parseInt(epreuve.minPoints, 10)
                  : undefined,
                maxPoints: epreuve.maxPoints
                  ? parseInt(epreuve.maxPoints, 10)
                  : undefined,
              }}
              index={index}
              onChange={handleEpreuveChange}
              onRemove={handleRemoveEpreuve}
            />
          ))}
          <div className="flex justify-center relative">
            <Button
              className="rounded-full bg-accent cursor-pointer absolute -top-10 opacity-0 hover:opacity-100"
              type="button"
              size="icon"
              onClick={handleAddEpreuve}
            >
              <Plus />
            </Button>
          </div>
        </div>
        <div className="justify-between flex">
          <Button className="" type="submit">
            modifier
          </Button>
          <ButtonGroup
            tournoiId={tournoiId.toString()}
            currentStatut={
              formData.statut === "BROUILLON" ? "Brouillon" : "Publié"
            }
          />
        </div>
      </CardContent>
    </form>
  );
}
