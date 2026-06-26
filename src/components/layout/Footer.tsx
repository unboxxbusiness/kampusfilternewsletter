import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[#e5e5e5] dark:border-[#14213d] py-8 px-6 md:px-12 text-center text-sm text-[#14213d]/60 dark:text-[#e5e5e5]/60 transition-colors">
      <div className="flex justify-center gap-6 mb-4">
        <Link href="/archive" className="hover:text-[#fca311] transition-colors hover:underline">Archive</Link>
        <Link href="/about" className="hover:text-[#fca311] transition-colors hover:underline">About</Link>
        <Link href="/terms" className="hover:text-[#fca311] transition-colors hover:underline">Terms</Link>
        <Link href="/privacy" className="hover:text-[#fca311] transition-colors hover:underline">Privacy</Link>
        <Link href="/contact" className="hover:text-[#fca311] transition-colors hover:underline">Contact</Link>
      </div>
      <p>&copy; {new Date().getFullYear()} Kampus Filter. All rights reserved.</p>
    </footer>
  );
}
