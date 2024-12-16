import { Button } from "@/components/ui/button";

interface FoodFormActionsProps {
  isEditing: boolean;
  onCancel?: () => void;
}

export function FoodFormActions({ isEditing, onCancel }: FoodFormActionsProps) {
  return (
    <div className="flex gap-2">
      <Button type="submit" className="flex-1">
        {isEditing ? "Update Food Item" : "Add Food Item"}
      </Button>
      {onCancel && (
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      )}
    </div>
  );
}