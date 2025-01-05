import { Input } from "@/components/ui/input";

interface MacroInputsProps {
  weight: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  onChange: (field: string, value: number) => void;
}

export function MacroInputs({
  weight,
  calories,
  protein,
  carbs,
  fat,
  fiber,
  onChange,
}: MacroInputsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <Input
        type="number"
        placeholder="Weight (g)"
        value={weight || ""}
        onChange={(e) => onChange("weight", Number(e.target.value))}
      />
      <Input
        type="number"
        placeholder="Calories"
        value={calories || ""}
        onChange={(e) => onChange("calories", Number(e.target.value))}
      />
      <Input
        type="number"
        placeholder="Protein (g)"
        value={protein || ""}
        onChange={(e) => onChange("protein", Number(e.target.value))}
      />
      <Input
        type="number"
        placeholder="Carbs (g)"
        value={carbs || ""}
        onChange={(e) => onChange("carbs", Number(e.target.value))}
      />
      <Input
        type="number"
        placeholder="Fat (g)"
        value={fat || ""}
        onChange={(e) => onChange("fat", Number(e.target.value))}
      />
      <Input
        type="number"
        placeholder="Fiber (g)"
        value={fiber || ""}
        onChange={(e) => onChange("fiber", Number(e.target.value))}
      />
    </div>
  );
}