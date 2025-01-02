import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface RecipeFormHeaderProps {
  name: string;
  onNameChange: (name: string) => void;
}

export function RecipeFormHeader({ name, onNameChange }: RecipeFormHeaderProps) {
  const handleSaveTemplate = () => {
    if (!name) return;
    
    const savedTemplates = JSON.parse(localStorage.getItem('mealTemplates') || '[]');
    savedTemplates.push({ name });
    localStorage.setItem('mealTemplates', JSON.stringify(savedTemplates));
    toast({
      title: "Success",
      description: "Recipe saved successfully",
    });
  };

  return (
    <div className="flex items-center gap-4">
      <Input
        placeholder="Recipe name"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        className="flex-1"
      />
      {name && (
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleSaveTemplate}
        >
          <Plus className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}