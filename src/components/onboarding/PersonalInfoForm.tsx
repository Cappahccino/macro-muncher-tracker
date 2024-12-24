import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HeightInput } from "./HeightInput";
import { WeightInput } from "./WeightInput";

interface PersonalInfoFormProps {
  userData: {
    name: string;
    currentWeight: number;
    targetWeight: number;
    weightUnit: "kg" | "lbs" | "st";
    gender: string;
    dob: string;
    height: number;
    activityLevel: string;
  };
  setUserData: (data: any) => void;
}

export const PersonalInfoForm = ({ userData, setUserData }: PersonalInfoFormProps) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <Input
          value={userData.name}
          onChange={(e) => setUserData({ ...userData, name: e.target.value })}
          placeholder="Enter your name"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <WeightInput
          label="Current Weight"
          weight={userData.currentWeight}
          weightUnit={userData.weightUnit}
          onWeightChange={(weight) => setUserData({ ...userData, currentWeight: weight })}
          onUnitChange={(unit) => setUserData({ ...userData, weightUnit: unit })}
        />

        <WeightInput
          label="Target Weight"
          weight={userData.targetWeight}
          weightUnit={userData.weightUnit}
          onWeightChange={(weight) => setUserData({ ...userData, targetWeight: weight })}
          onUnitChange={(unit) => setUserData({ ...userData, weightUnit: unit })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Gender</label>
        <Select
          value={userData.gender}
          onValueChange={(value) => setUserData({ ...userData, gender: value })}
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
          onChange={(e) => setUserData({ ...userData, dob: e.target.value })}
        />
      </div>

      <HeightInput
        height={userData.height}
        onChange={(height) => setUserData({ ...userData, height })}
      />

      <div>
        <label className="block text-sm font-medium mb-1">Activity Level</label>
        <Select
          value={userData.activityLevel}
          onValueChange={(value) => setUserData({ ...userData, activityLevel: value })}
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
  );
};