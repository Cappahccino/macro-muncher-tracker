import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Utensils, Clock, ChefHat } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface Recipe {
  recipe_id: string;
  title: string;
  description: string | null;
  instructions: any | null;
  created_at: string;
}

const RecipeVault = () => {
  const navigate = useNavigate();

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

        <ScrollArea className="h-[600px] rounded-md border p-4">
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {recipes?.map((recipe) => (
              <motion.div
                key={recipe.recipe_id}
                variants={item}
                whileHover={{ scale: 1.02 }}
                className="cursor-pointer"
                onClick={() => navigate(`/meal/${recipe.recipe_id}`)}
              >
                <Card className="overflow-hidden transition-all duration-200 hover:shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
                    <CardTitle className="flex items-center gap-2">
                      <ChefHat className="h-5 w-5 text-purple-500" />
                      {recipe.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      {new Date(recipe.created_at).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
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

            {recipes?.length === 0 && (
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