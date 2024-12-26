import { Dumbbell, Activity } from "lucide-react";

interface MetabolicInfoProps {
  bmr: number;
  tdee: number;
}

export const MetabolicInfo = ({ bmr, tdee }: MetabolicInfoProps) => {
  return (
    <div className="border-t pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="flex items-center space-x-3">
        <Dumbbell className="w-5 h-5 text-primary" />
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">
            Basal Metabolic Rate (BMR)
          </h3>
          <p className="text-lg font-semibold">
            {Math.round(bmr)} calories/day
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <Activity className="w-5 h-5 text-primary" />
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">
            Total Daily Energy Expenditure (TDEE)
          </h3>
          <p className="text-lg font-semibold">
            {Math.round(tdee)} calories/day
          </p>
        </div>
      </div>
    </div>
  );
};