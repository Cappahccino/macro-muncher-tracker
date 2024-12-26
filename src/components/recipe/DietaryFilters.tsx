import { Button } from "@/components/ui/button";
import { Vegan, Leaf, Filter } from "lucide-react";

interface DietaryFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const DIETARY_FILTERS = [
  { label: "All", value: "all" },
  { label: "Vegan", value: "vegan", icon: Vegan },
  { label: "Vegetarian", value: "vegetarian", icon: Leaf },
  { label: "Gluten Free", value: "gluten-free", icon: Filter },
];

export const DietaryFilters = ({ activeFilter, onFilterChange }: DietaryFiltersProps) => {
  return (
    <div className="flex gap-2 flex-wrap justify-center">
      {DIETARY_FILTERS.map((filter) => (
        <Button
          key={filter.value}
          variant={activeFilter === filter.value ? "default" : "outline"}
          onClick={() => onFilterChange(filter.value)}
          className="flex items-center gap-2"
        >
          {filter.icon && <filter.icon className="h-4 w-4" />}
          {filter.label}
        </Button>
      ))}
    </div>
  );
};