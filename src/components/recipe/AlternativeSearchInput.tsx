import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AlternativeSearchInputProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: () => void;
  isLoading: boolean;
}

export function AlternativeSearchInput({
  searchQuery,
  setSearchQuery,
  handleSearch,
  isLoading
}: AlternativeSearchInputProps) {
  return (
    <div className="flex gap-2">
      <Input
        placeholder="Enter a dish (e.g., 'mac and cheese')"
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