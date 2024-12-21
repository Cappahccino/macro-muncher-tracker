import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

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
      <div className="container max-w-2xl mx-auto p-4 space-y-6">
        <Header />
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">No Profile Found</h1>
          <Button onClick={() => navigate("/onboarding")}>Create Profile</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto p-4 space-y-6">
      <Header />
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">User Profile</h1>
        
        <div className="grid gap-4 p-6 border rounded-lg bg-card">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-muted-foreground">Name</h3>
              <p className="text-lg">{userData.name}</p>
            </div>
            <div>
              <h3 className="font-medium text-muted-foreground">Gender</h3>
              <p className="text-lg capitalize">{userData.gender}</p>
            </div>
            <div>
              <h3 className="font-medium text-muted-foreground">Current Weight</h3>
              <p className="text-lg">
                {userData.currentWeight} {userData.weightUnit}
              </p>
            </div>
            <div>
              <h3 className="font-medium text-muted-foreground">Target Weight</h3>
              <p className="text-lg">
                {userData.targetWeight} {userData.weightUnit}
              </p>
            </div>
            <div>
              <h3 className="font-medium text-muted-foreground">Height</h3>
              <p className="text-lg">{userData.height} cm</p>
            </div>
            <div>
              <h3 className="font-medium text-muted-foreground">Date of Birth</h3>
              <p className="text-lg">{new Date(userData.dob).toLocaleDateString()}</p>
            </div>
            <div>
              <h3 className="font-medium text-muted-foreground">Activity Level</h3>
              <p className="text-lg capitalize">{userData.activityLevel.replace("-", " ")}</p>
            </div>
          </div>

          <div className="border-t pt-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-muted-foreground">Basal Metabolic Rate (BMR)</h3>
                <p className="text-lg">{Math.round(userData.bmr)} calories/day</p>
              </div>
              <div>
                <h3 className="font-medium text-muted-foreground">Total Daily Energy Expenditure (TDEE)</h3>
                <p className="text-lg">{Math.round(userData.tdee)} calories/day</p>
              </div>
            </div>
          </div>
        </div>

        <Button onClick={() => navigate("/onboarding")} className="w-full">
          Update Profile
        </Button>
      </div>
    </div>
  );
};

export default UserProfile;