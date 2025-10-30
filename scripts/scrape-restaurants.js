// This script uses Apify to scrape Google Maps and saves to Supabase
const axios = require('axios');

// You'll need to install these:
// npm install axios dotenv

require('dotenv').config({ path: '.env.local' });

const APIFY_TOKEN = process.env.APIFY_API_TOKEN; // ✅ Use environment variable

const PRIORITY_STATES = [
  'California',
  'New York', 
  'Texas',
  'Florida',
  'Illinois',
  'New Jersey',
  'Washington',
  'Nevada',
  'Hawaii'
];

const SEARCH_QUERIES = [
  'Filipino restaurant',
  'Filipino bakery', 
  'Filipino grocery store',
  'Filipino catering',
  'Turo-Turo'
];

async function scrapeStateAndCategory(state, query) {
  console.log(`\n🔍 Scraping: ${query} in ${state}...`);
  
  const input = {
    searchStringsArray: [`${query} in ${state}`],
    maxCrawledPlacesPerSearch: 50,
    language: 'en',
    includeReviews: false,
    includeImages: true,
    includePeopleAlsoSearch: false
  };

  try {
    // Start the scraper
    const runResponse = await axios.post(
      'https://api.apify.com/v2/acts/compass~google-maps-scraper/runs',
      input,
      {
        headers: { 'Authorization': `Bearer ${APIFY_TOKEN}` },
        params: { token: APIFY_TOKEN }
      }
    );

    const runId = runResponse.data.data.id;
    console.log(`⏳ Run ID: ${runId} - Waiting for completion...`);

    // Wait for completion
    let status = 'RUNNING';
    while (status === 'RUNNING') {
      await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds
      
      const statusResponse = await axios.get(
        `https://api.apify.com/v2/acts/compass~google-maps-scraper/runs/${runId}`,
        { params: { token: APIFY_TOKEN } }
      );
      
      status = statusResponse.data.data.status;
      console.log(`   Status: ${status}`);
    }

    // Get results
    const resultsResponse = await axios.get(
      `https://api.apify.com/v2/acts/compass~google-maps-scraper/runs/${runId}/dataset/items`,
      { params: { token: APIFY_TOKEN } }
    );

    const results = resultsResponse.data;
    console.log(`✅ Found ${results.length} places`);
    
    return results;

  } catch (error) {
    console.error(`❌ Error scraping ${state}:`, error.message);
    return [];
  }
}

function categorizePlace(categoryName) {
  const category = (categoryName || '').toLowerCase();
  
  if (category.includes('bakery') || category.includes('pastry')) return 'bakery';
  if (category.includes('grocery') || category.includes('market') || category.includes('store')) return 'grocery';
  if (category.includes('catering')) return 'catering';
  if (category.includes('food truck') || category.includes('truck')) return 'food_truck';
  if (category.includes('turo') || category.includes('cafeteria')) return 'cafeteria';
  
  return 'restaurant';
}

function getStateAbbreviation(stateName) {
  const stateMap = {
    'California': 'CA', 'New York': 'NY', 'Texas': 'TX', 'Florida': 'FL',
    'Illinois': 'IL', 'New Jersey': 'NJ', 'Washington': 'WA', 'Nevada': 'NV',
    'Hawaii': 'HI', 'Pennsylvania': 'PA', 'Georgia': 'GA', 'Virginia': 'VA',
    'Maryland': 'MD', 'Arizona': 'AZ', 'Massachusetts': 'MA'
  };
  return stateMap[stateName] || stateName;
}

async function saveToSupabase(places, state) {
  const { createClient } = require('@supabase/supabase-js');
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const stateAbbrev = getStateAbbreviation(state);
  let savedCount = 0;
  let skippedCount = 0;

  for (const place of places) {
    // Skip if no name or address
    if (!place.title || !place.address) {
      skippedCount++;
      continue;
    }

    const restaurantData = {
      name: place.title,
      address: place.address || '',
      city: place.city || extractCity(place.address),
      state: stateAbbrev,
      zip_code: place.postalCode || null,
      phone: place.phone || place.phoneNumber || null,
      website: place.website || null,
      google_maps_url: place.url || null,
      category: categorizePlace(place.categoryName),
      cuisine_tags: ['Filipino'],
      latitude: place.latitude || null,
      longitude: place.longitude || null,
      rating: place.totalScore || null,
      review_count: place.reviewsCount || 0,
      price_level: place.priceLevel || null,
      description: place.description || `Filipino ${categorizePlace(place.categoryName)} in ${place.city || state}`,
      image_urls: place.imageUrls ? place.imageUrls.slice(0, 5) : [],
      signature_dishes: [], // We'll add these manually later
      verified: true
    };

    try {
      // Check if already exists
      const { data: existing } = await supabase
        .from('restaurants')
        .select('id')
        .eq('google_maps_url', restaurantData.google_maps_url)
        .single();

      if (existing) {
        skippedCount++;
        continue;
      }

      // Insert new restaurant
      const { error } = await supabase
        .from('restaurants')
        .insert(restaurantData);

      if (error) {
        console.error(`  ❌ Error inserting ${place.title}:`, error.message);
      } else {
        savedCount++;
        console.log(`  ✓ Saved: ${place.title}`);
      }
    } catch (err) {
      console.error(`  ❌ Exception for ${place.title}:`, err.message);
    }
  }

  console.log(`\n📊 Summary: ${savedCount} saved, ${skippedCount} skipped`);
}

function extractCity(address) {
  if (!address) return '';
  const parts = address.split(',');
  return parts.length > 1 ? parts[parts.length - 2].trim() : '';
}

async function main() {
  console.log('🚀 Starting Google Maps scraping...\n');
  
  // Start with California only (to test)
  const testState = 'California';
  
  for (const query of SEARCH_QUERIES) {
    const places = await scrapeStateAndCategory(testState, query);
    if (places.length > 0) {
      await saveToSupabase(places, testState);
    }
    
    // Wait 5 seconds between queries to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
  
  console.log('\n✅ Scraping complete!');
}

// Run it
main().catch(console.error);