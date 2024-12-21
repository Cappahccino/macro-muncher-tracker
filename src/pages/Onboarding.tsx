import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/Header";

type WeightUnit = "kg" | "lbs" | "st";

interface UserData {
  name: string;
  currentWeight: number;
  targetWeight: number;
  weightUnit: WeightUnit;
  gender: string;
  dob: string;
  height: number;
  activityLevel: string;
}

const calculateBMR = (userData: UserData) => {
  const age = new Date().getFullYear() - new Date(userData.dob).getFullYear();
  const weight = userData.weightUnit === "kg" 
    ? userData.currentWeight 
    : userData.weightUnit === "lbs" 
    ? userData.currentWeight * 0.453592
    : userData.currentWeight * 6.35029;

  if (userData.gender === "male") {
    return 88.362 + (13.397 * weight) + (4.799 * userData.height) - (5.677 * age);
  } else {
    return 447.593 + (9.247 * weight) + (3.098 * userData.height) - (4.330 * age);
  }
};

const calculateTDEE = (bmr: number, activityLevel: string) => {
  const multipliers = {
    sedentary: 1.2,
    "lightly active": 1.375,
    "moderately active": 1.55,
    "very active": 1.725,
    "extremely active": 1.9,
  };
  return Math.round(bmr * multipliers[activityLevel as keyof typeof multipliers]);
};

const Onboarding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userData, setUserData] = useState<UserData>({
    name: "",
    currentWeight: 0,
    targetWeight: 0,
    weightUnit: "kg",
    gender: "",
    dob: "",
    height: 0,
    activityLevel: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!Object.values(userData).every(value => value)) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const bmr = calculateBMR(userData);
    const tdee = calculateTDEE(bmr, userData.activityLevel);

    localStorage.setItem("userData", JSON.stringify({
      ...userData,
      bmr,
      tdee,
    }));

    toast({
      title: "Profile Created",
      description: "Welcome to Macro Muncher!",
    });

    navigate("/dashboard");
  };

  return (
    <div className="container max-w-2xl mx-auto p-4 space-y-6">
      <Header />
      <h1 className="text-3xl font-bold">Welcome to Macro Muncher</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
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
            <div>
              <label className="block text-sm font-medium mb-1">Current Weight</label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={userData.currentWeight || ""}
                  onChange={(e) => setUserData({ ...userData, currentWeight: Number(e.target.value) })}
                  placeholder={`Weight in ${userData.weightUnit}`}
                />
                <Select
                  value={userData.weightUnit}
                  onValueChange={(value: WeightUnit) => setUserData({ ...userData, weightUnit: value })}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">kg</SelectItem>
                    <SelectItem value="lbs">lbs</SelectItem>
                    <SelectItem value="st">st</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Target Weight</label>
              <Input
                type="number"
                value={userData.targetWeight || ""}
                onChange={(e) => setUserData({ ...userData, targetWeight: Number(e.target.value) })}
                placeholder={`Weight in ${userData.weightUnit}`}
              />
            </div>
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

          <div>
            <label className="block text-sm font-medium mb-1">Height (cm)</label>
            <Input
              type="number"
              value={userData.height || ""}
              onChange={(e) => setUserData({ ...userData, height: Number(e.target.value) })}
              placeholder="Height in centimeters"
            />
          </div>

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

        <Button type="submit" className="w-full">
          Complete Profile
        </Button>
      </form>
    </div>
  );
};

export default Onboarding;