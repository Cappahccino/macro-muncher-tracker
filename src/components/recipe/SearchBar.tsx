import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { AlternativeSearchResults } from "./AlternativeSearchResults";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearching: boolean;
  setIsSearching: (isSearching: boolean) => void;
}

export function SearchBar({ 
  searchQuery, 
  setSearchQuery, 
  isSearching,
  setIsSearching 
}: SearchBarProps) {
  const { toast } = useToast();
  const [showResults, setShowResults] = useState(false);
  const [alternative, setAlternative] = useState<any>(null);

  const handleSearch = async () => {
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
        return;
      }

      // Get user's health goals from their profile
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

  return (
    <>
      <div className="flex gap-2">
        <Input
          placeholder="Search recipes with AI (e.g., 'healthy breakfast under 500 calories')"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className="flex-1"
        />
        <Button 
          onClick={handleSearch}
          disabled={isSearching}
          className="w-[100px]"
        >
          {isSearching ? (
            "Searching..."
          ) : (
            <>
              <Search className="h-4 w-4 mr-2" />
              Search
            </>
          )}
        </Button>
      </div>

      <AlternativeSearchResults
        showResults={showResults}
        setShowResults={setShowResults}
        alternative={alternative}
        handleSearch={handleSearch}
      />
    </>
  );
}