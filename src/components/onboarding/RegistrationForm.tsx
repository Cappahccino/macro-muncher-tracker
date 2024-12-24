import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface RegistrationFormProps {
  registrationData: {
    email: string;
    password: string;
    confirmPassword: string;
  };
  setRegistrationData: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
}

export const RegistrationForm = ({
  registrationData,
  setRegistrationData,
  onSubmit,
  onBack,
}: RegistrationFormProps) => {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (registrationData.password !== registrationData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }
    onSubmit(e);
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Create Your Account</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type="email"
            placeholder="Email"
            value={registrationData.email}
            onChange={(e) =>
              setRegistrationData({ ...registrationData, email: e.target.value })
            }
            className="text-white"
          />
        </div>
        <div>
          <Input
            type="password"
            placeholder="Password"
            value={registrationData.password}
            onChange={(e) =>
              setRegistrationData({ ...registrationData, password: e.target.value })
            }
            className="text-white"
          />
        </div>
        <div>
          <Input
            type="password"
            placeholder="Confirm Password"
            value={registrationData.confirmPassword}
            onChange={(e) =>
              setRegistrationData({
                ...registrationData,
                confirmPassword: e.target.value,
              })
            }
            className="text-white"
          />
        </div>
        <div className="flex gap-4">
          <Button type="button" variant="outline" onClick={onBack} className="flex-1">
            Back
          </Button>
          <Button type="submit" className="flex-1">
            Sign Up
          </Button>
        </div>
      </form>
    </Card>
  );
};