import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

interface FoodItem {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  notes: string;
  weight: number;
}

interface FoodItemCardProps {
  food: FoodItem;
  onEdit: () => void;
  onDelete: () => void;
}

export function FoodItemCard({ food, onEdit, onDelete }: FoodItemCardProps) {
  return (
    <Card className="p-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div className="space-y-2 flex-1">
          <h3 className="font-bold text-lg">{food.name}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
            <p>Weight: {food.weight}g</p>
            <p>Calories: {food.calories}</p>
            <p>Protein: {food.protein}g</p>
            <p>Carbs: {food.carbs}g</p>
            <p>Fat: {food.fat}g</p>
            <p>Fiber: {food.fiber}g</p>
          </div>
          {food.notes && (
            <p className="mt-2 text-sm text-muted-foreground">Notes: {food.notes}</p>
          )}
        </div>
        <div className="flex sm:flex-col gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={onEdit}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}