import { Button } from "@/components/ui/button";
import { useSaveRecipe } from "@/hooks/useSaveRecipe";
import { MacroNutrient } from "../meal/MacroNutrient";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  const [expandedIngredient, setExpandedIngredient] = useState<number | null>(null);

  const toggleIngredient = (index: number) => {
    setExpandedIngredient(expandedIngredient === index ? null : index);
  };

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
    total_fiber: macros?.fiber,
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
                  <ul className="space-y-2">
                    {alternative.ingredients?.map((ingredient: any, index: number) => (
                      <li key={index} className="text-sm">
                        <div className="space-y-2">
                          <div 
                            className="flex items-center justify-between cursor-pointer p-2 hover:bg-muted/50 rounded-lg"
                            onClick={() => toggleIngredient(index)}
                          >
                            <span>{ingredient.name} - {ingredient.amount}g</span>
                            {expandedIngredient === index ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </div>
                          {expandedIngredient === index && ingredient.macros && (
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