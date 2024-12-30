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
import { ScrollArea } from "@/components/ui/scroll-area";
import { SaveToVaultButton } from "../meal/SaveToVaultButton";

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
  const macros = alternative?.macronutrients?.perServing;
  const meal = macros ? {
    name: alternative.title,
    calories: macros.calories,
    protein: macros.protein,
    carbs: macros.carbs,
    fat: macros.fat,
    fiber: macros.fiber,
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
                
                {alternative.servingSize && (
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium">
                      Makes {alternative.servingSize.servings} servings 
                      ({alternative.servingSize.gramsPerServing}g per serving)
                    </p>
                  </div>
                )}

                <div className="mt-4">
                  <h5 className="font-medium mb-2">Ingredients:</h5>
                  <ul className="space-y-4">
                    {alternative.ingredients?.map((ingredient: any, index: number) => (
                      <li key={index} className="text-sm">
                        <div className="space-y-2">
                          <p>{ingredient.name} - {ingredient.amount}g</p>
                          {ingredient.macros && (
                            <div className="grid grid-cols-5 gap-2 pl-4 text-xs bg-muted/50 p-2 rounded">
                              <div>
                                <p className="text-muted-foreground">Calories</p>
                                <p>{Math.round(ingredient.macros.calories)}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Protein</p>
                                <p>{Math.round(ingredient.macros.protein)}g</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Carbs</p>
                                <p>{Math.round(ingredient.macros.carbs)}g</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Fat</p>
                                <p>{Math.round(ingredient.macros.fat)}g</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Fiber</p>
                                <p>{Math.round(ingredient.macros.fiber)}g</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

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

                {macros && (
                  <div className="mt-4">
                    <h5 className="font-medium mb-2">Total Nutrition (per serving):</h5>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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
                      <MacroNutrient 
                        label="Fiber" 
                        value={macros.fiber} 
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
          {meal && <SaveToVaultButton meal={meal} />}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}