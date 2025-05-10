"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function FormUpdate({ userId }: { userId: string }) {
  const [formData, setFormData] = useState({
    bio: "",
    website: "",
    name: "",
    email: "",
  });

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
        const result = await res.json();

        if (res.ok) {
          setFormData({
            bio: result.bio || "",
            website: result.website || "",
            name: result.name,
            email: result.email,
          });
        } else {
          toast.error("Error fetching user data");
        }
      } catch (error) {
        console.error(error);
        toast.error("Error fetching user data");
      }
    };
    fetchUserData();
  }, [userId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch("api/updateUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          userBio: formData.bio,
          userWebsite: formData.website,
        }),
      });
      const result = await res.json();

      if (res.ok) {
        toast.success("Profil mis à jour avec succès !");
      } else {
        toast.error(result.error || "Erreur lors de la mise à jour du profil.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating user data");
    }
  };

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit} className="">
          <FormItem>
            <input type="hidden" name="id" value={userId} />
            <Label htmlFor="name">Nom</Label>
            <Input name="name" id="name" disabled value={formData.name} />
          </FormItem>
          <FormItem className="mt-2">
            <Label htmlFor="email">Email</Label>
            <Input name="email" id="email" disabled value={formData.email} />
          </FormItem>
          <FormItem className="mt-2">
            <Label htmlFor="bio">Description</Label>
            <Textarea
              placeholder="votre description"
              onChange={handleChange}
              id="bio"
              value={formData.bio}
              name="bio"
            />
          </FormItem>
          <FormItem className="mt-2">
            <Label htmlFor="website">Site internet</Label>
            <Input
              placeholder="votre site internet"
              onChange={handleChange}
              id="website"
              value={formData.website}
              name="website"
            />
          </FormItem>
          <Button type="submit" className="mt-4 cursor-pointer">
            Modifier
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
