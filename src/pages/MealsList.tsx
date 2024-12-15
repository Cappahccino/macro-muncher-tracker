import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Trash2, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FoodSelect } from "@/components/FoodSelect";

interface FoodComponent {
  name: string;
  amount: number;
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

  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const calculateTotalMacros = (components: FoodComponent[]) => {
    return components.reduce((acc, component) => ({
      calories: acc.calories + component.calories,
      protein: acc.protein + component.protein,
      carbs: acc.carbs + component.carbs,
      fat: acc.fat + component.fat,
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
  };

  const handleAddComponent = (component: FoodComponent) => {
    const updatedComponents = [...(editingIndex !== null ? mealTemplates[editingIndex].components : newTemplate.components), component];
    const totalMacros = calculateTotalMacros(updatedComponents);
    
    if (editingIndex !== null) {
      const updatedTemplates = [...mealTemplates];
      updatedTemplates[editingIndex] = {
        ...updatedTemplates[editingIndex],
        components: updatedComponents,
        totalMacros
      };
      setMealTemplates(updatedTemplates);
      localStorage.setItem('mealTemplates', JSON.stringify(updatedTemplates));
    } else {
      setNewTemplate({
        ...newTemplate,
        components: updatedComponents,
        totalMacros
      });
    }
  };

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

  const handleDeleteTemplate = (index: number) => {
    const updatedTemplates = mealTemplates.filter((_, i) => i !== index);
    setMealTemplates(updatedTemplates);
    localStorage.setItem('mealTemplates', JSON.stringify(updatedTemplates));
    toast({
      title: "Success",
      description: "Meal template deleted successfully",
    });
  };

  const handleEditTemplate = (index: number) => {
    setEditingIndex(index);
    setNewTemplate(mealTemplates[index]);
  };

  const handleSaveEdit = () => {
    if (editingIndex === null) return;
    
    const updatedTemplates = [...mealTemplates];
    updatedTemplates[editingIndex] = newTemplate;
    setMealTemplates(updatedTemplates);
    localStorage.setItem('mealTemplates', JSON.stringify(updatedTemplates));
    
    setEditingIndex(null);
    setNewTemplate({
      name: "",
      components: [],
      totalMacros: { calories: 0, protein: 0, carbs: 0, fat: 0 }
    });
    
    toast({
      title: "Success",
      description: "Meal template updated successfully",
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
        <form onSubmit={editingIndex !== null ? handleSaveEdit : handleAddTemplate} className="space-y-4">
          <Input
            placeholder="Template name"
            value={newTemplate.name}
            onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
          />
          <FoodSelect onAddComponent={handleAddComponent} />
          
          {(editingIndex !== null ? mealTemplates[editingIndex].components : newTemplate.components).length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="font-medium">Components:</h4>
              {(editingIndex !== null ? mealTemplates[editingIndex].components : newTemplate.components).map((component, idx) => (
                <div key={idx} className="pl-4">
                  <p>{component.name} - {component.amount}g</p>
                  <p className="text-sm text-muted-foreground">
                    Calories: {component.calories.toFixed(1)} | 
                    Protein: {component.protein.toFixed(1)}g | 
                    Carbs: {component.carbs.toFixed(1)}g | 
                    Fat: {component.fat.toFixed(1)}g
                  </p>
                </div>
              ))}
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Calories</p>
                  <p className="font-medium">{(editingIndex !== null ? mealTemplates[editingIndex].totalMacros.calories : newTemplate.totalMacros.calories).toFixed(1)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Protein</p>
                  <p className="font-medium">{(editingIndex !== null ? mealTemplates[editingIndex].totalMacros.protein : newTemplate.totalMacros.protein).toFixed(1)}g</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Carbs</p>
                  <p className="font-medium">{(editingIndex !== null ? mealTemplates[editingIndex].totalMacros.carbs : newTemplate.totalMacros.carbs).toFixed(1)}g</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Fat</p>
                  <p className="font-medium">{(editingIndex !== null ? mealTemplates[editingIndex].totalMacros.fat : newTemplate.totalMacros.fat).toFixed(1)}g</p>
                </div>
              </div>
            </div>
          )}
          
          <Button type="submit" className="w-full">
            {editingIndex !== null ? "Save Changes" : "Add Template"}
          </Button>
          {editingIndex !== null && (
            <Button type="button" variant="outline" className="w-full" onClick={() => {
              setEditingIndex(null);
              setNewTemplate({
                name: "",
                components: [],
                totalMacros: { calories: 0, protein: 0, carbs: 0, fat: 0 }
              });
            }}>
              Cancel Edit
            </Button>
          )}
        </form>
      </Card>

      <div className="space-y-4">
        {mealTemplates.map((template, index) => (
          <Card key={index} className="p-4">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-lg">{template.name}</h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleEditTemplate(index)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDeleteTemplate(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {template.components.length > 0 ? (
              <div className="space-y-2">
                <h4 className="font-medium">Components:</h4>
                {template.components.map((component, idx) => (
                  <div key={idx} className="pl-4">
                    <p>{component.name} - {component.amount}g</p>
                    <p className="text-sm text-muted-foreground">
                      Calories: {component.calories.toFixed(1)} | 
                      Protein: {component.protein.toFixed(1)}g | 
                      Carbs: {component.carbs.toFixed(1)}g | 
                      Fat: {component.fat.toFixed(1)}g
                    </p>
                  </div>
                ))}
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Calories</p>
                    <p className="font-medium">{template.totalMacros.calories.toFixed(1)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Protein</p>
                    <p className="font-medium">{template.totalMacros.protein.toFixed(1)}g</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Carbs</p>
                    <p className="font-medium">{template.totalMacros.carbs.toFixed(1)}g</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Fat</p>
                    <p className="font-medium">{template.totalMacros.fat.toFixed(1)}g</p>
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