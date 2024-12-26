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
    const { junkFood, userId } = await req.json();
    console.log('Generating healthy alternative for:', junkFood);

    // First verify the user exists
    if (userId) {
      const supabase = createClient(supabaseUrl!, supabaseServiceKey!);
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('user_id')
        .eq('user_id', userId)
        .single();

      if (userError || !userData) {
        console.error('User not found:', userError);
        throw new Error('User not found');
      }
    }

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
            content: `You are a nutritionist and chef specialized in creating healthy alternatives to popular junk food. Generate a healthy recipe that captures the essence of the requested food but with better nutritional value. 
            
            Important guidelines:
            - Use ONLY metric measurements (grams, milliliters)
            - NO cups, tablespoons, or other imperial measurements
            - Include precise macronutrient information per serving
            - Keep instructions clear and concise
            
            Return ONLY a JSON object with these exact fields:
            - title (string)
            - description (string)
            - instructions (array of steps)
            - dietaryTags (array of tags like "healthy", "low-fat", etc)
            - macronutrients (object with calories, protein, carbs, fat, and fiber in grams)
            
            Do not include any markdown formatting or additional text.`
          },
          {
            role: 'user',
            content: `Create a healthy alternative recipe for: ${junkFood}`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    const aiData = await response.json();
    console.log('AI response received:', aiData);

    if (!aiData.choices?.[0]?.message?.content) {
      throw new Error('Invalid AI response format');
    }

    let recipe;
    try {
      recipe = JSON.parse(aiData.choices[0].message.content.trim());
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      console.log('Raw AI response:', aiData.choices[0].message.content);
      throw new Error('Failed to parse recipe data');
    }
    
    // Only save the recipe if we have a valid user ID
    if (userId) {
      // Create Supabase client
      const supabase = createClient(supabaseUrl!, supabaseServiceKey!);
      
      const { data, error } = await supabase
        .from('recipes')
        .insert({
          user_id: userId,
          title: recipe.title,
          description: recipe.description,
          instructions: recipe.instructions,
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