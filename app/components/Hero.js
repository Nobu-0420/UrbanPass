'use client';

import HeroLogo from './HeroLogo';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-16 px-6 overflow-hidden">
      {/* 5deg rotated grid + vertical lines (名刺風) */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{ transform: 'rotate(5deg)' }}
      >
        <div className="absolute inset-0 grid grid-cols-[repeat(20,1fr)] gap-px">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="bg-navy h-full min-h-screen" />
          ))}
        </div>
      </div>
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ transform: 'rotate(-5deg)' }}
      >
        <div className="absolute inset-0 flex justify-around">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="w-px bg-navy min-h-screen"
              style={{ marginLeft: i === 0 ? 0 : undefined }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 text-center max-w2xl mx-auto">
        <HeroLogo />
        <h1 className="mt-10 text-navy font-serif text-2xl md:text-3xl lg:text-4xl font-semibold tracking-wide">
          合わせるのは、不動産の方だ。
        </h1>
        <p className="mt-3 text-navy/80 text-lg md:text-xl tracking-widest font-sans">
          Property fits your life.
        </p>
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <a
            href="https://swappee.jp/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-swappee-emerald text-navy font-semibold hover:bg-swappee-emerald-light transition-colors"
          >
            サービスを見る
          </a>
          <a
            href="#contact"
            className="inline-flex items-center justify-center px-8 py-3 rounded-lg border-2 border-navy text-navy font-semibold hover:bg-navy hover:text-white transition-colors"
          >
            お問い合わせ
          </a>
        </div>
      </div>
    </section>
  );
}
