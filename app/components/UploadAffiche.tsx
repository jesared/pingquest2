// components/UploadAffiche.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@clerk/nextjs";
import { createClient } from "@supabase/supabase-js";
import { X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

// Crée une instance Supabase SANS authentification globale
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function UploadAffiche({
  onUpload,
}: {
  onUpload: (url: string) => void;
}) {
  const { getToken } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  // ici file est une variable, et File est un type natif JS/TS

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFile(file);
    // Génére une URL temporaire pour preview
    const url = URL.createObjectURL(file);
    setPreview(url);
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
      alert("Erreur lors de l'upload !" + error.message);
    } else {
      const { data: publicUrlData } = supabase.storage
        .from("affiche")
        .getPublicUrl(filePath);
      onUpload(publicUrlData.publicUrl);
      setPreview(null); // Optionnel : enlever la preview après upload
    }
    setUploading(false);
  };
  // Reset preview et valeur du champ input
  const handleReset = () => {
    setPreview(null);
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    onUpload(""); // Réinitialise aussi dans le parent si besoin
  };
  return (
    <div>
      <div className="justify-between space-x-2">
        <Input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <Button
          size={"sm"}
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? "Upload en cours..." : "Choisir une affiche"}
        </Button>
        {file && (
          <Button
            size={"sm"}
            variant={"secondary"}
            type="button"
            onClick={handleUpload}
            disabled={uploading}
          >
            {uploading ? "Envoi en cours..." : "Uploader"}
          </Button>
        )}
      </div>

      {/* Preview */}
      {preview && (
        <div className="relative mt-2 inline-block">
          <Image
            width={200}
            height={400}
            src={preview}
            alt="Aperçu affiche"
            // className="max-w-xs max-h-40 rounded shadow border mb-2"
          />
          <Button
            size={"icon"}
            variant={"destructive"}
            type="button"
            onClick={handleReset}
            className="absolute top-1 right-1 rounded-full"
            title="Supprimer l’aperçu"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
