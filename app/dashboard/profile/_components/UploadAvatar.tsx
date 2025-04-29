// app/dashboard/profile/_components/UploadAvatar.tsx
"use client";

import { useAvatar } from "@/lib/AvartarContext";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useEffect, useState } from "react";

const UploadAvatar: React.FC = () => {
  console.log("Rendu de UploadAvatar, ID:", Math.random());

  const { user, isLoaded } = useUser();
  const userId = user?.id;
  const { avatarUrl, setAvatarUrl } = useAvatar();

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Initialiser avatarUrl avec l'image actuelle de l'utilisateur
  useEffect(() => {
    if (user?.imageUrl && !avatarUrl) {
      setAvatarUrl(user.imageUrl);
    }
  }, [user, avatarUrl, setAvatarUrl]);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      setUploadError("Aucun fichier sélectionné");
      return;
    }

    if (!userId) {
      setUploadError("Utilisateur non connecté");
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      console.log("Envoi de la requête avec userId:", userId);
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("file", file);

      const response = await fetch("/api/upload-avatar", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = "Erreur inconnue";
        try {
          const text = await response.text();
          console.log("Réponse brute du serveur:", text);
          const errorData = JSON.parse(text);
          errorMessage = errorData.error || `Erreur HTTP: ${response.status}`;
        } catch {
          errorMessage = "La réponse du serveur n'est pas valide";
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("Upload réussi:", data);

      // Mettre à jour l'image via le contexte
      if (data.imageUrl) {
        setAvatarUrl(data.imageUrl);
        // Rafraîchir les données de l'utilisateur pour synchroniser UserButton
        await user?.reload();
      }
    } catch (error) {
      console.error("Erreur lors de l'upload de l'image:", error);
      setUploadError(
        error instanceof Error
          ? error.message
          : "Une erreur s'est produite lors de l'upload"
      );
    } finally {
      setIsUploading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="loader" aria-label="Chargement de l'utilisateur"></div>
    );
  }

  if (!userId) {
    return (
      <p className="text-red-500">
        Veuillez vous connecter pour modifier votre profil
      </p>
    );
  }

  return (
    <div className="relative w-24 h-24">
      {/* Afficher l'image de profil */}
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt="Avatar de l'utilisateur"
          fill
          className="rounded-full object-cover"
        />
      ) : (
        <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500">Aucun avatar</span>
        </div>
      )}

      {/* Bouton d'upload */}
      <label
        htmlFor="upload-image"
        className="absolute bottom-0 right-0 bg-primary rounded-full p-1 text-white cursor-pointer shadow-md hover:bg-primary-foreground"
        aria-label="Modifier l'image de profil"
      >
        <svg
          className="w-4 h-4 hover:text-accent-foreground"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 18V8a1 1 0 0 1 1-1h1.5l1.707-1.707A1 1 0 0 1 8.914 5h6.172a1 1 0 0 1 .707.293L17.5 7H19a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Z"
          />
          <path
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
          />
        </svg>
        <input
          type="file"
          id="upload-image"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
          disabled={isUploading}
        />
      </label>

      {/* Indicateur de chargement et erreurs */}
      {isUploading && (
        <div className="loader" aria-label="Téléchargement en cours"></div>
      )}
      {uploadError && (
        <p className="text-red-500 mt-2 text-sm">{uploadError}</p>
      )}

      <style jsx>{`
        .loader {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #3498db;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 9999;
        }

        @keyframes spin {
          0% {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          100% {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default UploadAvatar;
