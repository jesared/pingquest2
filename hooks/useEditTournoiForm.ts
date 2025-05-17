// app/hooks/useEditTournoiForm.ts
"use client";
import GenererJoursTournoi from "@/app/components/GenererJoursTournoi";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// Type d'épreuve
type Epreuve = {
  id?: number;
  nom: string;
  jour: string;
  heure: string;
  prixAnticipe: number;
  prixSurPlace: number;
  isNew?: boolean;
  idLocal?: string;

  [key: string]: string | number | boolean | undefined;
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
  const router = useRouter();
  const [tournoi, setTournoi] = useState<Tournoi | null>(null);
  const [loading, setLoading] = useState(true);
  const [deletedEpreuves, setDeletedEpreuves] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formValues, setFormValues] = useState({
    id: undefined as number | undefined,
    nom: "",
    lieu: "",
    description: "",
    responsableNom: "",
    email: "",
    telephone: "",
    reglementUrl: "",
    afficheUrl: "",
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    epreuves: [] as Epreuve[],
    statut: "BROUILLON",
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

  const fetchEpreuves = async (tournoiId: number) => {
    const res = await fetch(`/api/epreuves?tournoiId=${tournoiId}`);
    if (!res.ok) throw new Error("Erreur épreuves");
    const data = await res.json();

    return data.map((e: Epreuve) => ({
      ...e,
      tarif: e.prixAnticipe,
      tarifPlace: e.prixSurPlace,
    }));
  };

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
          id: tournoiData.id,
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
          statut: tournoiData.statut || "BROUILLON",
        }));

        const transformedEpreuves = await fetchEpreuves(Number(tournoiId));
        setFormValues((prev) => ({ ...prev, epreuves: transformedEpreuves }));
      } catch (err: unknown) {
        return err instanceof Error ? err.message : "An unknown error occurred";
      } finally {
        setLoading(false);
      }
    };

    fetchTournoi();
    setDeletedEpreuves([]);
  }, [tournoiId]);

  useEffect(() => {
    if (tournoi) setIsFormModified(false);
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
      epreuves: [
        ...prev.epreuves,
        {
          ...newEpreuve,
          id: undefined,
          isNew: true,
          idLocal: `temp-${Date.now()}-${Math.random()}`,
          prixAnticipe: Number(tarif),
          prixSurPlace: Number(tarifPlace),
        },
      ],
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
    setFormValues((prev) => ({
      ...prev,
      epreuves: prev.epreuves.filter((e) => e.id !== idToDelete),
    }));
    setDeletedEpreuves((prevDeleted) => [...prevDeleted, idToDelete]);
    setIsFormModified(true);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      if (!tournoiId) return;

      await Promise.all(
        deletedEpreuves.map((id) =>
          fetch(`/api/epreuves/${id}`, { method: "DELETE" })
        )
      );

      const epreuvePromises = formValues.epreuves.map((epreuve) => {
        const payload = {
          nom: epreuve.nom,
          jour: epreuve.jour,
          heure: epreuve.heure,
          categorie: epreuve.categorie,
          minPoints: epreuve.minPoints,
          maxPoints: epreuve.maxPoints,
          prixAnticipe: Number(epreuve.tarif),
          prixSurPlace: Number(epreuve.tarifPlace),
          tournoiId: Number(tournoiId),
        };

        if (epreuve.id && !epreuve.isNew) {
          return fetch(`/api/epreuves/${epreuve.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
        } else {
          return fetch(`/api/epreuves`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
        }
      });

      await Promise.all(epreuvePromises);

      const tournoiPayload = {
        nom: formValues.nom,
        lieu: formValues.lieu,
        description: formValues.description,
        responsableNom: formValues.responsableNom,
        responsableEmail: formValues.email,
        responsableTelephone: formValues.telephone,
        debut: formValues.startDate?.toISOString(),
        fin: formValues.endDate?.toISOString(),
      };

      await fetch(`/api/tournois/${tournoiId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tournoiPayload),
      });

      toast.success("Tournoi modifié avec succès !");
      setDeletedEpreuves([]);
      setIsFormModified(false);

      router.push(`/tournois/${tournoiId}/apercu`);
      router.refresh();
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      toast.error("Une erreur est survenue pendant la modification.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateEpreuveField = (
    id: string | number,
    field: string,
    value: string | number
  ) => {
    setFormValues((prev) => ({
      ...prev,
      epreuves: prev.epreuves.map((ep) =>
        (ep.id ?? ep.idLocal) === id ? { ...ep, [field]: value } : ep
      ),
    }));
    setIsFormModified(true);
  };

  const duplicateEpreuve = (epreuveId: string | number) => {
    const epreuves = formValues.epreuves;

    const original = epreuves.find((e) => (e.id ?? e.idLocal) === epreuveId);
    if (!original) return;

    const clone = {
      ...original,
      id: undefined,
      idLocal: `temp-${Date.now()}-${Math.random()}`,
      nom: `${original.nom} (copie)`,
      isNew: true,
    };

    setFormValues((prev) => ({
      ...prev,
      epreuves: [...prev.epreuves, clone],
    }));

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
    return (
      !!(
        nom &&
        lieu &&
        description &&
        responsableNom &&
        email &&
        telephone &&
        startDate &&
        endDate
      ) && epreuves.length > 0
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
    isSubmitting,
    jours,
    loading,
    handleSubmit,
    updateEpreuveField,
    duplicateEpreuve,
    setFormValues,
    setStartDate: (date: Date | undefined) => updateField("startDate", date),
    setEndDate: (date: Date | undefined) => updateField("endDate", date),
    setNewEpreuve,
  };
};
