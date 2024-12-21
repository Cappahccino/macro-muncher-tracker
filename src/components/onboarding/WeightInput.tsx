import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface WeightInputProps {
  label: string;
  weight: number;
  weightUnit: "kg" | "lbs" | "st";
  onWeightChange: (weight: number) => void;
  onUnitChange: (unit: "kg" | "lbs" | "st") => void;
}

export const WeightInput = ({
  label,
  weight,
  weightUnit,
  onWeightChange,
  onUnitChange,
}: WeightInputProps) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <div className="flex gap-2">
        <Input
          type="number"
          value={weight || ""}
          onChange={(e) => onWeightChange(Number(e.target.value))}
          placeholder={`Weight in ${weightUnit}`}
        />
        <Select
          value={weightUnit}
          onValueChange={(value: "kg" | "lbs" | "st") => onUnitChange(value)}
        >
          <SelectTrigger className="w-24">
            <SelectValue placeholder="Unit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="kg">kg</SelectItem>
            <SelectItem value="lbs">lbs</SelectItem>
            <SelectItem value="st">st</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};