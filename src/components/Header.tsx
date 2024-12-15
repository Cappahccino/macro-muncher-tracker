import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center gap-4">
        {location.pathname !== "/" && (
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <h1 className="text-3xl font-bold">MyMacros</h1>
      </div>
      <div className="space-x-4">
        {location.pathname !== "/food-list" && (
          <Button onClick={() => navigate("/food-list")}>Food List</Button>
        )}
        {location.pathname !== "/meals-list" && (
          <Button onClick={() => navigate("/meals-list")}>Meals List</Button>
        )}
      </div>
    </div>
  );
};