import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { WeightEntry } from "./types";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface WeightEntriesTableProps {
  entries: WeightEntry[];
}

export const WeightEntriesTable = ({ entries }: WeightEntriesTableProps) => {
  const [expandedDays, setExpandedDays] = useState<string[]>([]);

  const toggleDay = (date: string) => {
    setExpandedDays(current =>
      current.includes(date)
        ? current.filter(d => d !== date)
        : [...current, date]
    );
  };

  const getDailyMeals = (date: string) => {
    const savedMeals = localStorage.getItem('dailyMealsHistory');
    if (!savedMeals) return [];
    const mealsHistory = JSON.parse(savedMeals);
    return mealsHistory[date] || [];
  };

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40px]"></TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Morning</TableHead>
            <TableHead>Night</TableHead>
            <TableHead className="hidden md:table-cell">Calories</TableHead>
            <TableHead className="hidden md:table-cell">Protein</TableHead>
            <TableHead className="hidden md:table-cell">Carbs</TableHead>
            <TableHead className="hidden md:table-cell">Fat</TableHead>
            <TableHead>Change</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry, index) => (
            <Collapsible
              key={`${entry.date}-${index}`}
              open={expandedDays.includes(entry.date)}
              onOpenChange={() => toggleDay(entry.date)}
            >
              <TableRow className="hover:bg-muted/50">
                <TableCell>
                  <CollapsibleTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-8 w-8 p-0"
                    >
                      {expandedDays.includes(entry.date) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                </TableCell>
                <TableCell className="font-medium">{entry.date}</TableCell>
                <TableCell>{Math.round(entry.morningWeight * 10) / 10}kg</TableCell>
                <TableCell>{Math.round(entry.nightWeight * 10) / 10}kg</TableCell>
                <TableCell className="hidden md:table-cell">{Math.round(entry.calories)}</TableCell>
                <TableCell className="hidden md:table-cell">{Math.round(entry.protein)}g</TableCell>
                <TableCell className="hidden md:table-cell">{Math.round(entry.carbs)}g</TableCell>
                <TableCell className="hidden md:table-cell">{Math.round(entry.fat)}g</TableCell>
                <TableCell className={entry.weightChange > 0 ? "text-destructive" : "text-green-500"}>
                  {entry.weightChange > 0 ? "+" : ""}{Math.round(entry.weightChange * 10) / 10}kg
                </TableCell>
              </TableRow>
              <CollapsibleContent asChild>
                <TableRow>
                  <TableCell colSpan={9} className="p-0">
                    <div className="px-4 py-2 bg-muted/50">
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Meals for {entry.date}</h4>
                        {getDailyMeals(entry.date).map((meal: any, mealIndex: number) => (
                          <div key={mealIndex} className="pl-4 py-1">
                            <p className="font-medium text-sm">{meal.name}</p>
                            <p className="text-xs text-muted-foreground">
                              Calories: {Math.round(meal.calories)} | 
                              Protein: {Math.round(meal.protein)}g | 
                              Carbs: {Math.round(meal.carbs)}g | 
                              Fat: {Math.round(meal.fat)}g
                            </p>
                          </div>
                        ))}
                        {getDailyMeals(entry.date).length === 0 && (
                          <p className="text-sm text-muted-foreground">No meals recorded for this day</p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              </CollapsibleContent>
            </Collapsible>
          ))}
          {entries.length === 0 && (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                No entries recorded yet
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};