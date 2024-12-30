interface DietaryTagsProps {
  tags: string[];
}

export function DietaryTags({ tags }: DietaryTagsProps) {
  if (!tags?.length) return null;

  return (
    <div>
      <h4 className="text-sm font-medium text-gray-300 mb-2">Dietary Tags</h4>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="px-3 py-1 rounded-full bg-purple-900/40 text-purple-200 text-xs font-medium"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}