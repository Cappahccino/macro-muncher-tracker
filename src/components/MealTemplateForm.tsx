import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FoodSelect } from "@/components/FoodSelect";
import { toast } from "@/components/ui/use-toast";

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

  const handleAddComponent = (component: FoodComponent) => {
    const updatedComponents = [...currentTemplate.components, component];
    const totalMacros = calculateTotalMacros(updatedComponents);
    
    setCurrentTemplate({
      ...currentTemplate,
      components: updatedComponents,
      totalMacros
    });
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
        description: "Please enter a meal template name",
        variant: "destructive",
      });
      return;
    }
    onSave(currentTemplate);
  };

  return (
    <Card className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder="Template name"
          value={currentTemplate.name}
          onChange={(e) => setCurrentTemplate({ ...currentTemplate, name: e.target.value })}
        />
        <FoodSelect onAddComponent={handleAddComponent} />
        
        {currentTemplate.components.length > 0 && (
          <div className="mt-4 space-y-2">
            <h4 className="font-medium">Components:</h4>
            {currentTemplate.components.map((component, idx) => (
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
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Calories</p>
                <p className="font-medium">{currentTemplate.totalMacros.calories.toFixed(1)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Protein</p>
                <p className="font-medium">{currentTemplate.totalMacros.protein.toFixed(1)}g</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Carbs</p>
                <p className="font-medium">{currentTemplate.totalMacros.carbs.toFixed(1)}g</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Fat</p>
                <p className="font-medium">{currentTemplate.totalMacros.fat.toFixed(1)}g</p>
              </div>
            </div>
          </div>
        )}
        
        <Button type="submit" className="w-full">
          {editingIndex !== null ? "Save Changes" : "Add Template"}
        </Button>
        {editingIndex !== null && (
          <Button type="button" variant="outline" className="w-full" onClick={onCancel}>
            Cancel Edit
          </Button>
        )}
      </form>
    </Card>
  );
}