import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <Link href="/">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black">STOCKLY</h1>
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}
