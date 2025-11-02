import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchFilters from '@/components/SearchFilters';
import { US_STATES } from '@/lib/constants';

export const revalidate = 3600; // Revalidate every hour

async function getRestaurants() {
  const { data, error } = await supabase
    .from('restaurants')
    .select('*')
    .eq('verified', true)
    .order('rating', { ascending: false });

  if (error) {
    console.error('Error fetching restaurants:', error);
    return [];
  }

  return data || [];
}

async function getStats() {
  const { count: totalRestaurants } = await supabase
    .from('restaurants')
    .select('*', { count: 'exact', head: true })
    .eq('verified', true);

  const { data: statesData } = await supabase
    .from('restaurants')
    .select('state')
    .eq('verified', true);

  const uniqueStates = new Set(statesData?.map(r => r.state) || []);

  return {
    totalRestaurants: totalRestaurants || 0,
    totalStates: uniqueStates.size
  };
}

export default async function Home() {
  const [restaurants, stats] = await Promise.all([
    getRestaurants(),
    getStats()
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-red-50">
      <Header stats={stats} />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <SearchFilters initialRestaurants={restaurants} />
      </main>

      {/* SEO State Links Section */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Browse Filipino Restaurants by State
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {US_STATES.map(state => {
              const count = restaurants.filter(r => r.state === state.name).length;
              return count > 0 ? (
                
                  <a key={state.code}
                  href={`/?state=${encodeURIComponent(state.name)}`}
                  className="text-pinoy-blue hover:text-pinoy-red hover:underline font-medium transition-colors"
                >
                  {state.name} ({count})
                </a>
              ) : null;
            })}
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Find Filipino Food Near You
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Discover authentic Filipino restaurants, bakeries, grocery stores, and caterers across the United States. 
              From traditional dishes like adobo, lumpia, and pancit to specialty Filipino groceries and desserts, 
              find the best Filipino food establishments in your state. Browse our directory of {restaurants.length} verified 
              Filipino businesses serving communities nationwide.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}