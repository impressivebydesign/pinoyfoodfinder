import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'PinoyFoodFinder - Discover Filipino Cuisine Across America',
  description: 'Find authentic Filipino restaurants, bakeries, and groceries in all 50 states. Search by signature dishes like Adobo, Sisig, Lumpia, and more.',
  keywords: 'Filipino food, Philippine cuisine, Filipino restaurants, Adobo, Sisig, Lumpia, Halo-Halo',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}