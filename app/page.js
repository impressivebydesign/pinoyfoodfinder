import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchFilters from '@/components/SearchFilters';

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

      <Footer />
    </div>
  );
}