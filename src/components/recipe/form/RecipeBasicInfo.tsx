import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface RecipeBasicInfoProps {
  recipeName: string;
  setRecipeName: (name: string) => void;
  notes: string;
  setNotes: (notes: string) => void;
  instructions: string;
  setInstructions: (instructions: string) => void;
}

export function RecipeBasicInfo({
  recipeName,
  setRecipeName,
  notes,
  setNotes,
  instructions,
  setInstructions,
}: RecipeBasicInfoProps) {
  return (
    <div className="space-y-4">
      <Input
        placeholder="Recipe Name"
        value={recipeName}
        onChange={(e) => setRecipeName(e.target.value)}
      />

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Notes</h3>
        <Textarea
          placeholder="Add any notes about this recipe..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Instructions</h3>
        <Textarea
          placeholder="Add cooking instructions (one step per line)..."
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
        />
      </div>
    </div>
  );
}