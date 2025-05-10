import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // const userId = "5674c4c5-d389-469c-9b44-710c52c1beb9";

  // await prisma.user.update({
  //   where: { id: userId },
  //   data: {
  //     role: {
  //       connect: { name: "organisateur" },
  //     },
  //   },
  // });
  await prisma.role.upsert({
    where: { name: "member" },
    update: {},
    create: {
      name: "member",
    },
  });

  await prisma.role.upsert({
    where: { name: "admin" },
    update: {},
    create: {
      name: "admin",
    },
  });
  await prisma.role.upsert({
    where: { name: "organizer" },
    update: {},
    create: {
      name: "organizer",
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
