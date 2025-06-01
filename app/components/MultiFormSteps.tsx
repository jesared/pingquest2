"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Epreuve } from "@/types/engagement";
import { useUser } from "@clerk/nextjs";
import confetti from "canvas-confetti";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormData } from "../../types/form";
import JourEpreuvesSelector from "./JourEpreuvesSelector";
import ProgressBar from "./ProgressBar";

const steps = [
  { title: "Identité", description: "Informations personnelles" },
  { title: "Epreuves", description: "Choisissez un ou plusieurs tableaux" },
  { title: "Confirmation", description: "Vérification finale" },
];

interface MultiStepFormProps {
  tournoiId: number;
  jours: string[];
  onFfttJoueurDetecte?: (joueur: { nom: string; prenom: string }) => void;
}

export default function MultiStepForm({
  tournoiId,
  jours,
  onFfttJoueurDetecte,
}: MultiStepFormProps) {
  const { user } = useUser(); // 👈 Récupération du currentUser Clerk
  const [step, setStep] = useState(1);
  const router = useRouter();
  const [loadingFftt, setLoadingFftt] = useState(false);
  const [licenceVerrouillee, setLicenceVerrouillee] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [successMessage, setSuccessMessage] = useState(false);

  const [epreuves, setEpreuves] = useState<Epreuve[]>([]);

  const fetchFromLicence = async () => {
    const licence = watch("numeroLicence");
    try {
      const res = await fetch("/api/verif-joueur", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tournoiId, numeroLicence: licence }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erreur inconnue");
        return; // 👈 stop ici
      }

      if (data.status === "deja_inscrit") {
        setError("Ce joueur est déjà inscrit à ce tournoi.");

        return; // 👈 stop ici aussi
      }

      if (data.status === "inscriptible" || data.status === "non_inscrit") {
        setError(null);
        // setStep(2); // 👈 avancer uniquement si tout est OK
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoadingFftt(false);
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/fftt?licence=${licence}`
      );

      const data = await response.json();
      console.log("data", data);
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
        setValue("sexe", data.sexe || "");

        if (onFfttJoueurDetecte) {
          onFfttJoueurDetecte({ nom: data.nom, prenom: data.prenom });
        }
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
    formState: { errors, isSubmitting },
    watch,
  } = useForm<FormData>({
    mode: "onChange",
    defaultValues: {
      numeroLicence: "",
      dossard: "",
      nom: "",
      prenom: "",
      sexe: "",
      pointsOfficiel: "",
      epreuves: [],
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    try {
      // 1. Vérifier si le joueur existe déjà
      const joueurCheck = await fetch(
        `/api/joueurs/existe?licence=${data.numeroLicence}`
      );

      const joueurExiste = await joueurCheck.json();

      let joueurId;

      if (joueurExiste?.id) {
        // Le joueur existe déjà
        joueurId = joueurExiste.id;
      } else {
        // 2. Récupérer le dernier dossard
        const dossardResponse = await fetch("/api/dernier-dossard");
        const { dernierDossard } = await dossardResponse.json();

        // 3. Créer le joueur
        const joueurData = {
          ...data,
          userClerkId: user?.id,
          dossard: (dernierDossard || 0) + 1,
        };

        const response = await fetch("/api/joueurs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(joueurData),
        });

        if (!response.ok)
          throw new Error("Erreur lors de la création du joueur");

        const nouveauJoueur = await response.json();
        joueurId = nouveauJoueur.joueur.id;
      }

      const selectedIds = watch("epreuves") || [];
      // ⚠️ Vérifie que chaque ID sélectionné correspond à une épreuve autorisée
      const invalidSelections = selectedIds.filter((id) => {
        const epreuve = epreuves.find((e) => String(e.id) === String(id));
        return !epreuve;
      });

      if (invalidSelections.length > 0) {
        toast.error(
          "Vous avez sélectionné un ou plusieurs tableaux non autorisés."
        );
        return;
      }

      const engagements = selectedIds
        .map((id) => {
          const epreuve = epreuves.find((e) => String(e.id) === String(id));
          if (!epreuve) return null;
          const n = Number(epreuve.id);
          if (!n || isNaN(n)) return null;
          return {
            eventId: n,
            modePaiement: "Anticipé",
            tournoiId,
          };
        })
        .filter(Boolean);

      if (engagements.length === 0) {
        throw new Error("Aucune épreuve valide sélectionnée.");
      }

      const res = await fetch("/api/engagements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ joueurId, tournoiId, eventIds: engagements }), // ✅
      });

      if (!res.ok) {
        const error = await res.text(); // ou .json() si tu retournes un JSON
        throw new Error("Erreur lors de la création des engagements: " + error);
      }

      confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
      setSuccessMessage(true);
      setTimeout(() => router.push("/dashboard/inscriptions"), 2000);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchEpreuves = async () => {
      try {
        setLoading(true);
        const points = parseInt(watch("pointsOfficiel") || "0", 10);

        const res = await fetch(`/api/epreuves?tournoiId=${tournoiId}`);

        // 👈 Ton endpoint API qui sort les épreuves
        if (!res.ok) {
          console.error(`Erreur HTTP: ${res.status}`);
          setError("Erreur lors du chargement des épreuves depuis l'API.");
          setLoading(false);
          return; // Stop further processing
        }
        const data = await res.json();
        const allEpreuves = Array.isArray(data) ? data : data.epreuves;

        if (!Array.isArray(allEpreuves)) {
          throw new Error("Le format des épreuves est invalide");
        }
        console.log("first", allEpreuves);
        const accessibles = allEpreuves.filter(
          (e: { minPoints: number; maxPoints: number }) => {
            return points >= e.minPoints && points <= e.maxPoints;
          }
        );

        setEpreuves(accessibles);
      } catch (err) {
        setError("Erreur lors du chargement des épreuves");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (step === 2) {
      fetchEpreuves();
    }
  }, [step, watch, tournoiId]);

  const validateStep = async (nextStep: number) => {
    const fieldMap: Record<number, (keyof FormData)[]> = {
      1: ["numeroLicence", "nom", "prenom"],
      2: ["epreuves"],
    };

    const fieldsToValidate = fieldMap[step] || [];
    const isValid = await trigger(fieldsToValidate);

    if (step === 2) {
      const selectedEpreuves = watch("epreuves");

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
    <>
      {successMessage && (
        <div className="text-green-600 text-center font-bold text-xl mb-6">
          🎉 Inscription réussie ! Redirection en cours...
        </div>
      )}
      {!successMessage && (
        <>
          <ProgressBar currentStep={step} steps={steps} />
          <form
            onSubmit={handleSubmit(onSubmit)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
              }
            }}
            className="space-y-8"
          >
            {step === 1 && (
              <div className="space-y-4">
                <Input
                  {...register("numeroLicence")}
                  placeholder="Numéro de Licence"
                  required
                  readOnly={licenceVerrouillee}
                  className="focus:bg-accent"
                />
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

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
                      setValue("sexe", "");
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
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      {...register("prenom")}
                      placeholder="Prénom"
                      readOnly
                      className="bg-accent"
                    />
                    {errors.prenom && (
                      <p className="text-red-500 text-xs">
                        {errors.prenom.message}
                      </p>
                    )}
                    <Input
                      {...register("nom")}
                      placeholder="Nom"
                      readOnly
                      className="bg-accent"
                    />
                    {errors.nom && (
                      <p className="text-red-500 text-xs">
                        {errors.nom.message}
                      </p>
                    )}
                  </div>
                )}
                {/* Montre le bouton uniquement si le nom a été récupéré */}
                {watch("pointsOfficiel") && (
                  <Button
                    type="button"
                    className="w-full"
                    onClick={() => validateStep(2)}
                  >
                    Suivant
                  </Button>
                )}
              </div>
            )}
            <>
              {step === 2 && (
                <div className="space-y-8">
                  <h2 className="text-2xl font-bold ">Choix des épreuves</h2>
                  {/* prevoir un chargement des épreuves */}
                  {loading ? (
                    <div className="flex justify-center items-center">
                      <p className="text-gray-500">
                        Chargement des épreuves...
                      </p>
                      <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                    </div>
                  ) : error ? (
                    <p className="text-red-500">{error}</p>
                  ) : (
                    <>
                      <JourEpreuvesSelector
                        jours={jours}
                        epreuves={epreuves}
                        register={register}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <Button
                          className="w-full"
                          type="button"
                          onClick={() => setStep(1)}
                        >
                          Précédent
                        </Button>
                        <Button
                          className="w-full"
                          type="button"
                          onClick={() => validateStep(3)}
                        >
                          Suivant
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </>
            {step === 3 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">
                  Confirmation d&rsquo;inscription
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Identité du joueur</h3>
                    <div className="text-sm text-gray-600 space-y-1 text-left">
                      <p>
                        <span className="text-gray-400">
                          Numéro de Licence:{" "}
                        </span>{" "}
                        {watch("numeroLicence")}
                      </p>
                      <p>
                        <span className="text-gray-400">Nom: </span>
                        {watch("nom")}
                      </p>
                      <p>
                        <span className="text-gray-400">Prénom: </span>
                        {watch("prenom")}
                      </p>
                      <p>
                        <span className="text-gray-400">Sexe: </span>
                        {watch("sexe") === "M"
                          ? "Masculin"
                          : watch("sexe") === "F"
                          ? "Féminin"
                          : ""}
                      </p>

                      <p>
                        <span className="text-gray-400">Club: </span>
                        {watch("club")}
                      </p>
                      <p>
                        <span className="text-gray-400">Points Officiel: </span>
                        {watch("pointsOfficiel")}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Tableaux choisis</h3>
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
                              className=" px-3 py-1 rounded-2 border-accent bg-accent text-sm text-accent-foreground"
                            >
                              {epreuve.tableau} ({epreuve.categorie})
                            </Badge>
                          );
                        })}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button
                    className="w-full"
                    type="button"
                    onClick={() => setStep(2)}
                  >
                    Précédent
                  </Button>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Validation...</span>
                      </div>
                    ) : (
                      "Confirmer l’inscription"
                    )}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </>
      )}
    </>
  );
}
