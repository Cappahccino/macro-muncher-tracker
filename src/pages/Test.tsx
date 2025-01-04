import { Header } from "@/components/Header";
import { useState } from "react";
import { AlternativeSearchInput } from "@/components/recipe/AlternativeSearchInput";
import { AlternativeResults } from "@/components/recipe/AlternativeResults";
import { useRecipeSearch } from "@/hooks/useRecipeSearch";

const Test = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { 
    isSearching, 
    showResults, 
    setShowResults, 
    alternative, 
    handleSearch 
  } = useRecipeSearch();

  return (
    <div className="container max-w-4xl mx-auto p-4">
      <Header />
      
      <div className="mt-8 space-y-8">
        <h1 className="text-2xl font-bold">Recipe Search</h1>
        
        <div className="space-y-6">
          <AlternativeSearchInput
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleSearch={() => handleSearch(searchQuery)}
            isLoading={isSearching}
          />

          <AlternativeResults
            showResults={showResults}
            setShowResults={setShowResults}
            alternative={alternative}
            handleSearch={() => handleSearch(searchQuery)}
          />
        </div>
      </div>
    </div>
  );
};

export default Test;