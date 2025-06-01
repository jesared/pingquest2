import { prisma } from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { userBio, userWebsite } = await request.json();
  const { userId: authenticatedUserId } = getAuth(request);

  if (!authenticatedUserId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const user = await prisma.user.update({
      where: { clerkUserId: authenticatedUserId },
      data: {
        bio: userBio,
        website: userWebsite,
      },
    });
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error updating user data", error);
    return NextResponse.json(
      { error: "Error updating user  data" },
      { status: 500 }
    );
  }
}
