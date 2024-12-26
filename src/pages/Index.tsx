import { useState, useEffect } from "react";
import { AddMealForm } from "@/components/AddMealForm";
import { DailySummary } from "@/components/DailySummary";
import { useToast } from "@/components/ui/use-toast";
import { Header } from "@/components/Header";
import { MacroCirclesGrid } from "@/components/MacroCirclesGrid";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface Meal {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [meals, setMeals] = useState<Meal[]>(() => {
    const savedMeals = localStorage.getItem('dailyMeals');
    return savedMeals ? JSON.parse(savedMeals) : [];
  });
  
  const [editingMeal, setEditingMeal] = useState<{ index: number; meal: Meal } | null>(null);
  const [targets, setTargets] = useState(() => {
    const savedTargets = localStorage.getItem('macroTargets');
    return savedTargets ? JSON.parse(savedTargets) : {
      calories: 2000,
      protein: 150,
      carbs: 250,
      fat: 70,
    };
  });

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to access the dashboard",
          variant: "destructive",
        });
        navigate("/sign-in");
      }
    };
    
    checkAuth();
  }, [navigate, toast]);

  // Save meals to activity_logs table
  const saveMealToDatabase = async (meal: Meal) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { error } = await supabase
        .from('activity_logs')
        .insert({
          user_id: session.user.id,
          date: new Date().toISOString().split('T')[0],
          calories: meal.calories,
          protein: meal.protein,
          carbs: meal.carbs,
          fat: meal.fat,
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving meal:', error);
      toast({
        title: "Error",
        description: "Failed to save meal to database",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    localStorage.setItem('dailyMeals', JSON.stringify(meals));
  }, [meals]);

  useEffect(() => {
    localStorage.setItem('macroTargets', JSON.stringify(targets));
  }, [targets]);

  const totals = meals.reduce(
    (acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + meal.protein,
      carbs: acc.carbs + meal.carbs,
      fat: acc.fat + meal.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const handleAddMeal = async (meal: Meal) => {
    if (editingMeal !== null) {
      const updatedMeals = [...meals];
      updatedMeals[editingMeal.index] = meal;
      setMeals(updatedMeals);
      setEditingMeal(null);
      await saveMealToDatabase(meal);
      toast({
        title: "Success",
        description: "Meal updated successfully",
      });
    } else {
      setMeals([...meals, meal]);
      await saveMealToDatabase(meal);
      toast({
        title: "Success",
        description: "Meal added successfully",
      });
    }
  };

  const handleDeleteMeal = (index: number) => {
    const updatedMeals = meals.filter((_, i) => i !== index);
    setMeals(updatedMeals);
    toast({
      title: "Success",
      description: "Meal deleted successfully",
    });
  };

  const handleEditMeal = (index: number, meal: Meal) => {
    setEditingMeal({ index, meal });
  };

  const handleTargetChange = (value: string, key: keyof typeof targets) => {
    const numValue = Number(value);
    if (isNaN(numValue) || numValue < 0) {
      toast({
        title: "Invalid input",
        description: "Please enter a valid positive number",
        variant: "destructive",
      });
      return;
    }
    
    const maxValues = {
      calories: 10000,
      protein: 1000,
      carbs: 1000,
      fat: 1000,
    };

    if (numValue > maxValues[key]) {
      toast({
        title: "Value too high",
        description: `Maximum value for ${String(key)} is ${maxValues[key]}`,
        variant: "destructive",
      });
      return;
    }

    setTargets((prev) => ({
      ...prev,
      [key]: numValue,
    }));
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container max-w-4xl mx-auto p-4 space-y-8"
    >
      <Header />

      <MacroCirclesGrid
        totals={totals}
        targets={targets}
        onTargetChange={handleTargetChange}
      />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid md:grid-cols-2 gap-8"
      >
        <AddMealForm onAddMeal={handleAddMeal} initialMeal={editingMeal?.meal} />
        <DailySummary 
          meals={meals} 
          onDeleteMeal={handleDeleteMeal}
          onEditMeal={handleEditMeal}
        />
      </motion.div>
    </motion.div>
  );
};

export default Index;