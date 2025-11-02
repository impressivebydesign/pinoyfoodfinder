import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ImageCarousel from '@/components/ImageCarousel';
import { notFound } from 'next/navigation';
import { MapPin, Phone, Globe, Star, Utensils, Clock } from 'lucide-react';

export default async function RestaurantPage({ params }) {
  const resolvedParams = await params;
  const { data: restaurant } = await supabase
    .from('restaurants')
    .select('*')
    .eq('id', resolvedParams.id)
    .single();
  
  if (!restaurant) notFound();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-red-50">
      <Header stats={{ totalRestaurants: 1, totalStates: 1 }} />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            
            {/* Left Column (60% - 3 of 5 columns) */}
            <div className="lg:col-span-3">
              {/* Featured Image or Carousel */}
              <div className="w-full">
                {restaurant.featured && restaurant.image_urls?.length > 1 ? (
                  <ImageCarousel images={restaurant.image_urls} alt={restaurant.name} />
                ) : (
                  <img 
                    src={restaurant.image_urls?.[0] || 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=500&fit=crop'} 
                    alt={restaurant.name}
                    className="w-full h-[400px] object-cover"
                  />
                )}
                {restaurant.featured && (
                  <div className="bg-gradient-to-r from-amber-500 to-red-600 text-white px-4 py-2 text-center font-bold">
                    ⭐ FEATURED LISTING
                  </div>
                )}
              </div>

              {/* Restaurant Info */}
              <div className="p-8">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">
                  {restaurant.name}
                </h1>
                
                {/* Rating & Reviews */}
                <div className="flex items-center gap-4 mb-6">
                  {restaurant.rating && (
                    <div className="flex items-center gap-2">
                      <Star size={20} fill="#EAB308" className="text-yellow-500" />
                      <span className="font-bold text-lg">{restaurant.rating}</span>
                      <span className="text-gray-600">({restaurant.review_count} reviews)</span>
                    </div>
                  )}
                  {restaurant.price_level && (
                    <>
                      <span className="text-gray-400">•</span>
                      <span className="font-bold text-gray-700">{restaurant.price_level}</span>
                    </>
                  )}
                </div>

                {/* Description */}
                <div className="mb-8">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {restaurant.description}
                  </p>
                </div>

                {/* Specialty Dishes */}
                {restaurant.signature_dishes && restaurant.signature_dishes.length > 0 && (
                  <div className="bg-gradient-to-br from-amber-50 to-red-50 rounded-xl p-6 border border-amber-200">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                      <Utensils size={24} className="text-red-600" />
                      Specialty Dishes
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {restaurant.signature_dishes.map((dish, i) => (
                        <div key={i} className="bg-white rounded-lg p-4 shadow-sm">
                          <h3 className="font-bold text-lg text-gray-800 mb-1">
                            {dish.name}
                          </h3>
                          {dish.price && (
                            <p className="text-red-600 font-semibold">{dish.price}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column (40% - 2 of 5 columns) */}
            <div className="lg:col-span-2 bg-gray-50 p-8">
              <div className="sticky top-8 space-y-6">
                
                {/* Contact Information */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold mb-4 text-gray-800">Contact Information</h3>
                  
                  <div className="space-y-4">
                    {/* Address */}
                    <div className="flex items-start gap-3">
                      <MapPin size={20} className="text-red-600 mt-1 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-gray-700 mb-1">Address</div>
                        <div className="text-gray-600 text-sm">{restaurant.address}</div>
                      </div>
                    </div>

                    {/* Phone */}
                    {restaurant.phone && (
                      <div className="flex items-start gap-3">
                        <Phone size={20} className="text-red-600 mt-1 flex-shrink-0" />
                        <div>
                          <div className="font-medium text-gray-700 mb-1">Phone</div>
                          <a 
                            href={`tel:${restaurant.phone}`} 
                            className="text-red-600 hover:underline text-sm font-medium"
                          >
                            {restaurant.phone}
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Hours */}
                    {restaurant.hours && (
                      <div className="flex items-start gap-3">
                        <Clock size={20} className="text-red-600 mt-1 flex-shrink-0" />
                        <div>
                          <div className="font-medium text-gray-700 mb-1">Hours</div>
                          <div className="text-gray-600 text-sm">
                            {/* You can parse and display hours here */}
                            See website for hours
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Google Maps */}
                {restaurant.latitude && restaurant.longitude && (
                  <div className="bg-white rounded-xl overflow-hidden shadow-sm">
                    <iframe
                      width="100%"
                      height="250"
                      frameBorder="0"
                      style={{ border: 0 }}
                      src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyAeUZUzc3Jcgt0ruTbe_flOs7jE3Q9Zb08&q=${restaurant.latitude},${restaurant.longitude}&zoom=15`}
                      allowFullScreen
                      title="Restaurant Location"
                    ></iframe>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-3">
                  {restaurant.google_maps_url && (
                    <a 
                      href={restaurant.google_maps_url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center justify-center gap-2 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 font-semibold transition-colors w-full"
                    >
                      <MapPin size={20} />
                      Get Directions
                    </a>
                  )}
                  
                  {restaurant.website && (
                    <a 
                      href={restaurant.website} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center justify-center gap-2 bg-white border-2 border-red-600 text-red-600 py-3 rounded-lg hover:bg-red-50 font-semibold transition-colors w-full"
                    >
                      <Globe size={20} />
                      Website
                    </a>
                  )}
                </div>

                {/* Cuisine Tags */}
                {restaurant.cuisine_tags && restaurant.cuisine_tags.length > 0 && (
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h3 className="text-sm font-bold mb-3 text-gray-700">Categories</h3>
                    <div className="flex flex-wrap gap-2">
                      {restaurant.cuisine_tags.map((tag, i) => (
                        <span 
                          key={i} 
                          className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}