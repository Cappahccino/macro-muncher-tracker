import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { searchQuery } = await req.json();
    console.log('Received search query:', searchQuery);

    // First, use GPT to understand the search query
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that analyzes recipe search queries. Extract key terms and dietary preferences. Return a JSON object with "searchTerms" (array of individual words relevant for recipe search) and "dietaryTags" (array of dietary preferences like "vegan", "vegetarian", "gluten-free"). Only include actual words, no special characters.'
          },
          {
            role: 'user',
            content: searchQuery
          }
        ],
      }),
    });

    const aiData = await openAIResponse.json();
    console.log('AI response:', aiData);

    if (!aiData.choices?.[0]?.message?.content) {
      throw new Error('Invalid AI response format');
    }

    const analysisResult = JSON.parse(aiData.choices[0].message.content);
    console.log('Parsed analysis result:', analysisResult);

    // Create Supabase client
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);
    
    // Format search terms for text search
    const searchTermsQuery = analysisResult.searchTerms
      .map((term: string) => term.trim())
      .filter((term: string) => term.length > 0)
      .join(' | ');

    console.log('Formatted search terms:', searchTermsQuery);

    // Build the query
    let query = supabase
      .from('recipes')
      .select('*');

    // Only add text search if we have search terms
    if (searchTermsQuery) {
      query = query.textSearch('title', searchTermsQuery);
    }

    // Apply dietary filters if present
    if (analysisResult.dietaryTags?.length > 0) {
      query = query.contains('dietary_tags', analysisResult.dietaryTags);
    }

    // Execute the query
    const { data: recipes, error: dbError } = await query.order('created_at', { ascending: false });

    if (dbError) {
      console.error('Database error:', dbError);
      throw dbError;
    }

    console.log(`Found ${recipes?.length || 0} matching recipes`);

    return new Response(
      JSON.stringify({ 
        recipes: recipes || [], 
        analysis: analysisResult 
      }), 
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in search-recipes function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.toString()
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});