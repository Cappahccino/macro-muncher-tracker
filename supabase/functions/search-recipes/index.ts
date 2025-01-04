import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
            content: 'You are a helpful nutritionist and chef that provides healthy recipes. Always provide measurements in grams and include detailed nutritional information for each ingredient.'
          },
          {
            role: 'user',
            content: `Please give me a recipe for ${searchQuery}. Give me step by step instructions on how I can make this dish and also list the ingredients with their measurements in grams. You must provide the total macros for the recipe and macros for the individual ingredients in grams.

            Return the response in this exact JSON format:
            {
              "title": "Recipe Name",
              "description": "Brief description",
              "servingSize": {
                "servings": number,
                "gramsPerServing": number
              },
              "ingredients": [
                {
                  "name": "Ingredient name",
                  "amount": number (in grams),
                  "macros": {
                    "calories": number (per specified amount),
                    "protein": number (in grams per specified amount),
                    "carbs": number (in grams per specified amount),
                    "fat": number (in grams per specified amount),
                    "fiber": number (in grams per specified amount)
                  }
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
      JSON.stringify({ error: error.message }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});