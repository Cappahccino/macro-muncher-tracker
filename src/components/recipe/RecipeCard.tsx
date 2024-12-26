import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChefHat, Clock, Utensils, Save, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";

interface Recipe {
  recipe_id: string;
  title: string;
  description: string | null;
  instructions: any | null;
  created_at: string;
  dietary_tags?: string[];
}

interface RecipeCardProps {
  recipe: Recipe;
}

export const RecipeCard = ({ recipe }: RecipeCardProps) => {
  const navigate = useNavigate();

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast({
      title: "Recipe Saved",
      description: `${recipe.title} has been saved to your favorites.`,
    });
  };

  const handlePrint = (e: React.MouseEvent) => {
    e.stopPropagation();
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${recipe.title}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h1 { color: #333; }
              .description { color: #666; margin-bottom: 20px; }
              .instructions { line-height: 1.6; }
            </style>
          </head>
          <body>
            <h1>${recipe.title}</h1>
            <div class="description">${recipe.description || ''}</div>
            <div class="instructions">
              ${JSON.stringify(recipe.instructions, null, 2)}
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="cursor-pointer"
    >
      <Card className="overflow-hidden transition-all duration-200 hover:shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ChefHat className="h-5 w-5 text-purple-500" />
                {recipe.title}
              </CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                {new Date(recipe.created_at).toLocaleDateString()}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSave}
              >
                <Save className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrint}
              >
                <Printer className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent 
          className="pt-4"
          onClick={() => navigate(`/meal/${recipe.recipe_id}`)}
        >
          <div className="flex items-start gap-2">
            <Utensils className="h-4 w-4 text-muted-foreground mt-1" />
            <p className="text-sm text-muted-foreground line-clamp-2">
              {recipe.description || "No description available"}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};