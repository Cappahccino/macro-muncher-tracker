import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { MealTemplate } from "@/types/food";

interface MealTemplateListProps {
  templates: MealTemplate[];
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
}

export function MealTemplateList({ templates, onEdit, onDelete }: MealTemplateListProps) {
  return (
    <div className="space-y-4">
      {templates.map((template, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className="overflow-hidden bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors duration-300">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text">
                  {template.name}
                </h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onEdit(index)}
                    className="hover:bg-purple-500/20 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onDelete(index)}
                    className="hover:bg-red-500/20 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {template.components.length > 0 ? (
                <div className="space-y-4">
                  <div className="border-t border-border/50 pt-4">
                    <h4 className="font-medium text-lg mb-2">Ingredients</h4>
                    <div className="grid gap-2">
                      {template.components.map((component, idx) => (
                        <div
                          key={idx}
                          className="bg-background/50 rounded-lg p-3 hover:bg-background/80 transition-colors"
                        >
                          <p className="font-medium">{component.name} - {Math.round(component.amount)}g</p>
                          <p className="text-sm text-muted-foreground">
                            Calories: {Math.round(component.calories)} | 
                            Protein: {Math.round(component.protein)}g | 
                            Carbs: {Math.round(component.carbs)}g | 
                            Fat: {Math.round(component.fat)}g |
                            Fiber: {Math.round(component.fiber)}g
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="border-t border-border/50 pt-4">
                    <h4 className="font-medium text-lg mb-2">Total Macros</h4>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="bg-background/50 rounded-lg p-3 text-center">
                        <p className="text-sm text-muted-foreground">Calories</p>
                        <p className="font-bold text-lg">{Math.round(template.totalMacros.calories)}</p>
                      </div>
                      <div className="bg-background/50 rounded-lg p-3 text-center">
                        <p className="text-sm text-muted-foreground">Protein</p>
                        <p className="font-bold text-lg">{Math.round(template.totalMacros.protein)}g</p>
                      </div>
                      <div className="bg-background/50 rounded-lg p-3 text-center">
                        <p className="text-sm text-muted-foreground">Carbs</p>
                        <p className="font-bold text-lg">{Math.round(template.totalMacros.carbs)}g</p>
                      </div>
                      <div className="bg-background/50 rounded-lg p-3 text-center">
                        <p className="text-sm text-muted-foreground">Fat</p>
                        <p className="font-bold text-lg">{Math.round(template.totalMacros.fat)}g</p>
                      </div>
                      <div className="bg-background/50 rounded-lg p-3 text-center">
                        <p className="text-sm text-muted-foreground">Fiber</p>
                        <p className="font-bold text-lg">{Math.round(template.totalMacros.fiber)}g</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  No ingredients added yet
                </p>
              )}
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}