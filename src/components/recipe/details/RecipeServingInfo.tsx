interface ServingSize {
  servings: number;
  gramsPerServing: number;
}

interface RecipeServingInfoProps {
  servingSize: ServingSize;
}

export function RecipeServingInfo({ servingSize }: RecipeServingInfoProps) {
  if (!servingSize) return null;

  return (
    <div className="mt-4 p-3 bg-muted rounded-lg">
      <p className="text-sm font-medium">
        Makes {servingSize.servings} servings 
        ({servingSize.gramsPerServing}g per serving)
      </p>
    </div>
  );
}