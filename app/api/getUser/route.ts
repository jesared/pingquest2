// app/api/getUser/route.ts
import { getPrismaClient } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST() {
  const prisma = getPrismaClient();

  const { userId } = await auth();

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
      image: user.image,
      name: user.name,
      role: user.role?.name || null,
      bio: user.bio,
      website: user.website,
    },
    { status: 200 }
  );
}
