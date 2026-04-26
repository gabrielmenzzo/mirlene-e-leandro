import type {Metadata} from 'next';
import { Great_Vibes, Cormorant_Garamond, Lato } from 'next/font/google';
import './globals.css';

const greatVibes = Great_Vibes({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-great-vibes',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'swap',
});

const lato = Lato({
  weight: ['300', '400', '700'],
  subsets: ['latin'],
  variable: '--font-lato',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Mirlene & Leandro | Casamento',
  description: 'Celebre conosco este momento especial.  acesse nossa lista de presentes.',
  openGraph: {
    title: 'Mirlene & Leandro | Casamento',
    description: 'Celebre conosco este momento especial.',
    type: 'website',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="pt-BR" className={`${greatVibes.variable} ${cormorant.variable} ${lato.variable}`}>
      <body className="font-lato bg-wedding-bg text-wedding-text antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
