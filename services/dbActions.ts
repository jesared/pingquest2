import { getPrismaClient } from "@/lib/prisma";

export const addUserToDatabase = async (
  clerkUserId: string,
  name: string,
  email: string,
  image: string
) => {
  const prisma = getPrismaClient();

  try {
    const role = await prisma.role.findUnique({
      where: { name: "member" },
    });

    if (!role) {
      throw new Error("Role not found");
    }

    const user = await prisma.user.upsert({
      where: { clerkUserId },
      update: {
        name,
        email,
        image,
      },
      create: {
        clerkUserId,
        name,
        email,
        image,
        roleId: role.id,
      },
    });
    return user;
  } catch (error) {
    console.error("Error adding user to database", error);
    throw error;
  }
};

export const getRole = async (clerkUserId: string) => {
  const prisma = getPrismaClient();
  try {
    const user = await prisma.user.findUnique({
      where: { clerkUserId },
      include: {
        role: true,
      },
    });
    return user;
  } catch (error) {
    console.error("Error getting role", error);
    throw error;
  }
};

export const getUserId = async (clerkUserId: string) => {
  const prisma = getPrismaClient();
  try {
    const user = await prisma.user.findUnique({
      where: { clerkUserId },
      select: {
        id: true,
        role: true, // ajoute ceci si ce n'est pas déjà présent
      },
    });
    return user;
  } catch (error) {
    console.error("Error getting role", error);
    throw error;
  }
};

export async function getTournoisByOrganisateur(clerkUserId: string) {
  const prisma = getPrismaClient();
  const user = await getUserId(clerkUserId);
  const tournois = await prisma.tournoi.findMany({
    where: {
      userId: user?.id,
    },
    orderBy: {
      debut: "desc",
    },
  });
  return tournois;
}
