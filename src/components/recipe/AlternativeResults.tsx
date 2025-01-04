import { Button } from "@/components/ui/button";
import { useSaveRecipe } from "@/hooks/useSaveRecipe";
import { MacroNutrient } from "../meal/MacroNutrient";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { RecipeIngredientsList } from "./details/RecipeIngredientsList";
import { RecipeInstructions } from "./details/RecipeInstructions";
import { RecipeServingInfo } from "./details/RecipeServingInfo";

interface AlternativeResultsProps {
  showResults: boolean;
  setShowResults: (show: boolean) => void;
  alternative: any;
  handleSearch: () => void;
}

export function AlternativeResults({
  showResults,
  setShowResults,
  alternative,
  handleSearch,
}: AlternativeResultsProps) {
  const { saveRecipe, isSaving } = useSaveRecipe();

  const macros = alternative?.macronutrients?.perServing;
  const recipe = alternative ? {
    title: alternative.title,
    description: alternative.description,
    instructions: alternative.instructions,
    dietary_tags: [],
    total_calories: macros?.calories,
    total_protein: macros?.protein,
    total_carbs: macros?.carbs,
    total_fat: macros?.fat,
    ingredients: alternative.ingredients
  } : null;

  return (
    <AlertDialog open={showResults} onOpenChange={setShowResults}>
      <AlertDialogContent className="max-w-2xl max-h-[90vh]">
        <AlertDialogHeader>
          <AlertDialogTitle>Healthy Alternative Found!</AlertDialogTitle>
        </AlertDialogHeader>
        
        <ScrollArea className="h-[calc(90vh-8rem)] pr-4">
          <AlertDialogDescription className="space-y-4">
            {alternative && (
              <>
                <h4 className="font-semibold text-lg">{alternative.title}</h4>
                <p className="text-muted-foreground">{alternative.description}</p>
                
                <RecipeServingInfo servingSize={alternative.servingSize} />
                <RecipeIngredientsList ingredients={alternative.ingredients || []} />
                <RecipeInstructions steps={alternative.instructions?.steps || []} />

                {macros && (
                  <div className="mt-4">
                    <h5 className="font-medium mb-2">Total Nutrition (per serving):</h5>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <MacroNutrient 
                        label="Calories" 
                        value={macros.calories} 
                        unit="" 
                      />
                      <MacroNutrient 
                        label="Protein" 
                        value={macros.protein} 
                        unit="g" 
                      />
                      <MacroNutrient 
                        label="Carbs" 
                        value={macros.carbs} 
                        unit="g" 
                      />
                      <MacroNutrient 
                        label="Fat" 
                        value={macros.fat} 
                        unit="g" 
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </AlertDialogDescription>
        </ScrollArea>

        <AlertDialogFooter className="flex gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => setShowResults(false)}
          >
            Close
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setShowResults(false);
              handleSearch();
            }}
          >
            Search Again
          </Button>
          <Button 
            onClick={() => saveRecipe(recipe)}
            disabled={isSaving}
          >
            {isSaving ? "Adding..." : "Add to Recipe Vault"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}