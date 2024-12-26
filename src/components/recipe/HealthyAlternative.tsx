import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export const HealthyAlternative = () => {
  const [junkFood, setJunkFood] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recipe, setRecipe] = useState<any>(null);
  const [showDialog, setShowDialog] = useState(false);
  const { toast } = useToast();

  const generateHealthyAlternative = async () => {
    if (!junkFood.trim()) return;

    setIsLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;

      const { data, error } = await supabase.functions.invoke('healthy-alternative', {
        body: { junkFood, userId },
      });

      if (error) throw error;

      setRecipe(data);
      setShowDialog(true);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to generate healthy alternative. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex gap-2">
        <Input
          placeholder="Enter your favorite junk food..."
          value={junkFood}
          onChange={(e) => setJunkFood(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && generateHealthyAlternative()}
          className="max-w-xs"
        />
        <Button 
          onClick={generateHealthyAlternative}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Find Healthy Alternative"
          )}
        </Button>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{recipe?.title}</DialogTitle>
            <DialogDescription>
              {recipe?.description}
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Instructions:</h4>
            <ol className="list-decimal list-inside space-y-2">
              {recipe?.instructions.map((step: string, index: number) => (
                <li key={index} className="text-sm">{step}</li>
              ))}
            </ol>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {recipe?.dietaryTags.map((tag: string) => (
              <span
                key={tag}
                className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};