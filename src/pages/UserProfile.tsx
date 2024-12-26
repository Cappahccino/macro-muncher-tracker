import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Edit } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ProfileMetrics } from "@/components/profile/ProfileMetrics";
import { MetabolicInfo } from "@/components/profile/MetabolicInfo";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UserData {
  name: string;
  currentWeight: number;
  targetWeight: number;
  weightUnit: string;
  gender: string;
  dob: string;
  height: number;
  activityLevel: string;
  bmr: number;
  tdee: number;
}

const UserProfile = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/sign-in");
        return;
      }

      const savedUserData = localStorage.getItem("userData");
      if (savedUserData) {
        setUserData(JSON.parse(savedUserData));
      }
      setLoading(false);
    };

    checkAuth();
  }, [navigate]);

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto p-4 space-y-6">
        <Header />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="container max-w-4xl mx-auto p-4 space-y-6">
        <Header />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-2xl font-bold">No Profile Found</h1>
          <Button 
            onClick={() => navigate("/onboarding")}
            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all duration-300"
          >
            Create Profile
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto p-4 space-y-8">
      <Header />
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-8"
      >
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
            User Profile
          </h1>
          <p className="text-muted-foreground">Your personal fitness journey details</p>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="backdrop-blur-sm bg-card/50 border-primary/20 hover:border-primary/40 transition-colors duration-300">
            <CardContent className="p-6 grid gap-8">
              <ProfileMetrics userData={userData} />
              <MetabolicInfo bmr={userData.bmr} tdee={userData.tdee} />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Button 
            onClick={() => navigate("/onboarding")} 
            className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all duration-300 group"
          >
            <Edit className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
            Update Profile
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default UserProfile;