import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { WeightGoalCard } from "@/components/weight/WeightGoalCard";
import { WeightEntryCard } from "@/components/weight/WeightEntryCard";
import { WeightProgressChart } from "@/components/weight/WeightProgressChart";
import { WeightEntriesTable } from "@/components/weight/WeightEntriesTable";
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
import { Trash2 } from "lucide-react";

const WeightProgress = () => {
  const [entries, setEntries] = useState<WeightEntry[]>(() => {
    const savedEntries = localStorage.getItem('weightEntries');
    return savedEntries ? JSON.parse(savedEntries) : [];
  });
  const { toast } = useToast();

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

  // Update entries when daily meals change
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'dailyMeals') {
        const updatedMacros = getDailyMacros();
        // Update the latest entry with new macro values
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

  // Save entries whenever they change
  useEffect(() => {
    localStorage.setItem('weightEntries', JSON.stringify(entries));
  }, [entries]);

  const handleGoalSet = (current: number, target: number) => {
    console.log("Goal set:", { current, target });
    // Save weight goals to localStorage
    localStorage.setItem('weightGoals', JSON.stringify({ current, target }));
  };

  const handleAddEntry = (newEntry: WeightEntry) => {
    const lastEntry = entries[0];
    const weightChange = lastEntry 
      ? Number((newEntry.morningWeight - lastEntry.morningWeight).toFixed(2))
      : 0;

    // Add daily macros to the entry
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
      
      <div className="container max-w-7xl mx-auto px-4 py-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Weight Progress</h2>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" className="w-full md:w-auto">
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
          <WeightProgressChart entries={entries} />
          <div className="grid md:grid-cols-2 gap-6">
            <WeightGoalCard onGoalSet={handleGoalSet} />
            <WeightEntryCard onEntryAdd={handleAddEntry} />
          </div>
          <div className="overflow-x-auto rounded-lg border bg-card">
            <WeightEntriesTable entries={entries} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeightProgress;