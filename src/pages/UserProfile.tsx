import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  User, 
  Weight, 
  Ruler, 
  Calendar, 
  Activity, 
  Dumbbell,
  Target,
  Edit
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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
  const navigate = useNavigate();

  useEffect(() => {
    const savedUserData = localStorage.getItem("userData");
    if (savedUserData) {
      setUserData(JSON.parse(savedUserData));
    }
  }, []);

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="container max-w-4xl mx-auto p-4 space-y-8">
      <Header />
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        <motion.div variants={itemVariants} className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
            User Profile
          </h1>
          <p className="text-muted-foreground">Your personal fitness journey details</p>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Card className="backdrop-blur-sm bg-card/50 border-primary/20 hover:border-primary/40 transition-colors duration-300">
            <CardContent className="p-6 grid gap-8">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-primary" />
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
                      <p className="text-lg font-semibold">{userData.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Weight className="w-5 h-5 text-primary" />
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Current Weight</h3>
                      <p className="text-lg font-semibold">
                        {userData.currentWeight} {userData.weightUnit}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Target className="w-5 h-5 text-primary" />
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Target Weight</h3>
                      <p className="text-lg font-semibold">
                        {userData.targetWeight} {userData.weightUnit}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Ruler className="w-5 h-5 text-primary" />
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Height</h3>
                      <p className="text-lg font-semibold">{userData.height} cm</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-primary" />
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Date of Birth</h3>
                      <p className="text-lg font-semibold">
                        {new Date(userData.dob).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Activity className="w-5 h-5 text-primary" />
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Activity Level</h3>
                      <p className="text-lg font-semibold capitalize">
                        {userData.activityLevel.replace("-", " ")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Metabolic Information */}
              <div className="border-t pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-3">
                  <Dumbbell className="w-5 h-5 text-primary" />
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Basal Metabolic Rate (BMR)
                    </h3>
                    <p className="text-lg font-semibold">
                      {Math.round(userData.bmr)} calories/day
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Activity className="w-5 h-5 text-primary" />
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Total Daily Energy Expenditure (TDEE)
                    </h3>
                    <p className="text-lg font-semibold">
                      {Math.round(userData.tdee)} calories/day
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
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