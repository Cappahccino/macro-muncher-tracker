interface MacroNutrientProps {
  label: string;
  value: number;
  unit?: string;
}

export function MacroNutrient({ label, value, unit = "g" }: MacroNutrientProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold">{Math.round(value)}{unit}</p>
    </div>
  );
}