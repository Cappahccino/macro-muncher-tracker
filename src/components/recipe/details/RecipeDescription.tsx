import { Utensils } from "lucide-react";

interface RecipeDescriptionProps {
  description: string | null;
}

export const RecipeDescription = ({ description }: RecipeDescriptionProps) => {
  return (
    <div className="flex items-start gap-2">
      <Utensils className="h-4 w-4 text-muted-foreground mt-1" />
      <p className="text-sm text-muted-foreground line-clamp-2">
        {description || "No description available"}
      </p>
    </div>
  );
};