import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { notFound } from 'next/navigation';
import { MapPin, Phone, Globe, Star, Utensils } from 'lucide-react';

export default async function RestaurantPage({ params }) {
  const resolvedParams = await params;
  const { data: restaurant } = await supabase.from('restaurants').select('*').eq('id', resolvedParams.id).single();
  if (!restaurant) notFound();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-red-50">
      <Header stats={{ totalRestaurants: 1, totalStates: 1 }} />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{restaurant.name}</h1>
          <div className="flex items-center gap-4 mb-6">
            {restaurant.rating && (
              <div className="flex items-center gap-2">
                <Star size={20} fill="#EAB308" className="text-yellow-500" />
                <span className="font-bold">{restaurant.rating}</span>
                <span className="text-gray-600">({restaurant.review_count} reviews)</span>
              </div>
            )}
            <span className="text-gray-400">•</span>
            <span className="font-bold">{restaurant.price_level}</span>
          </div>
          <p className="text-lg text-gray-600 mb-6">{restaurant.description}</p>
          
          {restaurant.signature_dishes && restaurant.signature_dishes.length > 0 && (
            <div className="bg-amber-50 rounded-xl p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Utensils size={24} className="text-red-600" />
                Specialty Dishes
              </h2>
              {restaurant.signature_dishes.map((dish, i) => (
                <div key={i} className="mb-3 pb-3 border-b last:border-0">
                  <h3 className="font-bold text-lg">{dish.name}</h3>
                  <p className="text-gray-600">{dish.description}</p>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3">
              <MapPin size={20} className="text-red-600 mt-1" />
              <div>
                <div className="font-medium">Address</div>
                <div className="text-gray-600">{restaurant.address}</div>
              </div>
            </div>
            {restaurant.phone && (
              <div className="flex items-start gap-3">
                <Phone size={20} className="text-red-600 mt-1" />
                <div>
                  <div className="font-medium">Phone</div>
                  <a href={`tel:${restaurant.phone}`} className="text-red-600 hover:underline">{restaurant.phone}</a>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            {restaurant.google_maps_url && (
              <a href={restaurant.google_maps_url} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 font-semibold">
                <MapPin size={20} />
                Get Directions
              </a>
            )}
            {restaurant.website && (
              <a href={restaurant.website} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-red-600 text-red-600 py-3 rounded-lg hover:bg-red-50 font-semibold">
                <Globe size={20} />
                Website
              </a>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}