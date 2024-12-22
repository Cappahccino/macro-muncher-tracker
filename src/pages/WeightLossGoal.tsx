import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const WeightLossGoal = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedGoal, setSelectedGoal] = useState("moderate");
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const savedUserData = localStorage.getItem("userData");
    if (!savedUserData) {
      navigate("/onboarding");
      return;
    }
    setUserData(JSON.parse(savedUserData));
  }, [navigate]);

  const weightLossOptions = [
    { id: "slow", label: "Slow", value: 0.25, description: "0.25 kg per week - Very gradual and easy to maintain" },
    { id: "moderate", label: "Moderate", value: 0.5, description: "0.5 kg per week - Recommended for sustainable weight loss" },
    { id: "fast", label: "Fast", value: 0.75, description: "0.75 kg per week - Requires more discipline" },
    { id: "aggressive", label: "Aggressive", value: 1, description: "1 kg per week - Challenging and requires strict adherence" }
  ];

  const handleSubmit = () => {
    const selectedOption = weightLossOptions.find(option => option.id === selectedGoal);
    if (!selectedOption) return;

    // Calculate daily calorie deficit based on weight loss goal
    // 1 kg of fat = 7700 calories
    const weeklyCalorieDeficit = selectedOption.value * 7700;
    const dailyCalorieDeficit = Math.round(weeklyCalorieDeficit / 7);

    // Save weight loss goal to localStorage
    localStorage.setItem("weightLossGoal", JSON.stringify({
      weeklyGoal: selectedOption.value,
      dailyCalorieDeficit,
    }));

    toast({
      title: "Weight loss goal set",
      description: `Your goal is to lose ${selectedOption.value} kg per week`,
    });

    navigate("/dashboard");
  };

  if (!userData) return null;

  return (
    <div className="container max-w-2xl mx-auto p-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Set Your Weight Loss Goal</CardTitle>
          <CardDescription>
            Based on your profile and activity level, choose a sustainable weight loss goal
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <RadioGroup
            value={selectedGoal}
            onValueChange={setSelectedGoal}
            className="space-y-4"
          >
            {weightLossOptions.map((option) => (
              <div
                key={option.id}
                className={`flex items-center space-x-3 rounded-lg border p-4 ${
                  option.id === "moderate" ? "border-primary" : ""
                }`}
              >
                <RadioGroupItem value={option.id} id={option.id} />
                <Label
                  htmlFor={option.id}
                  className="flex flex-col cursor-pointer w-full"
                >
                  <span className="font-semibold">{option.label}</span>
                  <span className="text-sm text-muted-foreground">
                    {option.description}
                  </span>
                </Label>
              </div>
            ))}
          </RadioGroup>

          <Button onClick={handleSubmit} className="w-full">
            Continue
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default WeightLossGoal;