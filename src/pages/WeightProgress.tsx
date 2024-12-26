import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { WeightEntryCard } from "@/components/weight/WeightEntryCard";
import { WeightProgressChart } from "@/components/weight/WeightProgressChart";
import { WeightEntriesTable } from "@/components/weight/WeightEntriesTable";
import { WeightGauge } from "@/components/weight/WeightGauge";
import { WeightEntry } from "@/components/weight/types";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Scale } from "lucide-react";
import { motion } from "framer-motion";

const WeightProgress = () => {
  const [entries, setEntries] = useState<WeightEntry[]>(() => {
    const savedEntries = localStorage.getItem('weightEntries');
    return savedEntries ? JSON.parse(savedEntries) : [];
  });
  
  const [weightGoals, setWeightGoals] = useState({
    currentWeight: 0,
    targetWeight: 0,
    initialWeight: 0,
  });

  const { toast } = useToast();

  useEffect(() => {
    const savedGoals = localStorage.getItem('weightGoals');
    const savedUserData = localStorage.getItem('userData');
    if (savedGoals && savedUserData) {
      const goals = JSON.parse(savedGoals);
      const userData = JSON.parse(savedUserData);
      setWeightGoals({
        currentWeight: entries.length > 0 ? entries[0].morningWeight : userData.currentWeight,
        targetWeight: goals.targetWeight || userData.targetWeight,
        initialWeight: userData.currentWeight,
      });
    }
  }, [entries]);

  const getDailyMacros = () => {
    const dailyMeals = JSON.parse(localStorage.getItem('dailyMeals') || '[]');
    return dailyMeals.reduce(
      (acc: any, meal: any) => ({
        calories: acc.calories + meal.calories,
        protein: acc.protein + meal.protein,
        carbs: acc.carbs + meal.carbs,
        fat: acc.fat + meal.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  };

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'dailyMeals') {
        const updatedMacros = getDailyMacros();
        setEntries(currentEntries => {
          if (currentEntries.length === 0) return currentEntries;
          
          const [latestEntry, ...oldEntries] = currentEntries;
          return [{
            ...latestEntry,
            calories: updatedMacros.calories,
            protein: updatedMacros.protein,
            carbs: updatedMacros.carbs,
            fat: updatedMacros.fat,
          }, ...oldEntries];
        });
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    localStorage.setItem('weightEntries', JSON.stringify(entries));
  }, [entries]);

  const handleAddEntry = (newEntry: WeightEntry) => {
    const lastEntry = entries[0];
    const weightChange = lastEntry 
      ? Number((newEntry.morningWeight - lastEntry.morningWeight).toFixed(2))
      : 0;

    const dailyMacros = getDailyMacros();
    const entryWithMacros = {
      ...newEntry,
      weightChange,
      calories: dailyMacros.calories,
      protein: dailyMacros.protein,
      carbs: dailyMacros.carbs,
      fat: dailyMacros.fat,
    };

    setEntries([entryWithMacros, ...entries]);
    setWeightGoals(prev => ({
      ...prev,
      currentWeight: newEntry.morningWeight,
    }));
  };

  const handleClearEntries = () => {
    setEntries([]);
    localStorage.removeItem('weightEntries');
    localStorage.removeItem('dailyMealsHistory');
    toast({
      title: "Entries cleared",
      description: "All weight entries and meal history have been cleared.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container max-w-7xl mx-auto px-4 py-6 space-y-6"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-2">
            <Scale className="w-8 h-8 text-primary" />
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Weight Progress</h2>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" className="w-full md:w-auto hover:scale-105 transition-transform">
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All Entries
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="sm:max-w-[425px]">
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete all your weight entries
                  and meal history data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleClearEntries}>
                  Yes, clear everything
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        
        <div className="grid gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <WeightProgressChart entries={entries} />
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <WeightGauge 
                currentWeight={weightGoals.currentWeight}
                targetWeight={weightGoals.targetWeight}
                initialWeight={weightGoals.initialWeight}
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <WeightEntryCard onEntryAdd={handleAddEntry} />
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="overflow-x-auto rounded-lg border bg-card shadow-lg hover:shadow-xl transition-shadow"
          >
            <WeightEntriesTable entries={entries} />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default WeightProgress;