import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Menu, User, BookCopy, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const menuItems = [
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
      path: "/recipes",
      label: "Meals List",
      show: location.pathname !== "/recipes"
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
          <h1 
            onClick={() => navigate("/dashboard")} 
            className="text-2xl md:text-3xl font-bold cursor-pointer hover:text-primary transition-colors"
          >
            Macro Muncher
          </h1>
          
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>

          <nav className="hidden md:flex space-x-2">
            {menuItems.filter(item => item.show).map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                onClick={() => navigate(item.path)}
                className="flex items-center gap-2"
              >
                {item.icon && <item.icon className="h-4 w-4" />}
                {item.label}
              </Button>
            ))}
          </nav>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t bg-background/95 backdrop-blur-sm"
          >
            <nav className="container max-w-4xl mx-auto p-4 flex flex-col space-y-2">
              {menuItems.filter(item => item.show).map((item) => (
                <Button
                  key={item.path}
                  variant="ghost"
                  onClick={() => {
                    navigate(item.path);
                    setIsMenuOpen(false);
                  }}
                  className="w-full justify-start gap-2"
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  {item.label}
                </Button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};