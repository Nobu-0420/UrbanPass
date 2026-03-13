import './globals.css';
import { Noto_Sans_JP, Noto_Serif_JP } from 'next/font/google';

const notoSans = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-noto-sans',
  display: 'swap',
});
const notoSerif = Noto_Serif_JP({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-noto-serif',
  display: 'swap',
});

export const metadata = {
  title: 'Swappee — 合わせるのは、不動産の方だ。',
  description: 'Property fits your life.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja" className={`${notoSans.variable} ${notoSerif.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
