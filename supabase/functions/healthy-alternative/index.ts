import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, userId } = await req.json();
    console.log('Processing query for healthier alternative:', query);

    // First, validate if the input is a valid meal
    const validationResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: `You are a meal validation assistant. Your task is to determine if the input is a valid meal or food item.
            Return ONLY a JSON object with these fields:
            - isValid (boolean): true if it's a recognizable meal/food item
            - mealType (string): breakfast/lunch/dinner/snack/dessert or null if not valid
            - category (string): e.g., "fast food", "pasta", "sandwich" or null if not valid
            - reasoning (string): brief explanation of why it's valid/invalid`
          },
          {
            role: 'user',
            content: query
          }
        ],
        temperature: 0.3,
      }),
    });

    const validationData = await validationResponse.json();
    const validation = JSON.parse(validationData.choices[0].message.content);
    console.log('Validation result:', validation);

    if (!validation.isValid) {
      return new Response(
        JSON.stringify({
          error: 'Invalid input',
          details: validation.reasoning
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // If valid, generate a healthy alternative
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: `You are a nutritionist and chef specialized in creating healthy alternatives to popular meals. 
            Given a ${validation.category} typically eaten for ${validation.mealType}, generate a healthier version that:
            - Maintains similar flavors and textures
            - Reduces calories and unhealthy fats
            - Increases protein and fiber content where possible
            - Uses whole, unprocessed ingredients
            - All measurements MUST be in grams
            
            Return ONLY a JSON object with these exact fields:
            - title (string): name of the healthy alternative
            - description (string): brief explanation of why this is healthier
            - instructions (array of strings): step-by-step cooking instructions with all measurements in grams
            - dietaryTags (array of strings): relevant tags like "high-protein", "low-carb", etc.
            - macronutrients (object): {
                calories (number): total calories per serving,
                protein (number): grams of protein per serving,
                carbs (number): grams of carbs per serving,
                fat (number): grams of fat per serving,
                fiber (number): grams of fiber per serving,
                servings (number): number of servings this recipe makes
              }
            - ingredients (array of objects): [{
                name (string): ingredient name,
                amount (number): amount in grams
              }]
            
            Do not include any markdown formatting or additional text.`
          },
          {
            role: 'user',
            content: `Create a healthy alternative recipe for: ${query}`
          }
        ],
        temperature: 0.7,
      }),
    });

    const alternativeData = await response.json();
    console.log('Generated alternative recipe');

    let recipe;
    try {
      recipe = JSON.parse(alternativeData.choices[0].message.content.trim());
    } catch (error) {
      console.error('Failed to parse recipe:', error);
      console.log('Raw response:', alternativeData.choices[0].message.content);
      throw new Error('Failed to generate recipe');
    }

    // Save to database if user is authenticated
    if (userId) {
      const supabase = createClient(supabaseUrl!, supabaseServiceKey!);
      
      const { data, error } = await supabase
        .from('recipes')
        .insert({
          user_id: userId,
          title: recipe.title,
          description: recipe.description,
          instructions: {
            steps: recipe.instructions,
            ingredients: recipe.ingredients,
            macros: recipe.macronutrients
          },
          dietary_tags: recipe.dietaryTags,
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving recipe:', error);
        throw error;
      }
      recipe.id = data.recipe_id;
    }

    return new Response(
      JSON.stringify(recipe),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in healthy-alternative function:', error);
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