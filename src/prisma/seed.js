const { PrismaClient } = require("@prisma/client");
const { hash } = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  await prisma.transactionItem.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.invoice.deleteMany(); // Clear invoices
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
  for (let i = 1; i <= 13; i++) {
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
  for (let i = 1; i <= 15; i++) {
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

    // Add 2 dummy invoice images per product
    await prisma.invoice.createMany({
      data: [
        {
          productId: product.id,
          image: `https://picsum.photos/seed/invoice${i}a/300/200`,
        },
        {
          productId: product.id,
          image: `https://picsum.photos/seed/invoice${i}b/300/200`,
        },
      ],
    });

    products.push(product);
  }

  // Generate 15 transactions with random products
  for (let t = 1; t <= 15; t++) {
    const randomKeeper =
      keeperUsers[Math.floor(Math.random() * keeperUsers.length)];

    // Pick 2–3 random products per transaction
    const items = [];
    const numberOfItems = Math.floor(Math.random() * 2) + 2; // 2 or 3 items
    const selectedProducts = [...products]
      .sort(() => 0.5 - Math.random())
      .slice(0, numberOfItems);

    for (const product of selectedProducts) {
      const quantity = Math.floor(Math.random() * 3) + 1;
      items.push({
        productId: product.id,
        quantity,
        unitPrice: product.price,
        totalPrice: parseFloat((product.price * quantity).toFixed(2)),
      });
    }

    await prisma.transaction.create({
      data: {
        custName: `Customer ${t}`,
        phone: `08123${Math.floor(1000000 + Math.random() * 8999999)}`,
        status: "PAID",
        createdById: randomKeeper.id,
        items: {
          create: items,
        },
      },
    });
  }

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
