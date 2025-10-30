import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Utensils } from 'lucide-react';

export const metadata = {
  title: 'Browse Filipino Dishes | PinoyFoodFinder',
  description: 'Find restaurants by Filipino signature dishes. Search for Adobo, Sisig, Lumpia, Halo-Halo and more across America.',
};

async function getAllDishes() {
  const { data } = await supabase
    .from('restaurants')
    .select('signature_dishes')
    .eq('verified', true);

  const dishMap = {};
  
  data?.forEach(restaurant => {
    restaurant.signature_dishes?.forEach(dish => {
      if (dish.name) {
        if (!dishMap[dish.name]) {
          dishMap[dish.name] = {
            name: dish.name,
            count: 0,
            description: dish.description || ''
          };
        }
        dishMap[dish.name].count++;
      }
    });
  });

  return Object.values(dishMap).sort((a, b) => b.count - a.count);
}

async function getStats() {
  const { count: totalRestaurants } = await supabase
    .from('restaurants')
    .select('*', { count: 'exact', head: true })
    .eq('verified', true);

  return {
    totalRestaurants: totalRestaurants || 0,
    totalStates: 50
  };
}

export default async function DishesPage() {
  const dishes = await getAllDishes();
  const stats = await getStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-red-50">
      <Header stats={stats} />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Utensils size={40} className="text-red-600" />
            <h1 className="text-4xl font-bold text-gray-800">
              Browse by Signature Dish
            </h1>
          </div>
          <p className="text-lg text-gray-600 mb-6">
            Find Filipino restaurants by their most popular dishes. Click any dish to see where you can get it!
          </p>
          
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-amber-900">
              🔥 <strong>{dishes.length}</strong> signature dishes available across <strong>{stats.totalRestaurants}</strong> restaurants
            </p>
          </div>
        </div>

        {dishes.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dishes.map(dish => (
              <Link
                key={dish.name}
                href={`/dishes/${encodeURIComponent(dish.name.toLowerCase().replace(/\s+/g, '-'))}`}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:-translate-y-1 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-2xl font-bold text-gray-800 flex-1">
                    {dish.name}
                  </h3>
                  <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold ml-2">
                    {dish.count}
                  </span>
                </div>
                
                {dish.description && (
                  <p className="text-gray-600 text-sm mb-4">
                    {dish.description}
                  </p>
                )}
                
                <div className="flex items-center text-red-600 font-medium text-sm">
                  <span>Available at {dish.count} {dish.count === 1 ? 'place' : 'places'}</span>
                  <span className="ml-2">→</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
            <span className="text-6xl mb-4 block">🍽️</span>
            <p className="text-gray-500 text-xl">No dishes found yet</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}