"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { EditJoueur, Epreuve } from "@/types/engagement";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

// Fonction utilitaire pour fetch les épreuves
async function fetchEpreuves(tournoiId: number): Promise<Epreuve[]> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/epreuves?tournoiId=${tournoiId}`,
    { cache: "no-store" }
  );
  if (!response.ok)
    throw new Error("Erreur lors de la récupération des épreuves");
  // Attention à ton API : si tu retournes {epreuves: Epreuve[]} alors retourne data.epreuves, sinon juste data
  const data = await response.json();
  return Array.isArray(data) ? data : data.epreuves ?? [];
}

type Props = {
  joueur: EditJoueur;
  open: boolean;
  onSave: (data: EditJoueur) => void;
  onRemoveEpreuve?: (id: number) => void;
  onClose: () => void;
  tournoiId: number;
  setSelectedTournoiId?: React.Dispatch<React.SetStateAction<number | null>>;
  allTournois: { id: number; nom: string }[];
};

export function EditJoueurForm({
  joueur,
  open,
  onSave,
  onClose,
  allTournois,
}: Props) {
  const [epreuves, setEpreuves] = useState<Epreuve[]>([]);
  const [form, setForm] = useState<EditJoueur>({ ...joueur });

  // Liste unique des tournois pour le sélecteur
  // const tournois = form.engagements.map((e) => ({ id: e.id, nom: e.tournoi }));
  // Liste unique des tournois pour le sélecteur : prend tous les tournois disponibles
  const tournoisUniques = (allTournois ?? []).map((t) => ({
    id: t.id,
    nom: t.nom,
  }));
  // const tournoisUniques = tournois.filter(
  //   (t, idx, arr) => arr.findIndex((tt) => tt.id === t.id) === idx
  // );
  // Sélection courante
  const [selectedTournoiId, setSelectedTournoiId] = useState<string>(
    tournoisUniques.length > 0 ? String(tournoisUniques[0].id) : ""
  );

  // Engagement du tournoi sélectionné
  const engagementActuel = form.engagements.find(
    (e) => e.id === Number(selectedTournoiId)
  );

  // Récupère les épreuves du tournoi sélectionné
  useEffect(() => {
    if (!selectedTournoiId) return;
    fetchEpreuves(Number(selectedTournoiId)).then((data) => setEpreuves(data));
  }, [selectedTournoiId]);

  // Toutes les épreuves déjà engagées tous tournois confondus
  const tableauxEngages = form.engagements.flatMap((e) =>
    e.epreuves.map((ep) => ep.tableau)
  );

  // Epreuves possibles = non engagées, dans la plage de points
  const epreuvesPossibles = epreuves.filter(
    (ep) =>
      !tableauxEngages.includes(ep.tableau) &&
      form.points >= ep.minPoints &&
      form.points <= ep.maxPoints
  );

  // Ajouter une épreuve à l'engagement du tournoi sélectionné
  const handleAddEpreuve = (ep: Epreuve) => {
    setForm((prev) => {
      const updated = { ...prev };
      const idTournoi = Number(selectedTournoiId);
      const engIdx = updated.engagements.findIndex((e) => e.id === idTournoi);
      if (engIdx >= 0) {
        const dejaEngage = updated.engagements[engIdx].epreuves.some(
          (ee) => ee.tableau === ep.tableau && ee.categorie === ep.categorie
        );
        if (!dejaEngage) {
          updated.engagements[engIdx].epreuves.push({
            tableau: ep.tableau,
            categorie: ep.categorie,
            id: ep.id,
          });
        }
      } else {
        updated.engagements.push({
          id: idTournoi,
          tournoi:
            tournoisUniques.find((t) => Number(t.id) === idTournoi)?.nom ?? "",
          epreuves: [
            { tableau: ep.tableau, categorie: ep.categorie, id: ep.id },
          ],
        });
      }
      return updated;
    });
  };
  const handleRemoveEpreuve = (idToRemove: number) => {
    setForm((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        engagements: prev.engagements.map((e) =>
          e.id === Number(selectedTournoiId)
            ? {
                ...e,
                epreuves: e.epreuves.filter((ep) => ep.id !== idToRemove),
              }
            : e
        ),
      };
    });
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg w-full">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Modifier le joueur</DialogTitle>
            <DialogDescription>
              Modifiez les engagements de ce joueur.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {/* Infos joueur (readonly) */}
            <Label>Nom</Label>
            <div>{form.nom}</div>
            <Label>Prénom</Label>
            <div>{form.prenom}</div>
            <Label>Licence</Label>
            <div>{form.licence}</div>
            <Label>Points</Label>
            <div>{form.points}</div>
          </div>
          <Separator className="my-4" />
          {/* --- Sélecteur tournoi --- */}
          <div className="mb-4">
            <Label className="font-semibold mb-2">Tournoi</Label>
            <Select
              value={selectedTournoiId}
              onValueChange={setSelectedTournoiId}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionne un tournoi" />
              </SelectTrigger>
              <SelectContent>
                {tournoisUniques.map((t) => (
                  <SelectItem key={t.id} value={String(t.id)}>
                    {t.nom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Engagements du tournoi sélectionné */}
          {engagementActuel && (
            <div>
              <div className=" ">
                {engagementActuel && (
                  <div>
                    <div className="font-semibold mb-2">Engagements</div>
                    <div className="flex flex-wrap gap-2">
                      {engagementActuel.epreuves.map((ep, idx) => (
                        <Badge
                          variant={"secondary"}
                          key={ep.id ?? ep.tableau + (ep.categorie || "") + idx}
                          className="flex items-center pr-6 relative py-2"
                        >
                          <span>
                            {ep.tableau}
                            {ep.categorie && ` (${ep.categorie})`}
                          </span>
                          {handleRemoveEpreuve && (
                            <Button
                              size="icon"
                              type="button"
                              variant="ghost"
                              className="!absolute right-0 top-1/2 -translate-y-1/2 h-5 w-5 p-0 rounded-full"
                              onClick={() => handleRemoveEpreuve(ep.id)}
                              tabIndex={-1}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          {/* Ajout des épreuves possibles */}
          <div className="mt-6">
            <div className="font-semibold mb-2">
              Ajouter une épreuve possible
            </div>
            {epreuvesPossibles.length === 0 ? (
              <div className="text-muted-foreground text-sm">
                Aucune épreuve supplémentaire possible.
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {epreuvesPossibles.map((ep) => (
                  <Button
                    key={ep.id}
                    size={"sm"}
                    type="button"
                    variant="outline"
                    onClick={() => handleAddEpreuve(ep)}
                  >
                    {ep.tableau}
                    {ep.categorie && (
                      <span className="ml-1 text-xs">({ep.categorie})</span>
                    )}
                  </Button>
                ))}
              </div>
            )}
          </div>
          <DialogFooter className="gap-2 mt-6">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Annuler
              </Button>
            </DialogClose>
            <Button type="submit" variant="default">
              Enregistrer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
