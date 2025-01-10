import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FoodItem {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface FoodSelectProps {
  onSelect: (food: FoodItem | null) => void;
}

export function FoodSelect({ onSelect }: FoodSelectProps) {
  const foodItems: FoodItem[] = JSON.parse(localStorage.getItem('foodItems') || '[]');

  const handleFoodSelect = (foodName: string) => {
    const food = foodItems.find(item => item.name === foodName);
    onSelect(food || null);
  };

  return (
    <Select onValueChange={handleFoodSelect}>
      <SelectTrigger>
        <SelectValue placeholder="Select a food" />
      </SelectTrigger>
      <SelectContent>
        {foodItems.map((food, index) => (
          <SelectItem key={index} value={food.name}>
            {food.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}