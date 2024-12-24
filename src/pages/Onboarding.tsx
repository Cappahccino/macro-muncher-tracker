import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { OnboardingForm, UserData } from "@/components/onboarding/OnboardingForm";
import RegistrationForm from "@/components/onboarding/RegistrationForm";
import { calculateBMR, calculateTDEE } from "@/utils/nutritionCalculations";

const Onboarding = () => {
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
        <RegistrationForm />
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto p-4 space-y-6 relative">
      <h1 className="text-3xl font-bold">Welcome to Macro Muncher</h1>
      <OnboardingForm
        userData={userData}
        onUserDataChange={(newData) => setUserData({ ...userData, ...newData })}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default Onboarding;