import { useState } from "react";
import { Header } from "@/components/Header";
import { WeightGoalCard } from "@/components/weight/WeightGoalCard";
import { WeightEntryCard } from "@/components/weight/WeightEntryCard";
import { WeightProgressChart } from "@/components/weight/WeightProgressChart";
import { WeightEntriesTable } from "@/components/weight/WeightEntriesTable";
import { WeightEntry } from "@/components/weight/types";

const WeightProgress = () => {
  const [entries, setEntries] = useState<WeightEntry[]>([]);
  const [currentWeight, setCurrentWeight] = useState<number>(0);
  const [targetWeight, setTargetWeight] = useState<number>(0);

  const handleGoalSet = (current: number, target: number) => {
    setCurrentWeight(current);
    setTargetWeight(target);
  };

  const handleAddEntry = (newEntry: WeightEntry) => {
    const lastEntry = entries[0];
    const weightChange = lastEntry 
      ? newEntry.morningWeight - lastEntry.morningWeight
      : 0;

    setEntries([{ ...newEntry, weightChange }, ...entries]);
  };

  return (
    <div className="container max-w-7xl mx-auto p-4 space-y-8">
      <Header />
      
      <div className="grid gap-8">
        <WeightProgressChart 
          entries={entries} 
          currentWeight={currentWeight}
          targetWeight={targetWeight}
        />
        <WeightGoalCard onGoalSet={handleGoalSet} />
        <WeightEntryCard onEntryAdd={handleAddEntry} />
        <WeightEntriesTable entries={entries} />
      </div>
    </div>
  );
};

export default WeightProgress;