import { Input } from "@/components/ui/input";

interface MealFormInputProps {
  type?: string;
  placeholder: string;
  value: string | number;
  onChange: (value: number | string) => void;
}

export function MealFormInput({ 
  type = "text", 
  placeholder, 
  value, 
  onChange 
}: MealFormInputProps) {
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