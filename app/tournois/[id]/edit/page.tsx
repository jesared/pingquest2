"use client";
import { ButtonGroup } from "@/app/components/ButtonStatutTournoi";
// app/components/EditTournoi.tsx
import DateRangeDisplay from "@/app/components/DateRangeDisplay";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Edit2,
  MoreVertical,
  Plus,
  Trash,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

const EditTournoi = () => {
  const params = useParams();
  const tournoiId = Number(params.id);

  const [openStartDatePopover, setOpenStartDatePopover] = useState(false);
  const [openEndDatePopover, setOpenEndDatePopover] = useState(false);
  const [openPopover, setOpenPopover] = useState(false);
  const [epreuveEditingId, setEpreuveEditingId] = useState<
    string | number | null
  >(null);
  // const [isEditPopoverOpen, setIsEditPopoverOpen] = useState(false);
  const isStringValid = (v: unknown) =>
    typeof v === "string" && v.trim() !== "";

  const {
    formValues,
    updateField,
    handleNewEpreuveChange,
    newEpreuve,
    addEpreuve,
    deleteEpreuve,
    isFormModified,
    handleSubmit,
    isSubmitting,
    updateEpreuveField,
    duplicateEpreuve,
    jours,
    loading,
    // error,
    setStartDate,
    setEndDate,
    setNewEpreuve,
  } = useEditTournoiForm(tournoiId);

  const epreuves = formValues.epreuves;

  if (loading) return <p>Chargement...</p>;

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
      <div className="flex justify-between  mb-2">
        <h1 className="text-2xl font-bold">Modifier votre tournoi</h1>
        <div className="justify-end flex space-x-2">
          {(formValues.id ?? tournoiId) && (
            <ButtonGroup
              tournoiId={(formValues.id ?? tournoiId).toString()}
              currentStatut={
                formValues?.statut === "BROUILLON" ? "Brouillon" : "Publié"
              }
            />
          )}
          <Link href={`/tournois/${tournoiId}`}>
            <Button variant={"ghost"} className="rounded-full cursor-pointer">
              <Binoculars />
              Voir votre tournoi
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="nom">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="nom">Infos</TabsTrigger>
          <TabsTrigger value="dates">Dates</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="fichiers">Fichiers</TabsTrigger>
          <TabsTrigger value="epreuves">Epreuves</TabsTrigger>
        </TabsList>

        <TabsContent value="nom">
          <Card>
            <CardHeader>
              <CardTitle>Nom, lieu et Description</CardTitle>
              <CardDescription>
                Merci d&apos;indiquer le <strong>nom officiel</strong> du
                tournoi, le <strong>lieu précis</strong> de déroulement des
                épreuves, ainsi qu&apos;une <strong>description</strong>{" "}
                permettant de contextualiser l&apos;événement (format, public
                visé, cadre...).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nom">Nom du tournoi</Label>
                <Input
                  className="placeholder:text-gray-400 mt-2 "
                  id="nom"
                  placeholder="Ex : Tournoi National de Printemps"
                  value={formValues.nom}
                  onChange={(e) => updateField("nom", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lieu">Lieu</Label>
                <Input
                  className="placeholder:text-gray-400 mt-2 "
                  id="lieu"
                  placeholder="Ex : Salle Jean Moulin, Reims"
                  value={formValues.lieu}
                  onChange={(e) => updateField("lieu", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  className="placeholder:text-gray-400 mt-2 "
                  id="description"
                  placeholder="Décrivez ici l'ambiance du tournoi, le public attendu ou toute information complémentaire."
                  rows={4}
                  value={formValues.description}
                  onChange={(e) => updateField("description", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dates">
          <Card>
            <CardHeader>
              <CardTitle>Dates du tournoi</CardTitle>
              <CardDescription>
                Sélectionnez les dates de début et de fin pendant lesquelles se
                dérouleront les épreuves. La date de fin doit être égale ou
                postérieure à la date de début.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="mt-1">
                  <DateRangeDisplay
                    startDate={formValues.startDate}
                    endDate={formValues.endDate}
                  />
                </div>
              </div>

              {/* Date de début */}
              <div className="space-y-2">
                <Label htmlFor="startDate">Date de début</Label>
                <Popover
                  open={openStartDatePopover}
                  onOpenChange={setOpenStartDatePopover}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
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

              {/* Date de fin */}
              <div className="space-y-2">
                <Label htmlFor="endDate">Date de fin</Label>
                <Popover
                  open={openEndDatePopover}
                  onOpenChange={setOpenEndDatePopover}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
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
                        const today = new Date(new Date().setHours(0, 0, 0, 0));
                        if (formValues.startDate) {
                          return date < today || date < formValues.startDate;
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
            <CardHeader>
              <CardTitle>Coordonnées de contact</CardTitle>
              <CardDescription>
                Merci de renseigner les informations du responsable du tournoi.
                Ces coordonnées seront utilisées en cas de besoin pour contacter
                l&apos;organisation.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="responsableNom">Nom du responsable</Label>
                <Input
                  className="placeholder:text-gray-400 mt-2 "
                  id="responsableNom"
                  value={formValues.responsableNom}
                  onChange={(e) =>
                    updateField("responsableNom", e.target.value)
                  }
                  placeholder="Ex : Jean Dupont"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Adresse email</Label>
                <Input
                  className="placeholder:text-gray-400 mt-2 "
                  id="email"
                  type="email"
                  value={formValues.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  placeholder="Ex : tournoi@email.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telephone">Téléphone</Label>
                <Input
                  className="placeholder:text-gray-400 mt-2 "
                  id="telephone"
                  type="tel"
                  value={formValues.telephone}
                  onChange={(e) => updateField("telephone", e.target.value)}
                  placeholder="Ex : 06 12 34 56 78"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fichiers">
          <Card>
            <CardHeader>
              <CardTitle>Documents du tournoi</CardTitle>
              <CardDescription>
                Ajoutez les documents nécessaires au bon déroulement de votre
                tournoi : une affiche officielle (image) et un règlement (PDF).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="affiche">Affiche du tournoi</Label>
                {formValues.afficheUrl ? (
                  <div className="rounded border p-2 w-fit">
                    <Image
                      src={formValues.afficheUrl}
                      alt="Affiche du tournoi"
                      className="max-w-xs rounded shadow"
                    />
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Aucune affiche ajoutée pour le moment.
                  </p>
                )}
                {/* Input upload à venir */}
                <Input
                  type="file"
                  id="affiche"
                  disabled
                  placeholder="(à venir)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reglement">Règlement du tournoi (PDF)</Label>
                {formValues.reglementUrl ? (
                  <a
                    href={formValues.reglementUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline text-sm"
                  >
                    Télécharger le règlement existant
                  </a>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Aucun règlement ajouté pour le moment.
                  </p>
                )}
                {/* Input upload à venir */}
                <Input
                  type="file"
                  id="reglement"
                  disabled
                  placeholder="(à venir)"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="epreuves">
          <Card>
            <CardHeader>
              <CardTitle>Épreuves</CardTitle>
              <CardDescription>
                Créez les épreuves qui composeront votre tournoi. Indiquez le
                nom, la catégorie, le jour et l’heure, ainsi que les tarifs
                anticipés et sur place.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Ajout d’une nouvelle épreuve */}
              <Popover open={openPopover} onOpenChange={setOpenPopover}>
                <PopoverTrigger asChild>
                  <Button size="icon" className="rounded-full cursor-pointer">
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
                      placeholder="Ex : A"
                      value={newEpreuve.nom}
                      onChange={(e) =>
                        handleNewEpreuveChange("nom", e.target.value)
                      }
                    />

                    <Label>Catégorie</Label>
                    <Input
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
                      onValueChange={(jour) =>
                        setNewEpreuve({ ...newEpreuve, jour })
                      }
                    >
                      <SelectTrigger className="w-full">
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
                      type="time"
                      value={newEpreuve.heure}
                      onChange={(e) =>
                        setNewEpreuve({ ...newEpreuve, heure: e.target.value })
                      }
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label>Points min</Label>
                        <Input
                          type="number"
                          value={newEpreuve.minPoints}
                          onChange={(e) =>
                            setNewEpreuve({
                              ...newEpreuve,
                              minPoints: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label>Points max</Label>
                        <Input
                          type="number"
                          value={newEpreuve.maxPoints}
                          onChange={(e) =>
                            setNewEpreuve({
                              ...newEpreuve,
                              maxPoints: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <Label>Tarif anticipé (€)</Label>
                    <Input
                      type="number"
                      value={newEpreuve.tarif}
                      onChange={(e) =>
                        setNewEpreuve({ ...newEpreuve, tarif: e.target.value })
                      }
                    />

                    <Label>Tarif sur place (€)</Label>
                    <Input
                      type="number"
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
                        newEpreuve.tarif === "" ||
                        newEpreuve.tarifPlace === ""
                      }
                    >
                      Ajouter
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Tableau des épreuves existantes */}
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
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {epreuves.map((e) => (
                        <TableRow key={e.id ?? e.idLocal}>
                          <TableCell>
                            <strong>{e.nom}</strong> - {e.categorie}
                          </TableCell>
                          <TableCell>
                            {e.jour} à {e.heure}
                          </TableCell>
                          <TableCell className="text-right text-primary font-medium">
                            {" "}
                            {!e.tarif ||
                            isNaN(Number(e.tarif)) ||
                            Number(e.tarif) === 0
                              ? "Gratuit"
                              : `${e.tarif} €`}
                          </TableCell>
                          <TableCell className="text-right text-primary font-medium">
                            {!e.tarifPlace ||
                            isNaN(Number(e.tarifPlace)) ||
                            Number(e.tarifPlace) === 0
                              ? "Gratuit"
                              : `${e.tarifPlace} €`}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem
                                  onClick={() =>
                                    duplicateEpreuve((e.id ?? e.idLocal)!)
                                  }
                                >
                                  <Plus className="mr-2 h-4 w-4 text-blue-600" />
                                  <span className="text-blue-600">
                                    Dupliquer
                                  </span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setEpreuveEditingId((e.id ?? e.idLocal)!);
                                    // setIsEditPopoverOpen(true);
                                  }}
                                >
                                  <Edit2 className="mr-2 h-4 w-4 text-yellow-600" />
                                  <span className="text-yellow-600">
                                    Modifier
                                  </span>
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                  onClick={() => {
                                    const id = e.id ?? e.idLocal;
                                    if (typeof id === "number") {
                                      askDelete(id); // OK, c’est un nombre
                                    }
                                  }}
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
                  {epreuveEditingId && (
                    <div className="fixed top-0 left-0 w-full h-full z-40">
                      <div
                        className="absolute top-20 right-10 z-50 w-[350px] bg-white p-4 rounded-lg shadow-lg border space-y-4"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <h4 className="text-sm font-medium">
                          Modifier l’épreuve
                        </h4>
                        {(() => {
                          const current = epreuves.find(
                            (e) => (e.id ?? e.idLocal) === epreuveEditingId
                          );
                          if (!current) return null;

                          return (
                            <div className="grid gap-2">
                              <Label>Nom</Label>
                              <Input
                                value={current.nom}
                                onChange={(e) =>
                                  updateEpreuveField(
                                    epreuveEditingId,
                                    "nom",
                                    e.target.value
                                  )
                                }
                              />
                              <Label>Catégorie</Label>
                              <Input
                                value={
                                  typeof current.categorie === "string"
                                    ? current.categorie
                                    : ""
                                }
                                onChange={(e) =>
                                  updateEpreuveField(
                                    epreuveEditingId,
                                    "categorie",
                                    e.target.value
                                  )
                                }
                              />
                              <Label>Jour</Label>
                              <Select
                                value={current.jour}
                                onValueChange={(val) =>
                                  updateEpreuveField(
                                    epreuveEditingId,
                                    "jour",
                                    val
                                  )
                                }
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Jour" />
                                </SelectTrigger>
                                <SelectContent>
                                  {jours.map((jour) => (
                                    <SelectItem key={jour} value={jour}>
                                      {jour}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Label>Heure</Label>
                              <Input
                                type="time"
                                value={current.heure}
                                onChange={(e) =>
                                  updateEpreuveField(
                                    epreuveEditingId,
                                    "heure",
                                    e.target.value
                                  )
                                }
                              />
                              <Label>Tarif anticipé (€)</Label>
                              <Input
                                type="number"
                                value={
                                  typeof current.tarif === "string" ||
                                  typeof current.tarif === "number"
                                    ? current.tarif
                                    : ""
                                }
                                onChange={(e) =>
                                  updateEpreuveField(
                                    epreuveEditingId,
                                    "tarif",
                                    e.target.value
                                  )
                                }
                              />
                              <Label>Tarif sur place (€)</Label>
                              <Input
                                type="number"
                                value={
                                  typeof current.tarifPlace === "string" ||
                                  typeof current.tarifPlace === "number"
                                    ? current.tarifPlace
                                    : ""
                                }
                                onChange={(e) =>
                                  updateEpreuveField(
                                    epreuveEditingId,
                                    "tarifPlace",
                                    e.target.value
                                  )
                                }
                              />

                              <Button
                                onClick={() => setEpreuveEditingId(null)}
                                className="w-full"
                                disabled={
                                  !isStringValid(current.nom) ||
                                  !isStringValid(current.categorie) ||
                                  !isStringValid(current.jour) ||
                                  !isStringValid(current.heure) ||
                                  current.tarif === "" ||
                                  current.tarifPlace === ""
                                }
                              >
                                Modifier
                              </Button>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <div className="justify-center flex mx-auto mt-3">
        <Button
          onClick={handleSubmit}
          disabled={!isFormModified || isSubmitting}
        >
          {isSubmitting ? "Enregistrement..." : "Sauvegarder les modifications"}
        </Button>
      </div>
    </div>
  );
};
export default EditTournoi;
