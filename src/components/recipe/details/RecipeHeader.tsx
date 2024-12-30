import { ChefHat, Clock, Utensils } from "lucide-react";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface RecipeHeaderProps {
  title: string;
  description: string | null;
  created_at: string;
}

export function RecipeHeader({ title, description, created_at }: RecipeHeaderProps) {
  return (
    <DialogHeader>
      <div className="flex items-center gap-2 mb-2">
        <ChefHat className="h-6 w-6 text-purple-500" />
        <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
          {title}
        </DialogTitle>
      </div>
      
      <div className="flex items-center gap-2 text-sm text-gray-300 mb-4">
        <Clock className="h-4 w-4" />
        {new Date(created_at).toLocaleDateString()}
      </div>

      {description && (
        <div className="flex items-start gap-2 mt-2">
          <Utensils className="h-4 w-4 text-gray-400 mt-1" />
          <DialogDescription className="text-base leading-relaxed text-gray-300">
            {description}
          </DialogDescription>
        </div>
      )}
    </DialogHeader>
  );
}