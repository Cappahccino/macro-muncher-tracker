import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MacroNutrient } from "../meal/MacroNutrient";

interface AlternativeResultsProps {
  showResults: boolean;
  setShowResults: (show: boolean) => void;
  alternative: any;
  handleSearch: () => void;
  handleAddToMeals: () => void;
}

export function AlternativeResults({
  showResults,
  setShowResults,
  alternative,
  handleSearch,
  handleAddToMeals
}: AlternativeResultsProps) {
  return (
    <AlertDialog open={showResults} onOpenChange={setShowResults}>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Healthy Alternative Found!</AlertDialogTitle>
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

                <div className="mt-4">
                  <h5 className="font-medium mb-2">Ingredients:</h5>
                  <ul className="space-y-1">
                    {alternative.ingredients?.map((ingredient: any, index: number) => (
                      <li key={index} className="text-sm">
                        {ingredient.name} - {ingredient.amount}g
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex gap-2">
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
            Research
          </Button>
          <Button onClick={handleAddToMeals}>
            Add to Meals
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}