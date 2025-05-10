"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { AwardIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function SelectTournoi() {
  const [tournois, setTournois] = useState<{ id: number; nom: string }[]>([]);

  useEffect(() => {
    fetch("/api/tournois")
      .then((res) => res.json())
      .then(setTournois);
  }, []);

  return (
    <>
      <SidebarMenu>
        <Collapsible className="group/collapsible">
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton>
                <AwardIcon />
                <span className="text-[14px]">Tournois</span>
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {tournois.map((tournoi) => (
                  <SidebarMenuSubItem key={tournoi.id} className="border-b-2">
                    <Link href={`/tournois/${tournoi.id}`}>
                      <span className="text-[14px] hover:bg-accent">
                        {" "}
                        {tournoi.nom}
                      </span>
                    </Link>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      </SidebarMenu>
    </>
  );
}
