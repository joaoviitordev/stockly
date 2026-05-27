// Router Handlers - Product Module (Apenas para referência, não está sendo usado no projeto final)

import { db } from "@/app/_lib/prisma";
import { verifySession } from "@/app/_lib/session";

export async function GET() {
  const { userId } = await verifySession();
  const products = await db.product.findMany({
    where: { userId },
  });
  return Response.json(products, { status: 200 });
}
