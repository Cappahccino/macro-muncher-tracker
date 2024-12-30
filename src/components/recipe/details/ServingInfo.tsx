interface ServingInfoProps {
  servings: number;
  gramsPerServing: number;
}

export function ServingInfo({ servings, gramsPerServing }: ServingInfoProps) {
  return (
    <div className="bg-gray-800/50 rounded-lg p-4">
      <h4 className="text-sm font-medium text-gray-300 mb-2">Serving Information</h4>
      <p className="text-gray-200">
        Makes {servings} servings ({gramsPerServing}g per serving)
      </p>
    </div>
  );
}