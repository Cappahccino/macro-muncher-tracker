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
  if (isMealName) {
    return (
      <div className="space-y-2">
        <MealSelect 
          value={String(value)} 
          onChange={(newValue) => onChange(newValue)} 
        />
        <Input
          type={type}
          placeholder={placeholder}
          value={value || ""}
          onChange={(e) => onChange(type === "number" ? Number(e.target.value) : e.target.value)}
        />
      </div>
    );
  }

  return (
    <div>
      <Input
        type={type}
        placeholder={placeholder}
        value={value || ""}
        onChange={(e) => onChange(type === "number" ? Number(e.target.value) : e.target.value)}
      />
    </div>
  );
}