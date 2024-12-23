import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const AuthButton = () => {
  const navigate = useNavigate();

  return (
    <div className="absolute top-4 right-4">
      <Button onClick={() => navigate("/login")} variant="outline">
        Login
      </Button>
    </div>
  );
};