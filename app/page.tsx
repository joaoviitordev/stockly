import { Button } from "./_components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col gap-4 items-center justify-center w-full h-screen">
      <h1 className="text-4xl font-black">STOCKLY</h1>
      <p className="text-muted-foreground w-90 text-center">
        Gerencie suas vendas, produtos e estoques de forma simples e eficiente.
      </p>
      <Link href="/dashboard">
        <Button className="w-30 h-10 rounded-2xl hover:bg-gray-100 hover:border-2 hover:border-black hover:text-black cursor-pointer transition-all">
          Começar
        </Button>
      </Link>
    </div>
  );
}
