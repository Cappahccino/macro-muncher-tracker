import { useLocation } from "react-router-dom";
import { MealDetails } from "@/components/MealDetails";
import { Header } from "@/components/Header";

const MealPage = () => {
  const location = useLocation();
  const { meal } = location.state || {};

  if (!meal) {
    return <div>Meal not found</div>;
  }

  return (
    <div className="container max-w-4xl mx-auto p-4">
      <Header />
      <MealDetails meal={meal} />
    </div>
  );
};

export default MealPage;