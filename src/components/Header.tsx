import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold">MyMacros</h1>
      <div className="space-x-4">
        <Button onClick={() => navigate("/food-list")}>Food List</Button>
        <Button onClick={() => navigate("/meals-list")}>Meals List</Button>
      </div>
    </div>
  );
};