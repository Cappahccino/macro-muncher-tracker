import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { AlternativeResults } from "./AlternativeResults";
import { useNavigate } from "react-router-dom";
import { useRecipeSearch } from "@/hooks/useRecipeSearch";

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
  const navigate = useNavigate();
  const [showResults, setShowResults] = useState(false);
  const [alternative, setAlternative] = useState<any>(null);
  const { handleSearch: performSearch } = useRecipeSearch();

  const handleSearch = async () => {
    setIsSearching(true);
    await performSearch(searchQuery);
    setIsSearching(false);
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

      <AlternativeResults
        showResults={showResults}
        setShowResults={setShowResults}
        alternative={alternative}
        handleSearch={handleSearch}
      />
    </>
  );
}