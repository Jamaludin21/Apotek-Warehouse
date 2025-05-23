const { PrismaClient } = require("@prisma/client");
const { hash } = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  await prisma.transactionItem.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await hash("password123", 10);

  // Manager accounts
  await prisma.user.createMany({
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
    ],
  });

  // Keeper accounts
  const keeperUsers = [];
  for (let i = 1; i <= 6; i++) {
    const keeper = await prisma.user.create({
      data: {
        username: `keeper${i}`,
        password: passwordHash,
        role: "KEEPER",
        name: `Keeper ${i}`,
        email: `keeper${i}@example.com`,
      },
    });
    keeperUsers.push(keeper);
  }

  // Categories
  const categoryNames = [
    "Electronics",
    "Groceries",
    "Clothing",
    "Stationery",
    "Health",
  ];
  const categories = [];
  for (let name of categoryNames) {
    const category = await prisma.category.create({
      data: { name },
    });
    categories.push(category);
  }

  // Products (12)
  const products = [];
  for (let i = 1; i <= 12; i++) {
    const randomCategory =
      categories[Math.floor(Math.random() * categories.length)];
    const randomKeeper =
      keeperUsers[Math.floor(Math.random() * keeperUsers.length)];
    const product = await prisma.product.create({
      data: {
        name: `Product ${i}`,
        description: `Description for Product ${i}`,
        image: `https://picsum.photos/200?random=${i}`,
        price: parseFloat((Math.random() * 100 + 10).toFixed(2)),
        stock: Math.floor(Math.random() * 50) + 10,
        categoryId: randomCategory.id,
        createdById: randomKeeper.id,
      },
    });
    products.push(product);
  }

  // Sample transaction
  const transaction = await prisma.transaction.create({
    data: {
      custName: "John Doe",
      phone: "081234567890",
      status: "PAID",
      createdById: keeperUsers[0].id,
      items: {
        create: [
          {
            productId: products[0].id,
            quantity: 2,
            unitPrice: products[0].price,
            totalPrice: parseFloat((products[0].price * 2).toFixed(2)),
          },
          {
            productId: products[2].id,
            quantity: 1,
            unitPrice: products[2].price,
            totalPrice: parseFloat((products[2].price * 1).toFixed(2)),
          },
        ],
      },
    },
  });

  console.log("🌱 Seed data has been created successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
