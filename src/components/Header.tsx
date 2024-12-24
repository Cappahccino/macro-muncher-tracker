import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Menu, User } from "lucide-react";
import { useState } from "react";

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold">Macro Muncher</h1>
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu className="h-6 w-6" />
          </Button>
        </div>
        <div className="hidden md:flex space-x-4">
          {location.pathname !== "/dashboard" && (
            <Button onClick={() => navigate("/dashboard")}>
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>
          )}
          {location.pathname !== "/profile" && (
            <Button onClick={() => navigate("/profile")}>
              <User className="mr-2 h-4 w-4" />
              Profile
            </Button>
          )}
          {location.pathname !== "/food-list" && (
            <Button onClick={() => navigate("/food-list")}>Food List</Button>
          )}
          {location.pathname !== "/recipes" && (
            <Button onClick={() => navigate("/recipes")}>Meals List</Button>
          )}
          {location.pathname !== "/weight-progress" && (
            <Button onClick={() => navigate("/weight-progress")}>Weight Progress</Button>
          )}
        </div>
      </div>
      
      {isMenuOpen && (
        <div className="mt-4 flex flex-col space-y-2 md:hidden">
          {location.pathname !== "/dashboard" && (
            <Button onClick={() => {
              navigate("/dashboard");
              setIsMenuOpen(false);
            }}>
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>
          )}
          {location.pathname !== "/profile" && (
            <Button onClick={() => {
              navigate("/profile");
              setIsMenuOpen(false);
            }}>
              <User className="mr-2 h-4 w-4" />
              Profile
            </Button>
          )}
          {location.pathname !== "/food-list" && (
            <Button onClick={() => {
              navigate("/food-list");
              setIsMenuOpen(false);
            }}>Food List</Button>
          )}
          {location.pathname !== "/recipes" && (
            <Button onClick={() => {
              navigate("/recipes");
              setIsMenuOpen(false);
            }}>Meals List</Button>
          )}
          {location.pathname !== "/weight-progress" && (
            <Button onClick={() => {
              navigate("/weight-progress");
              setIsMenuOpen(false);
            }}>Weight Progress</Button>
          )}
        </div>
      )}
    </div>
  );
};