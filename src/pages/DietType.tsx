import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { LogIn } from "lucide-react";

const DietType = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedDiet, setSelectedDiet] = useState("weightLoss");

  const dietTypes = [
    {
      id: "weightLoss",
      label: "Weight Loss",
      description: "Higher protein to preserve muscle, moderate carbs and fats"
    },
    {
      id: "muscleBuilding",
      label: "Muscle Building",
      description: "Higher protein and carbs for muscle repair, moderate fats"
    },
    {
      id: "lowCarb",
      label: "Low-Carb",
      description: "Reduced carbs, higher fats for energy needs"
    }
  ];

  const handleSubmit = () => {
    const selectedDietType = dietTypes.find(diet => diet.id === selectedDiet);
    if (!selectedDietType) return;

    // Save selected diet type to localStorage
    localStorage.setItem("selectedDiet", JSON.stringify(selectedDiet));

    toast({
      title: "Diet type set",
      description: `Your diet type has been set to ${selectedDietType.label}`,
    });

    navigate("/weight-loss-summary");
  };

  return (
    <div className="container max-w-2xl mx-auto p-4">
      <div className="flex justify-end mb-4">
        <Button variant="outline" onClick={() => navigate("/sign-in")}>
          <LogIn className="mr-2 h-4 w-4" />
          Sign In
        </Button>
      </div>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Choose Your Diet Type</CardTitle>
          <CardDescription>
            Select a diet type that aligns with your goals
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <RadioGroup
            value={selectedDiet}
            onValueChange={setSelectedDiet}
            className="space-y-4"
          >
            {dietTypes.map((diet) => (
              <div
                key={diet.id}
                className={`flex items-center space-x-3 rounded-lg border p-4 ${
                  diet.id === "weightLoss" ? "border-primary" : ""
                }`}
              >
                <RadioGroupItem value={diet.id} id={diet.id} />
                <Label
                  htmlFor={diet.id}
                  className="flex flex-col cursor-pointer w-full"
                >
                  <span className="font-semibold text-base md:text-lg">{diet.label}</span>
                  <span className="text-xs md:text-sm text-muted-foreground">
                    {diet.description}
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

export default DietType;