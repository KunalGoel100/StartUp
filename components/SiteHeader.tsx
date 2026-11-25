import Link from "next/link";

export default function SiteHeader() {
  return (
    <nav className="sticky top-0 z-50 border-b border-black/5 bg-[#f8f7f3]/88 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Link href="/" className="text-xl font-semibold tracking-[-0.04em]">Atelier Folk</Link>

        <div className="hidden items-center gap-8 text-sm text-[#6f756c] md:flex">
          <Link href="/#discover">Discover</Link>
          <Link href="/#makers">Makers</Link>
          <Link href="/#join">Join community</Link>
        </div>

        <div className="flex items-center gap-3">
        <Link
          href="/profile"
          className="rounded-full border border-[#dfe3da] bg-white px-5 py-2.5 text-sm font-medium text-[#2f3b31]">
          My Profile
        </Link>

        <Link
          href="/share-work"
          className="rounded-full bg-[#2f3b31] px-5 py-2.5 text-sm font-medium text-white">
          Share your work
        </Link>
      </div>
      </div>
    </nav>
  );
}

