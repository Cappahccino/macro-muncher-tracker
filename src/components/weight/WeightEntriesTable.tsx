import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { WeightEntry } from "./types";

interface WeightEntriesTableProps {
  entries: WeightEntry[];
}

export const WeightEntriesTable = ({ entries }: WeightEntriesTableProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Records</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
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
              <TableRow key={index}>
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
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};