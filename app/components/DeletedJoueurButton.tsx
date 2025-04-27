"use client";

interface DeleteJoueurButtonProps {
  joueurId: number;
  onDelete: (id: number) => void; // 👈 on passe une fonction à appeler après suppression
}

export function DeleteJoueurButton({
  joueurId,
  onDelete,
}: DeleteJoueurButtonProps) {
  const handleDelete = async () => {
    if (confirm("Es-tu sûr de vouloir supprimer ce joueur ?")) {
      try {
        const res = await fetch(`/api/joueurs/${joueurId}`, {
          method: "DELETE",
        });

        if (!res.ok) {
          throw new Error("Erreur lors de la suppression");
        }

        // Appeler le callback pour mettre à jour la liste côté parent
        onDelete(joueurId);
      } catch (error) {
        console.error("Erreur suppression:", error);
        alert("Erreur lors de la suppression !");
      }
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded"
    >
      Supprimer
    </button>
  );
}
