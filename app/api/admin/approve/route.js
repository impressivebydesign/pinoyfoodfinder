import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(request) {
  const { id, data: restaurantData } = await request.json();

  // Add restaurant to main table
  const { error: insertError } = await supabase
    .from('restaurants')
    .insert({
      ...restaurantData,
      verified: true
    });

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  // Update submission status
  const { error: updateError } = await supabase
    .from('submissions')
    .update({ status: 'approved' })
    .eq('id', id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}