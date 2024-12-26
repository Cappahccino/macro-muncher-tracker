import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Configuration, OpenAIApi } from "https://esm.sh/openai@3.2.1";

serve(async (req) => {
  const { query } = await req.json();

  const prompt = generatePrompt(query);

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${Deno.env.get("OPENAI_API_KEY")}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await response.json();

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
});

const generatePrompt = (query: string) => `
Generate a healthy alternative recipe based on this request: "${query}"

Provide the response in the following JSON format:
{
  "title": "Recipe Name",
  "description": "Brief description of the dish",
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
}

IMPORTANT:
1. ALL measurements MUST be in grams
2. Include detailed cooking instructions with precise measurements
3. Provide complete macronutrient information per serving
4. Make sure the recipe is healthy and nutritious
`;

