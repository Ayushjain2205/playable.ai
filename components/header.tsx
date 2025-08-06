import Image from "next/image";

import logo from "@/public/new_logo.png";
import Link from "next/link";

export default function Header() {
  return (
    <header className="relative mx-auto flex w-full shrink-0 items-center justify-center py-6">
      <div className="flex w-full max-w-6xl items-center justify-between px-4">
        <Link href="/">
          <div className="flex items-center gap-2 align-middle">
            <Image
              src={logo}
              alt=""
              quality={100}
              className="h-9 w-auto object-contain align-middle"
              priority
            />
            <span className="flex items-baseline text-2xl font-bold tracking-wide">
              <span className="font-pixel leading-none text-text-primary">
                Zapp
              </span>
              <span className="font-heading leading-none text-text-primary">
                mint
              </span>
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-6">
          <Link
            href="/test-token-factory"
            className="text-sm font-medium text-text-primary/70 transition-colors hover:text-text-primary"
          >
            🧪 Test Token Factory
          </Link>
        </nav>
      </div>
    </header>
  );
}
