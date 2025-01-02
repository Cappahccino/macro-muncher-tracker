import { useState } from "react";
import { Card } from "@/components/ui/card";
import { FoodSelect } from "@/components/FoodSelect";
import { toast } from "@/components/ui/use-toast";
import { SaveToVaultButton } from "@/components/meal/SaveToVaultButton";
import { ConfirmTemplateDialog } from "@/components/meal/ConfirmTemplateDialog";
import { IngredientsList } from "@/components/meal/IngredientsList";
import { calculateTotalMacros } from "@/utils/macroCalculations";
import { EditIngredientDialog } from "./meal/EditIngredientDialog";
import { RecipeFormHeader } from "./meal/RecipeFormHeader";
import { RecipeNotes } from "./meal/RecipeNotes";
import { RecipeInstructions } from "./meal/RecipeInstructions";
import { RecipeFormActions } from "./meal/RecipeFormActions";
import { FoodComponent, MealTemplate } from "@/types/food";

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
          <RecipeFormHeader
            name={currentTemplate.name}
            onNameChange={(name) => setCurrentTemplate({ ...currentTemplate, name })}
          />

          <FoodSelect onAddComponent={handleAddComponent} />

          <RecipeNotes
            description={currentTemplate.description || ""}
            onChange={(description) => setCurrentTemplate({ ...currentTemplate, description })}
          />

          <RecipeInstructions
            instructions={instructions}
            onChange={setInstructions}
          />
          
          <IngredientsList 
            ingredients={pendingIngredients}
            onEdit={handleEditIngredient}
            onDelete={handleDeleteIngredient}
          />
          
          <RecipeFormActions
            isEditing={editingIndex !== null}
            onCancel={onCancel}
          />
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