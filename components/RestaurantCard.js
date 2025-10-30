import Link from 'next/link';
import { MapPin, Phone, Globe, Star, Utensils } from 'lucide-react';

export default function RestaurantCard({ restaurant }) {
  return (
    <Link href={`/restaurant/${restaurant.id}`} className="block">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:-translate-y-1 cursor-pointer">
        <div className="relative">
          <img 
            src={restaurant.image_urls?.[0] || 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop'} 
            alt={restaurant.name}
            className="w-full h-52 object-cover"
          />
          <span className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
            {restaurant.state}
          </span>
        </div>
        
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-xl font-bold text-gray-800 flex-1 leading-tight">
              {restaurant.name}
            </h3>
          </div>
          
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center text-yellow-500">
              <Star size={18} fill="currentColor" />
              <span className="ml-1 text-gray-700 font-semibold">{restaurant.rating}</span>
            </div>
            <span className="text-gray-400">•</span>
            <span className="text-gray-600 text-sm">{restaurant.review_count} reviews</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-600 text-sm font-medium">{restaurant.price_level}</span>
          </div>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {restaurant.description}
          </p>

          {restaurant.signature_dishes && restaurant.signature_dishes.length > 0 && (
            <div className="mb-4 bg-gradient-to-br from-amber-50 to-red-50 rounded-xl p-4 border border-amber-200">
              <div className="flex items-center gap-2 mb-3">
                <Utensils size={16} className="text-red-600" />
                <h4 className="font-bold text-gray-800 text-sm">Signature Dishes</h4>
              </div>
              <div className="space-y-2">
                {restaurant.signature_dishes.map((dish, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className={`text-xs mt-0.5 ${dish.popular ? 'text-red-600' : 'text-gray-400'}`}>
                      {dish.popular ? '🔥' : '•'}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-800 leading-tight">
                        {dish.name}
                        {dish.popular && (
                          <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                            Popular
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-gray-600">{dish.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2 text-gray-600 mb-4">
            <div className="flex items-start">
              <MapPin size={16} className="mt-1 mr-2 flex-shrink-0 text-red-500" />
              <span className="text-sm">{restaurant.city}, {restaurant.state}</span>
            </div>
            <div className="flex items-center">
              <Phone size={16} className="mr-2 flex-shrink-0 text-red-500" />
              <span className="text-sm">{restaurant.phone}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {restaurant.cuisine_tags?.slice(0, 3).map(tag => (
              <span key={tag} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}