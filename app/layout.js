import './globals.css';
import { Noto_Sans_JP } from 'next/font/google';

// Noto Sans JP は next/font で最適化。Serif は Google CSS 経由（Vercel ビルドで next/font の weight 検証エラーを避ける）
const notoSans = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-noto-sans',
  display: 'swap',
});

export const metadata = {
  title: 'Swappee — 合わせるのは、不動産の方だ。',
  description: 'Property fits your life.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja" className={notoSans.variable}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
