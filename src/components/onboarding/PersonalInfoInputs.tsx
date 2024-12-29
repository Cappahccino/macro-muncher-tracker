import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PersonalInfoInputsProps {
  name: string;
  gender: string;
  dob: string;
  onNameChange: (value: string) => void;
  onGenderChange: (value: string) => void;
  onDobChange: (value: string) => void;
}

export const PersonalInfoInputs = ({
  name,
  gender,
  dob,
  onNameChange,
  onGenderChange,
  onDobChange,
}: PersonalInfoInputsProps) => {
  return (
    <>
      <div>
        <label className="block text-sm font-medium mb-2 text-primary">Name</label>
        <Input
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Enter your name"
          className="border-primary/20 focus:border-primary transition-colors"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-primary">Gender</label>
        <Select
          value={gender}
          onValueChange={onGenderChange}
        >
          <SelectTrigger className="border-primary/20 focus:border-primary transition-colors">
            <SelectValue placeholder="Select gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-primary">Date of Birth</label>
        <Input
          type="date"
          value={dob}
          onChange={(e) => onDobChange(e.target.value)}
          className="border-primary/20 focus:border-primary transition-colors"
        />
      </div>
    </>
  );
};