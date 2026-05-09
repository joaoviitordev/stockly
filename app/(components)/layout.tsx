"use client";

import {
  CircleDollarSignIcon,
  LayoutGridIcon,
  LucidePackage,
} from "lucide-react";
import { Button } from "../_components/ui/button";
import Link from "next/link";
import { usePathname } from 'next/navigation'

export default function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <div className="flex">
      <div className="h-screen w-52 px-6 py-4 flex flex-col gap-4 bg-gray-100 items-center justify-start">
        <h1 className="font-extrabold text-3xl">STOCKLY</h1>
        <div className="flex flex-col gap-2 w-full">
          <Button
            variant={pathname === '/dashboard' ? 'default' : 'ghost'}
            className="flex items-center justify-start"
            nativeButton={false}
            render={
              <Link href="/dashboard" className="flex items-center gap-2" />
            }
          >
            <LayoutGridIcon />
            Dashboard
          </Button>
          <Button
            variant={pathname === '/products' ? 'default' : 'ghost'}
            className="flex items-center justify-start"
            nativeButton={false}
            render={
              <Link href="/products" className="flex items-center gap-2" />
            }
          >
            <LucidePackage />
            Produtos
          </Button>
          <Button
            variant={pathname === '/sales' ? 'default' : 'ghost'}
            className="flex items-center justify-start"
            nativeButton={false}
            render={<Link href="/sales" className="flex items-center gap-2" />}
          >
            <CircleDollarSignIcon />
            Vendas
          </Button>
        </div>
      </div>
      {children}
    </div>
  );
}
