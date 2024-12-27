interface RecipeVaultHeaderProps {
  title: string;
}

export function RecipeVaultHeader({ title }: RecipeVaultHeaderProps) {
  return (
    <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text">
      {title}
    </h2>
  );
}