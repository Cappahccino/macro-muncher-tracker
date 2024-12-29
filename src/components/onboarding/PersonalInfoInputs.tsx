import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { calculateAge } from "@/utils/ageCalculation";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

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
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleDobChange = (value: string) => {
    const age = calculateAge(value);
    if (age < 18) {
      toast({
        title: "Age Restriction",
        description: "You must be at least 18 years old to use this app.",
        variant: "destructive",
      });
      navigate("/onboarding");
      return;
    }
    onDobChange(value);
  };

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
          onChange={(e) => handleDobChange(e.target.value)}
          className="border-primary/20 focus:border-primary transition-colors"
        />
      </div>
    </>
  );
};