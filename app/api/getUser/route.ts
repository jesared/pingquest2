import { getPrismaClient } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const prisma = getPrismaClient();

  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      include: { role: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        id: user.id,
        email: user.email,
        image: user.image, // On retourne l'image si elle existe
        name: user.name, // Le nom de l'utilisateur
        role: user.role?.name || null,
        bio: user.bio,
        website: user.website,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user data", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
