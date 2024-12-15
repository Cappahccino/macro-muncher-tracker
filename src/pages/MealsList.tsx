import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MealTemplateForm } from "@/components/MealTemplateForm";
import { MealTemplateList } from "@/components/MealTemplateList";

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

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newTemplate, setNewTemplate] = useState<MealTemplate>({
    name: "",
    components: [],
    totalMacros: { calories: 0, protein: 0, carbs: 0, fat: 0 }
  });

  useEffect(() => {
    localStorage.setItem('mealTemplates', JSON.stringify(mealTemplates));
  }, [mealTemplates]);

  const handleSaveTemplate = (template: MealTemplate) => {
    if (editingIndex !== null) {
      const updatedTemplates = [...mealTemplates];
      updatedTemplates[editingIndex] = template;
      setMealTemplates(updatedTemplates);
      setEditingIndex(null);
      toast({
        title: "Success",
        description: "Meal template updated successfully",
      });
    } else {
      setMealTemplates([...mealTemplates, template]);
      toast({
        title: "Success",
        description: "Meal template added successfully",
      });
    }
    setNewTemplate({
      name: "",
      components: [],
      totalMacros: { calories: 0, protein: 0, carbs: 0, fat: 0 }
    });
  };

  const handleDeleteTemplate = (index: number) => {
    const updatedTemplates = mealTemplates.filter((_, i) => i !== index);
    setMealTemplates(updatedTemplates);
    toast({
      title: "Success",
      description: "Meal template deleted successfully",
    });
  };

  const handleEditTemplate = (index: number) => {
    setEditingIndex(index);
    setNewTemplate(mealTemplates[index]);
  };

  return (
    <div className="container max-w-4xl mx-auto p-4 space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Meal Templates</h1>
      </div>

      <MealTemplateForm
        editingIndex={editingIndex}
        template={newTemplate}
        onSave={handleSaveTemplate}
        onCancel={() => {
          setEditingIndex(null);
          setNewTemplate({
            name: "",
            components: [],
            totalMacros: { calories: 0, protein: 0, carbs: 0, fat: 0 }
          });
        }}
      />

      <MealTemplateList
        templates={mealTemplates}
        onEdit={handleEditTemplate}
        onDelete={handleDeleteTemplate}
      />
    </div>
  );
};

export default MealsList;