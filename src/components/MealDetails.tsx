import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Meal {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface MealDetailsProps {
  meal: Meal;
}

export function MealDetails({ meal }: MealDetailsProps) {
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
          }
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
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-2xl font-bold">{meal.name}</h2>
        </div>
        <Button onClick={handleSaveToVault} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save to Vault
        </Button>
      </div>
      
      <Card className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Calories</p>
            <p className="text-2xl font-bold">{Math.round(meal.calories)}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Protein</p>
            <p className="text-2xl font-bold">{Math.round(meal.protein)}g</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Carbs</p>
            <p className="text-2xl font-bold">{Math.round(meal.carbs)}g</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Fat</p>
            <p className="text-2xl font-bold">{Math.round(meal.fat)}g</p>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold mb-2">Macronutrient Breakdown</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-100 p-4 rounded-lg">
              <p className="text-sm text-blue-800">Protein Ratio</p>
              <p className="text-lg font-semibold text-blue-900">
                {Math.round((meal.protein * 4 / meal.calories) * 100)}%
              </p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg">
              <p className="text-sm text-green-800">Carbs Ratio</p>
              <p className="text-lg font-semibold text-green-900">
                {Math.round((meal.carbs * 4 / meal.calories) * 100)}%
              </p>
            </div>
            <div className="bg-red-100 p-4 rounded-lg">
              <p className="text-sm text-red-800">Fat Ratio</p>
              <p className="text-lg font-semibold text-red-900">
                {Math.round((meal.fat * 9 / meal.calories) * 100)}%
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}