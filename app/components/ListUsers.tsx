"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserTypeData } from "@/types/types";
import { Edit } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import DeletedUserButton from "./DeletedUserButton";

export default function ListUsers() {
  const [users, setUsers] = useState<UserTypeData[]>([]);

  const fetchAllUsers = async () => {
    try {
      const res = await fetch("/api/getAllUsers", {
        method: "GET",
        cache: "no-store",
      });
      console.log("Status:", res.status);
      if (!res.ok) {
        throw new Error("Errur lors de la récupération des utilisateurs");
      }
      const data: UserTypeData[] = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs", error);
      toast.error("Erreur lors de la récupération des utilisateurs");
    }
  };
  useEffect(() => {
    fetchAllUsers();
  }, []);

  console.log("Users trouvés :", users.length);

  return (
    <Card className="mt-2">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                {user.image && (
                  <div className="w-[32px] h-[32px] rounded-full border-1  overflow-hidden ring-2 ring-accent">
                    <Image
                      src={user.image}
                      alt=""
                      width={32}
                      height={32}
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
              </TableCell>
              <TableCell>{user.role?.name}</TableCell>
              <TableCell>
                <div className="flex justify-between items-center">
                  <Link href={`/dashboard/edit/${user.clerkUserId}`}>
                    <Button
                      variant={"outline"}
                      size="icon"
                      className="cursor-pointer rounded-full"
                    >
                      <Edit />
                    </Button>
                  </Link>
                  <DeletedUserButton id={user.id as string} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
