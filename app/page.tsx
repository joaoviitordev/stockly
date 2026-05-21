import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "./_components/ui/button";
import Link from "next/link";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";

export default function Home() {
  return (
    <div className="flex flex-col gap-4 items-center justify-center w-full h-screen">
      <h1 className="text-5xl font-black">STOCKLY</h1>
      <p className="text-muted-foreground w-90 text-center font-semibold">
        Gerencie suas vendas, produtos e estoques de forma simples e eficiente.
      </p>
      <Link href="/dashboard">
        <Button className="w-30 h-10 text-md rounded-2xl hover:bg-muted hover:border-2 hover:border-foreground hover:text-foreground cursor-pointer transition-all">
          Começar
        </Button>
      </Link>
      <div className="flex gap-4 fixed bottom-4 justify-center">
        <Link href="https://github.com/joaoviitordev" target="_blank">
          <FontAwesomeIcon
            icon={faGithub}
            className="cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out w-8 h-8"
            size="xl"
          />
        </Link>
        <Link href="https://www.linkedin.com/in/joaoviitordev" target="_blank">
          <FontAwesomeIcon
            icon={faLinkedin}
            className="cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out w-8 h-8"
            size="xl"
          />
        </Link>
      </div>
    </div>
  );
}
