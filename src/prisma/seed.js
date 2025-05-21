const { PrismaClient } = require("@prisma/client");
const { hash } = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  // Clear previous data (optional in development)
  await prisma.user.deleteMany();

  // Create dummy users
  const passwordHash = await hash("password123", 10);

  const createAction = await prisma.user.createMany({
    data: [
      {
        username: "Jamaludin21",
        password: passwordHash,
        role: "MANAGER",
        name: "Jamaludin Hakim Harsoyo",
        email: "jamaludin.harsoyo@asaba.co.id",
      },
      {
        username: "Alvin21",
        password: passwordHash,
        role: "MANAGER",
        name: "Muhammad Alfain",
        email: "msalfain@gmail.com",
      },
      {
        username: "Joko21",
        password: passwordHash,
        role: "KEEPER",
        name: "Joko Tingkir",
        email: "jokotingkir@gmail.com",
      },
      {
        username: "Jaka21",
        password: passwordHash,
        role: "KEEPER",
        name: "Jaka Anwar",
        email: "jakaanwar@gmail.com",
      },
    ],
  });

  console.log("Seeding finished!");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
