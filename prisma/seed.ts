import * as dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";

import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Iniciando seed do banco de dados...");

  // Limpa dados existentes
  await prisma.saleProduct.deleteMany();
  await prisma.sale.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // Cria um usuário de demonstração
  const hashedPassword = await bcrypt.hash("123456", 10);
  const user = await prisma.user.create({
    data: {
      name: "Usuário Demo",
      email: "demo@stockly.com",
      password: hashedPassword,
    },
  });

  console.log(`👤 Usuário demo criado: ${user.email}`);

  const products = await prisma.product.createMany({
    data: [
      { name: "Notebook Dell Inspiron", price: 3499.99, stock: 12, userId: user.id },
      { name: "Monitor LG 24\"", price: 899.9, stock: 8, userId: user.id },
      { name: "Teclado Mecânico Redragon", price: 249.99, stock: 25, userId: user.id },
      { name: "Mouse Logitech MX Master 3", price: 599.0, stock: 0, userId: user.id },
      { name: "Headset HyperX Cloud II", price: 449.9, stock: 5, userId: user.id },
      { name: "Webcam Logitech C920", price: 329.99, stock: 3, userId: user.id },
      { name: "SSD Kingston 1TB", price: 379.9, stock: 18, userId: user.id },
      { name: "Memória RAM Corsair 16GB", price: 219.9, stock: 0, userId: user.id },
    ],
  });

  console.log(`✅ ${products.count} produtos inseridos com sucesso!`);
}

main()
  .catch((e) => {
    console.error("❌ Erro ao executar seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
