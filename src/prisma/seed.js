const { PrismaClient } = require("@prisma/client");
const { hash } = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  // Clear previous data (optional in development)
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();
  await prisma.product.deleteMany();

  // Create dummy users
  const passwordHash = await hash("password123", 10);

  const manager = await prisma.user.create({
    data: {
      username: "Jamaludin21",
      password: passwordHash,
      role: "MANAGER",
      name: "Jamaludin Hakim Harsoyo",
      email: "jamaludin.harsoyo@asaba.co.id",
    },
  });

  const keeper = await prisma.user.create({
    data: {
      username: "Dika21",
      password: passwordHash,
      role: "KEEPER",
      name: "Andhika Wisnu Saputra",
      email: "dikaws21@gmail.com",
    },
  });

  // Create a dummy product
  const product = await prisma.product.create({
    data: {
      name: "Paracetamol",
      stock: 100,
      price: 5.0,
    },
  });

  console.log("Seeding finished!");
  console.log({ manager, keeper, product });
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
