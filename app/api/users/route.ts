import { getPrismaClient } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const prisma = getPrismaClient();
  try {
    const data = await request.json();
    const user = await prisma.user.create({
      data: {
        ...data,
        technologies: JSON.stringify(data.technologies),
      },
    });
    return NextResponse.json(user);
  } catch (error) {
    console.error("Erreur API:", error); // 🔍 Log du détail
    return NextResponse.json(
      { error: "Erreur lors de la création de l'utilisateur" },
      { status: 500 }
    );
  }
}
