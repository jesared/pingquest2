// lib/deleteSupabaseFile.ts
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// bucketName: "affiche" OU "reglement", filePath: "affiche/1234_file.jpg" OU "reglement/1234_file.pdf"
export async function deleteSupabaseFile(bucketName: string, filePath: string) {
  const { data, error } = await supabase.storage
    .from(bucketName)
    .remove([filePath]);
  console.log("Tentative suppression:", {
    bucketName,
    filePath,
    error,
    data,
  });
  if (error) {
    console.error("Erreur lors de la suppression du fichier :", error.message);
    return false;
  }
  return true;
}
