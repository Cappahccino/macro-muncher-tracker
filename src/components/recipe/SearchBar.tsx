import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: () => void;
  isSearching: boolean;
}

export function SearchBar({ searchQuery, setSearchQuery, handleSearch, isSearching }: SearchBarProps) {
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
  );
}