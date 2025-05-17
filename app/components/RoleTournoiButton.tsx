"use client";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { useUser } from "@clerk/nextjs";
import { Award, PlusCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
type GetUserRoleResponse = {
  role?: { name: string };
};

export default function RoleTournoiButton() {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // État pour suivre le chargement
  const { user } = useUser();
  const pathname = usePathname();
  const isMakeTournoi = pathname === "/make/tournoi";
  const isDashboardTournois = pathname === "/dashboard/tournois";

  useEffect(() => {
    const fetchRole = async () => {
      if (!user || !user.id || !user.publicMetadata) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/getUserRole", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: user.id }),
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.error("Réponse non OK :", res.status, errorText);
          setLoading(false);
          return;
        }

        const data: GetUserRoleResponse = await res.json();

        if (data.role) {
          setRole(data.role.name);
        } else {
          console.error("Rôle introuvable dans la réponse.");
        }
      } catch (error) {
        console.error("Erreur lors de l'appel API:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, [user]);

  // Si l'utilisateur est en cours de chargement ou si ce n'est pas un organisateur
  if (loading) {
    return <div>Chargement...</div>;
  }

  if (role !== "organizer" && role !== "admin") {
    return null;
  }

  return (
    <>
      <SidebarMenuItem>
        <SidebarMenuButton
          className={isMakeTournoi ? "bg-primary text-white" : ""}
        >
          <Link
            href="/make/tournoi"
            title="Ajouter un tournoi"
            className="flex items-center space-x-2"
          >
            <PlusCircle size={18} className="shrink-0" />
            <span className="text-[16px]">Ajouter un tournoi</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton
          className={isDashboardTournois ? "bg-primary text-white" : ""}
        >
          <Link
            href="/dashboard/tournois"
            title="Vos tournois"
            className="flex items-center space-x-2"
          >
            <Award size={18} className="shrink-0" />
            <span className="text-[16px]">Mes tournois</span>
          </Link>{" "}
        </SidebarMenuButton>
      </SidebarMenuItem>
    </>
  );
}
