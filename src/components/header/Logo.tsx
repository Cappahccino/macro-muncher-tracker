import { useNavigate } from "react-router-dom";

export const Logo = () => {
  const navigate = useNavigate();
  
  return (
    <h1 
      onClick={() => navigate("/dashboard")} 
      className="text-2xl md:text-3xl font-bold cursor-pointer hover:text-primary transition-colors"
    >
      Macro Muncher
    </h1>
  );
};