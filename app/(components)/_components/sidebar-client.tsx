"use client";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import {
  CircleDollarSignIcon,
  LayoutGridIcon,
  LucidePackage,
  SunIcon,
  MoonIcon,
  MenuIcon,
  LogOutIcon,
  UserIcon,
} from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/app/_components/ui/sheet";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { logout } from "@/app/_actions/auth/logout";

/* Links de navegação reutilizados entre desktop e mobile */
const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutGridIcon },
  { href: "/products", label: "Produtos", icon: LucidePackage },
  { href: "/sales", label: "Vendas", icon: CircleDollarSignIcon },
];

interface SidebarClientProps {
  userName: string;
  children: React.ReactNode;
}

export default function SidebarClient({
  userName,
  children,
}: SidebarClientProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  /* Botão de tema reutilizado */
  const themeToggle = (
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
  );

  /* Links sociais reutilizados */
  const socialLinks = (
    <div className="flex gap-2">
      <Link href="https://github.com/joaoviitordev" target="_blank">
        <FontAwesomeIcon icon={faGithub} className="cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out" size="2x" />
      </Link>
      <Link href="https://www.linkedin.com/in/joaovitor-faria/" target="_blank">
        <FontAwesomeIcon icon={faLinkedin} className="cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out" size="2x" />
      </Link>
    </div>
  );

  /* Informações do usuário + logout */
  const userSection = (
    <div className="flex flex-col gap-2 w-full items-center">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <UserIcon className="size-4" />
        <span className="truncate max-w-[120px]" title={userName}>
          {userName}
        </span>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="cursor-pointer gap-2 text-muted-foreground hover:text-destructive w-full"
        onClick={() => logout()}
      >
        <LogOutIcon className="size-4" />
        Sair
      </Button>
    </div>
  );

  /* Links de navegação renderizados */
  const renderNavLinks = (onNavigate?: () => void) =>
    navLinks.map(({ href, label, icon: Icon }) => (
      <Button
        key={href}
        variant={pathname === href ? "default" : "ghost"}
        className="flex items-center justify-start"
        nativeButton={false}
        render={
          <Link
            href={href}
            className="flex items-center gap-2"
            onClick={onNavigate}
          />
        }
      >
        <Icon />
        {label}
      </Button>
    ));

  return (
    <div className="flex flex-col lg:flex-row">
      {/* ═══════════════════════════════════════════════════
          MOBILE HEADER — visível apenas em telas < lg
      ═══════════════════════════════════════════════════ */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 h-14 bg-muted border-b border-border">
        <Link href="/" className="hover:scale-105 transition-all duration-300 ease-in-out">
          <h1 className="font-black text-2xl">STOCKLY</h1>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="cursor-pointer"
          onClick={() => setMobileOpen(true)}
        >
          <MenuIcon className="size-6" />
          <span className="sr-only">Abrir menu</span>
        </Button>
      </header>

      {/* Sheet (drawer) lateral para mobile */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 px-6 py-4 flex flex-col gap-4">
          <SheetHeader className="p-0">
            <SheetTitle className="text-center">
              <Link
                href="/"
                className="font-black text-2xl"
                onClick={() => setMobileOpen(false)}
              >
                STOCKLY
              </Link>
            </SheetTitle>
            <SheetDescription className="sr-only">
              Menu de navegação
            </SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-2">
            {renderNavLinks(() => setMobileOpen(false))}
          </div>
          <div className="flex flex-1 flex-col items-center justify-end gap-4 pb-4">
            {userSection}
            <div className="flex items-center gap-4">
              {themeToggle}
              {socialLinks}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* ═══════════════════════════════════════════════════
          DESKTOP SIDEBAR — visível apenas em telas ≥ lg
      ═══════════════════════════════════════════════════ */}
      <div className="hidden lg:flex h-screen w-52 px-6 py-4 flex-col gap-4 bg-muted items-center justify-start sticky top-0">
        <Link href="/" className="cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out w-full flex justify-center">
          <h1 className="font-black text-3xl">STOCKLY</h1>
        </Link>
        <div className="flex flex-col gap-2 w-full">
          {renderNavLinks()}
        </div>
        <div className="w-full h-full flex flex-1 flex-col items-center justify-end gap-4 pb-4">
          {userSection}
          <div className="flex items-center gap-4">
            {themeToggle}
            {socialLinks}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
          CONTEÚDO PRINCIPAL
          pt-14 em mobile para compensar o header fixo
      ═══════════════════════════════════════════════════ */}
      <main className="flex-1 pt-14 lg:pt-0 min-h-screen">
        {children}
      </main>
    </div>
  );
}
