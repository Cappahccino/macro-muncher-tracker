import { Button } from "@/components/ui/button";
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
                
                <div className="mt-4">
                  <h5 className="font-medium mb-2">Nutritional Information (per serving):</h5>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Calories</p>
                      <p className="font-medium">{Math.round(alternative.calories || 0)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Protein</p>
                      <p className="font-medium">{Math.round(alternative.protein || 0)}g</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Carbs</p>
                      <p className="font-medium">{Math.round(alternative.carbs || 0)}g</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Fat</p>
                      <p className="font-medium">{Math.round(alternative.fat || 0)}g</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Fiber</p>
                      <p className="font-medium">{Math.round(alternative.fiber || 0)}g</p>
                    </div>
                  </div>
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