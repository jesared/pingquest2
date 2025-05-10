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
        setTournoi(data);
        setFormValues((prev) => ({
          ...prev,
          nom: data.nom || "",
          lieu: data.lieu || "",
          description: data.description || "",
          responsableNom: data.responsableNom || "",
          email: data.responsableEmail || "",
          telephone: data.responsableTelephone || "",
          startDate: data.debut ? new Date(data.debut) : undefined,
          endDate: data.fin ? new Date(data.fin) : undefined,
        }));

        const epreuvesRes = await fetch(`/api/epreuves?tournoiId=${tournoiId}`);

        if (!epreuvesRes.ok) throw new Error("Erreur épreuves");
        const dataEpreuves = await epreuvesRes.json();
        const transformed = dataEpreuves.map((e: Epreuve) => ({
          ...e,
          tarif: e.tarif,
          tarifPlace: e.tarifPlace,
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
    console.log("Validation des épreuves :", formValues.epreuves);
    formValues.epreuves.forEach((e, i) => {
      console.log(`Épreuve ${i} :`, {
        nom: !!e.nom,
        jour: !!e.jour,
        heure: !!e.heure,
        tarif: !!e.tarif,
        tarifPlace: !!e.tarifPlace,
      });
    });
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

    const baseValid =
      nom &&
      lieu &&
      description &&
      responsableNom &&
      email &&
      telephone &&
      startDate &&
      endDate;

    // Valider toutes les épreuves existantes (isNew !== true)
    const anciennesEpreuvesValides = epreuves
      .filter((e) => !e.isNew)
      .every((e) => e.nom && e.jour && e.heure && e.tarif && e.tarifPlace);

    // Valider seulement les nouvelles épreuves si elles sont remplies partiellement
    const nouvellesEpreuvesPartiellementRemplies = epreuves
      .filter((e) => e.isNew)
      .some((e) => e.nom || e.jour || e.heure || e.tarif || e.tarifPlace);

    const nouvellesEpreuvesValides = epreuves
      .filter((e) => e.isNew)
      .every((e) => e.nom && e.jour && e.heure && e.tarif && e.tarifPlace);

    return (
      !!baseValid &&
      anciennesEpreuvesValides &&
      (!nouvellesEpreuvesPartiellementRemplies || nouvellesEpreuvesValides)
    );
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
