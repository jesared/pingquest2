import { getPrismaClient } from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
  const { id } = await request.json();

  const prisma = getPrismaClient();

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
    await prisma.user.delete({
      where: { id },
    });
    return NextResponse.json({ message: "User deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleted user data", error);
    return NextResponse.json(
      { error: "Error deleted user  data" },
      { status: 500 }
    );
  }
}
