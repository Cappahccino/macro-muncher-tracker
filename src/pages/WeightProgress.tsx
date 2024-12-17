import { useState } from "react";
import { Header } from "@/components/Header";
import { WeightGoalCard } from "@/components/weight/WeightGoalCard";
import { WeightEntryCard } from "@/components/weight/WeightEntryCard";
import { WeightProgressChart } from "@/components/weight/WeightProgressChart";
import { WeightEntriesTable } from "@/components/weight/WeightEntriesTable";
import { WeightEntry } from "@/components/weight/types";

const WeightProgress = () => {
  const [entries, setEntries] = useState<WeightEntry[]>([]);

  const handleGoalSet = (current: number, target: number) => {
    console.log("Goal set:", { current, target });
  };

  const handleAddEntry = (newEntry: WeightEntry) => {
    const lastEntry = entries[0];
    const weightChange = lastEntry 
      ? newEntry.morningWeight - lastEntry.morningWeight
      : 0;

    setEntries([{ ...newEntry, weightChange }, ...entries]);
  };

  return (
    <div className="container max-w-7xl mx-auto p-4 space-y-6">
      <Header />
      
      <div className="grid gap-6">
        <WeightProgressChart entries={entries} />
        <div className="grid md:grid-cols-2 gap-6">
          <WeightGoalCard onGoalSet={handleGoalSet} />
          <WeightEntryCard onEntryAdd={handleAddEntry} />
        </div>
        <div className="overflow-x-auto">
          <WeightEntriesTable entries={entries} />
        </div>
      </div>
    </div>
  );
};

export default WeightProgress;