import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

const QUICK_SUGGESTIONS = [
  "Breakfast Bowl",
  "Protein Smoothie",
  "Chicken Salad",
  "Quinoa Bowl",
  "Greek Yogurt Parfait",
];

export const QuickSuggestions = () => {
  return (
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
  );
};