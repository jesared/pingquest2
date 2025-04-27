"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@clerk/nextjs";
import confetti from "canvas-confetti";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormData } from "../../types/form";
import ProgressBar from "./ProgressBar";

const steps = [
  { title: "Identité", description: "Informations personnelles" },
  { title: "Epreuves", description: "Choisissez un ou plusieurs tableaux" },
  { title: "Confirmation", description: "Vérification finale" },
];

export default function MultiStepForm() {
  const { user } = useUser(); // 👈 Récupération du currentUser Clerk
  const [step, setStep] = useState(1);
  const router = useRouter();
  const [loadingFftt, setLoadingFftt] = useState(false);
  const [licenceVerrouillee, setLicenceVerrouillee] = useState(false);

  interface Epreuve {
    categorie: string;
    tableau: string;
    id: string;
    nom: string;
    jour: string;
    minPoints: number;
    maxPoints: number;
    epreuves: string[];
  }
  const [successMessage, setSuccessMessage] = useState(false);

  const [epreuves, setEpreuves] = useState<Epreuve[]>([]);

  const fetchFromLicence = async () => {
    const licence = watch("numeroLicence");
    if (!licence) return;

    setLoadingFftt(true);

    try {
      const response = await fetch(`/api/fftt?licence=${licence}`);

      const data = await response.json();

      if (!response.ok) {
        // ⚡ Ici, si le serveur renvoie une erreur (400 ou 404)
        if (data.error) {
          toast.error(data.error); // 🔥 Affiche l'erreur en toast rouge
        } else {
          toast.error("Erreur inconnue lors de la recherche de la licence.");
        }
        return; // ❌ On stoppe ici !
      }

      if (data && data.nom && data.prenom) {
        // Mise à jour des champs du formulaire
        // Le setValue vient de react-hook-form
        setValue("nom", data.nom);
        setValue("prenom", data.prenom);
        setValue("club", data.club || "");
        setValue("pointsOfficiel", data.pointsOfficiel || "");
        setValue("dossard", data.dossard || "");

        setLicenceVerrouillee(true); // ➡️ On verrouille le champ
        toast.success(`Joueur trouvé : ${data.nom} ${data.prenom}`); // 🎉 Petit succès
      } else {
        toast.error("Joueur non trouvé avec cette licence.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la récupération des infos FFTT.");
    } finally {
      setLoadingFftt(false);
    }
  };

  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    mode: "onChange",
    defaultValues: {
      numeroLicence: "",
      dossard: "",
      nom: "",
      prenom: "",
      epreuves: [],
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    try {
      // Récupérer le dernier dossard existant
      const dossardResponse = await fetch("/api/dernier-dossard");
      const { dernierDossard } = await dossardResponse.json();

      const joueurData = {
        ...data,
        userClerkId: user?.id,
        dossard: (dernierDossard || 0) + 1, // s'il n'y a aucun dossard, on commence à 1
      };

      const response = await fetch("/api/joueurs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(joueurData),
      });

      if (response.ok) {
        confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
        // Affiche le message de succès
        setSuccessMessage(true);

        setTimeout(() => router.push("/dashboard/inscriptions"), 2000);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchEpreuves = async () => {
      try {
        const points = parseInt(watch("pointsOfficiel") || "0", 10);

        const res = await fetch("/api/epreuves"); // 👈 Ton endpoint API qui sort les épreuves
        const allEpreuves = await res.json();

        const accessibles = allEpreuves.filter(
          (e: { minPoints: number; maxPoints: number }) => {
            return points >= e.minPoints && points <= e.maxPoints;
          }
        );

        setEpreuves(accessibles);
      } catch (err) {
        console.error("Erreur chargement épreuves:", err);
      }
    };

    if (step === 2) {
      fetchEpreuves();
    }
  }, [step, watch]);

  const validateStep = async (nextStep: number) => {
    const fieldMap: Record<number, (keyof FormData)[]> = {
      1: ["numeroLicence", "nom", "prenom"],
      2: ["epreuves"],
    };

    const fieldsToValidate = fieldMap[step] || [];
    const isValid = await trigger(fieldsToValidate);

    if (step === 2) {
      const selectedEpreuves = watch("epreuves");
      console.log("selectedEpreuves:", selectedEpreuves);
      if (!selectedEpreuves || selectedEpreuves.length === 0) {
        toast.error(
          "Veuillez sélectionner au moins un tableau pour continuer."
        );
        return;
      }
    }

    if (isValid) setStep(nextStep);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {successMessage && (
        <div className="text-green-600 text-center font-bold text-xl mb-6">
          🎉 Inscription réussie ! Redirection en cours...
        </div>
      )}
      {!successMessage && (
        <>
          <ProgressBar currentStep={step} steps={steps} />
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {step === 1 && (
              <div className="space-y-4">
                <Input
                  {...register("numeroLicence")}
                  placeholder="Numéro de Licence"
                  required
                  readOnly={licenceVerrouillee}
                />
                {licenceVerrouillee && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setLicenceVerrouillee(false);
                      setValue("numeroLicence", ""); // On efface aussi la licence pour repartir propre
                      setValue("nom", "");
                      setValue("prenom", "");
                      setValue("club", "");
                      setValue("pointsOfficiel", "");
                    }}
                    className="text-xs px-2 py-1"
                    size={"sm"}
                  >
                    Modifier la licence
                  </Button>
                )}
                <Button
                  type="button"
                  onClick={fetchFromLicence}
                  disabled={loadingFftt}
                  className="w-full"
                >
                  {loadingFftt ? "Chargement..." : "Auto-compléter via FFTT"}
                </Button>

                {errors.numeroLicence && (
                  <p className="text-red-500 text-xs">
                    {errors.numeroLicence.message}
                  </p>
                )}
                {/* Montre les autres champs uniquement si le nom a été récupéré */}
                {watch("nom") && (
                  <>
                    <Input {...register("nom")} placeholder="Nom" readOnly />
                    {errors.nom && (
                      <p className="text-red-500 text-xs">
                        {errors.nom.message}
                      </p>
                    )}

                    <Input
                      {...register("prenom")}
                      placeholder="Prénom"
                      readOnly
                    />
                    {errors.prenom && (
                      <p className="text-red-500 text-xs">
                        {errors.prenom.message}
                      </p>
                    )}

                    <Input
                      {...register("pointsOfficiel")}
                      placeholder="Points Officiel"
                      readOnly
                    />
                    {errors.pointsOfficiel && (
                      <p className="text-red-500 text-xs">
                        {errors.pointsOfficiel.message}
                      </p>
                    )}
                  </>
                )}
                <Button
                  type="button"
                  className="w-full"
                  onClick={() => validateStep(2)}
                >
                  Suivant
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8">
                <h2 className="text-2xl font-bold ">Choix des épreuves</h2>

                <div className="grid grid-cols-3 gap-4">
                  {/* Colonne Samedi */}
                  <div>
                    <h3 className="text-lg font-semibold  mb-2">Samedi</h3>
                    <div className="flex flex-col gap-1">
                      {epreuves
                        .filter((e) => e.jour === "samedi")
                        .map((e) => (
                          <label key={e.id} className="flex items-center gap-2">
                            <Input
                              type="checkbox"
                              value={e.id}
                              {...register("epreuves")}
                              className="p-0 m-0 h-6 w-6 rounded-full border-2 border-accent bg-white checked:bg-accent appearance-none focus:ring-1 focus:ring-accent transition"
                            />

                            <span className="ml-1">
                              {e.tableau} ({e.categorie})
                            </span>
                          </label>
                        ))}
                    </div>
                  </div>
                  {/* Colonne Dimanche */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Dimanche</h3>
                    <div className="flex flex-col gap-1">
                      {epreuves
                        .filter((e) => e.jour === "dimanche")
                        .map((e) => (
                          <label key={e.id} className="flex items-center gap-2">
                            <Input
                              type="checkbox"
                              value={e.id}
                              {...register("epreuves")}
                              className="p-0 m-0 h-6 w-6 rounded-full border-2 border-accent bg-white checked:bg-accent appearance-none focus:ring-1 focus:ring-accent transition"
                            />
                            <span className="ml-2">
                              {e.tableau} ({e.categorie})
                            </span>
                          </label>
                        ))}
                    </div>
                  </div>

                  {/* Colonne Lundi */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Lundi</h3>
                    <div className="flex flex-col gap-1">
                      {epreuves
                        .filter((e) => e.jour === "lundi")
                        .map((e) => (
                          <label
                            key={e.id}
                            className="flex items-center gap-2 "
                          >
                            <Input
                              type="checkbox"
                              value={e.id}
                              {...register("epreuves")}
                              className="p-0 m-0 h-6 w-6 rounded-full border-2 border-accent bg-white checked:bg-accent appearance-none focus:ring-1 focus:ring-accent transition"
                            />
                            <span className="ml-2">
                              {e.tableau} ({e.categorie})
                            </span>
                          </label>
                        ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button type="button" onClick={() => setStep(1)}>
                    Précédent
                  </Button>
                  <Button type="button" onClick={() => validateStep(3)}>
                    Suivant
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">
                  Confirmation d&rsquo;inscription
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">
                      Identité du joueur :
                    </h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Numéro de Licence: {watch("numeroLicence")}</p>
                      <p>Nom: {watch("nom")}</p>
                      <p>Prénom: {watch("prenom")}</p>
                      <p>Club: {watch("club")}</p>
                      <p>Points Officiel: {watch("pointsOfficiel")}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">
                      Tableaux choisis :
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(watch("epreuves")) &&
                        (watch("epreuves") || []).map((epreuveId) => {
                          const epreuve = epreuves.find(
                            (e) => e.id.toString() === epreuveId
                          );
                          if (!epreuve) return null;

                          return (
                            <Badge
                              key={epreuve.id}
                              className=" px-3 py-1 rounded-2 bg-accent text-sm"
                            >
                              {epreuve.tableau} ({epreuve.categorie})
                            </Badge>
                          );
                        })}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button type="button" onClick={() => setStep(2)}>
                    Précédent
                  </Button>
                  <Button type="submit">Confirmer l&rsquo;inscription</Button>
                </div>
              </div>
            )}
          </form>
        </>
      )}
    </div>
  );
}
