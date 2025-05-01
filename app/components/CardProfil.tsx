"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function CardProfil({ userId }: { userId: string }) {
  interface UserData {
    image?: string;
    name?: string;
  }

  const [data, setData] = useState<UserData | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch("/api/getUser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        });
        if (!res.ok) {
          throw new Error("Error fetching user data");
        }

        const userData = await res.json();
        setData(userData);
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };
    fetchUserData();
  }, [userId]);
  console.log("data", data);
  if (error) {
    return toast.error(error);
  }
  return (
    <div className="mx-auto">
      <div className="flex justify-center items-center gap-4">
        {data?.image && (
          <div className="w-[150px] h-[150px] rounded-full border-2  overflow-hidden ring-2 ring-accent">
            <Image
              src={data.image}
              alt={data.image}
              width={150}
              height={150}
              className="object-cover w-full h-full"
            />
          </div>
        )}
      </div>
      <div className="text-center uppercase mb-4">
        <h1 className="text-2xl font-black text-gray-500">Tableau de bord</h1>
        <h3 className="text-xl font-black text-primary">{data?.name}</h3>
      </div>
    </div>
  );
}
