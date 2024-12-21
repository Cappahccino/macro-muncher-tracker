import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <div className="text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold">Welcome to Macro Muncher</h1>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          Your personal nutrition tracker for achieving your fitness goals
        </p>
        <Button size="lg" onClick={() => navigate("/onboarding")}>
          Get Started
        </Button>
      </div>
    </div>
  );
};

export default Landing;