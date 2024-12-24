import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { PersonalInfoForm } from "@/components/onboarding/PersonalInfoForm";
import { RegistrationForm } from "@/components/onboarding/RegistrationForm";

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

interface RegistrationData {
  email: string;
  password: string;
  confirmPassword: string;
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
  const [step, setStep] = useState(1);
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
  const [registrationData, setRegistrationData] = useState<RegistrationData>({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
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

    setStep(2);
  };

  const handleRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.auth.signUp({
      email: registrationData.email,
      password: registrationData.password,
    });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Check your email to confirm your account",
      });
      navigate("/dashboard");
    }
  };

  if (step === 2) {
    return (
      <div className="container max-w-lg mx-auto p-4">
        <RegistrationForm
          registrationData={registrationData}
          setRegistrationData={setRegistrationData}
          onSubmit={handleRegistrationSubmit}
          onBack={() => setStep(1)}
        />
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">Tell Us About Yourself</h1>
      
      <form onSubmit={handleProfileSubmit} className="space-y-6">
        <Card className="p-6">
          <PersonalInfoForm userData={userData} setUserData={setUserData} />
          <Button type="submit" className="w-full mt-6">
            Continue to Registration
          </Button>
        </Card>
      </form>
    </div>
  );
};

export default Onboarding;