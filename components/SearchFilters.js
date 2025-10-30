'use client';

import { useState, useMemo } from 'react';
import { Search, MapPin, Filter, ChevronDown, Utensils } from 'lucide-react';
import { US_STATES, CATEGORIES } from '@/lib/constants';
import RestaurantCard from './RestaurantCard';

export default function SearchFilters({ initialRestaurants }) {
  const [restaurants] = useState(initialRestaurants);
  const [selectedState, setSelectedState] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDish, setSelectedDish] = useState('');

  const allDishes = useMemo(() => {
    const dishSet = new Set();
    restaurants.forEach(restaurant => {
      restaurant.signature_dishes?.forEach(dish => {
        if (dish.name) dishSet.add(dish.name);
      });
    });
    return Array.from(dishSet).sort();
  }, [restaurants]);

  const filteredRestaurants = useMemo(() => {
    return restaurants.filter(restaurant => {
      const matchesState = !selectedState || restaurant.state === selectedState;
      const matchesSearch = !searchTerm || 
        restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.signature_dishes?.some(dish => 
          dish.name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      const matchesCategory = selectedCategory === 'all' || restaurant.category === selectedCategory;
      const matchesDish = !selectedDish || restaurant.signature_dishes?.some(dish => 
        dish.name === selectedDish
      );
      
      return matchesState && matchesSearch && matchesCategory && matchesDish;
    });
  }, [selectedState, searchTerm, selectedCategory, selectedDish, restaurants]);

  const restaurantsByState = useMemo(() => {
    const grouped = {};
    restaurants.forEach(restaurant => {
      grouped[restaurant.state] = (grouped[restaurant.state] || 0) + 1;
    });
    return grouped;
  }, [restaurants]);

  const statName = selectedState ? US_STATES.find(s => s.code === selectedState)?.name : '';

  return (
    <>
      <div className="bg-white rounded-2xl shadow-2xl p-6 mb-8 border border-gray-100">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search name, city, or dish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
            />
          </div>

          <div className="relative">
            <Utensils className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={selectedDish}
              onChange={(e) => setSelectedDish(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 appearance-none transition-all bg-white"
            >
              <option value="">All Dishes</option>
              {allDishes.map(dish => (
                <option key={dish} value={dish}>{dish}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
          </div>

          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 appearance-none transition-all bg-white"
            >
              <option value="">All States</option>
              {US_STATES.map(state => (
                <option key={state.code} value={state.code}>
                  {state.name} {restaurantsByState[state.code] ? `(${restaurantsByState[state.code]})` : ''}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 appearance-none transition-all bg-white"
            >
              {CATEGORIES.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.icon} {cat.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
          </div>
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">
          {filteredRestaurants.length} {filteredRestaurants.length === 1 ? 'Place' : 'Places'}
          {statName && <span className="text-red-600"> in {statName}</span>}
          {selectedDish && <span className="text-red-600"> serving {selectedDish}</span>}
        </h2>
        {(selectedState || searchTerm || selectedCategory !== 'all' || selectedDish) && (
          <button
            onClick={() => {
              setSelectedState('');
              setSearchTerm('');
              setSelectedCategory('all');
              setSelectedDish('');
            }}
            className="text-red-600 hover:text-red-700 font-medium underline"
          >
            Clear Filters
          </button>
        )}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRestaurants.map(restaurant => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} />
        ))}
      </div>

      {filteredRestaurants.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
          <span className="text-6xl mb-4 block">🔍</span>
          <p className="text-gray-500 text-xl mb-2">No restaurants found</p>
          <p className="text-gray-400">Try adjusting your filters or search terms</p>
        </div>
      )}
    </>
  );
}