"use client";
import {
  Home,
  LogIn,
  LogOut,
  ShieldCheck,
  Star,
  Trophy,
  UserCircle,
  UserPlus,
  Users,
} from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { SignInButton, SignOutButton, useAuth, useUser } from "@clerk/nextjs"; // Clerk imports
import Image from "next/image";
import Link from "next/link";
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
    authOnly: true,
  },
  {
    title: "Inscriptions",
    url: "/dashboard/inscriptions",
    icon: Users,
    authOnly: true,
  },
  {
    title: "Les épreuves",
    url: "/epreuves",
    icon: Star,
  },
  {
    title: "Les participants",
    url: "/participants",
    icon: ShieldCheck,
  },
  {
    title: "Profile",
    url: "/dashboard/profile",
    icon: UserCircle,
    authOnly: true,
  },
];

export function AppSidebar() {
  const { isSignedIn } = useAuth(); // Hook Clerk pour vérifier l'état de connexion// Récupérer les infos de l'utilisateur
  const pathname = usePathname();
  const { user } = useUser();
  return (
    <>
      <Sidebar>
        <SidebarContent>
          <div className="p-2 flex justify-end"></div>
          <div className="flex items-center justify-center">
            <Trophy className="w-8 h-8 font-medium" strokeWidth={1} />

            <h4 className="ml-2 scroll-m-20 text-2xl font-normal tracking-tight">
              <span className="text-primary font-semibold">P</span>ing
              <span className="text-accent font-bold">Q</span>uest
            </h4>
          </div>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {items
                  .filter((item) => !item.authOnly || isSignedIn)
                  .map((item) => {
                    const isActive = pathname === item.url; // Vérifier si le lien est actif
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          className={isActive ? "bg-primary text-white" : ""} // Couleur pour le lien actif
                        >
                          <Link href={item.url} title={item.title}>
                            <item.icon />
                            <span className="text-[18px]">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarSeparator className="p-0 m-0" />

          <div className="mt-auto p-2">
            <SidebarSeparator className="p-0 m-0" />
            <div className="items-center flex mb-2">
              {user?.imageUrl && (
                <Avatar>
                  <Image
                    width={64}
                    height={64}
                    src={user.imageUrl}
                    alt={user.fullName || "Profile"}
                  />
                </Avatar>
              )}
              <div className="justify-between space-x-1">
                {user?.fullName && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate ml-2">
                    {user.fullName}
                  </p>
                )}
                {user?.emailAddresses && user.emailAddresses.length > 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate ml-2">
                    {user.emailAddresses[0].emailAddress}
                  </p>
                )}
              </div>
            </div>

            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className=" h-auto min-h-0 flex items-center cursor-pointer"
                >
                  {isSignedIn ? (
                    <SignOutButton>
                      <button
                        className="flex items-center w-full h-16 "
                        title="Sign In"
                      >
                        <LogOut className="w-16 h-16" />

                        <span className="ml-2 truncate">Se déconnecter</span>
                      </button>
                    </SignOutButton>
                  ) : (
                    <SignInButton mode="modal">
                      <button
                        className="flex items-center w-full h-16 "
                        title="Sign In"
                      >
                        <LogIn className="w-16 h-16" />
                        <span className="ml-2 truncate">Se connecter</span>
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
