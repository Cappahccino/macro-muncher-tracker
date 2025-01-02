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
import { EditIngredientDialog } from "./meal/EditIngredientDialog";
import { Plus } from "lucide-react";

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
  const [editingIngredient, setEditingIngredient] = useState<{index: number, component: FoodComponent} | null>(null);

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

  const handleEditIngredient = (index: number, component: FoodComponent) => {
    setEditingIngredient({ index, component });
  };

  const handleUpdateIngredient = (updatedComponent: FoodComponent) => {
    if (editingIngredient === null) return;
    
    const updatedIngredients = [...pendingIngredients];
    updatedIngredients[editingIngredient.index] = updatedComponent;
    setPendingIngredients(updatedIngredients);
    setEditingIngredient(null);
    
    toast({
      title: "Success",
      description: "Ingredient updated successfully",
    });
  };

  const handleDeleteIngredient = (index: number) => {
    const updatedIngredients = pendingIngredients.filter((_, i) => i !== index);
    setPendingIngredients(updatedIngredients);
    toast({
      title: "Success",
      description: "Ingredient removed successfully",
    });
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
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => {
                  const savedTemplates = JSON.parse(localStorage.getItem('mealTemplates') || '[]');
                  savedTemplates.push(currentTemplate);
                  localStorage.setItem('mealTemplates', JSON.stringify(savedTemplates));
                  toast({
                    title: "Success",
                    description: "Recipe saved successfully",
                  });
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            )}
          </div>

          <FoodSelect onAddComponent={handleAddComponent} />

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
          
          <IngredientsList 
            ingredients={pendingIngredients}
            onEdit={handleEditIngredient}
            onDelete={handleDeleteIngredient}
          />
          
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

      <EditIngredientDialog
        open={editingIngredient !== null}
        onOpenChange={(open) => !open && setEditingIngredient(null)}
        ingredient={editingIngredient?.component}
        onSave={handleUpdateIngredient}
      />
    </div>
  );
}