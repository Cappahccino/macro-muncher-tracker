import { Button } from "@/components/ui/button";
import { useSaveRecipe } from "@/hooks/useSaveRecipe";
import { MacroNutrient } from "../meal/MacroNutrient";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IngredientsList } from "./ingredients/IngredientsList";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface AlternativeSearchResultsProps {
  showResults: boolean;
  setShowResults: (show: boolean) => void;
  alternative: any;
  handleSearch: () => void;
}

export function AlternativeSearchResults({
  showResults,
  setShowResults,
  alternative,
  handleSearch,
}: AlternativeSearchResultsProps) {
  const { saveRecipe, isSaving } = useSaveRecipe();

  const handleAddToMeals = async () => {
    if (!alternative) return;
    
    const saved = await saveRecipe(alternative);
    if (saved) {
      setShowResults(false);
    }
  };

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
                
                {alternative.servingSize && (
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium">
                      Makes {alternative.servingSize.servings} servings 
                      ({alternative.servingSize.gramsPerServing}g per serving)
                    </p>
                  </div>
                )}

                <IngredientsList ingredients={alternative.ingredients || []} />

                <div className="mt-4">
                  <h5 className="font-medium mb-2">Instructions:</h5>
                  <ol className="list-decimal list-inside space-y-2">
                    {alternative.instructions?.steps?.map((step: string, index: number) => (
                      <li key={index} className="text-sm">
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>

                {alternative.macronutrients?.perServing && (
                  <div className="mt-4">
                    <h5 className="font-medium mb-2">Nutrition (per serving):</h5>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <MacroNutrient 
                        label="Calories" 
                        value={alternative.macronutrients.perServing.calories} 
                        unit="" 
                      />
                      <MacroNutrient 
                        label="Protein" 
                        value={alternative.macronutrients.perServing.protein} 
                        unit="g" 
                      />
                      <MacroNutrient 
                        label="Carbs" 
                        value={alternative.macronutrients.perServing.carbs} 
                        unit="g" 
                      />
                      <MacroNutrient 
                        label="Fat" 
                        value={alternative.macronutrients.perServing.fat} 
                        unit="g" 
                      />
                      <MacroNutrient 
                        label="Fiber" 
                        value={alternative.macronutrients.perServing.fiber} 
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
            onClick={handleAddToMeals}
            disabled={isSaving}
          >
            {isSaving ? "Adding..." : "Add to Recipe Vault"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}