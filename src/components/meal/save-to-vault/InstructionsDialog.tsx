import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface InstructionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  instructions: string;
  onInstructionsChange: (value: string) => void;
  onConfirm: () => void;
}

export function InstructionsDialog({
  open,
  onOpenChange,
  instructions,
  onInstructionsChange,
  onConfirm,
}: InstructionsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Cooking Instructions</DialogTitle>
          <DialogDescription>
            Please enter the cooking instructions for this recipe (one step per line)
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            value={instructions}
            onChange={(e) => onInstructionsChange(e.target.value)}
            placeholder="1. Preheat oven to 350°F&#10;2. Mix ingredients in a bowl&#10;3. Bake for 30 minutes"
            className="min-h-[200px]"
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={onConfirm}>
              Save to Vault
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}