// components/UploadDocument.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { deleteSupabaseFile } from "@/lib/deleteSupabaseFile";
import { useAuth } from "@clerk/nextjs";
import { createClient } from "@supabase/supabase-js";
import { X } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { toast } from "sonner";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function UploadDocument({
  onUpload,
  url: initialUrl = "",
}: {
  onUpload: (url: string) => void;
  url?: string;
}) {
  const { getToken } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewName, setPreviewName] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState(initialUrl); // Ajout url pour gérer l’état du doc en ligne
  const [filePath, setFilePath] = useState<string | null>(null);

  // Choix du fichier
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast.error("Merci de sélectionner un fichier PDF.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    setPreviewName(file.name);
    setFile(file);
    setUrl(""); // cache l'ancien doc s'il y en avait un
  };

  // Upload du PDF
  const handleUpload = async () => {
    const token = await getToken({ template: "supabase" });
    const authedSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );
    if (!file) return;
    setUploading(true);

    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const filePath = `reglement/${Date.now()}_${sanitizedFileName}`;
    const { error } = await authedSupabase.storage
      .from("reglement")
      .upload(filePath, file);

    if (error) {
      toast.error("Erreur lors de l'upload du règlement !" + error.message);
    } else {
      const { data: publicUrlData } = supabase.storage
        .from("reglement")
        .getPublicUrl(filePath);
      onUpload(publicUrlData.publicUrl);
      setPreviewName(null);
      setFile(null);
      setUrl(publicUrlData.publicUrl);
      setFilePath(filePath);
      toast.success("Règlement uploadé !");
    }
    setUploading(false);
  };

  // Suppression du doc en ligne
  const handleDelete = async () => {
    if (filePath || url) {
      // On déduit le chemin à partir de l’url
      const pathToDelete =
        filePath ||
        (url
          ? url.split("/object/public/reglement/")[1] &&
            `reglement/${url.split("/object/public/reglement/")[1]}`
          : null);
      if (pathToDelete) {
        await deleteSupabaseFile("reglement", pathToDelete);
        toast.success("Règlement supprimé !");
      }
    }
    setPreviewName(null);
    setFile(null);
    setFilePath(null);
    setUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    onUpload(""); // Réinitialise côté parent
  };

  // Affichage
  return (
    <div className="flex flex-col gap-3 items-start w-full">
      <input
        type="file"
        accept="application/pdf"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <Button
        type="button"
        variant={"secondary"}
        className="cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        size="sm"
      >
        {uploading ? "Upload en cours..." : "Choisir un PDF"}
      </Button>

      {/* Preview nom PDF avant upload */}
      {previewName && !url && (
        <div className="mt-4">
          <Badge
            variant={"outline"}
            className="relative flex items-center gap-2"
          >
            <span className="truncate max-w-[200px]">{previewName}</span>
            <Button
              type="button"
              size="icon"
              variant={"destructive"}
              onClick={handleDelete}
              className="ml-2 bg-white/80 hover:bg-red-500 text-red-600 hover:text-white rounded-full p-1 shadow transition-colors cursor-pointer"
              title="Supprimer"
            >
              <X className="h-4 w-4" />
            </Button>
          </Badge>
        </div>
      )}
      {/* Affichage PDF déjà uploadé */}
      {url && !previewName && (
        <div className="mt-4">
          <Badge variant={"outline"} className="flex items-center gap-2">
            <Link
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Voir le règlement
            </Link>
            <Button
              type="button"
              size="icon"
              onClick={handleDelete}
              className="ml-2 bg-white/80 hover:bg-red-500 text-red-600 hover:text-white rounded-full p-1 shadow transition-colors"
              title="Supprimer"
            >
              <X className="h-4 w-4" />
            </Button>
          </Badge>
        </div>
      )}
      {/* Bouton d’upload */}
      {previewName && !url && (
        <Button
          size="sm"
          type="button"
          className="cursor-pointer "
          onClick={handleUpload}
          disabled={uploading}
        >
          {uploading ? "Envoi en cours..." : "Uploader"}
        </Button>
      )}
    </div>
  );
}
