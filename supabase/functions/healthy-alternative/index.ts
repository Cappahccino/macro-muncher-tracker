import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();
    console.log('Received query:', query);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Deno.env.get("OPENAI_API_KEY")}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a helpful nutritionist that provides healthy recipe alternatives. Always provide measurements in grams."
          },
          {
            role: "user",
            content: `Generate a healthy alternative recipe for: ${query}. 
            Return a JSON object with the following structure:
            {
              "title": "Recipe Name",
              "description": "Brief description of why this is a healthier alternative",
              "servingSize": {
                "servings": number,
                "gramsPerServing": number
              },
              "ingredients": [
                {
                  "name": "Ingredient name",
                  "amount": number
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
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    const data = await response.json();
    console.log('OpenAI response:', data);

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid AI response format');
    }

    try {
      const recipe = JSON.parse(data.choices[0].message.content.trim());
      console.log('Parsed recipe:', recipe);

      return new Response(JSON.stringify(recipe), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      console.log('Raw content:', data.choices[0].message.content);
      throw new Error('Failed to parse recipe JSON from OpenAI response');
    }
  } catch (error) {
    console.error('Error in healthy-alternative function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack 
      }), 
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});