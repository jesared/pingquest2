import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    if (!process.env.CLERK_SECRET_KEY) {
      console.error("CLERK_SECRET_KEY non définie");
      return NextResponse.json(
        { error: "Configuration Clerk manquante" },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const userId = formData.get("userId") as string;
    const file = formData.get("file") as File;

    if (!userId || !file || !file.name || !file.type || !file.size) {
      console.log("Données manquantes:", { userId, file });
      return NextResponse.json(
        { error: "userId ou fichier manquant" },
        { status: 400 }
      );
    }

    const clerkApiUrl = `https://api.clerk.com/v1/users/${userId}/profile_image`;
    const formDataForClerk = new FormData();
    formDataForClerk.append("file", file);

    const response = await fetch(clerkApiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
      body: formDataForClerk,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erreur API Clerk:", errorData);
      return NextResponse.json(
        {
          error: errorData.errors || "Erreur lors de la mise à jour de l'image",
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("Réponse API Clerk:", data);
    return NextResponse.json({
      success: true,
      imageUrl: data.image_url,
    });
  } catch (error) {
    console.error("Erreur dans /api/upload-avatar:", error);
    return NextResponse.json({ error: `Erreur serveur` }, { status: 500 });
  }
}
