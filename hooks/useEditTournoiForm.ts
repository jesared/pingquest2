// app/hooks/useEditTournoiForm.ts
"use client";
import GenererJoursTournoi from "@/app/components/GenererJoursTournoi";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// Define or import the Epreuve type
type Epreuve = {
  id?: number; // Add the optional 'id' property
  nom: string;
  categorie: string;
  jour: string;
  heure: string;
  minPoints: string;
  maxPoints: string;
  tarif: string;
  tarifPlace: string;
  isNew?: boolean; // Add the optional 'isNew' property
};

export const useEditTournoiForm = (tournoiId: number) => {
  type Tournoi = {
    nom: string;
    lieu: string;
    description: string;
    responsableNom: string;
    responsableEmail: string;
    responsableTelephone: string;
    debut?: string;
    fin?: string;
    prixAnticipe?: string;
    prixSurPlace?: string;
  };

  const [tournoi, setTournoi] = useState<Tournoi | null>(null);
  const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);
  const [deletedEpreuves, setDeletedEpreuves] = useState<number[]>([]);

  const [formValues, setFormValues] = useState({
    nom: "",
    lieu: "",
    description: "",
    responsableNom: "",
    email: "",
    telephone: "",
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    epreuves: [] as Epreuve[],
  });

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

  const [isFormModified, setIsFormModified] = useState(false);

  useEffect(() => {
    const fetchTournoi = async () => {
      if (!tournoiId) return;
      try {
        const res = await fetch(`/api/tournois/${tournoiId}`);
        if (!res.ok) throw new Error("Erreur tournoi");
        const data = await res.json();
        const tournoiData = data.data;
        setTournoi(tournoiData);
        setFormValues((prev) => ({
          ...prev,
          nom: tournoiData.nom || "",
          lieu: tournoiData.lieu || "",
          description: tournoiData.description || "",
          responsableNom: tournoiData.responsableNom || "",
          email: tournoiData.responsableEmail || "",
          telephone: tournoiData.responsableTelephone || "",
          startDate: tournoiData.debut
            ? new Date(tournoiData.debut)
            : undefined,
          endDate: tournoiData.fin ? new Date(tournoiData.fin) : undefined,
        }));

        const epreuvesRes = await fetch(`/api/epreuves?tournoiId=${tournoiId}`);

        if (!epreuvesRes.ok) throw new Error("Erreur épreuves");
        const dataEpreuves = await epreuvesRes.json();

        const transformed = dataEpreuves.map((e: Tournoi) => ({
          ...e,
          tarif: e.prixAnticipe,
          tarifPlace: e.prixSurPlace,
        }));

        setFormValues((prev) => ({ ...prev, epreuves: transformed }));
      } catch (err: unknown) {
        return err instanceof Error ? err.message : "An unknown error occurred";
      } finally {
        setLoading(false);
      }
    };

    fetchTournoi();
  }, [tournoiId]);

  useEffect(() => {
    if (tournoi) {
      setIsFormModified(false);
    }
  }, [tournoi]);

  const updateField = (
    field: string,
    value: string | number | Date | undefined
  ) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    setIsFormModified(true);
  };

  const handleNewEpreuveChange = (field: keyof Epreuve, value: string) => {
    setNewEpreuve((prev) => ({ ...prev, [field]: value }));
  };

  const addEpreuve = () => {
    const { nom, jour, heure, tarif, tarifPlace } = newEpreuve;
    if (!nom || !jour || !heure || !tarif || !tarifPlace) {
      toast.error(
        "Veuillez remplir tous les champs obligatoires de l'épreuve."
      );
      return;
    }
    setFormValues((prev) => ({
      ...prev,
      epreuves: [...prev.epreuves, { ...newEpreuve, isNew: true }],
    }));
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

    setIsFormModified(true);
  };

  const deleteEpreuve = (idToDelete: number) => {
    setFormValues((prev) => {
      const epreuveToDelete = prev.epreuves.find((e) => e.id === idToDelete);

      if (epreuveToDelete?.id) {
        setDeletedEpreuves((prevDeleted) =>
          prevDeleted.filter((id) => id !== idToDelete)
        );
      }

      const updatedEpreuves = prev.epreuves.filter((e) => e.id !== idToDelete);

      return { ...prev, epreuves: updatedEpreuves };
    });

    setIsFormModified(true);
  };

  const isFormValid = () => {
    const {
      nom,
      lieu,
      description,
      responsableNom,
      email,
      telephone,
      startDate,
      endDate,
      epreuves,
    } = formValues;

    // Vérifie qu'il y a au moins une épreuve
    const hasAtLeastOneEpreuve = epreuves.length > 0;

    const baseValid =
      nom &&
      lieu &&
      description &&
      responsableNom &&
      email &&
      telephone &&
      startDate &&
      endDate;
    // On ne vérifie pas les champs de la nouvelle épreuve ici !
    return !!baseValid && hasAtLeastOneEpreuve;
  };

  const jours =
    formValues.startDate && formValues.endDate
      ? GenererJoursTournoi(formValues.startDate, formValues.endDate)
      : [];

  return {
    formValues,
    updateField,
    handleNewEpreuveChange,
    newEpreuve,
    addEpreuve,
    deleteEpreuve,
    deletedEpreuves,
    isFormModified,
    isFormValid,
    jours,
    loading,
    // error,
    setFormValues: setFormValues as typeof setFormValues | undefined, // pour modifier directement si besoin
    setStartDate: (date: Date | undefined) => updateField("startDate", date),
    setEndDate: (date: Date | undefined) => updateField("endDate", date),
    setNewEpreuve,
  };
};
