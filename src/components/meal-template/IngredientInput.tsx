import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FoodSelect } from "@/components/FoodSelect";

interface FoodItem {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface IngredientInputProps {
  selectedFood: FoodItem | null;
  amount: number;
  onFoodSelect: (food: FoodItem | null) => void;
  onAmountChange: (amount: number) => void;
  onAdd: () => void;
}

export function IngredientInput({
  selectedFood,
  amount,
  onFoodSelect,
  onAmountChange,
  onAdd
}: IngredientInputProps) {
  return (
    <div className="flex gap-2">
      <div className="flex-1">
        <FoodSelect onSelect={onFoodSelect} />
      </div>
      <Input
        type="number"
        placeholder="Weight (g)"
        value={amount}
        onChange={(e) => onAmountChange(Number(e.target.value))}
        className="w-32"
      />
      <Button 
        type="button"
        onClick={onAdd}
        disabled={!selectedFood || !amount}
      >
        Add
      </Button>
    </div>
  );
}