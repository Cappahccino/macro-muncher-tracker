import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/components/AuthProvider";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import WeightLossGoal from "./pages/WeightLossGoal";
import DietType from "./pages/DietType";
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

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
            <Route path="/weight-loss-goal" element={<ProtectedRoute><WeightLossGoal /></ProtectedRoute>} />
            <Route path="/diet-type" element={<ProtectedRoute><DietType /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
            <Route path="/food-list" element={<ProtectedRoute><FoodList /></ProtectedRoute>} />
            <Route path="/meal/:id" element={<ProtectedRoute><MealPage /></ProtectedRoute>} />
            <Route path="/recipes" element={<ProtectedRoute><MealsList /></ProtectedRoute>} />
            <Route path="/weight-progress" element={<ProtectedRoute><WeightProgress /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;