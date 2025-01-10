import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Home, User, BookCopy } from "lucide-react";
import { MenuItem } from "./types";

interface NavigationMenuProps {
  items: MenuItem[];
  onItemClick?: () => void;
  className?: string;
}

export const NavigationMenu = ({ items, onItemClick, className = "" }: NavigationMenuProps) => {
  const navigate = useNavigate();

  return (
    <nav className={className}>
      {items.filter(item => item.show).map((item) => (
        <Button
          key={item.path}
          variant="ghost"
          onClick={() => {
            navigate(item.path);
            onItemClick?.();
          }}
          className="flex items-center gap-2"
        >
          {item.icon && <item.icon className="h-4 w-4" />}
          {item.label}
        </Button>
      ))}
    </nav>
  );
};