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
    <Card>
      <CardHeader>
        <CardTitle>Daily Records</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Morning Weight</TableHead>
              <TableHead>Night Weight</TableHead>
              <TableHead>Calories</TableHead>
              <TableHead>Protein</TableHead>
              <TableHead>Carbs</TableHead>
              <TableHead>Fat</TableHead>
              <TableHead>Weight Change</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry, index) => (
              <Collapsible
                key={`${entry.date}-${index}`}
                open={expandedDays.includes(entry.date)}
                onOpenChange={() => toggleDay(entry.date)}
              >
                <TableRow>
                  <TableCell>
                    <CollapsibleTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm"
                      >
                        {expandedDays.includes(entry.date) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                  </TableCell>
                  <TableCell>{entry.date}</TableCell>
                  <TableCell>{entry.morningWeight}kg</TableCell>
                  <TableCell>{entry.nightWeight}kg</TableCell>
                  <TableCell>{entry.calories}</TableCell>
                  <TableCell>{entry.protein}g</TableCell>
                  <TableCell>{entry.carbs}g</TableCell>
                  <TableCell>{entry.fat}g</TableCell>
                  <TableCell className={entry.weightChange > 0 ? "text-red-500" : "text-green-500"}>
                    {entry.weightChange > 0 ? "+" : ""}{entry.weightChange}kg
                  </TableCell>
                </TableRow>
                <CollapsibleContent asChild>
                  <TableRow>
                    <TableCell colSpan={9} className="p-0">
                      <div className="px-4 py-2 bg-muted/50">
                        <div className="space-y-2">
                          <h4 className="font-medium">Meals for {entry.date}</h4>
                          {getDailyMeals(entry.date).map((meal: any, mealIndex: number) => (
                            <div key={mealIndex} className="pl-4 py-1">
                              <p className="font-medium">{meal.name}</p>
                              <p className="text-sm text-muted-foreground">
                                Calories: {meal.calories} | 
                                Protein: {meal.protein}g | 
                                Carbs: {meal.carbs}g | 
                                Fat: {meal.fat}g
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
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};