import { WeightInput } from "./WeightInput";

interface WeightInputsProps {
  currentWeight: number;
  targetWeight: number;
  weightUnit: "kg" | "lbs" | "st";
  onCurrentWeightChange: (weight: number) => void;
  onTargetWeightChange: (weight: number) => void;
  onWeightUnitChange: (unit: "kg" | "lbs" | "st") => void;
}

export const WeightInputs = ({
  currentWeight,
  targetWeight,
  weightUnit,
  onCurrentWeightChange,
  onTargetWeightChange,
  onWeightUnitChange,
}: WeightInputsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <WeightInput
        label="Current Weight"
        weight={currentWeight}
        weightUnit={weightUnit}
        onWeightChange={onCurrentWeightChange}
        onUnitChange={onWeightUnitChange}
      />

      <WeightInput
        label="Target Weight"
        weight={targetWeight}
        weightUnit={weightUnit}
        onWeightChange={onTargetWeightChange}
        onUnitChange={onWeightUnitChange}
      />
    </div>
  );
};