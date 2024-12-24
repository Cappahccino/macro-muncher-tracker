import { WeightInput } from "@/components/onboarding/WeightInput";
import { HeightInput } from "@/components/onboarding/HeightInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface UserData {
  name: string;
  currentWeight: number;
  targetWeight: number;
  weightUnit: "kg" | "lbs" | "st";
  gender: string;
  dob: string;
  height: number;
  activityLevel: string;
}

interface OnboardingFormProps {
  userData: UserData;
  onUserDataChange: (data: Partial<UserData>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const OnboardingForm = ({ userData, onUserDataChange, onSubmit }: OnboardingFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <Input
            value={userData.name}
            onChange={(e) => onUserDataChange({ name: e.target.value })}
            placeholder="Enter your name"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <WeightInput
            label="Current Weight"
            weight={userData.currentWeight}
            weightUnit={userData.weightUnit}
            onWeightChange={(weight) => onUserDataChange({ currentWeight: weight })}
            onUnitChange={(unit) => onUserDataChange({ weightUnit: unit })}
          />

          <WeightInput
            label="Target Weight"
            weight={userData.targetWeight}
            weightUnit={userData.weightUnit}
            onWeightChange={(weight) => onUserDataChange({ targetWeight: weight })}
            onUnitChange={(unit) => onUserDataChange({ weightUnit: unit })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Gender</label>
          <Select
            value={userData.gender}
            onValueChange={(value) => onUserDataChange({ gender: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Date of Birth</label>
          <Input
            type="date"
            value={userData.dob}
            onChange={(e) => onUserDataChange({ dob: e.target.value })}
          />
        </div>

        <HeightInput
          height={userData.height}
          onChange={(height) => onUserDataChange({ height })}
        />

        <div>
          <label className="block text-sm font-medium mb-1">Activity Level</label>
          <Select
            value={userData.activityLevel}
            onValueChange={(value) => onUserDataChange({ activityLevel: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select activity level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sedentary">Sedentary (BMR × 1.2)</SelectItem>
              <SelectItem value="lightly active">Lightly Active (BMR × 1.375)</SelectItem>
              <SelectItem value="moderately active">Moderately Active (BMR × 1.55)</SelectItem>
              <SelectItem value="very active">Very Active (BMR × 1.725)</SelectItem>
              <SelectItem value="extremely active">Extremely Active (BMR × 1.9)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button type="submit" className="w-full">
        Continue to Registration
      </Button>
    </form>
  );
};