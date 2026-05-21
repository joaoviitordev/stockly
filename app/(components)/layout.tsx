"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import {
  CircleDollarSignIcon,
  LayoutGridIcon,
  LucidePackage,
  SunIcon,
  MoonIcon,
} from "lucide-react";
import { Button } from "../_components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";

export default function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex">
      <div className="h-screen w-52 px-6 py-4 flex flex-col gap-4 bg-muted items-center justify-start">
        <Link href="/" className="cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out w-full flex justify-center"><h1 className="font-black text-3xl">STOCKLY</h1></Link>
        <div className="flex flex-col gap-2 w-full">
          <Button
            variant={pathname === "/dashboard" ? "default" : "ghost"}
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
            variant={pathname === "/products" ? "default" : "ghost"}
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
            variant={pathname === "/sales" ? "default" : "ghost"}
            className="flex items-center justify-start"
            nativeButton={false}
            render={<Link href="/sales" className="flex items-center gap-2" />}
          >
            <CircleDollarSignIcon />
            Vendas
          </Button>
        </div>
        <div className="w-full h-full flex flex-1 flex-col items-center justify-end pb-4 gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <SunIcon className="size-8 rotate-0 scale-100 transition-transform duration-300 dark:-rotate-90 dark:scale-0" />
            <MoonIcon className="absolute size-8 rotate-90 scale-0 transition-transform duration-300 dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Alternar tema</span>
          </Button>
          <div className="flex gap-2">
            <Link href="https://github.com/joaoviitordev" target="_blank">
              <FontAwesomeIcon icon={faGithub} className="cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out" size="2x" />
            </Link>
            <Link href="https://www.linkedin.com/in/joaoviitordev" target="_blank">
              <FontAwesomeIcon icon={faLinkedin} className="cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out" size="2x" />
            </Link>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}

