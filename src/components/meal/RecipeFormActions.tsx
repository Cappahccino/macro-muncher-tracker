import { Button } from "@/components/ui/button";

interface RecipeFormActionsProps {
  isEditing: boolean;
  onCancel: () => void;
}

export function RecipeFormActions({ isEditing, onCancel }: RecipeFormActionsProps) {
  return (
    <div className="flex gap-4">
      <Button type="submit" className="w-full">
        {isEditing ? "Save Changes" : "Add Recipe"}
      </Button>
      {isEditing && (
        <Button type="button" variant="outline" className="w-full" onClick={onCancel}>
          Cancel Edit
        </Button>
      )}
    </div>
  );
}