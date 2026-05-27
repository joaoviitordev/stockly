import { verifySession } from "@/app/_lib/session";
import { db } from "@/app/_lib/prisma";
import SidebarClient from "./_components/sidebar-client";

export default async function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await verifySession();

  const user = await db.user.findUnique({
    where: { id: userId },
    select: { name: true },
  });

  return (
    <SidebarClient userName={user?.name ?? "Usuário"}>
      {children}
    </SidebarClient>
  );
}
