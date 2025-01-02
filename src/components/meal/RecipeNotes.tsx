import { Textarea } from "@/components/ui/textarea";

interface RecipeNotesProps {
  description: string;
  onChange: (description: string) => void;
}

export function RecipeNotes({ description, onChange }: RecipeNotesProps) {
  return (
    <Textarea
      placeholder="Recipe notes"
      value={description}
      onChange={(e) => onChange(e.target.value)}
      className="min-h-[100px]"
    />
  );
}