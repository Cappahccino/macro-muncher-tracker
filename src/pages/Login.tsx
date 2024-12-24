import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/dashboard");
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        navigate("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleGetStarted = () => {
    navigate("/weight-loss-goal");
  };

  return (
    <div className="container max-w-lg mx-auto p-4">
      <div className="flex justify-end mb-4">
        <Button onClick={handleGetStarted} variant="outline">
          Get Started
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Welcome Back to Macro Muncher</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Auth
            supabaseClient={supabase}
            appearance={{ 
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#0f172a',
                    brandAccent: '#334155'
                  }
                }
              }
            }}
            providers={[]}
            redirectTo={`${window.location.origin}/dashboard`}
            view="sign_in"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;