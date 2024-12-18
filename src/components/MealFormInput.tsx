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
    const savedTemplates = JSON.parse(localStorage.getItem('mealTemplates') || '[]');
    const selectedTemplate = savedTemplates.find((t: any) => t.name === templateName);
    
    if (selectedTemplate) {
      // Update the meal name input with the template name
      onChange(templateName);
      
      // Emit an event to notify parent component about template selection
      const event = new CustomEvent('templateSelected', { 
        detail: selectedTemplate.totalMacros 
      });
      window.dispatchEvent(event);
    }
  };

  if (isMealName) {
    return (
      <div className="space-y-2">
        <MealSelect 
          value={String(value)} 
          onChange={handleTemplateSelect} 
        />
        <Input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    );
  }

  return (
    <div>
      <Input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(type === "number" ? Number(e.target.value) : e.target.value)}
      />
    </div>
  );
}