import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MealSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function MealSelect({ value, onChange }: MealSelectProps) {
  const savedTemplates = JSON.parse(localStorage.getItem('mealTemplates') || '[]');

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select a meal template" />
      </SelectTrigger>
      <SelectContent>
        {savedTemplates.map((template: { name: string }, index: number) => (
          <SelectItem key={index} value={template.name}>
            {template.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}