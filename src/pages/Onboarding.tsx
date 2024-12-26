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
import { LogIn, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

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
      description: "Let's set your weight loss goal!",
    });

    navigate("/weight-loss-goal");
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted py-8 px-4">
      <motion.div
        className="container max-w-2xl mx-auto space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex justify-between items-center">
          <motion.h1 
            className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"
            variants={itemVariants}
          >
            Welcome to Macro Muncher
          </motion.h1>
          <motion.div variants={itemVariants}>
            <Button variant="outline" onClick={() => navigate("/sign-in")}>
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Button>
          </motion.div>
        </div>
        
        <Card className="backdrop-blur-sm bg-card/50">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div className="space-y-6" variants={itemVariants}>
                <div>
                  <label className="block text-sm font-medium mb-2 text-primary">Name</label>
                  <Input
                    value={userData.name}
                    onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                    placeholder="Enter your name"
                    className="border-primary/20 focus:border-primary transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <label className="block text-sm font-medium mb-2 text-primary">Gender</label>
                  <Select
                    value={userData.gender}
                    onValueChange={(value) => setUserData({ ...userData, gender: value })}
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
                    value={userData.dob}
                    onChange={(e) => setUserData({ ...userData, dob: e.target.value })}
                    className="border-primary/20 focus:border-primary transition-colors"
                  />
                </div>

                <HeightInput
                  height={userData.height}
                  onChange={(height) => setUserData({ ...userData, height })}
                />

                <div>
                  <label className="block text-sm font-medium mb-2 text-primary">Activity Level</label>
                  <Select
                    value={userData.activityLevel}
                    onValueChange={(value) => setUserData({ ...userData, activityLevel: value })}
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
              </motion.div>

              <motion.div variants={itemVariants}>
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
      </motion.div>
    </div>
  );
};

export default Onboarding;