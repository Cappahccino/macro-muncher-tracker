import { Input } from "@/components/ui/input";
import { MealSelect } from "./MealSelect";

interface MealFormInputProps {
  type?: string;
  placeholder: string;
  value: string | number;
  onChange: (value: number | string) => void;
  isMealName?: boolean;
}

export function MealFormInput({ 
  type = "text", 
  placeholder, 
  value, 
  onChange,
  isMealName = false
}: MealFormInputProps) {
  const handleRecipeSelect = (recipeName: string) => {
    onChange(recipeName);
  };

  return (
    <div className="space-y-2">
      {isMealName && (
        <>
          <MealSelect 
            value={String(value)} 
            onChange={handleRecipeSelect} 
          />
          <Input
            type={type}
            placeholder={placeholder}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
          />
        </>
      )}
      {!isMealName && (
        <Input
          type={type}
          placeholder={placeholder}
          value={value || ""}
          onChange={(e) => onChange(type === "number" ? Number(e.target.value) : e.target.value)}
        />
      )}
    </div>
  );
}