import { Input } from "@/components/ui/input";
import { MealSelect } from "./MealSelect";

interface MealFormInputProps {
  type?: string;
  placeholder: string;
  value: string | number;
  onChange: (value: number | string) => void;
  isMealName?: boolean;
}

export function MealFormInput({ 
  type = "text", 
  placeholder, 
  value, 
  onChange,
  isMealName = false
}: MealFormInputProps) {
  const handleTemplateSelect = (templateName: string) => {
    // Update the meal name input with the selected template name
    onChange(templateName);
    
    // Get the template's macros and emit them
    const savedTemplates = JSON.parse(localStorage.getItem('mealTemplates') || '[]');
    const selectedTemplate = savedTemplates.find((t: any) => t.name === templateName);
    
    if (selectedTemplate) {
      const event = new CustomEvent('templateSelected', { 
        detail: {
          ...selectedTemplate.totalMacros,
          name: selectedTemplate.name
        }
      });
      window.dispatchEvent(event);
    }
  };

  return (
    <div className="space-y-2">
      {isMealName && (
        <>
          <MealSelect 
            value={String(value)} 
            onChange={handleTemplateSelect} 
          />
          <Input
            type={type}
            placeholder={placeholder}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
          />
        </>
      )}
      {!isMealName && (
        <Input
          type={type}
          placeholder={placeholder}
          value={value || ""}
          onChange={(e) => onChange(type === "number" ? Number(e.target.value) : e.target.value)}
        />
      )}
    </div>
  );
}