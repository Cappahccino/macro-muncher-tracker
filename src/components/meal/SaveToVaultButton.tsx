import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SaveToVaultButtonProps {
  meal: {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export function SaveToVaultButton({ meal }: SaveToVaultButtonProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSaveToVault = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to save recipes",
          variant: "destructive",
        });
        navigate("/sign-in");
        return;
      }

      const { error } = await supabase
        .from('recipes')
        .insert({
          user_id: session.user.id,
          title: meal.name,
          description: `A meal with ${meal.calories} calories, ${meal.protein}g protein, ${meal.carbs}g carbs, and ${meal.fat}g fat.`,
          instructions: {
            macros: {
              calories: meal.calories,
              protein: meal.protein,
              carbs: meal.carbs,
              fat: meal.fat
            }
          },
          total_calories: meal.calories,
          total_protein: meal.protein,
          total_carbs: meal.carbs,
          total_fat: meal.fat
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Recipe saved to vault successfully",
      });
    } catch (error) {
      console.error('Error saving recipe:', error);
      toast({
        title: "Error",
        description: "Failed to save recipe to vault",
        variant: "destructive",
      });
    }
  };

  return (
    <Button onClick={handleSaveToVault} className="flex items-center gap-2">
      <Save className="h-4 w-4" />
      Save to Vault
    </Button>
  );
}