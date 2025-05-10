// hooks/useCurrentUser.ts
import { useEffect, useState } from "react";

export function useCurrentUser() {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/getUser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        });

        const data = await res.json();
        if (res.ok && data?.id) {
          setCurrentUserId(data.id);
        }
      } catch (err) {
        console.error("Erreur lors de la récupération de l'utilisateur :", err);
      }
    }

    fetchUser();
  }, []);

  return currentUserId;
}
