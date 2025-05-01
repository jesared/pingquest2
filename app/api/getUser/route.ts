import { getPrismaClient } from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const prisma = getPrismaClient();

  try {
    const { userId: requestedUserId } = await request.json(); // Si vous attendez un ID spécifique dans le body
    const { userId: authenticatedUserId } = getAuth(request);

    if (!authenticatedUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let userIdToSearch = authenticatedUserId;

    // Si vous attendez un userId spécifique dans le body ET que l'utilisateur authentifié a la permission de le voir
    // (vous devrez implémenter cette logique d'autorisation)
    if (
      requestedUserId &&
      requestedUserId !==
        authenticatedUserId /* && checkPermissions(authenticatedUserId, requestedUserId) */
    ) {
      userIdToSearch = requestedUserId;
    }

    const user = await prisma.user.findUnique({
      where: { clerkUserId: userIdToSearch },
      include: {
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error fetching user data", error);
    return NextResponse.json(
      { error: "Error fetching user  data" },
      { status: 500 }
    );
  }
}
