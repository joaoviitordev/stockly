import * as dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";

import { PrismaPg } from "@prisma/adapter-pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Iniciando seed do banco de dados...");

  // Limpa produtos existentes
  await prisma.product.deleteMany();

  const products = await prisma.product.createMany({
    data: [
      { name: "Notebook Dell Inspiron", price: 3499.99, stock: 12 },
      { name: "Monitor LG 24\"", price: 899.9, stock: 8 },
      { name: "Teclado Mecânico Redragon", price: 249.99, stock: 25 },
      { name: "Mouse Logitech MX Master 3", price: 599.0, stock: 0 },
      { name: "Headset HyperX Cloud II", price: 449.9, stock: 5 },
      { name: "Webcam Logitech C920", price: 329.99, stock: 3 },
      { name: "SSD Kingston 1TB", price: 379.9, stock: 18 },
      { name: "Memória RAM Corsair 16GB", price: 219.9, stock: 0 },
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
