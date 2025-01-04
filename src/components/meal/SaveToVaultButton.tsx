import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { InstructionsDialog } from "./save-to-vault/InstructionsDialog";
import { saveRecipeToVault } from "./save-to-vault/SaveToVaultService";

interface Ingredient {
  name: string;
  amount: number;
  macros: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
}

interface SaveToVaultButtonProps {
  meal: {
    title: string;
    description: string;
    instructions: {
      steps: string[];
      servingSize?: {
        servings: number;
        gramsPerServing: number;
      };
    };
    ingredients?: Ingredient[];
    macronutrients: {
      perServing: {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
        fiber: number;
      };
    };
  };
  existingInstructions?: string[];
}

export function SaveToVaultButton({ meal, existingInstructions }: SaveToVaultButtonProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showInstructionsDialog, setShowInstructionsDialog] = useState(false);
  const [instructions, setInstructions] = useState(existingInstructions ? existingInstructions.join('\n') : "");

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

      setShowInstructionsDialog(true);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to prepare recipe for saving",
        variant: "destructive",
      });
    }
  };

  const handleConfirmSave = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const instructionsArray = instructions.split('\n').filter(line => line.trim() !== '');
      const recipeToSave = {
        ...meal,
        instructions: { steps: instructionsArray }
      };

      await saveRecipeToVault(recipeToSave, session.user.id);

      setShowInstructionsDialog(false);
      toast({
        title: "Success",
        description: "Recipe saved to vault successfully",
      });
      
      navigate("/recipe-vault");
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
    <>
      <Button onClick={handleSaveToVault} className="flex items-center gap-2">
        <Save className="h-4 w-4" />
        Save to Vault
      </Button>

      <InstructionsDialog
        open={showInstructionsDialog}
        onOpenChange={setShowInstructionsDialog}
        instructions={instructions}
        onInstructionsChange={setInstructions}
        onConfirm={handleConfirmSave}
      />
    </>
  );
}