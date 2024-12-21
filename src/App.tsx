import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Onboarding from "./pages/Onboarding";
import UserProfile from "./pages/UserProfile";
import Index from "./pages/Index";
import FoodList from "./pages/FoodList";
import MealPage from "./pages/MealPage";
import MealsList from "./pages/MealsList";
import WeightProgress from "./pages/WeightProgress";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/dashboard" element={<Index />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/food-list" element={<FoodList />} />
          <Route path="/meal/:id" element={<MealPage />} />
          <Route path="/meals-list" element={<MealsList />} />
          <Route path="/weight-progress" element={<WeightProgress />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;