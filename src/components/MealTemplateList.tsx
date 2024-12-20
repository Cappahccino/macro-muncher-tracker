import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

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

interface MealTemplateListProps {
  templates: MealTemplate[];
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
}

export function MealTemplateList({ templates, onEdit, onDelete }: MealTemplateListProps) {
  return (
    <div className="space-y-4">
      {templates.map((template, index) => (
        <Card key={index} className="p-4">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-bold text-lg">{template.name}</h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => onEdit(index)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onDelete(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {template.components.length > 0 ? (
            <div className="space-y-2">
              <h4 className="font-medium">Components:</h4>
              {template.components.map((component, idx) => (
                <div key={idx} className="pl-4">
                  <p>{component.name} - {Math.round(component.amount)}g</p>
                  <p className="text-sm text-muted-foreground">
                    Calories: {Math.round(component.calories)} | 
                    Protein: {Math.round(component.protein)}g | 
                    Carbs: {Math.round(component.carbs)}g | 
                    Fat: {Math.round(component.fat)}g
                  </p>
                </div>
              ))}
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Calories</p>
                  <p className="font-medium">{Math.round(template.totalMacros.calories)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Protein</p>
                  <p className="font-medium">{Math.round(template.totalMacros.protein)}g</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Carbs</p>
                  <p className="font-medium">{Math.round(template.totalMacros.carbs)}g</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Fat</p>
                  <p className="font-medium">{Math.round(template.totalMacros.fat)}g</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">No components added yet</p>
          )}
        </Card>
      ))}
    </div>
  );
}