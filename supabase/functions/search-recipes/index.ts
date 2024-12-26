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

    // First, use GPT to understand the search query and extract key terms
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
            content: 'You are a helpful assistant that analyzes recipe search queries. Extract key terms and dietary preferences from the query. Return a JSON object with "terms" (array of search terms) and "dietaryTags" (array of dietary preferences like "vegan", "vegetarian", "gluten-free").'
          },
          {
            role: 'user',
            content: searchQuery
          }
        ],
      }),
    });

    const aiData = await openAIResponse.json();
    const analysisResult = JSON.parse(aiData.choices[0].message.content);
    console.log('AI analysis result:', analysisResult);

    // Use Supabase to search recipes based on AI analysis
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);
    
    let query = supabase
      .from('recipes')
      .select('*')
      .textSearch('title', analysisResult.terms.join(' | '))
      .order('created_at', { ascending: false });

    // Apply dietary filters if present
    if (analysisResult.dietaryTags && analysisResult.dietaryTags.length > 0) {
      query = query.contains('dietary_tags', analysisResult.dietaryTags);
    }

    const { data: recipes, error } = await query;

    if (error) throw error;

    return new Response(JSON.stringify({ recipes, analysis: analysisResult }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in search-recipes function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});