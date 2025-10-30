import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RestaurantCard from '@/components/RestaurantCard';
import { notFound } from 'next/navigation';
import { Utensils } from 'lucide-react';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const dishSlug = resolvedParams.dish;
  const dishName = dishSlug?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return {
    title: `Where to Find ${dishName} | PinoyFoodFinder`,
    description: `Find the best ${dishName} at Filipino restaurants across America. Browse locations, ratings, and reviews.`,
  };
}

async function getRestaurantsByDish(dishSlug) {
  const dishName = dishSlug.replace(/-/g, ' ');
  
  const { data } = await supabase
    .from('restaurants')
    .select('*')
    .eq('verified', true);

  const matches = data?.filter(restaurant => {
    return restaurant.signature_dishes?.some(dish => 
      dish.name?.toLowerCase() === dishName.toLowerCase()
    );
  }) || [];

  return matches.sort((a, b) => (b.rating || 0) - (a.rating || 0));
}

export default async function DishPage({ params }) {
  const resolvedParams = await params;
  const dishSlug = resolvedParams.dish;
  
  if (!dishSlug) {
    notFound();
  }

  const dishName = dishSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const restaurants = await getRestaurantsByDish(dishSlug);

  if (restaurants.length === 0) {
    notFound();
  }

  const stats = {
    totalRestaurants: restaurants.length,
    totalStates: new Set(restaurants.map(r => r.state)).size
  };

  const stateBreakdown = restaurants.reduce((acc, r) => {
    acc[r.state] = (acc[r.state] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-red-50">
      <Header stats={stats} />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Utensils size={40} className="text-red-600" />
            <h1 className="text-4xl font-bold text-gray-800">
              Where to Find {dishName}
            </h1>
          </div>
          
          <p className="text-lg text-gray-600 mb-6">
            Discover {restaurants.length} Filipino {restaurants.length === 1 ? 'restaurant' : 'restaurants'} serving {dishName} across {stats.totalStates} {stats.totalStates === 1 ? 'state' : 'states'}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-red-50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-red-600">{restaurants.length}</div>
              <div className="text-sm text-gray-600">Restaurants</div>
            </div>
            <div className="bg-amber-50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-amber-600">{stats.totalStates}</div>
              <div className="text-sm text-gray-600">States</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-green-600">
                {Math.round((restaurants.reduce((sum, r) => sum + (r.rating || 0), 0) / restaurants.length) * 10) / 10}
              </div>
              <div className="text-sm text-gray-600">Avg Rating</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-purple-600">
                {restaurants.reduce((sum, r) => sum + (r.review_count || 0), 0)}
              </div>
              <div className="text-sm text-gray-600">Total Reviews</div>
            </div>
          </div>

          {Object.keys(stateBreakdown).length > 0 && (
            <div>
              <h3 className="font-bold text-gray-800 mb-2">Available in these states:</h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(stateBreakdown)
                  .sort((a, b) => b[1] - a[1])
                  .map(([state, count]) => (
                    <span key={state} className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">
                      {state} ({count})
                    </span>
                  ))}
              </div>
            </div>
          )}
        </div>

        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Restaurants Serving {dishName}
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map(restaurant => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}