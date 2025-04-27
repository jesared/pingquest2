"use client";

import {
  Home,
  LogIn,
  Search,
  Settings,
  Trophy,
  User,
  UserPlus,
  Users,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SignInButton, SignOutButton, useAuth, useUser } from "@clerk/nextjs"; // Clerk imports
import Image from "next/image";
import { usePathname } from "next/navigation"; // Pour obtenir l'URL actuelle
// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Ajout",
    url: "/dashboard/ajout",
    icon: UserPlus,
  },
  {
    title: "Inscriptions",
    url: "/dashboard/inscriptions",
    icon: Users,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

export function AppSidebar() {
  const { isSignedIn } = useAuth(); // Hook Clerk pour vérifier l'état de connexion
  const { user } = useUser(); // Récupérer les infos de l'utilisateur
  const pathname = usePathname(); // Récupérer l'URL actuelle

  return (
    <>
      <Sidebar>
        <SidebarContent>
          <div className="p-2 flex justify-end"></div>
          <div className="flex items-center justify-center">
            <Trophy className="w-8 h-8" />
          </div>
          <div className="flex items-center justify-center">
            <h4 className=" scroll-m-20 text-xl font-semibold tracking-tight">
              PingQuest
            </h4>
          </div>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => {
                  const isActive = pathname === item.url; // Vérifier si le lien est actif
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className={isActive ? "bg-primary text-white" : ""} // Couleur pour le lien actif
                      >
                        <a href={item.url} title={item.title}>
                          <item.icon />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          {/* Élément en bas : Image de profil ou Login */}
          <div className="mt-auto p-2">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="p-0 m-0 h-auto min-h-0 flex items-center"
                >
                  {isSignedIn ? (
                    <SignOutButton>
                      <button
                        className="flex items-center w-full h-10"
                        title="Deconnexion"
                      >
                        {user?.imageUrl ? (
                          <Image
                            src={user.imageUrl}
                            alt="Profile"
                            width={40}
                            height={40}
                            className="rounded-full object-cover overflow-hidden w-10 h-10"
                          />
                        ) : (
                          <User className="w-10 h-10" />
                        )}
                        {user?.firstName && (
                          <span className="ml-2 truncate text-sm leading-none">
                            {user.firstName}
                          </span>
                        )}
                      </button>
                    </SignOutButton>
                  ) : (
                    <SignInButton mode="modal">
                      <button
                        className="flex items-center w-full h-14"
                        title="Sign In"
                      >
                        <LogIn className="w-10 h-10" />

                        <span className="ml-2 truncate">Login</span>
                      </button>
                    </SignInButton>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </div>
        </SidebarContent>
      </Sidebar>
    </>
  );
}
