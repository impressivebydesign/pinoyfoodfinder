import Logo from './Logo';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export default function Header({ stats }) {
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Logo */}
          <Link href="/" className="flex-shrink-0">
            <Logo className="h-24 w-auto hover:opacity-90 transition-opacity" />
          </Link>

          {/* Right: Navigation */}
          <nav className="flex items-center gap-6">
            {/* Location Link */}
            <Link 
              href="#location" 
              className="px-4 py-2 text-gray-700 hover:text-pinoy-blue font-medium transition-colors cursor-pointer"
            >
              Location
            </Link>

            {/* Dishes Link */}
            <Link 
              href="#dishes" 
              className="px-4 py-2 text-gray-700 hover:text-pinoy-blue font-medium transition-colors cursor-pointer"
            >
              Dishes
            </Link>

            {/* Categories Link */}
            <Link 
              href="#categories" 
              className="px-4 py-2 text-gray-700 hover:text-pinoy-blue font-medium transition-colors cursor-pointer"
            >
              Categories
            </Link>

          {/* Add Listing Button */}
        <Link 
  href="/submit" 
  className="flex items-center gap-2 bg-pinoy-yellow hover:bg-pinoy-yellow/90 text-gray-900 px-6 py-2 rounded-full font-bold transition-colors shadow-md hover:shadow-lg"
>
  <Plus size={20} />
  Add Listing
</Link>
          </nav>
        </div>
      </div>
    </header>
  );
}