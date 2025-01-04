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
    const { searchQuery, userGoals } = await req.json();
    console.log('Received search query:', searchQuery);
    console.log('User goals:', userGoals);

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
            content: `You are a helpful nutritionist and chef that provides healthy recipes. Always provide measurements in grams and include detailed nutritional information for each ingredient. Consider the following health goals: ${userGoals || 'balanced nutrition'}`
          },
          {
            role: 'user',
            content: `Please give me a healthy alternative for ${searchQuery}. Give me step by step instructions on how I can make the alternative dish and also list the ingredients with their measurements. You must provide ingredients and steps in grams. You must provide the total macros for the alternative dish and macros for the individual ingredients in grams.

            Return the response in this exact JSON format without any markdown formatting or code blocks:
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
                  "amount": number,
                  "macros": {
                    "calories": number,
                    "protein": number,
                    "carbs": number,
                    "fat": number,
                    "fiber": number
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

    let recipe;
    try {
      const content = data.choices[0].message.content;
      // Remove any markdown formatting if present
      const jsonContent = content.replace(/```json\n|\n```/g, '').trim();
      recipe = JSON.parse(jsonContent);
      console.log('Parsed recipe:', recipe);
    } catch (parseError) {
      console.error('Error parsing recipe JSON:', parseError);
      throw new Error('Failed to parse recipe data from AI response');
    }

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