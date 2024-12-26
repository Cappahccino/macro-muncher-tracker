import { User, Weight, Ruler, Calendar, Activity, Dumbbell, Target } from "lucide-react";

interface ProfileMetricsProps {
  userData: {
    name: string;
    currentWeight: number;
    targetWeight: number;
    weightUnit: string;
    height: number;
    dob: string;
    activityLevel: string;
    bmr: number;
    tdee: number;
  };
}

export const ProfileMetrics = ({ userData }: ProfileMetricsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <User className="w-5 h-5 text-primary" />
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
            <p className="text-lg font-semibold">{userData.name}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Weight className="w-5 h-5 text-primary" />
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Current Weight</h3>
            <p className="text-lg font-semibold">
              {userData.currentWeight} {userData.weightUnit}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Target className="w-5 h-5 text-primary" />
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Target Weight</h3>
            <p className="text-lg font-semibold">
              {userData.targetWeight} {userData.weightUnit}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Ruler className="w-5 h-5 text-primary" />
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Height</h3>
            <p className="text-lg font-semibold">{userData.height} cm</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <Calendar className="w-5 h-5 text-primary" />
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Date of Birth</h3>
            <p className="text-lg font-semibold">
              {new Date(userData.dob).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Activity className="w-5 h-5 text-primary" />
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Activity Level</h3>
            <p className="text-lg font-semibold capitalize">
              {userData.activityLevel.replace("-", " ")}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Dumbbell className="w-5 h-5 text-primary" />
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Basal Metabolic Rate (BMR)
            </h3>
            <p className="text-lg font-semibold">
              {Math.round(userData.bmr)} calories/day
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
              {Math.round(userData.tdee)} calories/day
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};