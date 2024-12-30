import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export const useRecipeSearch = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [alternative, setAlternative] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to search for recipes",
          variant: "destructive",
        });
        navigate("/sign-in");
        return;
      }

      const { data: userData } = await supabase
        .from('users')
        .select('dietary_preferences')
        .eq('user_id', session.user.id)
        .single();

      const userGoals = userData?.dietary_preferences || {};

      const { data, error } = await supabase.functions.invoke('search-recipes', {
        body: { 
          searchQuery,
          userGoals
        }
      });

      if (error) throw error;
      
      setAlternative(data);
      setShowResults(true);
      
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Error",
        description: "Failed to search recipes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  return {
    isSearching,
    showResults,
    setShowResults,
    alternative,
    handleSearch
  };
};