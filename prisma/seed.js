import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const userId = "59fe6085-8ed3-4368-9376-62204daeb634";

  await prisma.user.update({
    where: { id: userId },
    data: {
      role: {
        connect: { name: "admin" },
      },
    },
  });
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
