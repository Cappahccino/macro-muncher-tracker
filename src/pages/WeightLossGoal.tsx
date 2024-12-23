import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AuthButton } from "@/components/AuthButton";

const WeightLossGoal = () => {
  const navigate = useNavigate();
  const [goal, setGoal] = useState<number | "">("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (goal === "") {
      alert("Please enter a weight loss goal.");
      return;
    }

    const weightLossGoal = {
      dailyCalorieDeficit: goal,
      description,
    };

    localStorage.setItem("weightLossGoal", JSON.stringify(weightLossGoal));
    navigate("/diet-type");
  };

  return (
    <div className="container max-w-2xl mx-auto p-4 relative">
      <AuthButton />
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Set Your Weight Loss Goal</CardTitle>
          <CardDescription>
            Enter your daily calorie deficit goal to help you achieve your weight loss target.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="number"
              value={goal}
              onChange={(e) => setGoal(Number(e.target.value))}
              placeholder="Daily Calorie Deficit"
            />
            <Input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description (optional)"
            />
            <Button type="submit" className="w-full">
              Continue
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default WeightLossGoal;
