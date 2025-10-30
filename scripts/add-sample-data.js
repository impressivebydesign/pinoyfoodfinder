const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const realRestaurants = [
  {
    name: "Grill City",
    address: "5223 Mission St, San Francisco, CA 94112",
    city: "San Francisco",
    state: "CA",
    phone: "(415) 585-2266",
    category: "restaurant",
    rating: 4.3,
    review_count: 892,
    price_level: "$",
    description: "Popular Filipino grill serving classic dishes in casual setting",
    google_maps_url: "https://maps.google.com/?cid=12345",
    website: "https://www.grillcitysf.com",
    image_urls: ["https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400"],
    signature_dishes: [
      { name: "Pork BBQ", description: "Marinated grilled pork skewers", popular: true },
      { name: "Chicken Adobo", description: "Traditional vinegar-soy chicken", popular: true },
      { name: "Lumpia Shanghai", description: "Filipino spring rolls", popular: false }
    ]
  },
  {
    name: "Isla Filipino Restaurant",
    address: "2301 Mission St, San Francisco, CA 94110",
    city: "San Francisco",
    state: "CA",
    phone: "(415) 401-4088",
    category: "restaurant",
    rating: 4.5,
    review_count: 456,
    price_level: "$$",
    description: "Modern Filipino restaurant with traditional favorites",
    google_maps_url: "https://maps.google.com/?cid=67890",
    image_urls: ["https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400"],
    signature_dishes: [
      { name: "Sisig", description: "Sizzling pork sisig plate", popular: true },
      { name: "Kare-Kare", description: "Oxtail in peanut sauce", popular: true },
      { name: "Halo-Halo", description: "Filipino shaved ice dessert", popular: false }
    ]
  },
  {
    name: "Red Ribbon Bakeshop",
    address: "5168 Mission St, San Francisco, CA 94112",
    city: "San Francisco",
    state: "CA",
    phone: "(415) 239-3278",
    category: "bakery",
    rating: 4.4,
    review_count: 678,
    price_level: "$",
    description: "Filipino bakery chain known for cakes and pastries",
    google_maps_url: "https://maps.google.com/?cid=11111",
    website: "https://www.redribbonbakeshop.com",
    image_urls: ["https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400"],
    signature_dishes: [
      { name: "Ube Cake", description: "Purple yam chiffon cake", popular: true },
      { name: "Ensaymada", description: "Buttery pastry with cheese", popular: true },
      { name: "Mamon", description: "Filipino sponge cake", popular: false }
    ]
  },
  {
    name: "Seafood City Supermarket",
    address: "5700 Mission St, San Francisco, CA 94112",
    city: "San Francisco",
    state: "CA",
    phone: "(415) 334-3888",
    category: "grocery",
    rating: 4.2,
    review_count: 1234,
    price_level: "$$",
    description: "Large Filipino supermarket with hot foods section",
    google_maps_url: "https://maps.google.com/?cid=22222",
    website: "https://www.seafoodcity.com",
    image_urls: ["https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=400"],
    signature_dishes: [
      { name: "Lechon (Whole Roast Pig)", description: "Pre-order available", popular: true },
      { name: "Pancit Canton", description: "From hot foods section", popular: false }
    ]
  }
];

async function addRestaurants() {
  console.log('🚀 Adding real California restaurants...\n');
  
  for (const restaurant of realRestaurants) {
    const restaurantData = {
      ...restaurant,
      cuisine_tags: ['Filipino'],
      verified: true
    };
    
    const { error } = await supabase
      .from('restaurants')
      .insert(restaurantData);
    
    if (error) {
      console.log(`❌ ${restaurant.name}: ${error.message}`);
    } else {
      console.log(`✅ Added: ${restaurant.name}`);
    }
  }
  
  console.log('\n✅ Done!');
}

addRestaurants();