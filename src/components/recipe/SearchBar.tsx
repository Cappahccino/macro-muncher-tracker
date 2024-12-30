import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: () => Promise<void>;
  isLoading: boolean;
}

export function SearchBar({ 
  searchQuery, 
  setSearchQuery, 
  handleSearch,
  isLoading 
}: SearchBarProps) {
  return (
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
        disabled={isLoading}
        className="w-[100px]"
      >
        {isLoading ? (
          "Searching..."
        ) : (
          <>
            <Search className="h-4 w-4 mr-2" />
            Search
          </>
        )}
      </Button>
    </div>
  );
}