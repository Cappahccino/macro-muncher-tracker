import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

interface Recipe {
  title: string;
  description: string | null;
  instructions: any | null;
}

interface PrintRecipeButtonProps {
  recipe: Recipe;
}

export function PrintRecipeButton({ recipe }: PrintRecipeButtonProps) {
  const handlePrint = (e: React.MouseEvent) => {
    e.stopPropagation();
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${recipe.title}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h1 { color: #333; }
              .description { color: #666; margin-bottom: 20px; }
              .instructions { line-height: 1.6; }
            </style>
          </head>
          <body>
            <h1>${recipe.title}</h1>
            <div class="description">${recipe.description || ''}</div>
            <div class="instructions">
              ${JSON.stringify(recipe.instructions, null, 2)}
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handlePrint}
      className="shrink-0"
    >
      <Printer className="h-4 w-4" />
    </Button>
  );
}