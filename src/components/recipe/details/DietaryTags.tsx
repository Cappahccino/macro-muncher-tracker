interface DietaryTagsProps {
  tags: string[];
}

export const DietaryTags = ({ tags }: DietaryTagsProps) => {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {tags.map((tag, index) => (
        <span
          key={index}
          className="px-2 py-1 rounded-full bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 text-xs font-medium"
        >
          {tag}
        </span>
      ))}
    </div>
  );
};