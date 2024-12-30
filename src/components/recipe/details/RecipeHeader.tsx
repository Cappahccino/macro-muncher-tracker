import { ChefHat, Clock } from "lucide-react";

interface RecipeHeaderProps {
  title: string;
  createdAt: string;
  description?: string | null;
}

export const RecipeHeader = ({ title, createdAt, description }: RecipeHeaderProps) => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <ChefHat className="h-5 w-5 text-purple-500" />
        <h3 className="font-semibold text-lg">{title}</h3>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <Clock className="h-4 w-4" />
        {new Date(createdAt).toLocaleDateString()}
      </div>
      {description && (
        <p className="text-sm text-muted-foreground mt-2">
          {description}
        </p>
      )}
    </div>
  );
};