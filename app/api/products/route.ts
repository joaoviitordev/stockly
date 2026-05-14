// Router Handlers - Product Module (Apenas para referência, não está sendo usado no projeto final)

import { db } from "@/app/_lib/prisma";

export async function GET() {
  const products = await db.product.findMany();
  return Response.json(products, { status: 200 });
}
