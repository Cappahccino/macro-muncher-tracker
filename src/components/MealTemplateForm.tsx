import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FoodSelect } from "@/components/FoodSelect";
import { toast } from "@/components/ui/use-toast";
import { SaveToVaultButton } from "@/components/meal/SaveToVaultButton";
import { ConfirmTemplateDialog } from "@/components/meal/ConfirmTemplateDialog";
import { IngredientsList } from "@/components/meal/IngredientsList";
import { calculateTotalMacros } from "@/utils/macroCalculations";

interface FoodComponent {
  name: string;
  amount: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
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
    fiber: number;
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
    const existingIndex = pendingIngredients.findIndex(
      (item) => item.name === component.name
    );

    if (existingIndex !== -1) {
      const updatedIngredients = [...pendingIngredients];
      updatedIngredients[existingIndex] = component;
      setPendingIngredients(updatedIngredients);
      toast({
        title: "Component Updated",
        description: `${component.name} has been updated with new values.`,
      });
    } else {
      setPendingIngredients([...pendingIngredients, component]);
    }
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
      resetForm();
    }
  };

  const handleConfirmEdit = () => {
    onSave(currentTemplate);
    setShowConfirmDialog(false);
    resetForm();
  };

  const resetForm = () => {
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
                      fiber: comp.fiber || 0,
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
          
          <IngredientsList ingredients={pendingIngredients} />
          
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

      <ConfirmTemplateDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        onConfirm={handleConfirmEdit}
        onCancel={() => {
          setShowConfirmDialog(false);
          resetForm();
        }}
      />
    </div>
  );
}