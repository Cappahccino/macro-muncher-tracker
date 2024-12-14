import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface FoodComponent {
  name: string;
  amount: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface MealTemplate {
  name: string;
  components: FoodComponent[];
  totalMacros: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

const MealsList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mealTemplates, setMealTemplates] = useState<MealTemplate[]>(() => {
    const saved = localStorage.getItem('mealTemplates');
    return saved ? JSON.parse(saved) : [];
  });

  const [newTemplate, setNewTemplate] = useState<MealTemplate>({
    name: "",
    components: [],
    totalMacros: { calories: 0, protein: 0, carbs: 0, fat: 0 }
  });

  const handleAddTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTemplate.name) {
      toast({
        title: "Error",
        description: "Please enter a meal template name",
        variant: "destructive",
      });
      return;
    }
    
    const updatedTemplates = [...mealTemplates, newTemplate];
    setMealTemplates(updatedTemplates);
    localStorage.setItem('mealTemplates', JSON.stringify(updatedTemplates));
    
    setNewTemplate({
      name: "",
      components: [],
      totalMacros: { calories: 0, protein: 0, carbs: 0, fat: 0 }
    });
    
    toast({
      title: "Success",
      description: "Meal template added successfully",
    });
  };

  return (
    <div className="container max-w-4xl mx-auto p-4 space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Meal Templates</h1>
      </div>

      <Card className="p-4">
        <form onSubmit={handleAddTemplate} className="space-y-4">
          <Input
            placeholder="Template name"
            value={newTemplate.name}
            onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
          />
          <Button type="submit" className="w-full">
            Add Template
          </Button>
        </form>
      </Card>

      <div className="space-y-4">
        {mealTemplates.map((template, index) => (
          <Card key={index} className="p-4">
            <h3 className="font-bold text-lg mb-2">{template.name}</h3>
            {template.components.length > 0 ? (
              <div className="space-y-2">
                <h4 className="font-medium">Components:</h4>
                {template.components.map((component, idx) => (
                  <div key={idx} className="pl-4">
                    <p>{component.name} - {component.amount}{component.unit}</p>
                  </div>
                ))}
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Calories</p>
                    <p className="font-medium">{template.totalMacros.calories}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Protein</p>
                    <p className="font-medium">{template.totalMacros.protein}g</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Carbs</p>
                    <p className="font-medium">{template.totalMacros.carbs}g</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Fat</p>
                    <p className="font-medium">{template.totalMacros.fat}g</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">No components added yet</p>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MealsList;