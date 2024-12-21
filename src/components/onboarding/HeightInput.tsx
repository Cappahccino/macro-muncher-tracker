import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface HeightInputProps {
  height: number;
  onChange: (height: number) => void;
}

export const HeightInput = ({ height, onChange }: HeightInputProps) => {
  const [unit, setUnit] = useState<"cm" | "ft">('cm');
  const [feet, setFeet] = useState(0);
  const [inches, setInches] = useState(0);

  const handleUnitChange = (value: "cm" | "ft") => {
    setUnit(value);
    if (value === "ft") {
      // Convert cm to feet and inches
      const totalInches = height / 2.54;
      const ft = Math.floor(totalInches / 12);
      const inch = Math.round(totalInches % 12);
      setFeet(ft);
      setInches(inch);
    } else {
      // Convert feet/inches to cm
      const newHeight = Math.round((feet * 12 + inches) * 2.54);
      onChange(newHeight);
    }
  };

  const handleFeetChange = (newFeet: number) => {
    setFeet(newFeet);
    const newHeight = Math.round((newFeet * 12 + inches) * 2.54);
    onChange(newHeight);
  };

  const handleInchesChange = (newInches: number) => {
    setInches(newInches);
    const newHeight = Math.round((feet * 12 + newInches) * 2.54);
    onChange(newHeight);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium mb-1">Height</label>
      <div className="flex gap-2">
        {unit === "cm" ? (
          <Input
            type="number"
            value={height || ""}
            onChange={(e) => onChange(Number(e.target.value))}
            placeholder="Height in centimeters"
          />
        ) : (
          <div className="flex gap-2 flex-1">
            <div className="flex-1">
              <Input
                type="number"
                value={feet || ""}
                onChange={(e) => handleFeetChange(Number(e.target.value))}
                placeholder="Feet"
              />
            </div>
            <div className="flex-1">
              <Input
                type="number"
                value={inches || ""}
                onChange={(e) => handleInchesChange(Number(e.target.value))}
                placeholder="Inches"
                min="0"
                max="11"
              />
            </div>
          </div>
        )}
        <Select
          value={unit}
          onValueChange={(value: "cm" | "ft") => handleUnitChange(value)}
        >
          <SelectTrigger className="w-24">
            <SelectValue placeholder="Unit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cm">cm</SelectItem>
            <SelectItem value="ft">ft</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};