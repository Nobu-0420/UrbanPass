import Image from 'next/image';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center h-16 px-6 md:px-10 bg-white/90 backdrop-blur-md border-b border-navy/10">
      <a href="/" className="flex items-center gap-2">
        <Image
          src="/logo.svg"
          alt="Swappee"
          width={40}
          height={40}
          className="h-10 w-10"
        />
        <span className="text-navy font-semibold text-lg tracking-tight">Swappee</span>
      </a>
    </header>
  );
}
