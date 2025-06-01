"use client";

import DateRangeDisplay from "@/app/components/DateRangeDisplay";
import { DeleteDialog } from "@/app/components/DeleteDialog";
import GenererJoursTournoi from "@/app/components/GenererJoursTournoi";
import UploadAffiche from "@/app/components/UploadAffiche";
import UploadDocument from "@/app/components/UploadDocument";
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
import { useDeleteDialog } from "@/hooks/useDeleteDialog";
import { useUser } from "@clerk/nextjs";
import confetti from "canvas-confetti";
import { format } from "date-fns";
import {
  CalendarIcon,
  FileImage,
  FileText,
  MoreVertical,
  Plus,
  Trash,
} from "lucide-react";
import { redirect } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type Epreuve = {
  nom: string;
  categorie: string;
  minPoints: string;
  maxPoints: string;
  jour: string;
  heure: string;
  tarif: string;
  tarifPlace: string;
};

export default function MakeTournoi() {
  const { user } = useUser();
  const userId = user?.id;

  const [openPopover, setOpenPopover] = useState(false);
  const [openStartDatePopover, setOpenStartDatePopover] = useState(false);
  const [openEndDatePopover, setOpenEndDatePopover] = useState(false);

  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [epreuves, setEpreuves] = useState<Epreuve[]>([]);

  const [newEpreuve, setNewEpreuve] = useState({
    nom: "",
    categorie: "",
    jour: "",
    heure: "",
    minPoints: "",
    maxPoints: "",
    tarif: "",
    tarifPlace: "",
  });
  // États pour les champs du formulaire principal
  const [nom, setNom] = useState("");
  const [lieu, setLieu] = useState("");
  const [description, setDescription] = useState("");
  const [responsableNom, setResponsableNom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [reglementUrl, setReglementUrl] = useState("");
  const [afficheUrl, setAfficheUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !nom ||
      !lieu ||
      // !description ||
      !responsableNom ||
      !email ||
      !telephone ||
      !startDate ||
      !endDate ||
      epreuves.length === 0 ||
      !epreuves.every(
        (ep) =>
          ep.nom &&
          ep.jour &&
          ep.heure &&
          ep.categorie &&
          ep.tarif !== undefined &&
          ep.tarif !== "" &&
          ep.tarifPlace !== undefined &&
          ep.tarifPlace !== ""
      )
    ) {
      toast.error(
        "Veuillez remplir tous les champs obligatoires et ajouter au moins une épreuve valide."
      );
      return;
    }

    const payload = {
      nom,
      lieu,
      description,
      responsableNom,
      email,
      telephone,
      afficheUrl,
      reglementUrl,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      epreuves,
      userId,
    };

    const res = await fetch("/api/tournois", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const json = await res.json();
      toast.success("Tournoi créé !");
      confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
      redirect("/dashboard/tournois");
      console.log(json);
    } else {
      const errorData = await res.json();
      toast.error(
        `Erreur lors de la création du tournoi: ${
          errorData?.message || "Une erreur inconnue s'est produite."
        }`
      );
      console.error("Erreur lors de la création du tournoi", errorData);
    }
  };

  const handleAddEpreuve = () => {
    if (
      newEpreuve.nom &&
      newEpreuve.jour &&
      newEpreuve.heure &&
      newEpreuve.categorie &&
      newEpreuve.tarif !== undefined &&
      newEpreuve.tarif !== "" &&
      newEpreuve.tarifPlace !== undefined &&
      newEpreuve.tarifPlace !== ""
    ) {
      setEpreuves((prev) => [...prev, { ...newEpreuve }]);
      setNewEpreuve({
        nom: "",
        categorie: "",
        jour: "",
        heure: "",
        minPoints: "",
        maxPoints: "",
        tarif: "",
        tarifPlace: "",
      });
      setOpenPopover(false); // Fermer le Popover après l'ajout
    } else {
      toast.error("Veuillez remplir tous les champs de l'épreuve.");
    }
  };

  const handleDelete = (epreuveToDelete: Epreuve) => {
    setEpreuves((prev) => prev.filter((e) => e !== epreuveToDelete));
    cancel(); // referme le dialog si tu utilises un hook comme useDeleteDialog
  };

  const isFormValid = () => {
    return !!(
      nom?.trim() &&
      lieu?.trim() &&
      description?.trim() &&
      responsableNom?.trim() &&
      email?.trim() &&
      telephone?.trim() &&
      startDate &&
      endDate &&
      epreuves.length > 0 &&
      epreuves.every(
        (e) =>
          e.nom?.trim() &&
          e.jour?.trim() &&
          e.heure?.trim() &&
          e.categorie?.trim() &&
          e.tarif !== undefined &&
          e.tarif !== "" &&
          !isNaN(parseFloat(e.tarif)) &&
          e.tarifPlace !== undefined &&
          e.tarifPlace !== "" &&
          !isNaN(parseFloat(e.tarifPlace))
      )
    );
  };
  const { isOpen, askDelete, cancel, confirm } = useDeleteDialog<Epreuve>();
  const jours =
    startDate && endDate ? GenererJoursTournoi(startDate, endDate) : [];

  return (
    <div className="@max-xs:w-full max-w-3xl mx-auto py-10 px-4">
      <DeleteDialog
        isOpen={isOpen}
        onCancel={cancel}
        onConfirm={() => {
          const epreuve = confirm();
          if (epreuve) {
            handleDelete(epreuve);
          }
        }}
      />

      <div className="flex justify-between  mb-6">
        <h1 className="text-2xl font-bold">Ajouter votre tournoi</h1>
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
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label htmlFor="nom">Nom du tournoi</Label>
                <Input
                  className="placeholder:text-gray-400 mt-2 "
                  id="nom"
                  name="nom"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  placeholder="Ex : Tournoi National de Printemps"
                />
              </div>
              <div className="space-y-4">
                <Label htmlFor="lieu">Lieu</Label>
                <Input
                  className="placeholder:text-gray-400 mt-2 "
                  id="lieu"
                  name="lieu"
                  value={lieu}
                  onChange={(e) => setLieu(e.target.value)}
                  placeholder="Ex : Salle Jean Moulin, Reims"
                />
              </div>
              <div className="space-y-4">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  className="placeholder:text-gray-400 mt-2 "
                  id="description"
                  placeholder="Décrivez ici l'ambiance du tournoi, le public attendu ou toute information complémentaire."
                  rows={4}
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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
            <CardContent className="space-y-6">
              <div>
                <div className="mt-1">
                  <DateRangeDisplay startDate={startDate} endDate={endDate} />
                </div>
              </div>
              <div className="space-y-4">
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
                      {startDate ? (
                        format(startDate, "dd/MM/yyyy")
                      ) : (
                        <span>Sélectionner une date de début</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => {
                        setStartDate(date);

                        if (endDate && date && endDate < date) {
                          setEndDate(undefined);
                        }
                        setOpenStartDatePopover(false); // Fermer après sélection
                      }}
                      disabled={(date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-4">
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
                      {endDate ? (
                        format(endDate, "dd/MM/yyyy")
                      ) : (
                        <span>Sélectionner une date de fin</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={(date) => {
                        setEndDate(date);
                        setOpenEndDatePopover(false); // Fermer après sélection
                      }}
                      initialFocus
                      disabled={(date) => {
                        const today = new Date(new Date().setHours(0, 0, 0, 0));
                        if (startDate) {
                          return date < today || date < startDate;
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
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>Nom de l&apos;organisateur</Label>
                <Input
                  name="responsableNom"
                  className="placeholder:text-gray-400 mt-2 "
                  type="text"
                  placeholder="Ex : Jean Dupont"
                  value={responsableNom}
                  onChange={(e) => setResponsableNom(e.target.value)}
                />
              </div>
              <div className="space-y-4">
                <Label>Email</Label>
                <Input
                  className="placeholder:text-gray-400 mt-2 "
                  type="email"
                  placeholder="Ex : tournoi@email.com"
                  value={email}
                  name="email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-4">
                <Label>Téléphone</Label>
                <Input
                  className="placeholder:text-gray-400 mt-2 "
                  type="tel"
                  placeholder="Ex : 06 12 34 56 78"
                  value={telephone}
                  name="telephone"
                  onChange={(e) => setTelephone(e.target.value)}
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
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 bg-gray-50 rounded-lg shadow-lg border p-6 flex flex-col items-center hover:bg-gray-100 transition">
                  <div className="flex items-center gap-2 mb-3">
                    <Label htmlFor="afficheUrl">
                      <FileImage />
                      <span className="font-bold text-md">
                        Affiche du tournoi
                      </span>
                    </Label>
                  </div>
                  <UploadAffiche onUpload={(url) => setAfficheUrl(url)} />
                </div>
                <div className="flex-1 bg-gray-50 rounded-lg shadow-lg border p-6 flex flex-col items-center hover:bg-gray-100 transition">
                  <div className="flex items-center gap-2 mb-3">
                  <Label htmlFor="reglement"><FileText />
                    <span className="font-bold text-md">
                      Règlement du tournoi
                    </span></Label>
                  </div>
                  <UploadDocument onUpload={setReglementUrl} />
                </div>
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
            <CardContent className="space-y-3">
              <Popover open={openPopover} onOpenChange={setOpenPopover}>
                <PopoverTrigger asChild>
                  <Button size={"sm"} className=" cursor-pointer">
                    <Plus />
                    Ajouter une épreuve
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
                        setNewEpreuve({
                          ...newEpreuve,
                          nom: e.target.value,
                        })
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
                      onClick={handleAddEpreuve}
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
                <div className="pt-4">
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
                                <DropdownMenuItem onClick={() => askDelete(e)}>
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
      <div className="justify-center flex mx-auto mt-3">
        <Button onClick={handleSubmit} disabled={!isFormValid()}>
          Créer le tournoi
        </Button>
      </div>
    </div>
  );
}
