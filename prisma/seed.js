const { PrismaClient } = require("@prisma/client");
const { hash } = require("bcryptjs");

const prisma = new PrismaClient();

function getRandomRupiah(min = 10000, max = 10_000_000) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  // Clean up in correct order
  await prisma.transactionItem.deleteMany();
  await prisma.productInvoice.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.product.deleteMany();
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
  for (let i = 1; i <= 5; i++) {
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

    const price = getRandomRupiah();

    const product = await prisma.product.create({
      data: {
        name: `Product ${j}`,
        description: `Description for Product ${j}`,
        image: `https://picsum.photos/200?random=${j}`,
        price,
        stock: Math.floor(Math.random() * 50) + 10,
        categoryId: randomCategory.id,
        createdById: randomKeeper.id,
      },
    });

    products.push(product);
  }

  // // Create Transactions with Invoice
  // for (let k = 1; k <= 15; k++) {
  //   const randomKeeper =
  //     keeperUsers[Math.floor(Math.random() * keeperUsers.length)];
  //   const numberOfItems = Math.floor(Math.random() * 2) + 2;
  //   const selectedProducts = [...products]
  //     .sort(() => 0.5 - Math.random())
  //     .slice(0, numberOfItems);

  //   const items = selectedProducts.map((product) => {
  //     const quantity = Math.floor(Math.random() * 3) + 1;
  //     const unitPrice = getRandomRupiah();
  //     const totalPrice = unitPrice * quantity;

  //     return {
  //       productId: product.id,
  //       quantity,
  //       unitPrice,
  //       totalPrice,
  //     };
  //   });

  //   // Create the transaction first
  //   const transaction = await prisma.transaction.create({
  //     data: {
  //       custName: `Customer ${k}`,
  //       phone: `08123${Math.floor(1000000 + Math.random() * 8999999)}`,
  //       status: "PAID",
  //       createdById: randomKeeper.id,
  //       items: { create: items },
  //     },
  //   });

  //   // Create the invoice and relate it to the transaction
  //   await prisma.invoice.create({
  //     data: {
  //       transactionId: transaction.id,
  //       image: `https://picsum.photos/seed/invoice${k}/300/200`,
  //       productInvoices: {
  //         create: items.map((item) => ({
  //           productId: item.productId,
  //           quantity: item.quantity,
  //           unitPrice: item.unitPrice,
  //         })),
  //       },
  //     },
  //   });
  // }

  console.log("🌱 Seed data created!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
