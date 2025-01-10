import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MealSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function MealSelect({ value, onChange }: MealSelectProps) {
  const { data: recipes } = useQuery({
    queryKey: ['recipes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recipes')
        .select('*');
      
      if (error) throw error;
      return data;
    },
  });

  const handleRecipeSelect = (recipeName: string) => {
    const selectedRecipe = recipes?.find(recipe => recipe.title === recipeName);
    
    if (selectedRecipe) {
      onChange(recipeName);
      
      // Emit the template selected event with the recipe's macros
      const event = new CustomEvent('templateSelected', {
        detail: {
          name: selectedRecipe.title,
          calories: selectedRecipe.total_calories,
          protein: selectedRecipe.total_protein,
          carbs: selectedRecipe.total_carbs,
          fat: selectedRecipe.total_fat,
          fiber: selectedRecipe.total_fiber
        }
      });
      window.dispatchEvent(event);
    }
  };

  return (
    <Select value={value} onValueChange={handleRecipeSelect}>
      <SelectTrigger>
        <SelectValue placeholder="Select a recipe" />
      </SelectTrigger>
      <SelectContent>
        {recipes?.map((recipe, index) => (
          <SelectItem key={index} value={recipe.title}>
            {recipe.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}