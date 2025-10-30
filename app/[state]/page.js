import { supabase } from '@/lib/supabase';
import { US_STATES } from '@/lib/constants';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RestaurantCard from '@/components/RestaurantCard';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  return US_STATES.map(state => ({
    state: state.code.toLowerCase()
  }));
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const stateCode = resolvedParams.state?.toUpperCase();
  const stateInfo = US_STATES.find(s => s.code === stateCode);
  
  if (!stateInfo) {
    return {
      title: 'State Not Found | PinoyFoodFinder'
    };
  }

  return {
    title: `Filipino Restaurants in ${stateInfo.name} | PinoyFoodFinder`,
    description: `Discover authentic Filipino restaurants, bakeries, and groceries in ${stateInfo.name}. Find signature dishes like Adobo, Sisig, and Lumpia near you.`,
  };
}

async function getStateRestaurants(stateCode) {
  const { data, error } = await supabase
    .from('restaurants')
    .select('*')
    .eq('state', stateCode)
    .eq('verified', true)
    .order('rating', { ascending: false });

  if (error) {
    console.error('Error fetching restaurants:', error);
    return [];
  }

  return data || [];
}

async function getStateCities(stateCode) {
  const { data } = await supabase
    .from('restaurants')
    .select('city')
    .eq('state', stateCode)
    .eq('verified', true);

  const uniqueCities = [...new Set(data?.map(r => r.city) || [])];
  return uniqueCities.sort();
}

export default async function StatePage({ params }) {
  const resolvedParams = await params;
  const stateCode = resolvedParams.state?.toUpperCase();
  
  if (!stateCode) {
    notFound();
  }
  
  const stateInfo = US_STATES.find(s => s.code === stateCode);

  if (!stateInfo) {
    notFound();
  }

  const restaurants = await getStateRestaurants(stateCode);
  const cities = await getStateCities(stateCode);

  const stats = {
    totalRestaurants: restaurants.length,
    totalStates: 1
  };

  const byCategory = restaurants.reduce((acc, r) => {
    acc[r.category] = (acc[r.category] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-red-50">
      <Header stats={stats} />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Filipino Food in {stateInfo.name}
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Discover {restaurants.length} authentic Filipino restaurants, bakeries, and groceries across {stateInfo.name}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-red-50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-red-600">{restaurants.length}</div>
              <div className="text-sm text-gray-600">Total Places</div>
            </div>
            <div className="bg-amber-50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-amber-600">{cities.length}</div>
              <div className="text-sm text-gray-600">Cities</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-green-600">
                {byCategory.restaurant || 0}
              </div>
              <div className="text-sm text-gray-600">Restaurants</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-purple-600">
                {byCategory.bakery || 0}
              </div>
              <div className="text-sm text-gray-600">Bakeries</div>
            </div>
          </div>

          {cities.length > 0 && (
            <div>
              <h3 className="font-bold text-gray-800 mb-2">Cities with Filipino Food:</h3>
              <div className="flex flex-wrap gap-2">
                {cities.map(city => (
                  <span key={city} className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">
                    {city}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {restaurants.length > 0 ? (
          <>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              All Filipino Food Places in {stateInfo.name}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurants.map(restaurant => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
            <span className="text-6xl mb-4 block">🔍</span>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              No restaurants found in {stateInfo.name} yet
            </h2>
            <p className="text-gray-600 mb-6">
              Know a great Filipino restaurant here? Help us add it!
            </p>
            <a 
              href="/#"
              className="inline-block bg-gradient-to-r from-red-600 to-amber-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-red-700 hover:to-amber-700"
            >
              Submit a Restaurant
            </a>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}