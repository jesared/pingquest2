// components/UploadAffiche.tsx
"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { deleteSupabaseFile } from "@/lib/deleteSupabaseFile";
import { useAuth } from "@clerk/nextjs";
import { createClient } from "@supabase/supabase-js";
import { AlertCircle, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "sonner";
// Crée une instance Supabase SANS authentification globale
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
export default function UploadAffiche({
  onUpload,
}: {
  onUpload: (url: string) => void;
}) {
  const { getToken } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [filePath, setFilePath] = useState<string | null>(null);
  const [url, setUrl] = useState<string>("");
  const MAX_FILE_SIZE = 2 * 1024 * 1024;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ACCEPTED_TYPES.includes(file.type)) {
      alert(
        "Format non supporté. Merci de choisir une image JPG, PNG ou WEBP."
      );
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setErrorMsg("Le fichier dépasse la taille maximale autorisée (2 Mo).");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setPreview(URL.createObjectURL(file));
    setUrl("");
    setErrorMsg(null);
  };

  const handleUpload = async () => {
    // 1. Récupère le JWT Clerk
    const token = await getToken({ template: "supabase" });
    // Crée un nouveau client supabase avec le token de l'utilisateur
    const authedSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: { headers: { Authorization: `Bearer ${token}` } },
      }
    );

    const file = fileInputRef.current?.files?.[0];
    if (!file) return;

    setUploading(true);
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const filePath = `affiche/${Date.now()}_${sanitizedFileName}`;
    const { error } = await authedSupabase.storage
      .from("affiche")
      .upload(filePath, file);

    if (error) {
      toast.error("Erreur lors de l'upload !" + error.message);
    } else {
      const { data: publicUrlData } = supabase.storage
        .from("affiche")
        .getPublicUrl(filePath);
      onUpload(publicUrlData.publicUrl);
      setUrl(publicUrlData.publicUrl);

      setFilePath(filePath);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setPreview(null);
    }
    setUploading(false);
  };
  // --- SUPPRESSION ---
  const handleDelete = async () => {
    console.log("filePath", filePath);
    if (filePath) {
      await deleteSupabaseFile("affiche", filePath);
      toast.success("Affiche supprimée !");
    }
    setPreview(null);
    setUrl("");
    setFilePath(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    onUpload(""); // Reset dans le parent
  };
  console.log("preview:", preview, "url:", url);
  return (
    <div className="flex flex-col gap-3 items-start w-full">
      {/* Choix fichier */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <Button
        type="button"
        size={"sm"}
        variant={"secondary"}
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading || (!!url && !preview)}
        className="px-4 py-2 rounded hover:scale-105 transition cursor-pointer"
      >
        {uploading ? "Upload en cours..." : "Choisir une affiche"}
      </Button>
      {errorMsg && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errorMsg}</AlertDescription>
        </Alert>
      )}
      {/* Preview */}
      {preview && !url && (
        <div className="relative mt-4 inline-block">
          <Image
            width={200}
            height={300}
            src={preview}
            alt="Aperçu affiche"
            className="rounded-lg shadow-md border-2 border-primary hover:scale-105 hover:shadow-xl transition"
          />
          <Button
            type="button"
            onClick={handleDelete}
            className="cursor-pointer absolute top-2 right-2  bg-white/80 hover:bg-red-500 text-red-600 hover:text-white rounded-full shadow transition-colors"
            title="Supprimer l’aperçu"
            size="icon"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      {/* Affichage image déjà uploadée */}
      {url && !preview && (
        <div className="relative mt-4 inline-block">
          <Image
            width={200}
            height={300}
            src={url}
            alt="Affiche uploadée"
            className="rounded-lg shadow-md border-2 border-primary hover:scale-105 hover:shadow-xl transition"
          />
          <Button
            type="button"
            variant={"destructive"}
            onClick={handleDelete}
            className="cursor-pointer absolute top-2 right-2  bg-white/80 hover:bg-red-500 text-red-600 hover:text-white rounded-full shadow transition-colors"
            title="Supprimer"
            size={"icon"}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Bouton d’upload */}
      {preview && !url && (
        <Button
          type="button"
          size={"sm"}
          className="cursor-pointer "
          onClick={handleUpload}
          disabled={uploading}
        >
          {uploading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 mr-2 inline"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Envoi en cours...
            </>
          ) : (
            "Uploader"
          )}
        </Button>
      )}
    </div>
  );
}
