import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ActivityLevelSelectProps {
  activityLevel: string;
  onActivityLevelChange: (value: string) => void;
}

export const ActivityLevelSelect = ({
  activityLevel,
  onActivityLevelChange,
}: ActivityLevelSelectProps) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-2 text-primary">Activity Level</label>
      <Select
        value={activityLevel}
        onValueChange={onActivityLevelChange}
      >
        <SelectTrigger className="border-primary/20 focus:border-primary transition-colors">
          <SelectValue placeholder="Select activity level" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="sedentary">Sedentary</SelectItem>
          <SelectItem value="lightly active">Lightly Active</SelectItem>
          <SelectItem value="moderately active">Moderately Active</SelectItem>
          <SelectItem value="very active">Very Active</SelectItem>
          <SelectItem value="extremely active">Extremely Active</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};