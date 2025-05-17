"use client";
import { Home, LogIn, LogOut, Settings, Trophy, Users } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";

import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";

import RoleTournoiButton from "./RoleTournoiButton";

export function AppSidebar() {
  const { isSignedIn } = useUser();

  const pathname = usePathname();
  const isActive = pathname === "/tournois";
  const items = [
    {
      title: "Home",
      url: "/",
      icon: Home,
    },
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Settings,
      authOnly: true,
    },
    {
      title: "Vos inscriptions",
      url: "/dashboard/inscriptions",
      icon: Users,
      authOnly: true,
    },
  ];

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarContent>
        <div className="p-2 flex justify-end"></div>
        <div className="flex items-center justify-center py-4">
          <Trophy className="w-8 h-8 font-light" strokeWidth={1} />
          <h4 className="ml-2 scroll-m-20 text-3xl font-extralight  tracking-tight">
            <span className="text-primary text-4xl font-bold">P</span>ing
            <span className="text-secondary text-4xl font-bold">Q</span>uest
          </h4>
        </div>

        <SidebarGroup className="space-y-3">
          <SidebarGroupContent>
            <SidebarMenu>
              {items
                .filter((item) => !item.authOnly || isSignedIn)
                .map((item) => {
                  const isActive = pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className={isActive ? "bg-primary text-white" : ""}
                      >
                        <Link href={item.url} title={item.title}>
                          <item.icon />
                          <span className="text-[16px]">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
            </SidebarMenu>
          </SidebarGroupContent>

          <SidebarSeparator className="p-0 m-0 my-4" />
          <SidebarGroupLabel>Tournois</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* button limiter au role admin et organizer */}
              <RoleTournoiButton />
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className={isActive ? "bg-primary text-white" : ""}
                >
                  <Link href="/tournois" title="Tous les tournois">
                    <Trophy />
                    <span className="text-[16px]">Tournois</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="p-0 m-0" />
        <div className="mt-auto">
          <SidebarSeparator className="p-0 mx-0 my-3" />
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="h-auto min-h-0 flex items-center cursor-pointer"
              >
                {isSignedIn ? (
                  <SignOutButton>
                    <button
                      className="flex items-center w-full h-16"
                      title="Sign Out"
                    >
                      <LogOut className="w-16 h-16" />
                      <span className="ml-2 truncate">Se déconnecter</span>
                    </button>
                  </SignOutButton>
                ) : (
                  <SignInButton mode="modal">
                    <button
                      className="flex items-center w-full h-16"
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
  );
}
