const { PrismaClient } = require("@prisma/client");
const { hash } = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  // Bersihkan data dalam urutan yang benar
  await prisma.transactionItem.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.productInvoice.deleteMany(); // Tabel pivot
  await prisma.product.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await hash("password123", 10);

  // Create Manager Users
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

  // Create Keeper Users
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

  // Create Categories
  const categoryNames = [
    "Electronics",
    "Groceries",
    "Clothing",
    "Stationery",
    "Health",
  ];
  const categories = [];
  for (let name of categoryNames) {
    const category = await prisma.category.create({ data: { name } });
    categories.push(category);
  }

  // Create Products
  const products = [];
  for (let j = 1; j <= 20; j++) {
    const randomCategory =
      categories[Math.floor(Math.random() * categories.length)];
    const randomKeeper =
      keeperUsers[Math.floor(Math.random() * keeperUsers.length)];

    const product = await prisma.product.create({
      data: {
        name: `Product ${j}`,
        description: `Description for Product ${j}`,
        image: `https://picsum.photos/200?random=${j}`,
        price: parseFloat((Math.random() * 100 + 10).toFixed(2)),
        stock: Math.floor(Math.random() * 50) + 10,
        categoryId: randomCategory.id,
        createdById: randomKeeper.id,
      },
    });

    products.push(product);
  }

  // Create Invoices + ProductInvoice entries
  for (let p = 1; p <= 15; p++) {
    const invoice = await prisma.invoice.create({
      data: {
        image: `https://picsum.photos/seed/invoice${p}/300/200`,
      },
    });

    const numberOfItems = Math.floor(Math.random() * 3) + 1; // 1–3 products
    const selectedProducts = [...products]
      .sort(() => 0.5 - Math.random())
      .slice(0, numberOfItems);

    for (let product of selectedProducts) {
      const quantity = Math.floor(Math.random() * 10) + 1;
      const unitPrice = parseFloat(
        (product.price * (0.8 + Math.random() * 0.4)).toFixed(2)
      ); // simulate real cost

      await prisma.productInvoice.create({
        data: {
          productId: product.id,
          invoiceId: invoice.id,
          quantity,
          unitPrice,
        },
      });
    }
  }

  // Create Transactions
  for (let k = 1; k <= 15; k++) {
    const randomKeeper =
      keeperUsers[Math.floor(Math.random() * keeperUsers.length)];
    const numberOfItems = Math.floor(Math.random() * 2) + 2; // 2–3 items
    const selectedProducts = [...products]
      .sort(() => 0.5 - Math.random())
      .slice(0, numberOfItems);

    const items = selectedProducts.map((product) => {
      const quantity = Math.floor(Math.random() * 3) + 1;
      return {
        productId: product.id,
        quantity,
        unitPrice: product.price,
        totalPrice: parseFloat((product.price * quantity).toFixed(2)),
      };
    });

    await prisma.transaction.create({
      data: {
        custName: `Customer ${k}`,
        phone: `08123${Math.floor(1000000 + Math.random() * 8999999)}`,
        status: "PAID",
        createdById: randomKeeper.id,
        items: { create: items },
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
