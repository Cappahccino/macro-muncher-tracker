import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, LogIn, Edit2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UserData {
  name: string;
  currentWeight: number;
  targetWeight: number;
  weightUnit: string;
  gender: string;
  dob: string;
  height: number;
  activityLevel: string;
}

interface WeightLossGoal {
  weeklyGoal: number;
  dailyCalorieDeficit: number;
}

const WeightLossSummary = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [weightLossGoal, setWeightLossGoal] = useState<WeightLossGoal | null>(null);
  const [dietType, setDietType] = useState<string>("");
  const [monthsToGoal, setMonthsToGoal] = useState<number>(0);

  useEffect(() => {
    const savedUserData = localStorage.getItem("userData");
    const savedWeightLossGoal = localStorage.getItem("weightLossGoal");
    const savedDietType = localStorage.getItem("selectedDiet");

    if (!savedUserData || !savedWeightLossGoal) {
      navigate("/onboarding");
      return;
    }

    const parsedUserData = JSON.parse(savedUserData);
    const parsedWeightLossGoal = JSON.parse(savedWeightLossGoal);
    const parsedDietType = savedDietType ? JSON.parse(savedDietType) : "";

    setUserData(parsedUserData);
    setWeightLossGoal(parsedWeightLossGoal);
    setDietType(parsedDietType);

    // Calculate months to reach goal
    const weightToLose = Math.abs(parsedUserData.currentWeight - parsedUserData.targetWeight);
    const weeklyLoss = parsedWeightLossGoal.weeklyGoal;
    const weeksToGoal = weightToLose / weeklyLoss;
    setMonthsToGoal(Math.ceil(weeksToGoal / 4));
  }, [navigate]);

  const handleEdit = (section: string) => {
    switch (section) {
      case "profile":
        navigate("/onboarding");
        break;
      case "goal":
        navigate("/weight-loss-goal");
        break;
      case "diet":
        navigate("/diet-type");
        break;
    }
  };

  const handleConfirm = () => {
    toast({
      title: "Journey Plan Confirmed",
      description: "Let's get started with your weight loss journey!",
    });
    navigate("/sign-up");
  };

  if (!userData || !weightLossGoal) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted py-8 px-4">
      <div className="container max-w-2xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <motion.h1 
            className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Your Weight Loss Journey
          </motion.h1>
          <Button variant="outline" onClick={() => navigate("/sign-in")}>
            <LogIn className="mr-2 h-4 w-4" />
            Sign In
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="backdrop-blur-sm bg-card/50">
            <CardHeader>
              <CardTitle>Journey Summary</CardTitle>
              <CardDescription>
                Review your plan and confirm to begin your transformation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-start p-4 rounded-lg border bg-background/50">
                  <div>
                    <h3 className="font-semibold">Profile Details</h3>
                    <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                      <li>Name: {userData.name}</li>
                      <li>Current Weight: {userData.currentWeight}{userData.weightUnit}</li>
                      <li>Height: {userData.height}cm</li>
                      <li>Activity Level: {userData.activityLevel.replace('-', ' ')}</li>
                    </ul>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleEdit("profile")}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex justify-between items-start p-4 rounded-lg border bg-background/50">
                  <div>
                    <h3 className="font-semibold">Weight Loss Goal</h3>
                    <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                      <li>Target Weight: {userData.targetWeight}{userData.weightUnit}</li>
                      <li>Weekly Goal: {weightLossGoal.weeklyGoal}kg per week</li>
                      <li>Daily Calorie Deficit: {weightLossGoal.dailyCalorieDeficit} calories</li>
                    </ul>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleEdit("goal")}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex justify-between items-start p-4 rounded-lg border bg-background/50">
                  <div>
                    <h3 className="font-semibold">Diet Type</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {dietType.charAt(0).toUpperCase() + dietType.slice(1).replace(/([A-Z])/g, ' $1')}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleEdit("diet")}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <h3 className="font-semibold text-primary">Estimated Timeline</h3>
                  <p className="mt-2 text-sm">
                    At your chosen pace, you could reach your target weight in approximately{' '}
                    <span className="font-semibold text-primary">{monthsToGoal} months</span>
                  </p>
                </div>
              </div>

              <Button 
                onClick={handleConfirm} 
                className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity group"
              >
                Confirm & Continue
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default WeightLossSummary;