import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/onboarding");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-4">Welcome to Macro Muncher</h1>
      <p className="text-lg mb-8 text-center max-w-md">
        Your personal nutrition tracker that helps you achieve your health goals
      </p>
      <Button onClick={handleGetStarted} size="lg">
        Get Started
      </Button>
    </div>
  );
};

export default Landing;