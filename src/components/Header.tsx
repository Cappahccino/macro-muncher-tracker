import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Home, User, BookCopy } from "lucide-react";
import { Logo } from "./header/Logo";
import { MenuButton } from "./header/MenuButton";
import { NavigationMenu } from "./header/NavigationMenu";
import { MobileMenu } from "./header/MobileMenu";
import type { MenuItem } from "./header/types";

export const Header = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const menuItems: MenuItem[] = [
    {
      path: "/dashboard",
      label: "Home",
      icon: Home,
      show: location.pathname !== "/dashboard"
    },
    {
      path: "/profile",
      label: "Profile",
      icon: User,
      show: location.pathname !== "/profile"
    },
    {
      path: "/food-list",
      label: "Food List",
      show: location.pathname !== "/food-list"
    },
    {
      path: "/my-recipes",
      label: "My Recipes",
      show: location.pathname !== "/my-recipes"
    },
    {
      path: "/recipe-vault",
      label: "Recipe Vault",
      icon: BookCopy,
      show: location.pathname !== "/recipe-vault"
    },
    {
      path: "/weight-progress",
      label: "Weight Progress",
      show: location.pathname !== "/weight-progress"
    }
  ];

  return (
    <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b mb-8">
      <div className="container max-w-4xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Logo />
          
          <div className="md:hidden">
            <MenuButton 
              isOpen={isMenuOpen} 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            />
          </div>

          <NavigationMenu 
            items={menuItems}
            className="hidden md:flex space-x-2"
          />
        </div>
      </div>

      <MobileMenu
        isOpen={isMenuOpen}
        items={menuItems}
        onItemClick={() => setIsMenuOpen(false)}
      />
    </div>
  );
};