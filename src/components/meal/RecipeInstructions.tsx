import { Textarea } from "@/components/ui/textarea";

interface RecipeInstructionsProps {
  instructions: string;
  onChange: (instructions: string) => void;
}

export function RecipeInstructions({ instructions, onChange }: RecipeInstructionsProps) {
  return (
    <Textarea
      placeholder="Instructions (one step per line)"
      value={instructions}
      onChange={(e) => onChange(e.target.value)}
      className="min-h-[150px]"
    />
  );
}