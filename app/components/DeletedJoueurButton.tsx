"use client";

interface DeleteJoueurButtonProps {
  joueurId: number;
}

export function DeleteJoueurButton({ joueurId }: DeleteJoueurButtonProps) {
  const handleDelete = async () => {
    if (confirm("Es-tu sûr de vouloir supprimer ce joueur ?")) {
      const res = await fetch(`/api/joueurs/${joueurId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        window.location.reload(); // Ou bien tu peux utiliser Router.refresh() si tu veux éviter window.location
      } else {
        alert("Erreur lors de la suppression");
        console.log(res);
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
