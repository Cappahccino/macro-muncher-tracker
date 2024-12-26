import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Utensils, Clock, ChefHat, Filter, Printer, Save, Vegan, Leaf } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

interface Recipe {
  recipe_id: string;
  title: string;
  description: string | null;
  instructions: any | null;
  created_at: string;
  dietary_tags?: string[];
}

const DIETARY_FILTERS = [
  { label: "All", value: "all" },
  { label: "Vegan", value: "vegan", icon: Vegan },
  { label: "Vegetarian", value: "vegetarian", icon: Leaf },
  { label: "Gluten Free", value: "gluten-free", icon: Filter },
];

const QUICK_SUGGESTIONS = [
  "Breakfast Bowl",
  "Protein Smoothie",
  "Chicken Salad",
  "Quinoa Bowl",
  "Greek Yogurt Parfait",
];

const RecipeVault = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("all");

  const { data: recipes, isLoading } = useQuery({
    queryKey: ['recipes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Recipe[];
    },
  });

  const filteredRecipes = recipes?.filter(recipe => {
    if (activeFilter === "all") return true;
    return recipe.dietary_tags?.includes(activeFilter);
  });

  const handlePrint = (recipe: Recipe) => {
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

  const handleSave = (recipe: Recipe) => {
    // In a real app, this would save to local storage or database
    toast({
      title: "Recipe Saved",
      description: `${recipe.title} has been saved to your favorites.`,
    });
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto p-4">
        <Header />
        <div className="mt-8 text-center">Loading recipes...</div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto p-4">
      <Header />
      
      <div className="mt-8">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text">
          Recipe Vault
        </h2>

        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex gap-2 flex-wrap justify-center">
            {DIETARY_FILTERS.map((filter) => (
              <Button
                key={filter.value}
                variant={activeFilter === filter.value ? "default" : "outline"}
                onClick={() => setActiveFilter(filter.value)}
                className="flex items-center gap-2"
              >
                {filter.icon && <filter.icon className="h-4 w-4" />}
                {filter.label}
              </Button>
            ))}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-[200px]">
                Quick Suggestions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[200px]">
              {QUICK_SUGGESTIONS.map((suggestion) => (
                <DropdownMenuItem
                  key={suggestion}
                  onClick={() => {
                    // In a real app, this would filter or search for these recipes
                    toast({
                      title: "Quick Suggestion",
                      description: `Showing recipes similar to ${suggestion}`,
                    });
                  }}
                >
                  {suggestion}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <ScrollArea className="h-[600px] rounded-md border p-4">
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {filteredRecipes?.map((recipe) => (
              <motion.div
                key={recipe.recipe_id}
                variants={item}
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
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSave(recipe);
                          }}
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePrint(recipe);
                          }}
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
            ))}

            {filteredRecipes?.length === 0 && (
              <div className="col-span-2 text-center py-8 text-muted-foreground">
                No recipes found. Start creating some delicious meals!
              </div>
            )}
          </motion.div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default RecipeVault;