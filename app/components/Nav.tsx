import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Nav() {
  return (
    <nav className="w-full h-[50px] p-2 flex items-center justify-between border-b">
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              <Link href="/dashboard" className="flex items-center">
                Dashboard
              </Link>
            </MenubarItem>
            <MenubarItem>
              <Link href="/dashboard/ajout" className="flex items-center">
                Ajout
              </Link>
            </MenubarItem>
            <MenubarItem>
              <Link
                href="/dashboard/inscriptions"
                className="flex items-center"
              >
                Inscriptions
              </Link>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </nav>
  );
}
