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
    const { searchQuery, userGoals } = await req.json();
    console.log('Received search query:', searchQuery);
    console.log('User goals:', userGoals);

    // Use GPT to generate a recipe based on the search query and user goals
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
            content: `You are a helpful nutritionist and chef that provides healthy recipes. Always provide measurements in grams. Consider the following health goals: ${userGoals || 'balanced nutrition'}`
          },
          {
            role: 'user',
            content: `Generate a healthy recipe for: ${searchQuery}. 
            Return the response in this exact JSON format:
            {
              "title": "Recipe Name",
              "description": "Brief description of why this recipe aligns with the user's health goals",
              "servingSize": {
                "servings": number,
                "gramsPerServing": number
              },
              "ingredients": [
                {
                  "name": "Ingredient name",
                  "amount": number (in grams)
                }
              ],
              "instructions": {
                "steps": [
                  "Step 1 with precise measurements in grams",
                  "Step 2 with precise measurements in grams"
                ]
              },
              "macronutrients": {
                "totalCalories": number,
                "perServing": {
                  "calories": number,
                  "protein": number,
                  "carbs": number,
                  "fat": number,
                  "fiber": number
                }
              }
            }`
          }
        ],
      }),
    });

    const data = await openAIResponse.json();
    console.log('OpenAI response:', data);

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid AI response format');
    }

    const recipe = JSON.parse(data.choices[0].message.content);
    console.log('Parsed recipe:', recipe);

    return new Response(
      JSON.stringify(recipe),
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