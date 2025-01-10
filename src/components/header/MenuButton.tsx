import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

interface MenuButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export const MenuButton = ({ isOpen, onClick }: MenuButtonProps) => (
  <Button 
    variant="ghost" 
    size="icon" 
    onClick={onClick}
    className="relative"
  >
    {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
  </Button>
);