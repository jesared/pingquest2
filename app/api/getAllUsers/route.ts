import { prisma } from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { userId: authenticatedUserId } = getAuth(request);

  if (!authenticatedUserId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const adminUser = await prisma.user.findUnique({
    where: { clerkUserId: authenticatedUserId },
    include: { role: true },
  });
  if (!adminUser || adminUser.role.name !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const users = await prisma.user.findMany({
      include: {
        role: true,
      },
    });

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Error fetching users data", error);
    return NextResponse.json(
      { error: "Error fetching users  data" },
      { status: 500 }
    );
  }
}
