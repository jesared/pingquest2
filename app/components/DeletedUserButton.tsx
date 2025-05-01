import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import React from "react";
import { toast } from "sonner";

export default function DeletedUserButton({ id }: { id: string }) {
  const handleDelete = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const response = await fetch("/api/deleteUser", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });
    if (response.ok) {
      localStorage.clear();
      sessionStorage.clear();
      toast.success("Utilisateur a bien été supprimé");
      window.location.reload();
    } else {
      const errorData = await response.json();
      console.error(errorData);
    }
  };
  return (
    <form onSubmit={handleDelete}>
      <Button
        size="icon"
        className="rounded-full cursor-pointer"
        type="submit"
        variant={"destructive"}
      >
        <Trash />
      </Button>
    </form>
  );
}
