"use client";
// app/components/EditTournoi.tsx
import DateRangeDisplay from "@/app/components/DateRangeDisplay";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useEditTournoiForm } from "@/hooks/useEditTournoiForm";
import { format } from "date-fns";
import {
  Binoculars,
  CalendarIcon,
  MoreVertical,
  Pencil,
  Plus,
  Trash,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const EditTournoi = () => {
  const params = useParams();
  const tournoiId = Number(params.id);

  const [openStartDatePopover, setOpenStartDatePopover] = useState(false);
  const [openEndDatePopover, setOpenEndDatePopover] = useState(false);
  const [openPopover, setOpenPopover] = useState(false);

  const {
    formValues,
    updateField,
    handleNewEpreuveChange,
    newEpreuve,
    addEpreuve,
    deleteEpreuve,
    isFormModified,
    isFormValid,
    jours,
    loading,
    // error,
    deletedEpreuves,
    setStartDate,
    setEndDate,
    setNewEpreuve,
  } = useEditTournoiForm(tournoiId);

  const epreuves = formValues.epreuves;

  if (loading) return <p>Chargement...</p>;
  // if (error) return <p>Erreur: {error}</p>;

  const handleSubmit = async () => {
    if (!isFormValid()) {
      toast.error("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const body = {
      ...formValues,
      deletedEpreuves,
    };

    try {
      const res = await fetch(`/api/tournois/${tournoiId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        throw new Error("Échec de la mise à jour.");
      }

      toast.success("Tournoi mis à jour avec succès !");
      // setIsFormModified(false);

      // Optionnel : redirection ou rafraîchissement
      // router.push(`/tournois/${tournoiId}`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(`Erreur : ${err.message}`);
      } else {
        toast.error("Une erreur inconnue s'est produite.");
      }
    }
  };

  const askDelete = (epreuve: number) => {
    const confirmed = window.confirm(
      "Êtes-vous sûr de vouloir supprimer cette épreuve ?"
    );

    if (confirmed) {
      deleteEpreuve(epreuve);
    }
  };

  return (
    <div className="@max-xs:w-full max-w-3xl mx-auto py-10 px-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <h1 className="text-2xl font-bold">Modifier votre tournoi</h1>
            <div className="justify-end">
              <Link href={`/tournois/${tournoiId}`}>
                <Button size={"icon"} className="rounded-full cursor-pointer">
                  <Binoculars />
                </Button>
              </Link>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs defaultValue="nom" className="">
            <TabsList className="mb-2">
              <TabsTrigger value="nom">Nom, lieu et Description</TabsTrigger>
              <TabsTrigger value="dates">Dates</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
              <TabsTrigger value="fichiers">Fichiers</TabsTrigger>
              <TabsTrigger value="epreuves">Epreuves</TabsTrigger>
            </TabsList>
            <TabsContent value="nom">
              <Card>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="nom">Nom du tournoi</Label>
                    <Input
                      value={formValues.nom}
                      onChange={(e) => updateField("nom", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lieu">Lieu</Label>
                    <Input
                      value={formValues.lieu}
                      onChange={(e) => updateField("lieu", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      value={formValues.description}
                      onChange={(e) =>
                        updateField("description", e.target.value)
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="dates">
              <Card>
                <CardContent className="space-y-3">
                  {/* Contenu de l'onglet Dates */}
                  <div className="mt-4">
                    <DateRangeDisplay
                      startDate={formValues.startDate}
                      endDate={formValues.endDate}
                    />{" "}
                  </div>
                  <div className="space-y-2">
                    <Label hidden>Date de début</Label>
                    <Popover
                      open={openStartDatePopover}
                      onOpenChange={setOpenStartDatePopover}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal mt-2"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />

                          {formValues.startDate ? (
                            format(formValues.startDate, "dd/MM/yyyy")
                          ) : (
                            <span>Sélectionner une date de début</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={formValues.startDate}
                          onSelect={(date) => {
                            setStartDate(date);
                            if (
                              formValues.endDate &&
                              date &&
                              formValues.endDate < date
                            ) {
                              setEndDate(undefined);
                            }
                            setOpenStartDatePopover(false);
                          }}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label hidden>Date de fin</Label>
                    <Popover
                      open={openEndDatePopover}
                      onOpenChange={setOpenEndDatePopover}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal mt-2"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formValues.endDate ? (
                            format(formValues.endDate, "dd/MM/yyyy")
                          ) : (
                            <span>Sélectionner une date de fin</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={formValues.endDate}
                          onSelect={(date) => {
                            setEndDate(date);
                            setOpenEndDatePopover(false);
                          }}
                          initialFocus
                          disabled={(date) => {
                            const today = new Date(
                              new Date().setHours(0, 0, 0, 0)
                            );
                            if (formValues.startDate) {
                              return (
                                date < today || date < formValues.startDate
                              );
                            }
                            return date < today;
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="contact">
              <Card>
                <CardContent>
                  <div className="space-y-2">
                    <Label>Nom de l&apos;organisateur</Label>
                    <Input
                      value={formValues.responsableNom}
                      onChange={(e) =>
                        updateField("responsableNom", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      value={formValues.email}
                      onChange={(e) => updateField("email", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Téléphone</Label>
                    <Input
                      value={formValues.telephone}
                      onChange={(e) => updateField("telephone", e.target.value)}
                    />
                  </div>{" "}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="fichiers">
              <Card>
                <CardContent>
                  {/* Contenu de l'onglet Fichiers */}
                  <p>Contenu de l&apos;onglet Fichiers</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="epreuves">
              <Card>
                <CardContent className="space-y-3">
                  <Popover open={openPopover} onOpenChange={setOpenPopover}>
                    <PopoverTrigger asChild>
                      <Button
                        size="icon"
                        className="rounded-full cursor-pointer"
                      >
                        <Plus />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      side="right"
                      sideOffset={20}
                      className="w-[350px] space-y-4"
                    >
                      <h4 className="text-sm font-medium">Nouvelle épreuve</h4>
                      <div className="grid gap-2">
                        <Label>Nom</Label>

                        <Input
                          className="placeholder:text-gray-400 "
                          placeholder="Ex : A"
                          value={newEpreuve.nom}
                          onChange={(e) =>
                            handleNewEpreuveChange("nom", e.target.value)
                          }
                        />
                        <Label>categorie</Label>
                        <Input
                          className="placeholder:text-gray-400 "
                          placeholder="Ex : NC - 1399 pts"
                          value={newEpreuve.categorie}
                          onChange={(e) =>
                            setNewEpreuve({
                              ...newEpreuve,
                              categorie: e.target.value,
                            })
                          }
                        />
                        <Label>Jour</Label>
                        <Select
                          onValueChange={(jourSelectionne) =>
                            setNewEpreuve({
                              ...newEpreuve,
                              jour: jourSelectionne,
                            })
                          }
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Jour" />
                          </SelectTrigger>
                          <SelectContent>
                            {jours.map((jour) => (
                              <SelectItem key={jour} value={jour}>
                                {jour.charAt(0).toUpperCase() + jour.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Label>Heure</Label>
                        <Input
                          className="placeholder:text-gray-400 "
                          type="time"
                          value={newEpreuve.heure}
                          onChange={(e) =>
                            setNewEpreuve({
                              ...newEpreuve,
                              heure: e.target.value,
                            })
                          }
                        />
                        <Label>Points minimum</Label>
                        <Input
                          className="placeholder:text-gray-400 "
                          type="number"
                          placeholder="Ex : 0 equivalent à NC"
                          value={newEpreuve.minPoints}
                          onChange={(e) =>
                            setNewEpreuve({
                              ...newEpreuve,
                              minPoints: e.target.value,
                            })
                          }
                        />
                        <Label>Points maximum</Label>
                        <Input
                          className="placeholder:text-gray-400 "
                          type="number"
                          placeholder="Ex : 1399"
                          value={newEpreuve.maxPoints}
                          onChange={(e) =>
                            setNewEpreuve({
                              ...newEpreuve,
                              maxPoints: e.target.value,
                            })
                          }
                        />
                        <Label>Tarifs anticipé (€)</Label>
                        <Input
                          className="placeholder:text-gray-400 "
                          type="number"
                          placeholder="Tarif anticipé (€)"
                          value={newEpreuve.tarif}
                          onChange={(e) =>
                            setNewEpreuve({
                              ...newEpreuve,
                              tarif: e.target.value,
                            })
                          }
                        />
                        <Label>Tarifs sur place (€)</Label>
                        <Input
                          className="placeholder:text-gray-400 "
                          type="number"
                          placeholder="Tarif sur place (€)"
                          value={newEpreuve.tarifPlace}
                          onChange={(e) =>
                            setNewEpreuve({
                              ...newEpreuve,
                              tarifPlace: e.target.value,
                            })
                          }
                        />
                        <Button
                          onClick={() => {
                            addEpreuve();
                            setOpenPopover(false);
                          }}
                          className="w-full mt-2"
                          disabled={
                            !newEpreuve.nom ||
                            !newEpreuve.jour ||
                            !newEpreuve.heure ||
                            newEpreuve.tarif === undefined ||
                            newEpreuve.tarif === "" ||
                            newEpreuve.tarifPlace === undefined ||
                            newEpreuve.tarifPlace === ""
                          }
                        >
                          Ajouter
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>

                  {epreuves.length > 0 && (
                    <div className="mt-4 border-t pt-4">
                      <h4 className="font-medium text-sm text-muted-foreground mb-2">
                        Résumé des épreuves :
                      </h4>
                      <Table>
                        <TableHeader className="bg-gray-100 text-xs">
                          <TableRow>
                            <TableHead>Nom & Catégorie</TableHead>
                            <TableHead>Jour / Heure</TableHead>

                            <TableHead className="text-right">
                              Tarif anticipé
                            </TableHead>
                            <TableHead className="text-right">
                              Tarif sur place
                            </TableHead>
                            <TableHead className="text-right">
                              Actions
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {epreuves.map((e, i) => (
                            <TableRow key={i}>
                              <TableCell>
                                <strong>{e.nom}</strong> - {e.categorie}
                              </TableCell>
                              <TableCell>
                                {e.jour} à {e.heure}
                              </TableCell>

                              <TableCell className="text-right text-primary font-medium">
                                {!e.tarif || parseFloat(e.tarif) === 0
                                  ? "Gratuit"
                                  : `${parseFloat(e.tarif).toFixed(2)} €`}
                              </TableCell>
                              <TableCell className="text-right text-primary font-medium">
                                {!e.tarifPlace || parseFloat(e.tarifPlace) === 0
                                  ? "Gratuit"
                                  : `${parseFloat(e.tarifPlace).toFixed(2)} €`}
                              </TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent>
                                    <DropdownMenuItem>
                                      <Pencil className="mr-2 h-4 w-4" />
                                      <span>Editer</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        e.id !== undefined && askDelete(e.id)
                                      }
                                    >
                                      <Trash className="mr-2 h-4 w-4 text-destructive" />
                                      <span className="text-red-600">
                                        Supprimer
                                      </span>
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          <Button
            onClick={handleSubmit}
            className="mt-6 w-full"
            disabled={!isFormModified}
          >
            Modifier le tournoi
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
export default EditTournoi;
