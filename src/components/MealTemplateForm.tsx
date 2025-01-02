import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FoodSelect } from "@/components/FoodSelect";
import { toast } from "@/components/ui/use-toast";
import { SaveToVaultButton } from "@/components/meal/SaveToVaultButton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface FoodComponent {
  name: string;
  amount: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface MealTemplate {
  name: string;
  description?: string;
  instructions?: {
    steps: string[];
    servingSize?: {
      servings: number;
      gramsPerServing: number;
    };
  };
  components: FoodComponent[];
  totalMacros: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

interface MealTemplateFormProps {
  editingIndex: number | null;
  template: MealTemplate;
  onSave: (template: MealTemplate) => void;
  onCancel: () => void;
}

export function MealTemplateForm({ 
  editingIndex, 
  template, 
  onSave, 
  onCancel 
}: MealTemplateFormProps) {
  const [currentTemplate, setCurrentTemplate] = useState<MealTemplate>(template);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingIngredients, setPendingIngredients] = useState<FoodComponent[]>([]);
  const [instructions, setInstructions] = useState<string>("");

  const handleAddComponent = (component: FoodComponent) => {
    // Check if component already exists
    const existingIndex = pendingIngredients.findIndex(
      (item) => item.name === component.name
    );

    if (existingIndex !== -1) {
      // Update existing component
      const updatedIngredients = [...pendingIngredients];
      updatedIngredients[existingIndex] = component;
      setPendingIngredients(updatedIngredients);
      toast({
        title: "Component Updated",
        description: `${component.name} has been updated with new values.`,
      });
    } else {
      // Add new component
      setPendingIngredients([...pendingIngredients, component]);
    }
  };

  const calculateTotalMacros = (components: FoodComponent[]) => {
    return components.reduce((acc, component) => ({
      calories: acc.calories + component.calories,
      protein: acc.protein + component.protein,
      carbs: acc.carbs + component.carbs,
      fat: acc.fat + component.fat,
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTemplate.name) {
      toast({
        title: "Error",
        description: "Please enter a recipe name",
        variant: "destructive",
      });
      return;
    }
    
    // Process instructions into steps array
    const instructionsSteps = instructions
      .split('\n')
      .filter(step => step.trim() !== '')
      .map(step => step.trim());
    
    const updatedTemplate = {
      ...currentTemplate,
      components: pendingIngredients,
      instructions: {
        steps: instructionsSteps,
      },
      totalMacros: calculateTotalMacros(pendingIngredients)
    };
    
    if (editingIndex !== null) {
      setShowConfirmDialog(true);
      setCurrentTemplate(updatedTemplate);
    } else {
      onSave(updatedTemplate);
      setPendingIngredients([]);
      setInstructions("");
    }
  };

  const handleConfirmEdit = () => {
    onSave(currentTemplate);
    setShowConfirmDialog(false);
    setPendingIngredients([]);
    setInstructions("");
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-card/50 backdrop-blur-sm border rounded-xl shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center gap-4">
            <Input
              placeholder="Recipe name"
              value={currentTemplate.name}
              onChange={(e) => setCurrentTemplate({ ...currentTemplate, name: e.target.value })}
              className="flex-1"
            />
            {currentTemplate.name && (
              <SaveToVaultButton
                meal={{
                  title: currentTemplate.name,
                  description: currentTemplate.description || "",
                  instructions: {
                    steps: instructions.split('\n').filter(step => step.trim() !== ''),
                  },
                  ingredients: pendingIngredients.map(comp => ({
                    name: comp.name,
                    amount: comp.amount,
                    macros: {
                      calories: comp.calories,
                      protein: comp.protein,
                      carbs: comp.carbs,
                      fat: comp.fat,
                      fiber: 0, // Add proper fiber tracking if needed
                    }
                  })),
                  macronutrients: {
                    perServing: calculateTotalMacros(pendingIngredients)
                  }
                }}
              />
            )}
          </div>

          <Textarea
            placeholder="Recipe notes"
            value={currentTemplate.description || ""}
            onChange={(e) => setCurrentTemplate({ ...currentTemplate, description: e.target.value })}
            className="min-h-[100px]"
          />

          <Textarea
            placeholder="Instructions (one step per line)"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            className="min-h-[150px]"
          />

          <FoodSelect onAddComponent={handleAddComponent} />
          
          {pendingIngredients.length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="font-medium text-lg bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">Ingredients:</h4>
              {pendingIngredients.map((component, idx) => (
                <div key={idx} className="bg-background/50 backdrop-blur-sm rounded-lg p-4 border">
                  <p className="font-medium">{component.name} - {component.amount}g</p>
                  <p className="text-sm text-muted-foreground">
                    Calories: {component.calories.toFixed(1)} | 
                    Protein: {component.protein.toFixed(1)}g | 
                    Carbs: {component.carbs.toFixed(1)}g | 
                    Fat: {component.fat.toFixed(1)}g
                  </p>
                </div>
              ))}
            </div>
          )}
          
          <div className="flex gap-4">
            <Button type="submit" className="w-full">
              {editingIndex !== null ? "Save Changes" : "Add Recipe"}
            </Button>
            {editingIndex !== null && (
              <Button type="button" variant="outline" className="w-full" onClick={onCancel}>
                Cancel Edit
              </Button>
            )}
          </div>
        </form>
      </Card>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Recipe Update</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to update this recipe? This will overwrite the existing recipe with the new information.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmEdit}>
              Update Recipe
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}