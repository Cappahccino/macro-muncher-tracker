import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FoodSelect } from "@/components/FoodSelect";
import { toast } from "@/components/ui/use-toast";
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
  const [pendingIngredients, setPendingIngredients] = useState<FoodComponent[]>(template.components || []);
  const [selectedFood, setSelectedFood] = useState<any>(null);
  const [amount, setAmount] = useState<number>(100);

  // Reset form when template changes
  useEffect(() => {
    setCurrentTemplate(template);
    setPendingIngredients(template.components || []);
    setSelectedFood(null);
    setAmount(100);
  }, [template]);

  const handleAddIngredient = () => {
    if (!selectedFood || !amount) return;

    const ratio = amount / 100;
    const newComponent: FoodComponent = {
      name: selectedFood.name,
      amount: amount,
      calories: selectedFood.calories * ratio,
      protein: selectedFood.protein * ratio,
      carbs: selectedFood.carbs * ratio,
      fat: selectedFood.fat * ratio,
    };

    setPendingIngredients(prev => [...prev, newComponent]);
    setSelectedFood(null);
    setAmount(100);
  };

  const calculateTotalMacros = (components: FoodComponent[]) => {
    return components.reduce((acc, component) => ({
      calories: acc.calories + component.calories,
      protein: acc.protein + component.protein,
      carbs: acc.carbs + component.carbs,
      fat: acc.fat + component.fat,
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
  };

  const resetForm = () => {
    setCurrentTemplate({
      name: "",
      components: [],
      totalMacros: { calories: 0, protein: 0, carbs: 0, fat: 0 }
    });
    setPendingIngredients([]);
    setSelectedFood(null);
    setAmount(100);
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
    
    const updatedTemplate = {
      ...currentTemplate,
      components: pendingIngredients,
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

  return (
    <>
      <Card className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Recipe name"
            value={currentTemplate.name}
            onChange={(e) => setCurrentTemplate({ ...currentTemplate, name: e.target.value })}
          />
          <div className="flex gap-2">
            <div className="flex-1">
              <FoodSelect onSelect={setSelectedFood} />
            </div>
            <Input
              type="number"
              placeholder="Weight (g)"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-32"
            />
            <Button 
              type="button"
              onClick={handleAddIngredient}
              disabled={!selectedFood || !amount}
            >
              Add
            </Button>
          </div>
          
          {pendingIngredients.length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="font-medium">Pending Ingredients:</h4>
              {pendingIngredients.map((component, idx) => (
                <div key={idx} className="pl-4">
                  <p>{component.name} - {component.amount}g</p>
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
          
          <Button type="submit" className="w-full">
            {editingIndex !== null ? "Save Changes" : "Add Recipe"}
          </Button>
          {editingIndex !== null && (
            <Button type="button" variant="outline" className="w-full" onClick={onCancel}>
              Cancel Edit
            </Button>
          )}
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
    </>
  );
}