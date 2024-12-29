import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { HeightInput } from "@/components/onboarding/HeightInput";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { PersonalInfoInputs } from "./PersonalInfoInputs";
import { WeightInputs } from "./WeightInputs";
import { ActivityLevelSelect } from "./ActivityLevelSelect";

interface UserData {
  name: string;
  currentWeight: number;
  targetWeight: number;
  weightUnit: "kg" | "lbs" | "st";
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

export const OnboardingForm = () => {
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
      description: "Let's set your weight loss goal!",
    });

    navigate("/weight-loss-goal");
  };

  return (
    <Card className="backdrop-blur-sm bg-card/50">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <PersonalInfoInputs
              name={userData.name}
              gender={userData.gender}
              dob={userData.dob}
              onNameChange={(value) => setUserData({ ...userData, name: value })}
              onGenderChange={(value) => setUserData({ ...userData, gender: value })}
              onDobChange={(value) => setUserData({ ...userData, dob: value })}
            />

            <WeightInputs
              currentWeight={userData.currentWeight}
              targetWeight={userData.targetWeight}
              weightUnit={userData.weightUnit}
              onCurrentWeightChange={(weight) => setUserData({ ...userData, currentWeight: weight })}
              onTargetWeightChange={(weight) => setUserData({ ...userData, targetWeight: weight })}
              onWeightUnitChange={(unit) => setUserData({ ...userData, weightUnit: unit })}
            />

            <HeightInput
              height={userData.height}
              onChange={(height) => setUserData({ ...userData, height })}
            />

            <ActivityLevelSelect
              activityLevel={userData.activityLevel}
              onActivityLevelChange={(value) => setUserData({ ...userData, activityLevel: value })}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity group"
            >
              Continue
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </form>
      </CardContent>
    </Card>
  );
};