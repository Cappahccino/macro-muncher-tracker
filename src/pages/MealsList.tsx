import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
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

const Recipes = () => {
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
        description: "Recipe updated successfully",
      });
    } else {
      setMealTemplates([...mealTemplates, template]);
      toast({
        title: "Success",
        description: "Recipe added successfully",
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
      description: "Recipe deleted successfully",
    });
  };

  const handleEditTemplate = (index: number) => {
    setEditingIndex(index);
    setNewTemplate(mealTemplates[index]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background">
      <Header />
      <div className="container max-w-4xl mx-auto px-4 py-8 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text">
            Your Recipe Collection
          </h1>
          
          <div className="bg-card/50 backdrop-blur-sm border rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-center">
              {editingIndex !== null ? "Edit Recipe" : "Create New Recipe"}
            </h2>
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
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          {mealTemplates.length > 0 ? (
            <MealTemplateList
              templates={mealTemplates}
              onEdit={handleEditTemplate}
              onDelete={handleDeleteTemplate}
            />
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="text-center py-12 bg-card/50 backdrop-blur-sm rounded-xl border"
            >
              <p className="text-lg text-muted-foreground">
                No recipes yet. Start creating your collection!
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Recipes;