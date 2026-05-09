import { CircleDollarSignIcon, LayoutGridIcon, LucidePackage } from "lucide-react";

export default function SidebarLayout() {
    return (
        <div className="h-screen w-60 px-6 py-4 flex flex-col gap-4 bg-gray-100">
            <h1 className="font-extrabold text-2xl px-4">STOCKLY</h1>
            <div className="flex flex-col gap-2">
                <button className="cursor-pointer flex items-center gap-2 px-4 py-2">
                    <LayoutGridIcon size={20} />
                    Dashboard
                </button>
                <button className="cursor-pointer flex items-center gap-2 px-4 py-2">
                    <LucidePackage size={20} />
                    Produtos
                </button>
                <button className="cursor-pointer flex items-center gap-2 px-4 py-2">
                    <CircleDollarSignIcon size={20} />
                    Vendas
                </button>
            </div>
        </div>
    )
}