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
import { WeightInput } from "@/components/onboarding/WeightInput";
import { HeightInput } from "@/components/onboarding/HeightInput";
import { AuthButton } from "@/components/AuthButton";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";

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
  const [showRegistration, setShowRegistration] = useState(false);
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

    setShowRegistration(true);
  };

  if (showRegistration) {
    return (
      <div className="container max-w-lg mx-auto p-4">
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Create Your Account</h2>
          <Auth
            supabaseClient={supabase}
            appearance={{ 
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#0f172a',
                    brandAccent: '#334155'
                  }
                }
              }
            }}
            providers={[]}
            redirectTo={`${window.location.origin}/dashboard`}
            view="sign_up"
          />
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => setShowRegistration(false)}
          >
            Back to Profile
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto p-4 space-y-6 relative">
      <AuthButton />
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

        <Button type="submit" className="w-full">
          Continue to Registration
        </Button>
      </form>
    </div>
  );
};

export default Onboarding;
