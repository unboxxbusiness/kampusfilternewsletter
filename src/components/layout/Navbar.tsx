import Link from "next/link";
import ThemeToggle from "@/components/common/ThemeToggle";
import NavbarLogo from "@/components/layout/NavbarLogo";

export default function Navbar() {
  return (
    <header className="sticky top-0 bg-[#ffffff]/90 dark:bg-[#000000]/90 backdrop-blur-md z-40 border-b border-[#e5e5e5] dark:border-[#14213d] py-3 px-6 md:px-12 flex justify-between items-center transition-all duration-300">
      <NavbarLogo />

      {/* Desktop Navigation Links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
        <Link href="/archive" className="text-[#14213d]/70 dark:text-[#e5e5e5]/70 hover:text-[#14213d] dark:hover:text-[#ffffff] transition font-medium">
          Archive
        </Link>
        <Link href="/finder" className="text-[#14213d]/70 dark:text-[#e5e5e5]/70 hover:text-[#14213d] dark:hover:text-[#ffffff] transition font-medium">
          Opportunity
        </Link>
        <Link href="/about" className="text-[#14213d]/70 dark:text-[#e5e5e5]/70 hover:text-[#14213d] dark:hover:text-[#ffffff] transition font-medium">
          About
        </Link>
        <ThemeToggle />
        <Link
          href="/"
          className="bg-[#fca311] text-[#000000] px-4 py-2 hover:bg-[#e6930f] transition-all duration-200 rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm"
        >
          Join Free
        </Link>
      </nav>

      {/* Mobile Top Actions */}
      <div className="flex md:hidden items-center gap-3">
        <ThemeToggle />
        <Link
          href="/"
          className="bg-[#fca311] text-[#000000] px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wide uppercase hover:bg-[#e6930f] transition-all duration-200"
        >
          Join Free
        </Link>
      </div>
    </header>
  );
}


